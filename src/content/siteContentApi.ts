import { supabase } from "@/integrations/supabase/client";
import { defaultSiteContent, mergeWithDefaults, type ContentState, type SitePage, type SitePageContent } from "./siteContent";

export type ContentRecord = { page: SitePage; state: ContentState; content: SitePageContent; revision: number; updated_at: string };

const withTimeout = async <T,>(promise: PromiseLike<T>, milliseconds = 3000): Promise<T> => {
  let timer = 0;
  try {
    return await Promise.race([
      Promise.resolve(promise),
      new Promise<T>((_, reject) => { timer = window.setTimeout(() => reject(new Error("Timeout caricamento contenuti")), milliseconds); }),
    ]);
  } finally { window.clearTimeout(timer); }
};

export const loadSiteContent = async (page: SitePage, state: ContentState = "published"): Promise<ContentRecord> => {
  const { data, error } = await withTimeout(
    supabase.from("site_page_content").select("page,state,content,revision,updated_at").eq("page", page).eq("state", state).maybeSingle(),
  );
  if (error) throw error;
  if (!data) return { page, state, content: defaultSiteContent[page], revision: 0, updated_at: "" };
  return { page, state, content: mergeWithDefaults(page, data.content), revision: data.revision, updated_at: data.updated_at };
};

export const saveDraft = async (page: SitePage, content: SitePageContent, expectedRevision: number) => {
  const { data, error } = await supabase.rpc("save_site_content_draft", { p_page: page, p_content: content, p_expected_revision: expectedRevision });
  if (error) throw error;
  return data as unknown as ContentRecord;
};

export const publishContent = async (page: SitePage, expectedDraftRevision: number, expectedPublishedRevision: number) => {
  const { data, error } = await supabase.rpc("publish_site_content", { p_page: page, p_expected_draft_revision: expectedDraftRevision, p_expected_published_revision: expectedPublishedRevision });
  if (error) throw error;
  return data as unknown as { draft: ContentRecord; published: ContentRecord };
};

export const restoreDraft = async (page: SitePage, expectedDraftRevision: number, expectedPublishedRevision: number) => {
  const { data, error } = await supabase.rpc("restore_site_content_draft", { p_page: page, p_expected_draft_revision: expectedDraftRevision, p_expected_published_revision: expectedPublishedRevision });
  if (error) throw error;
  return data as unknown as ContentRecord;
};
