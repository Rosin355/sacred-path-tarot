-- Eseguire soltanto su un database di prova dopo le due migrazioni site_page_content.
DO $$ BEGIN
  IF (SELECT count(*) FROM public.site_page_content) <> 10 THEN RAISE EXCEPTION 'Attesi 10 record editoriali'; END IF;
  IF (SELECT count(*) FROM public.site_page_content WHERE page='chi_sono') <> 2 THEN RAISE EXCEPTION 'Manca Chi sono bozza/pubblicato'; END IF;
  IF (SELECT content->>'hero_title' FROM public.site_page_content WHERE page='home' AND state='published') <> 'Tre Vie Per Illuminarsi' THEN RAISE EXCEPTION 'Titolo iniziale non aggiornato'; END IF;
  IF (SELECT content->>'hero_kicker' FROM public.site_page_content WHERE page='home' AND state='published') <> 'Percorsi con Jessica Marin' THEN RAISE EXCEPTION 'Kicker iniziale non aggiornato'; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_events' AND policyname='Public reads published events') THEN RAISE EXCEPTION 'RLS eventi assente'; END IF;
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id='event-posters' AND public) THEN RAISE EXCEPTION 'Bucket pubblico assente'; END IF;
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id='event-poster-drafts' AND NOT public) THEN RAISE EXCEPTION 'Bucket privato assente'; END IF;
END $$;

INSERT INTO storage.objects(bucket_id,name) VALUES
 ('event-poster-drafts','test/original.jpg'),('event-poster-drafts','test/thumb.webp'),
 ('event-posters','public/original.jpg'),('event-posters','public/thumb.webp');
INSERT INTO public.site_events(title,description,start_date,original_image_path,thumbnail_image_path,status)
VALUES('Bozza QA','Descrizione',current_date,'test/original.jpg','test/thumb.webp','draft'),
      ('Pubblicato QA','Descrizione',current_date,'public/original.jpg','public/thumb.webp','published');

GRANT USAGE ON SCHEMA storage TO anon,authenticated;
GRANT SELECT ON storage.objects TO anon,authenticated;

SET ROLE anon;
DO $$ BEGIN
  IF (SELECT count(*) FROM public.site_events) <> 1 THEN RAISE EXCEPTION 'Anon vede bozze'; END IF;
  IF (SELECT count(*) FROM public.site_page_content) <> 5 THEN RAISE EXCEPTION 'Anon vede bozze editoriali'; END IF;
  IF (SELECT count(*) FROM storage.objects) <> 2 THEN RAISE EXCEPTION 'Anon vede locandine private'; END IF;
END $$;
RESET ROLE;

SET app.test_admin='false';
SET ROLE authenticated;
DO $$ DECLARE id uuid; rev integer; BEGIN
  IF (SELECT count(*) FROM public.site_events) <> 1 THEN RAISE EXCEPTION 'Utente normale vede bozze'; END IF;
  SELECT e.id,e.revision INTO id,rev FROM public.site_events e WHERE e.title='Pubblicato QA';
  BEGIN
    PERFORM public.save_site_event(id,'Senza ruolo','Descrizione',current_date,null,'public/original.jpg','public/thumb.webp',rev,'published');
    RAISE EXCEPTION 'Scrittura utente normale consentita';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END $$;
RESET ROLE;

SET app.test_admin='true';
SET ROLE authenticated;
DO $$ DECLARE id uuid; rev integer; BEGIN
  SELECT e.id,e.revision INTO id,rev FROM public.site_events e WHERE e.title='Bozza QA';
  PERFORM public.save_site_event(id,'Bozza QA aggiornata','Descrizione',current_date,null,'test/original.jpg','test/thumb.webp',rev,'draft');
  BEGIN
    PERFORM public.save_site_event(id,'Conflitto','Descrizione',current_date,null,'test/original.jpg','test/thumb.webp',rev,'draft');
    RAISE EXCEPTION 'Conflitto revisioni non rilevato';
  EXCEPTION WHEN serialization_failure THEN NULL;
  END;
END $$;
RESET ROLE;
