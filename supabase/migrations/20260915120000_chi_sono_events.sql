-- Da applicare solo dopo aver verificato e applicato, se assente, 20260914120000_site_page_content.sql.
-- I contenuti personalizzati non vengono sovrascritti: sostituzione soltanto dei valori iniziali esatti.
DO $$ BEGIN
  IF to_regclass('public.site_page_content') IS NULL THEN
    RAISE EXCEPTION 'Manca site_page_content: applicare prima la migrazione 20260914120000';
  END IF;
END $$;

ALTER TABLE public.site_page_content DROP CONSTRAINT IF EXISTS site_page_content_page_check;
ALTER TABLE public.site_page_content ADD CONSTRAINT site_page_content_page_check CHECK (page IN ('home','arcani','respiro','ispirazione','chi_sono'));
DROP TRIGGER IF EXISTS validate_site_page_content_trigger ON public.site_page_content;
create or replace function public.site_content_spec(p_page text)
returns jsonb language sql immutable set search_path = public as $$
  select (jsonb_build_object('home', '{"hero_kicker":160,"hero_title":160,"hero_subtitle":3000,"intro_kicker":160,"intro_text":3000,"arcani_kicker":160,"arcani_title":160,"arcani_intro":3000,"arcani_item_1":500,"arcani_item_2":500,"arcani_item_3":500,"arcani_item_4":500,"arcani_item_5":500,"arcani_item_6":500,"arcani_closing":3000,"respiro_kicker":160,"respiro_title":160,"respiro_intro":3000,"respiro_group_1":160,"respiro_items_1":500,"respiro_group_2":160,"respiro_items_2":500,"respiro_closing":3000,"respiro_place":500,"respiro_note":500,"arte_kicker":160,"arte_title":160,"arte_intro":3000,"arte_group_1":160,"arte_text_1":500,"arte_group_2":160,"arte_text_2":500,"arte_group_3":160,"arte_text_3":500,"arte_group_4":160,"arte_text_4":500,"final_kicker":160,"final_title":160,"final_arcani":160,"final_respiro":160,"final_arte":160,"arcani_brand":160,"respiro_brand":160}'::jsonb, 'arcani', '{"hero_kicker":160,"hero_title":160,"hero_text":3000,"section_1_title":160,"section_1_text":3000,"section_2_title":160,"section_2_text":3000,"section_3_title":160,"section_3_text":3000,"closing":3000,"hero_brand":160}'::jsonb, 'respiro', '{"hero_kicker":160,"hero_title":160,"hero_text":3000,"section_1_title":160,"section_1_text":3000,"section_2_title":160,"section_2_text":3000,"section_3_title":160,"section_3_text":3000,"section_4_title":160,"section_4_text":3000,"practical_label":160,"practical_place":160,"practical_text":3000,"closing":3000,"hero_brand":160}'::jsonb, 'chi_sono', '{"kicker":160,"title":160,"intro":3000,"biography_1":3000,"biography_2":3000}'::jsonb, 'ispirazione', '{"hero_kicker":160,"hero_title":160,"hero_text":3000,"section_1_label":160,"section_1_title":160,"section_1_text":3000,"section_2_label":160,"section_2_title":160,"section_2_text":3000,"section_3_label":160,"section_3_title":160,"section_3_text":3000,"section_4_label":160,"section_4_title":160,"section_4_text":3000,"closing":3000}'::jsonb))->p_page;
$$;

UPDATE public.site_page_content SET revision=revision+1, updated_at=now(), content = content
  || jsonb_build_object(
    'arcani_brand', coalesce(content->>'arcani_brand', '𝐓𝐚𝐫𝐨𝐜𝐜𝐡𝐢𝓟𝓮𝓻𝐈𝐥𝐥𝐮𝐦𝐢𝐧𝐚𝐫𝐬𝐢✨'),
    'respiro_brand', coalesce(content->>'respiro_brand', '𝐘𝐨𝐠𝐚𝓟𝓮𝓻𝐈𝐥𝐥𝐮𝐦𝐢𝐧𝐚𝐫𝐬𝐢✨'),
    'hero_kicker', CASE WHEN content->>'hero_kicker' = 'Un percorso con Jessica Marin' THEN 'Percorsi con Jessica Marin' ELSE content->>'hero_kicker' END,
    'hero_title', CASE WHEN content->>'hero_title' = E'Le tre vie\nper illuminarsi' THEN 'Tre Vie Per Illuminarsi' ELSE content->>'hero_title' END
  ) WHERE page = 'home' AND (NOT content ? 'arcani_brand' OR NOT content ? 'respiro_brand' OR content->>'hero_kicker'='Un percorso con Jessica Marin' OR content->>'hero_title'=E'Le tre vie\nper illuminarsi');
UPDATE public.site_page_content SET revision=revision+1, updated_at=now(), content = content || jsonb_build_object('hero_brand', coalesce(content->>'hero_brand', '𝐓𝐚𝐫𝐨𝐜𝐜𝐡𝐢𝓟𝓮𝓻𝐈𝐥𝐥𝐮𝐦𝐢𝐧𝐚𝐫𝐬𝐢✨')) WHERE page = 'arcani' AND NOT content ? 'hero_brand';
UPDATE public.site_page_content SET revision=revision+1, updated_at=now(), content = content || jsonb_build_object('hero_brand', coalesce(content->>'hero_brand', '𝐘𝐨𝐠𝐚𝓟𝓮𝓻𝐈𝐥𝐥𝐮𝐦𝐢𝐧𝐚𝐫𝐬𝐢✨')) WHERE page = 'respiro' AND NOT content ? 'hero_brand';
INSERT INTO public.site_page_content(page,state,content) VALUES ('chi_sono','draft','{"kicker": "La Sacerdotessa", "title": "Chi sono", "intro": "Sono Jessica Marin. Ti accompagno nell’esplorazione del tuo mondo interiore attraverso simboli, tarocchi e pratiche del corpo.", "biography_1": "Nei miei corsi, percorsi e workshop condivido conoscenze esoteriche, yoga e attività motorie, dai livelli di base a quelli avanzati.", "biography_2": "Credo che ogni persona possa trovare la propria luce interiore attraverso un cammino di ascolto, studio e consapevolezza. Scegli la via che senti tua."}'::jsonb),('chi_sono','published','{"kicker": "La Sacerdotessa", "title": "Chi sono", "intro": "Sono Jessica Marin. Ti accompagno nell’esplorazione del tuo mondo interiore attraverso simboli, tarocchi e pratiche del corpo.", "biography_1": "Nei miei corsi, percorsi e workshop condivido conoscenze esoteriche, yoga e attività motorie, dai livelli di base a quelli avanzati.", "biography_2": "Credo che ogni persona possa trovare la propria luce interiore attraverso un cammino di ascolto, studio e consapevolezza. Scegli la via che senti tua."}'::jsonb) ON CONFLICT(page,state) DO NOTHING;
CREATE TRIGGER validate_site_page_content_trigger BEFORE INSERT OR UPDATE OF page,content ON public.site_page_content FOR EACH ROW EXECUTE FUNCTION public.validate_site_page_content();

CREATE TABLE IF NOT EXISTS public.site_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 160 AND title !~ '<[^>]+>'),
 description text NOT NULL CHECK (char_length(btrim(description)) BETWEEN 1 AND 5000 AND description !~ '<[^>]+>'),
 start_date date NOT NULL,
 end_date date CHECK (end_date IS NULL OR end_date >= start_date),
 original_image_path text NOT NULL CHECK (char_length(original_image_path)>0),
 thumbnail_image_path text NOT NULL CHECK (char_length(thumbnail_image_path)>0),
 status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
 revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS site_events_public_dates ON public.site_events(start_date DESC) WHERE status='published';
ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public reads published events" ON public.site_events;
CREATE POLICY "Public reads published events" ON public.site_events FOR SELECT TO anon,authenticated USING (status='published' OR (SELECT public.is_admin()));
REVOKE INSERT,UPDATE,DELETE ON public.site_events FROM anon,authenticated;
GRANT SELECT ON public.site_events TO anon,authenticated;

CREATE OR REPLACE FUNCTION public.save_site_event(
 p_id uuid, p_title text, p_description text, p_start_date date, p_end_date date,
 p_original_image_path text, p_thumbnail_image_path text, p_expected_revision integer, p_status text
) RETURNS public.site_events LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE current_row public.site_events;
BEGIN
 IF NOT public.is_admin() THEN RAISE EXCEPTION 'Accesso amministratore richiesto' USING errcode='42501'; END IF;
 IF p_status NOT IN ('draft','published','archived') THEN RAISE EXCEPTION 'Stato non valido' USING errcode='22023'; END IF;
 IF NOT EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id=CASE WHEN p_status='published' THEN 'event-posters' ELSE 'event-poster-drafts' END AND name=p_original_image_path)
    OR NOT EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id=CASE WHEN p_status='published' THEN 'event-posters' ELSE 'event-poster-drafts' END AND name=p_thumbnail_image_path) THEN
   RAISE EXCEPTION 'Locandina originale o miniatura non presente nel bucket previsto' USING errcode='22023';
 END IF;
 IF p_id IS NULL THEN
   IF p_expected_revision <> 0 THEN RAISE EXCEPTION 'Conflitto revisione' USING errcode='40001'; END IF;
   INSERT INTO public.site_events(title,description,start_date,end_date,original_image_path,thumbnail_image_path,status)
   VALUES(p_title,p_description,p_start_date,p_end_date,p_original_image_path,p_thumbnail_image_path,p_status) RETURNING * INTO current_row;
 ELSE
   SELECT * INTO current_row FROM public.site_events WHERE id=p_id FOR UPDATE;
   IF NOT FOUND OR current_row.revision <> p_expected_revision THEN RAISE EXCEPTION 'Conflitto: evento modificato in un’altra sessione' USING errcode='40001'; END IF;
   UPDATE public.site_events SET title=p_title,description=p_description,start_date=p_start_date,end_date=p_end_date,
     original_image_path=p_original_image_path,thumbnail_image_path=p_thumbnail_image_path,status=p_status,
     revision=revision+1,updated_at=now() WHERE id=p_id RETURNING * INTO current_row;
 END IF;
 RETURN current_row;
END $$;
REVOKE ALL ON FUNCTION public.save_site_event(uuid,text,text,date,date,text,text,integer,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.save_site_event(uuid,text,text,date,date,text,text,integer,text) TO authenticated;

INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES('event-posters','event-posters',true,15728640,ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT(id) DO NOTHING;
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES('event-poster-drafts','event-poster-drafts',false,15728640,ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT(id) DO NOTHING;
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id='event-posters' AND public=true AND file_size_limit=15728640 AND allowed_mime_types @> ARRAY['image/jpeg','image/png','image/webp'])
    OR NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id='event-poster-drafts' AND public=false AND file_size_limit=15728640 AND allowed_mime_types @> ARRAY['image/jpeg','image/png','image/webp']) THEN
   RAISE EXCEPTION 'Bucket preesistente con configurazione incompatibile: verifica manuale richiesta' USING errcode='22023';
 END IF;
END $$;
-- Percorso UUID casuale. La pagina pubblica espone soltanto le immagini di record pubblicati.
DROP POLICY IF EXISTS "Admins upload event posters" ON storage.objects;
CREATE POLICY "Admins upload event posters" ON storage.objects FOR INSERT TO authenticated
WITH CHECK(bucket_id IN ('event-posters','event-poster-drafts') AND (SELECT public.is_admin()));
DROP POLICY IF EXISTS "Admins update event posters" ON storage.objects;
CREATE POLICY "Admins update event posters" ON storage.objects FOR UPDATE TO authenticated
USING(bucket_id IN ('event-posters','event-poster-drafts') AND (SELECT public.is_admin())) WITH CHECK(bucket_id IN ('event-posters','event-poster-drafts') AND (SELECT public.is_admin()));
DROP POLICY IF EXISTS "Admins remove event posters" ON storage.objects;
CREATE POLICY "Admins remove event posters" ON storage.objects FOR DELETE TO authenticated
USING(bucket_id IN ('event-posters','event-poster-drafts') AND (SELECT public.is_admin()));
DROP POLICY IF EXISTS "Published event posters readable" ON storage.objects;
CREATE POLICY "Published event posters readable" ON storage.objects FOR SELECT TO anon,authenticated
USING(bucket_id='event-posters' AND (EXISTS(SELECT 1 FROM public.site_events e WHERE e.status='published' AND (e.original_image_path=name OR e.thumbnail_image_path=name)) OR (SELECT public.is_admin())));
DROP POLICY IF EXISTS "Admins read draft posters" ON storage.objects;
CREATE POLICY "Admins read draft posters" ON storage.objects FOR SELECT TO authenticated
USING(bucket_id='event-poster-drafts' AND (SELECT public.is_admin()));
