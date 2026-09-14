import { Link, Navigate, useParams } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SiteContentBoundary } from "@/content/SiteContentBoundary";
import { sitePages, type SitePage, type SitePageContent } from "@/content/siteContent";
import { CinematicHomeView } from "./CinematicHome";
import { ViaArcaniView } from "./ViaArcani";
import { ViaRespiroView } from "./ViaRespiro";
import { ViaIspirazioneView } from "./ViaIspirazione";

const PreviewPage = ({ page, content }: { page: SitePage; content: SitePageContent }) => {
  if (page === "home") return <CinematicHomeView content={content} />;
  if (page === "arcani") return <ViaArcaniView content={content} />;
  if (page === "respiro") return <ViaRespiroView content={content} />;
  return <ViaIspirazioneView content={content} />;
};

const AdminContentPreview = () => {
  const { page } = useParams();
  if (!sitePages.includes(page as SitePage)) return <Navigate to="/admin" replace />;
  const selectedPage = page as SitePage;
  return <ProtectedRoute requireAdmin><div className="fixed left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-full border border-amber-300 bg-slate-950 px-5 py-3 text-sm font-semibold text-amber-200 shadow-xl">Anteprima bozza · <Link className="underline" to="/admin">Torna all’admin</Link></div><SiteContentBoundary page={selectedPage} state="draft">{content => <PreviewPage page={selectedPage} content={content} />}</SiteContentBoundary></ProtectedRoute>;
};

export default AdminContentPreview;
