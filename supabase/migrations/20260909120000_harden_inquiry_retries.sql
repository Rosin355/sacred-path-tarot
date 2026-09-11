-- Additive hardening; apply only after the original contact migration.
-- RLS remains the admin authorization boundary; table grants are explicit.
REVOKE ALL ON TABLE public.contact_inquiries FROM PUBLIC, anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.contact_inquiries TO authenticated;

CREATE OR REPLACE FUNCTION public.submit_contact_inquiry(
  p_submission_token uuid,
  p_via text,
  p_topic text,
  p_name text,
  p_email text,
  p_phone text,
  p_message text,
  p_privacy_accepted boolean,
  p_company text DEFAULT ''
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_id uuid;
  v_email text := lower(btrim(p_email));
  v_name text := btrim(p_name);
  v_phone text := nullif(btrim(coalesce(p_phone, '')), '');
  v_topic text := btrim(p_topic);
  v_message text := btrim(p_message);
BEGIN
  -- Honeypot: acknowledge bots without persisting their payload.
  IF char_length(btrim(coalesce(p_company, ''))) > 0 THEN
    RETURN coalesce(p_submission_token, gen_random_uuid());
  END IF;

  IF p_submission_token IS NULL
    OR p_via IS NULL
    OR p_via NOT IN ('arcani', 'respiro', 'ispirazione')
    OR p_privacy_accepted IS DISTINCT FROM true
    OR v_name IS NULL
    OR char_length(v_name) NOT BETWEEN 2 AND 100
    OR v_email IS NULL
    OR char_length(v_email) > 254
    OR v_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    OR (v_phone IS NOT NULL AND char_length(v_phone) > 30)
    OR v_topic IS NULL
    OR char_length(v_topic) NOT BETWEEN 2 AND 80
    OR v_message IS NULL
    OR char_length(v_message) NOT BETWEEN 20 AND 2000
  THEN
    RAISE EXCEPTION 'invalid_contact_inquiry' USING ERRCODE = '22023';
  END IF;

  IF NOT (
    (p_via = 'arcani' AND v_topic IN ('corsi-percorsi', 'consulto-personale', 'eventi-esercitazioni', 'altro'))
    OR (p_via = 'respiro' AND v_topic IN ('lezione-prova', 'discipline-percorsi', 'eventi-incontri', 'altro'))
    OR (p_via = 'ispirazione' AND v_topic IN ('collaborazioni-progetti', 'eventi-culturali', 'contenuti-editoriali', 'altro'))
  ) THEN
    RAISE EXCEPTION 'invalid_contact_inquiry' USING ERRCODE = '22023';
  END IF;

  DELETE FROM public.contact_inquiries WHERE expires_at <= now();

  -- Lock token before email: retries serialize before the idempotency lookup.
  PERFORM pg_advisory_xact_lock(hashtextextended(p_submission_token::text, 1));
  PERFORM pg_advisory_xact_lock(hashtextextended(v_email, 0));

  SELECT id INTO v_id
  FROM public.contact_inquiries
  WHERE submission_token = p_submission_token;

  IF v_id IS NOT NULL THEN
    RETURN v_id;
  END IF;


  IF (
    SELECT count(*)
    FROM public.contact_inquiries
    WHERE email = v_email
      AND created_at > now() - interval '1 hour'
  ) >= 3 THEN
    RAISE EXCEPTION 'rate_limit_exceeded' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.contact_inquiries (
    submission_token,
    via,
    topic,
    name,
    email,
    phone,
    message
  ) VALUES (
    p_submission_token,
    p_via,
    v_topic,
    v_name,
    v_email,
    v_phone,
    v_message
  )
  ON CONFLICT (submission_token) DO UPDATE
    SET submission_token = EXCLUDED.submission_token
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_contact_inquiry(uuid, text, text, text, text, text, text, boolean, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_contact_inquiry(uuid, text, text, text, text, text, text, boolean, text) TO anon, authenticated;
