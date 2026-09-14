import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";

const modulePath = process.env.PGLITE_MODULE;
if (!modulePath) throw new Error("Imposta PGLITE_MODULE");
const { PGlite } = await import(pathToFileURL(modulePath).href);
const db = new PGlite();
const migration = await fs.readFile("supabase/migrations/20260914120000_site_page_content.sql", "utf8");
await db.exec(`
  create role anon; create role authenticated;
  create schema auth;
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create table public.user_roles(user_id uuid not null, role text not null);
  create function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
    select exists(select 1 from public.user_roles where user_id=auth.uid() and role='admin')
  $$;
  insert into public.user_roles values ('11111111-1111-1111-1111-111111111111','admin');
`);
await db.exec(migration);

const seeded = await db.query("select count(*)::int as count from public.site_page_content");
assert.equal(seeded.rows[0].count, 8);

await db.exec("set role anon");
const anonymous = await db.query("select state, count(*)::int as count from public.site_page_content group by state");
assert.deepEqual(anonymous.rows, [{ state: "published", count: 4 }]);
await db.exec("reset role");

await db.exec("set request.jwt.claim.sub='11111111-1111-1111-1111-111111111111'; set role authenticated");
const admin = await db.query("select count(*)::int as count from public.site_page_content");
assert.equal(admin.rows[0].count, 8);
const row = await db.query("select content, revision from public.site_page_content where page='home' and state='draft'");
await db.query("select public.save_site_content_draft($1,$2,$3)", ["home", row.rows[0].content, row.rows[0].revision]);
await assert.rejects(() => db.query("select public.save_site_content_draft($1,$2,$3)", ["home", row.rows[0].content, row.rows[0].revision]), /Conflitto/);
const current = await db.query("select content, revision from public.site_page_content where page='home' and state='draft'");
await assert.rejects(() => db.query("select public.save_site_content_draft($1,$2,$3)", ["home", { ...current.rows[0].content, extra: "non consentito" }, current.rows[0].revision]), /schema|consentito/i);
await db.query("select public.publish_site_content($1,$2,$3)", ["home", current.rows[0].revision, 1]);
await db.exec("reset role; reset request.jwt.claim.sub");
await db.exec(migration);
const afterSecondRun = await db.query("select revision from public.site_page_content where page='home' and state='published'");
assert.equal(afterSecondRun.rows[0].revision, 2);
console.log("site-content-db-qa: OK — seed, RLS, validazione, revisione, pubblicazione e idempotenza");
