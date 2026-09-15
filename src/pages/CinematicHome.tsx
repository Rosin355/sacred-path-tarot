import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/figtree/latin-300.css";
import "@fontsource/figtree/latin-400.css";
import "@fontsource/figtree/latin-500.css";
import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initializeCinematicJourney } from "@/cinematic/cinematicJourney";
import "@/cinematic/cinematic-home.css";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { TempleNavigation } from "@/components/TempleNavigation";
import type { TemplePathId } from "@/config/templePaths";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SiteContentBoundary } from "@/content/SiteContentBoundary";
import type { SitePageContent } from "@/content/siteContent";
import { DecorativeBrand } from "@/components/DecorativeBrand";
import { PublicHeaderLinks } from "@/components/PublicHeaderLinks";

const destinations = {
  arcani: { route: "/arcani", color: "270 55% 45%" },
  respiro: { route: "/respiro", color: "175 40% 45%" },
  ispirazione: { route: "/ispirazione", color: "38 55% 52%" },
} as const;

type Destination = keyof typeof destinations;

export const CinematicHomeView = ({ content }: { content: SitePageContent }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isMuted, isPlaying, toggleMute } = useBackgroundMusic();
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null);
  const transitionTimer = useRef<number | null>(null);
  const systemReducedMotion = useReducedMotion();
  const [viewportRevision, setViewportRevision] = useState(0);
  const readingMode = systemReducedMotion;
  const [restingReading, setRestingReading] = useState(false);

  // Il velo di lettura sale dopo qualche secondo di quiete, poi torna tenue.
  useEffect(() => {
    let timer = window.setTimeout(() => setRestingReading(true), 2200);
    const wake = () => {
      setRestingReading(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setRestingReading(true), 2200);
    };
    const options = { passive: true } as const;
    window.addEventListener("scroll", wake, options);
    window.addEventListener("pointermove", wake, options);
    window.addEventListener("pointerdown", wake, options);
    window.addEventListener("keydown", wake);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("keydown", wake);
    };
  }, []);

  useEffect(() => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (width !== window.innerWidth || Math.abs(height - window.innerHeight) > 120) {
          width = window.innerWidth;
          height = window.innerHeight;
          setViewportRevision(value => value + 1);
        }
      }, 200);
    };
    window.addEventListener("resize", onResize);
    return () => { window.clearTimeout(timer); window.removeEventListener("resize", onResize); };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const abortController = new AbortController();
    let dispose: (() => void) | undefined;
    let unmounted = false;

    document.body.classList.add("cinematic-active", "cinematic-loading");
    document.title = "Tempio delle Tre Vie — Jessica Marin";
    document.querySelector('meta[name="description"]')?.setAttribute(
      "content",
      "Le tre vie per illuminarsi: Tarocchi, Yoga, attività fisica, Arte e percorsi interiori. Un viaggio nel Tempio con Jessica Marin.",
    );

    void initializeCinematicJourney(root, abortController.signal, readingMode || systemReducedMotion).then((cleanup) => {
      if (unmounted) cleanup();
      else dispose = cleanup;
    });

    return () => {
      unmounted = true;
      abortController.abort();
      dispose?.();
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
      document.body.classList.remove("cinematic-active", "cinematic-loading", "cinematic-static");
    };
  }, [readingMode, systemReducedMotion, viewportRevision]);

  const enterPath = useCallback(
    (destination: TemplePathId) => {
      if (activeDestination) return;
      const target = destinations[destination];
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setActiveDestination(destination);

      const completeNavigation = () => {
        navigate(target.route, {
          state: { doorColor: target.color, from: "cinematic-home" },
        });
      };

      if (reducedMotion || readingMode) {
        completeNavigation();
        return;
      }

      transitionTimer.current = window.setTimeout(completeNavigation, 800);
    },
    [activeDestination, navigate, readingMode],
  );

  return (
    <div
      ref={rootRef}
      className="cinematic-home"
      data-leaving={activeDestination ?? undefined}
      data-reading={restingReading ? "idle" : undefined}
    >
      <a className="skip-link" href="#journey">Vai al contenuto</a>

      <div id="loader" role="status" aria-live="polite">
        <div className="loader-inner">
          <span className="loader-glyph">✦</span>
          <p className="loader-title">JESSICA MARIN</p>
          <p className="loader-label">Il velo si sta sollevando…</p>
          <div
            className="loader-bar"
            role="progressbar"
            aria-label="Caricamento esperienza"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
          >
            <span id="loader-fill" />
          </div>
        </div>
      </div>

      <canvas id="scrub" aria-hidden="true" />
      <div id="tint" aria-hidden="true" />
      <div id="vignette" aria-hidden="true" />
      <div id="atmosphere" aria-hidden="true" />
      <div className="cinematic-route-fade" aria-hidden="true" />

      <header id="hud">
        <a className="brand" href="#soglia" data-waypoint="0">
          TEMPIO DELLE TRE VIE <span className="brand-glyph" aria-hidden="true">☽</span>
        </a>
        <TempleNavigation variant="cinematic" onSelect={enterPath} />
        <div className="cinematic-header-actions"><PublicHeaderLinks variant="cinematic" /><button
          type="button"
          className="cinematic-audio-toggle"
          onClick={toggleMute}
          aria-label={isMuted || !isPlaying ? "Attiva audio" : "Disattiva audio"}
        >
          {isMuted || !isPlaying ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
        </button></div>
      </header>

      <nav id="waypoints" aria-label="Tappe del viaggio">
        <div className="rail" aria-hidden="true"><span id="rail-fill" /></div>
        <ol>
          <li><a href="#soglia" data-waypoint="0" aria-label="I — Soglia"><span className="numeral">I</span><span className="wp-label">Soglia</span></a></li>
          <li><a href="#arcani" data-waypoint="1" aria-label="II — Arcani"><span className="numeral">II</span><span className="wp-label">Arcani</span></a></li>
          <li><a href="#respiro" data-waypoint="2" aria-label="III — Respiro"><span className="numeral">III</span><span className="wp-label">Respiro</span></a></li>
          <li><a href="#ispirazione" data-waypoint="3" aria-label="IV — Arte"><span className="numeral">IV</span><span className="wp-label">Arte</span></a></li>
          <li><a href="#centro" data-waypoint="4" aria-label="V — La scelta"><span className="numeral">V</span><span className="wp-label">La scelta</span></a></li>
        </ol>
      </nav>

      <main id="journey" tabIndex={-1}>
        <section className="scene" id="soglia" data-scene="0" data-tint="#E7C9B4" aria-label="Le tre vie per illuminarsi — Jessica Marin">
          <div className="pin">
            <div className="moment" data-window="0,0.38" data-theme="ink">
              <p className="kicker"><span aria-hidden="true">✦ &nbsp;</span>{content.hero_kicker}</p>
              <h1>{content.hero_title.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h1>
              <p className="tagline">{content.hero_subtitle}</p>
              <p className="scroll-hint">Scorri e scopri il percorso<span className="hint-arrow" aria-hidden="true">▾</span></p>
            </div>
            <div className="moment" data-window="0.4,0.99">
              <p className="kicker"><span aria-hidden="true">◈ &nbsp;</span>{content.intro_kicker}</p>
              <blockquote className="presentazione">{content.intro_text}</blockquote>
            </div>
          </div>
        </section>

        <section className="scene" id="arcani" data-scene="1" data-tint="#C98A3D" aria-label="La Via degli Arcani — tarocchi">
          <div className="pin">
            <div className="moment" data-window="0.02,0.46">
              <p className="kicker"><span aria-hidden="true">✦ &nbsp;</span>{content.arcani_kicker}</p>
              <h2>{content.arcani_title}</h2>
              <DecorativeBrand value={content.arcani_brand} accessibleName="Tarocchi Per Illuminarsi" />
              <p className="manifesto">{content.arcani_intro}</p>
            </div>
            <div className="moment" data-window="0.48,0.99">
              <ul className="offerta">
                {(["✦", "◈", "❖", "◇", "☽", "◯"] as const).map((glyph, index) => <li key={glyph}><span className="glifo" aria-hidden="true">{glyph}</span> {content[`arcani_item_${index + 1}`]}</li>)}
              </ul>
              <p className="chiusa">{content.arcani_closing}</p>
            </div>
          </div>
        </section>

        <section className="scene" id="respiro" data-scene="2" data-tint="#A8CFE0" aria-label="La Via del Respiro — Yoga e attività fisica">
          <div className="pin">
            <div className="moment" data-window="0.02,0.46" data-theme="ink">
              <p className="kicker"><span aria-hidden="true">◯ &nbsp;</span>{content.respiro_kicker}</p>
              <h2>{content.respiro_title}</h2>
              <DecorativeBrand value={content.respiro_brand} accessibleName="Yoga Per Illuminarsi" />
              <p className="manifesto">{content.respiro_intro}</p>
            </div>
            <div className="moment" data-window="0.48,0.99">
              <div className="discipline">
                <div className="colonna"><h3>{content.respiro_group_1}</h3><p>{content.respiro_items_1}</p></div>
                <div className="colonna"><h3>{content.respiro_group_2}</h3><p>{content.respiro_items_2}</p></div>
              </div>
              <p className="chiusa">{content.respiro_closing}</p>
              <p className="logistica"><span aria-hidden="true">☽ &nbsp;</span>{content.respiro_place}<br /><span className="logistica-nota">{content.respiro_note}</span></p>
            </div>
          </div>
        </section>

        <section className="scene" id="ispirazione" data-scene="3" data-tint="#5B4A96" aria-label="La Via dell'Arte — arte, parola e contemplazione">
          <div className="pin">
            <div className="moment" data-window="0.02,0.46">
              <p className="kicker"><span aria-hidden="true">◇ &nbsp;</span>{content.arte_kicker}</p>
              <h2>{content.arte_title}</h2>
              <p className="manifesto">{content.arte_intro}</p>
            </div>
            <div className="moment" data-window="0.48,0.99">
              <div className="filoni">
                {(["✦", "◈", "❖", "◯"] as const).map((glyph, index) => <div className="filone" key={glyph}><h3><span aria-hidden="true">{glyph} </span>{content[`arte_group_${index + 1}`]}</h3><p>{content[`arte_text_${index + 1}`]}</p></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="scene" id="centro" data-scene="4" data-tint="#D4AF6A" aria-label="Scegli la tua via">
          <div className="pin">
            <div className="moment finale" data-window="0.1,1">
              <p className="kicker"><span aria-hidden="true">△ &nbsp;</span>{content.final_kicker}</p>
              <h2>{content.final_title.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h2>
              <div className="porte">
                <a className="porta-testo" href="/arcani" onClick={event => { event.preventDefault(); enterPath("arcani"); }}><span aria-hidden="true">✦</span>{content.final_arcani}</a>
                <a className="porta-testo" href="/respiro" onClick={event => { event.preventDefault(); enterPath("respiro"); }}><span aria-hidden="true">◯</span>{content.final_respiro}</a>
                <a className="porta-testo" href="/ispirazione" onClick={event => { event.preventDefault(); enterPath("ispirazione"); }}><span aria-hidden="true">◇</span>{content.final_arte}</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const CinematicHome = () => <SiteContentBoundary page="home">{content => <CinematicHomeView content={content} />}</SiteContentBoundary>;

export default CinematicHome;
