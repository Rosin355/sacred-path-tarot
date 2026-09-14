import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = process.cwd();
const source = fs.readFileSync(path.join(root, "src/content/siteContent.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
const mod = { exports: {} };
new Function("require", "module", "exports", compiled)(require, mod, mod.exports);
const { contentFields, defaultSiteContent, sitePages, maxLengthFor } = mod.exports;
const quote = value => `'${String(value).replaceAll("'", "''")}'`;
const specs = Object.fromEntries(sitePages.map(page => [page, Object.fromEntries(contentFields[page].map(field => [field.key, maxLengthFor(field.kind)]))]));
const seedRows = sitePages.flatMap(page => ["draft", "published"].map(state => `  (${quote(page)}, ${quote(state)}, ${quote(JSON.stringify(defaultSiteContent[page]))}::jsonb)`)).join(",\n");

const sql = `-- Editor dei testi del sito: migrazione autonoma e idempotente.
create table if not exists public.site_page_content (
  page text not null check (page in ('home','arcani','respiro','ispirazione')),
  state text not null check (state in ('draft','published')),
  content jsonb not null,
  revision integer not null default 1 check (revision > 0),
  updated_at timestamptz not null default now(),
  primary key (page, state)
);

comment on table public.site_page_content is 'Testi strutturati delle pagine, separati tra bozza e pubblicato';

create or replace function public.site_content_spec(p_page text)
returns jsonb language sql immutable set search_path = public as \$\$
  select (jsonb_build_object(${Object.entries(specs).flatMap(([page, spec]) => [quote(page), `${quote(JSON.stringify(spec))}::jsonb`]).join(", ")}))->p_page;
\$\$;

create or replace function public.validate_site_page_content()
returns trigger language plpgsql set search_path = public as \$\$
declare
  spec jsonb := public.site_content_spec(new.page);
  item record;
begin
  if spec is null or jsonb_typeof(new.content) <> 'object'
    or (select count(*) from jsonb_object_keys(new.content)) <> (select count(*) from jsonb_object_keys(spec)) then
    raise exception 'Contenuto non conforme allo schema della pagina' using errcode = '22023';
  end if;
  for item in select key, value from jsonb_each(new.content) loop
    if not (spec ? item.key) or jsonb_typeof(item.value) <> 'string' then
      raise exception 'Campo non consentito o non testuale: %', item.key using errcode = '22023';
    end if;
    if btrim(item.value #>> '{}') = '' or char_length(item.value #>> '{}') > (spec->>item.key)::integer then
      raise exception 'Lunghezza non valida per il campo: %', item.key using errcode = '22023';
    end if;
    if (item.value #>> '{}') ~ '<[^>]+>' then
      raise exception 'HTML non consentito nel campo: %', item.key using errcode = '22023';
    end if;
  end loop;
  new.updated_at := now();
  return new;
end;
\$\$;

drop trigger if exists validate_site_page_content_trigger on public.site_page_content;
create trigger validate_site_page_content_trigger before insert or update of page, content on public.site_page_content
for each row execute function public.validate_site_page_content();

insert into public.site_page_content (page, state, content) values
${seedRows}
on conflict (page, state) do nothing;

alter table public.site_page_content enable row level security;
drop policy if exists "Published site content is public" on public.site_page_content;
create policy "Published site content is public" on public.site_page_content for select
using (state = 'published' or (select public.is_admin()));

revoke insert, update, delete on public.site_page_content from anon, authenticated;
grant select on public.site_page_content to anon, authenticated;

create or replace function public.save_site_content_draft(p_page text, p_content jsonb, p_expected_revision integer)
returns jsonb language plpgsql security definer set search_path = public as \$\$
declare current_row public.site_page_content;
begin
  if not public.is_admin() then raise exception 'Accesso amministratore richiesto' using errcode = '42501'; end if;
  select * into current_row from public.site_page_content where page = p_page and state = 'draft' for update;
  if not found or current_row.revision <> p_expected_revision then raise exception 'Conflitto: la bozza è stata modificata in un’altra sessione' using errcode = '40001'; end if;
  update public.site_page_content set content = p_content, revision = revision + 1 where page = p_page and state = 'draft' returning * into current_row;
  return to_jsonb(current_row);
end;
\$\$;

create or replace function public.publish_site_content(p_page text, p_expected_draft_revision integer, p_expected_published_revision integer)
returns jsonb language plpgsql security definer set search_path = public as \$\$
declare draft_row public.site_page_content; published_row public.site_page_content;
begin
  if not public.is_admin() then raise exception 'Accesso amministratore richiesto' using errcode = '42501'; end if;
  select * into draft_row from public.site_page_content where page = p_page and state = 'draft' for update;
  select * into published_row from public.site_page_content where page = p_page and state = 'published' for update;
  if draft_row.revision <> p_expected_draft_revision or published_row.revision <> p_expected_published_revision then raise exception 'Conflitto: i contenuti sono cambiati in un’altra sessione' using errcode = '40001'; end if;
  update public.site_page_content set content = draft_row.content, revision = revision + 1 where page = p_page and state = 'published' returning * into published_row;
  return jsonb_build_object('draft', to_jsonb(draft_row), 'published', to_jsonb(published_row));
end;
\$\$;

create or replace function public.restore_site_content_draft(p_page text, p_expected_draft_revision integer, p_expected_published_revision integer)
returns jsonb language plpgsql security definer set search_path = public as \$\$
declare draft_row public.site_page_content; published_row public.site_page_content;
begin
  if not public.is_admin() then raise exception 'Accesso amministratore richiesto' using errcode = '42501'; end if;
  select * into draft_row from public.site_page_content where page = p_page and state = 'draft' for update;
  select * into published_row from public.site_page_content where page = p_page and state = 'published' for update;
  if draft_row.revision <> p_expected_draft_revision or published_row.revision <> p_expected_published_revision then raise exception 'Conflitto: i contenuti sono cambiati in un’altra sessione' using errcode = '40001'; end if;
  update public.site_page_content set content = published_row.content, revision = revision + 1 where page = p_page and state = 'draft' returning * into draft_row;
  return to_jsonb(draft_row);
end;
\$\$;

revoke all on function public.save_site_content_draft(text, jsonb, integer) from public, anon;
revoke all on function public.publish_site_content(text, integer, integer) from public, anon;
revoke all on function public.restore_site_content_draft(text, integer, integer) from public, anon;
grant execute on function public.save_site_content_draft(text, jsonb, integer) to authenticated;
grant execute on function public.publish_site_content(text, integer, integer) to authenticated;
grant execute on function public.restore_site_content_draft(text, integer, integer) to authenticated;
`;

process.stdout.write(sql);
