-- Secure contact inquiry workflow for the three public paths.
CREATE TYPE public.contact_inquiry_status AS ENUM ('new', 'read', 'archived');

CREATE TABLE public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_token uuid NOT NULL UNIQUE,
  via text NOT NULL CHECK (via IN ('arcani', 'respiro', 'ispirazione')),
  topic text NOT NULL CHECK (char_length(topic) BETWEEN 2 AND 80),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (char_length(email) <= 254),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 30),
  message text NOT NULL CHECK (char_length(message) BETWEEN 20 AND 2000),
  status public.contact_inquiry_status NOT NULL DEFAULT 'new',
  privacy_accepted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '12 months'),
  read_at timestamptz,
  archived_at timestamptz
);

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_contact_inquiries_status_created
  ON public.contact_inquiries(status, created_at DESC);
CREATE INDEX idx_contact_inquiries_via_created
  ON public.contact_inquiries(via, created_at DESC);
CREATE INDEX idx_contact_inquiries_email_created
  ON public.contact_inquiries(email, created_at DESC);
CREATE INDEX idx_contact_inquiries_expires_at
  ON public.contact_inquiries(expires_at);

CREATE POLICY "Admins can read contact inquiries"
ON public.contact_inquiries
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update contact inquiries"
ON public.contact_inquiries
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete contact inquiries"
ON public.contact_inquiries
FOR DELETE
TO authenticated
USING (public.is_admin());

CREATE TRIGGER set_contact_inquiries_updated_at
BEFORE UPDATE ON public.contact_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

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

  SELECT id INTO v_id
  FROM public.contact_inquiries
  WHERE submission_token = p_submission_token;

  IF v_id IS NOT NULL THEN
    RETURN v_id;
  END IF;

  -- Serialize checks for the same normalized email to avoid concurrent bypasses.
  PERFORM pg_advisory_xact_lock(hashtextextended(v_email, 0));

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

CREATE OR REPLACE FUNCTION public.purge_expired_contact_inquiries()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_deleted integer;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'insufficient_privilege' USING ERRCODE = '42501';
  END IF;

  DELETE FROM public.contact_inquiries WHERE expires_at <= now();
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;

REVOKE ALL ON FUNCTION public.purge_expired_contact_inquiries() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.purge_expired_contact_inquiries() TO authenticated;
