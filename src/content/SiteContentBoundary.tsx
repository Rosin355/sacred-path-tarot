import { useQuery } from "@tanstack/react-query";
import { loadSiteContent } from "./siteContentApi";
import { defaultSiteContent, type ContentState, type SitePage, type SitePageContent } from "./siteContent";

export const SiteContentBoundary = ({ page, state = "published", children }: { page: SitePage; state?: ContentState; children: (content: SitePageContent) => React.ReactNode }) => {
  const query = useQuery({ queryKey: ["site-content", page, state], queryFn: () => loadSiteContent(page, state), retry: false, staleTime: Infinity, gcTime: 30 * 60 * 1000 });
  if (query.isLoading) return <div className="min-h-[100dvh] bg-background" role="status" aria-label="Caricamento contenuti" />;
  return <>{children(query.data?.content ?? defaultSiteContent[page])}</>;
};
