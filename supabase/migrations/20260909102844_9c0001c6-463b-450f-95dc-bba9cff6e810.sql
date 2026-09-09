CREATE TYPE public.contact_inquiry_status AS ENUM ('new', 'read', 'archived');

CREATE TABLE public.contact_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_token UUID NOT NULL UNIQUE,
  via TEXT NOT NULL,
  topic TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  privacy_accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status public.contact_inquiry_status NOT NULL DEFAULT 'new',
  read_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '365 days',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX contact_inquiries_created_at_idx ON public.contact_inquiries (created_at DESC);
CREATE INDEX contact_inquiries_status_idx ON public.contact_inquiries (status);

GRANT SELECT, UPDATE, DELETE ON public.contact_inquiries TO authenticated;
GRANT ALL ON public.contact_inquiries TO service_role;

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view inquiries" ON public.contact_inquiries
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update inquiries" ON public.contact_inquiries
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete inquiries" ON public.contact_inquiries
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_contact_inquiries_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER contact_inquiries_updated_at
  BEFORE UPDATE ON public.contact_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_contact_inquiries_updated_at();

CREATE OR REPLACE FUNCTION public.submit_contact_inquiry(
  p_submission_token UUID,
  p_via TEXT,
  p_topic TEXT,
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_message TEXT,
  p_privacy_accepted BOOLEAN,
  p_company TEXT DEFAULT ''
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_recent INTEGER;
BEGIN
  IF coalesce(p_company, '') <> '' THEN
    RETURN;
  END IF;

  IF p_privacy_accepted IS NOT TRUE THEN
    RAISE EXCEPTION 'privacy_not_accepted';
  END IF;

  IF p_via NOT IN ('arcani', 'respiro', 'ispirazione') THEN
    RAISE EXCEPTION 'invalid_via';
  END IF;

  IF length(trim(p_name)) < 2 OR length(trim(p_name)) > 100
     OR length(trim(p_email)) > 254 OR trim(p_email) !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
     OR length(coalesce(p_phone, '')) > 30
     OR length(trim(p_message)) < 20 OR length(trim(p_message)) > 2000
     OR length(trim(p_topic)) = 0 OR length(trim(p_topic)) > 60 THEN
    RAISE EXCEPTION 'invalid_payload';
  END IF;

  SELECT count(*) INTO v_recent
  FROM public.contact_inquiries
  WHERE lower(email) = lower(trim(p_email))
    AND created_at > now() - interval '1 hour';

  IF v_recent >= 5 THEN
    RAISE EXCEPTION 'rate_limit_exceeded';
  END IF;

  INSERT INTO public.contact_inquiries (submission_token, via, topic, name, email, phone, message)
  VALUES (p_submission_token, p_via, trim(p_topic), trim(p_name), lower(trim(p_email)), nullif(trim(coalesce(p_phone, '')), ''), trim(p_message))
  ON CONFLICT (submission_token) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_contact_inquiry(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_contact_inquiry(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.purge_expired_contact_inquiries()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.contact_inquiries WHERE expires_at < now();
END;
$$;

REVOKE ALL ON FUNCTION public.purge_expired_contact_inquiries() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.purge_expired_contact_inquiries() TO authenticated, service_role;