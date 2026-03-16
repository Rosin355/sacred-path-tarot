-- AI knowledge base foundation for Guida alla Via
-- Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'knowledge_status') THEN
    CREATE TYPE public.knowledge_status AS ENUM ('draft', 'published', 'archived');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'knowledge_content_type') THEN
    CREATE TYPE public.knowledge_content_type AS ENUM ('page', 'article', 'method', 'faq', 'rule', 'source_note');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'knowledge_path') THEN
    CREATE TYPE public.knowledge_path AS ENUM ('arcani', 'respiro', 'ispirazione', 'tempio');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assistant_rule_type') THEN
    CREATE TYPE public.assistant_rule_type AS ENUM ('system', 'tone', 'safety', 'routing', 'retrieval');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assistant_source_kind') THEN
    CREATE TYPE public.assistant_source_kind AS ENUM ('approved_link', 'reference_domain', 'editorial_source');
  END IF;
END $$;

-- Updated at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Documents
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL,
  summary text,
  content_type public.knowledge_content_type NOT NULL DEFAULT 'page',
  path public.knowledge_path NOT NULL DEFAULT 'tempio',
  status public.knowledge_status NOT NULL DEFAULT 'draft',
  priority integer NOT NULL DEFAULT 50,
  tags text[] NOT NULL DEFAULT '{}',
  source_url text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT knowledge_documents_priority_range CHECK (priority >= 0 AND priority <= 100),
  CONSTRAINT knowledge_documents_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_knowledge_documents_status ON public.knowledge_documents(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_path ON public.knowledge_documents(path);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_type ON public.knowledge_documents(content_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_priority ON public.knowledge_documents(priority DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_tags ON public.knowledge_documents USING gin(tags);

DROP POLICY IF EXISTS "Published knowledge documents are viewable by everyone" ON public.knowledge_documents;
CREATE POLICY "Published knowledge documents are viewable by everyone"
ON public.knowledge_documents
FOR SELECT
USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert knowledge documents" ON public.knowledge_documents;
CREATE POLICY "Admins can insert knowledge documents"
ON public.knowledge_documents
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update knowledge documents" ON public.knowledge_documents;
CREATE POLICY "Admins can update knowledge documents"
ON public.knowledge_documents
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete knowledge documents" ON public.knowledge_documents;
CREATE POLICY "Admins can delete knowledge documents"
ON public.knowledge_documents
FOR DELETE
TO authenticated
USING (public.is_admin());

DROP TRIGGER IF EXISTS set_knowledge_documents_updated_at ON public.knowledge_documents;
CREATE TRIGGER set_knowledge_documents_updated_at
BEFORE UPDATE ON public.knowledge_documents
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Chunks
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL,
  chunk_index integer NOT NULL,
  heading text,
  content text NOT NULL,
  token_estimate integer NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT knowledge_chunks_document_fkey FOREIGN KEY (document_id) REFERENCES public.knowledge_documents(id) ON DELETE CASCADE,
  CONSTRAINT knowledge_chunks_unique_index UNIQUE (document_id, chunk_index)
);

ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_document_id ON public.knowledge_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_metadata ON public.knowledge_chunks USING gin(metadata);

DROP POLICY IF EXISTS "Published knowledge chunks are viewable by everyone" ON public.knowledge_chunks;
CREATE POLICY "Published knowledge chunks are viewable by everyone"
ON public.knowledge_chunks
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.knowledge_documents d
    WHERE d.id = knowledge_chunks.document_id
      AND (d.status = 'published' OR public.is_admin())
  )
);

DROP POLICY IF EXISTS "Admins can insert knowledge chunks" ON public.knowledge_chunks;
CREATE POLICY "Admins can insert knowledge chunks"
ON public.knowledge_chunks
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update knowledge chunks" ON public.knowledge_chunks;
CREATE POLICY "Admins can update knowledge chunks"
ON public.knowledge_chunks
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete knowledge chunks" ON public.knowledge_chunks;
CREATE POLICY "Admins can delete knowledge chunks"
ON public.knowledge_chunks
FOR DELETE
TO authenticated
USING (public.is_admin());

DROP TRIGGER IF EXISTS set_knowledge_chunks_updated_at ON public.knowledge_chunks;
CREATE TRIGGER set_knowledge_chunks_updated_at
BEFORE UPDATE ON public.knowledge_chunks
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Assistant rules
CREATE TABLE IF NOT EXISTS public.assistant_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  rule_type public.assistant_rule_type NOT NULL DEFAULT 'system',
  content text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  priority integer NOT NULL DEFAULT 50,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT assistant_rules_priority_range CHECK (priority >= 0 AND priority <= 100),
  CONSTRAINT assistant_rules_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.assistant_rules ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_assistant_rules_active ON public.assistant_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_assistant_rules_type ON public.assistant_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_assistant_rules_priority ON public.assistant_rules(priority DESC);

DROP POLICY IF EXISTS "Active assistant rules are viewable by everyone" ON public.assistant_rules;
CREATE POLICY "Active assistant rules are viewable by everyone"
ON public.assistant_rules
FOR SELECT
USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert assistant rules" ON public.assistant_rules;
CREATE POLICY "Admins can insert assistant rules"
ON public.assistant_rules
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update assistant rules" ON public.assistant_rules;
CREATE POLICY "Admins can update assistant rules"
ON public.assistant_rules
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete assistant rules" ON public.assistant_rules;
CREATE POLICY "Admins can delete assistant rules"
ON public.assistant_rules
FOR DELETE
TO authenticated
USING (public.is_admin());

DROP TRIGGER IF EXISTS set_assistant_rules_updated_at ON public.assistant_rules;
CREATE TRIGGER set_assistant_rules_updated_at
BEFORE UPDATE ON public.assistant_rules
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- FAQs
CREATE TABLE IF NOT EXISTS public.assistant_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  path public.knowledge_path NOT NULL DEFAULT 'tempio',
  tags text[] NOT NULL DEFAULT '{}',
  priority integer NOT NULL DEFAULT 50,
  status public.knowledge_status NOT NULL DEFAULT 'draft',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT assistant_faqs_priority_range CHECK (priority >= 0 AND priority <= 100),
  CONSTRAINT assistant_faqs_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.assistant_faqs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_assistant_faqs_status ON public.assistant_faqs(status);
CREATE INDEX IF NOT EXISTS idx_assistant_faqs_path ON public.assistant_faqs(path);
CREATE INDEX IF NOT EXISTS idx_assistant_faqs_tags ON public.assistant_faqs USING gin(tags);

DROP POLICY IF EXISTS "Published FAQs are viewable by everyone" ON public.assistant_faqs;
CREATE POLICY "Published FAQs are viewable by everyone"
ON public.assistant_faqs
FOR SELECT
USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert FAQs" ON public.assistant_faqs;
CREATE POLICY "Admins can insert FAQs"
ON public.assistant_faqs
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update FAQs" ON public.assistant_faqs;
CREATE POLICY "Admins can update FAQs"
ON public.assistant_faqs
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete FAQs" ON public.assistant_faqs;
CREATE POLICY "Admins can delete FAQs"
ON public.assistant_faqs
FOR DELETE
TO authenticated
USING (public.is_admin());

DROP TRIGGER IF EXISTS set_assistant_faqs_updated_at ON public.assistant_faqs;
CREATE TRIGGER set_assistant_faqs_updated_at
BEFORE UPDATE ON public.assistant_faqs
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Approved sources
CREATE TABLE IF NOT EXISTS public.assistant_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  source_kind public.assistant_source_kind NOT NULL DEFAULT 'approved_link',
  url text NOT NULL,
  domain text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  trust_level integer NOT NULL DEFAULT 50,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT assistant_sources_trust_level_range CHECK (trust_level >= 0 AND trust_level <= 100),
  CONSTRAINT assistant_sources_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.assistant_sources ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_assistant_sources_active ON public.assistant_sources(is_active);
CREATE INDEX IF NOT EXISTS idx_assistant_sources_domain ON public.assistant_sources(domain);

DROP POLICY IF EXISTS "Active assistant sources are viewable by everyone" ON public.assistant_sources;
CREATE POLICY "Active assistant sources are viewable by everyone"
ON public.assistant_sources
FOR SELECT
USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert assistant sources" ON public.assistant_sources;
CREATE POLICY "Admins can insert assistant sources"
ON public.assistant_sources
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update assistant sources" ON public.assistant_sources;
CREATE POLICY "Admins can update assistant sources"
ON public.assistant_sources
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete assistant sources" ON public.assistant_sources;
CREATE POLICY "Admins can delete assistant sources"
ON public.assistant_sources
FOR DELETE
TO authenticated
USING (public.is_admin());

DROP TRIGGER IF EXISTS set_assistant_sources_updated_at ON public.assistant_sources;
CREATE TRIGGER set_assistant_sources_updated_at
BEFORE UPDATE ON public.assistant_sources
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();