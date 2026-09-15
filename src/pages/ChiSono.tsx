import { useEffect } from "react";
import ViaLayout from "@/components/ViaLayout";
import { SiteContentBoundary } from "@/content/SiteContentBoundary";
import type { SitePageContent } from "@/content/siteContent";
import "./editorial-pages.css";

export function ChiSonoView({ content }: { content: SitePageContent }) {
  useEffect(() => { document.title = "Chi sono | Jessica Marin"; }, []);
  return <ViaLayout viaClass="editorial-page" title="Chi sono">
    <section className="editorial-hero" aria-labelledby="chi-sono-title">
      <div className="editorial-hero__copy">
        <p className="editorial-kicker">✦ {content.kicker}</p>
        <h1 id="chi-sono-title">{content.title}</h1>
        <p className="editorial-intro">{content.intro}</p>
      </div>
    </section>
    <section className="editorial-body" aria-label="Presentazione di Jessica Marin">
      <p>{content.biography_1}</p><p>{content.biography_2}</p>
    </section>
  </ViaLayout>;
}

export default function ChiSono() { return <SiteContentBoundary page="chi_sono">{content => <ChiSonoView content={content} />}</SiteContentBoundary>; }
