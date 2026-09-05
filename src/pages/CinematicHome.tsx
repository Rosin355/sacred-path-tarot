import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/figtree/latin-300.css";
import "@fontsource/figtree/latin-400.css";
import "@fontsource/figtree/latin-500.css";
import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { initializeCinematicJourney } from "@/cinematic/cinematicJourney";
import "@/cinematic/cinematic-home.css";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { TempleNavigation } from "@/components/TempleNavigation";
import type { TemplePathId } from "@/config/templePaths";

const destinations = {
  arcani: { route: "/arcani", color: "270 55% 45%" },
  respiro: { route: "/respiro", color: "175 40% 45%" },
  ispirazione: { route: "/ispirazione", color: "38 55% 52%" },
} as const;

type Destination = keyof typeof destinations;

const CinematicHome = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isMuted, isPlaying, toggleMute } = useBackgroundMusic();
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null);
  const transitionTimer = useRef<number | null>(null);

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

    void initializeCinematicJourney(root, abortController.signal).then((cleanup) => {
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
  }, []);

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

      if (reducedMotion) {
        completeNavigation();
        return;
      }

      transitionTimer.current = window.setTimeout(completeNavigation, 800);
    },
    [activeDestination, navigate],
  );

  return (
    <div ref={rootRef} className="cinematic-home" data-leaving={activeDestination ?? undefined}>
      <a className="skip-link" href="#journey">Vai al contenuto</a>

      <div id="loader" role="status" aria-live="polite">
        <div className="loader-inner">
          <span className="loader-glyph">✦</span>
          <p className="loader-title">TEMPIO DELLE TRE VIE</p>
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
        <button
          type="button"
          className="cinematic-audio-toggle"
          onClick={toggleMute}
          aria-label={isMuted || !isPlaying ? "Attiva audio" : "Disattiva audio"}
        >
          {isMuted || !isPlaying ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
        </button>
      </header>

      <nav id="waypoints" aria-label="Tappe del viaggio">
        <div className="rail" aria-hidden="true"><span id="rail-fill" /></div>
        <ol>
          <li><a href="#soglia" data-waypoint="0" aria-label="I — Soglia"><span className="numeral">I</span><span className="wp-label">Soglia</span></a></li>
          <li><a href="#arcani" data-waypoint="1" aria-label="II — Arcani"><span className="numeral">II</span><span className="wp-label">Arcani</span></a></li>
          <li><a href="#respiro" data-waypoint="2" aria-label="III — Respiro"><span className="numeral">III</span><span className="wp-label">Respiro</span></a></li>
          <li><a href="#ispirazione" data-waypoint="3" aria-label="IV — Arte"><span className="numeral">IV</span><span className="wp-label">Arte</span></a></li>
          <li><a href="#centro" data-waypoint="4" aria-label="V — Tempio"><span className="numeral">V</span><span className="wp-label">Tempio</span></a></li>
        </ol>
      </nav>

      <main id="journey" tabIndex={-1}>
        <section className="scene" id="soglia" data-scene="0" data-tint="#E7C9B4" aria-label="La Soglia — benvenuto nel Tempio">
          <div className="pin">
            <div className="moment" data-window="0,0.38" data-theme="ink">
              <p className="kicker"><span aria-hidden="true">✦ &nbsp;</span>Benvenuto nel Tempio</p>
              <h1>Tempio delle<br />Tre Vie</h1>
              <p className="tagline">Le tre vie per illuminarsi — Arcani, Respiro e Arte</p>
              <p className="scroll-hint">Scegli la soglia che ti chiama<span className="hint-arrow" aria-hidden="true">▾</span></p>
            </div>
            <div className="moment" data-window="0.36,0.96">
              <p className="kicker"><span aria-hidden="true">◈ &nbsp;</span>La Sacerdotessa</p>
              <blockquote className="presentazione">
                «Sono Jessica Marin, la Sacerdotessa che ti guiderà verso le profondità della tua anima e dell’inconscio
                collettivo umano, costellato di simboli e chiavi segrete che ti aiuterò a reintegrare per far emergere la
                pienezza realizzativa del tuo essere! Nei miei Corsi, Percorsi e Workshop trasmetto le conoscenze
                Esoteriche e Yogiche-motorie dai livelli basi a quelli avanzati. Sei pronto a trovare la tua luce interiore?
                {" "}<em>Scegli la tua via!</em>»
              </blockquote>
            </div>
          </div>
        </section>

        <section className="scene" id="arcani" data-scene="1" data-tint="#C98A3D" aria-label="La Via degli Arcani — tarocchi">
          <div className="pin">
            <div className="moment" data-window="0.02,0.46">
              <p className="kicker"><span aria-hidden="true">✦ &nbsp;</span>Il cammino attraverso i simboli</p>
              <h2>La Via degli Arcani</h2>
              <p className="manifesto">Non solo divinazione: i tarocchi come via di conoscenza, interpretazione e consapevolezza.</p>
            </div>
            <div className="moment" data-window="0.44,0.96">
              <ul className="offerta">
                <li><span className="glifo" aria-hidden="true">✦</span> Corsi sugli Arcani Maggiori e Minori</li>
                <li><span className="glifo" aria-hidden="true">◈</span> Metodi di stesura e lettura</li>
                <li><span className="glifo" aria-hidden="true">❖</span> Medianità attraverso i tarocchi</li>
                <li><span className="glifo" aria-hidden="true">◇</span> La Carta del Destino — comprendere sé e gli altri dalla data di nascita</li>
                <li><span className="glifo" aria-hidden="true">☽</span> Esercitazioni pratiche sulle stesure — ogni primo venerdì del mese, Libreria Esoterica Il Sigillo</li>
                <li><span className="glifo" aria-hidden="true">◯</span> Consulti personali</li>
              </ul>
              <p className="chiusa">Ogni percorso è pensato per accompagnarti verso una comprensione più profonda del simbolo e di te stesso.</p>
              <div className="cta-row">
                <button type="button" className="cta" title="Presto disponibile" disabled>Scopri il metodo</button>
                <button type="button" className="cta" title="Presto disponibile" disabled>Esplora i percorsi</button>
                <button type="button" className="cta" title="Presto disponibile" disabled>Vedi gli eventi</button>
              </div>
            </div>
          </div>
        </section>

        <section className="scene" id="respiro" data-scene="2" data-tint="#A8CFE0" aria-label="La Via del Respiro — Yoga e attività fisica">
          <div className="pin">
            <div className="moment" data-window="0.02,0.46" data-theme="ink">
              <p className="kicker"><span aria-hidden="true">◯ &nbsp;</span>Yoga e attività fisica</p>
              <h2>La Via del Respiro</h2>
              <p className="manifesto">La pratica è il luogo in cui il corpo ricorda ciò che la mente dimentica: Yoga e attività fisica si incontrano in un percorso di ascolto, forza e consapevolezza.</p>
            </div>
            <div className="moment" data-window="0.44,0.96">
              <div className="discipline">
                <div className="colonna"><h3>Attività fisica e pratiche dinamiche</h3><p>Power Yoga · Ginnastica Total Body</p></div>
                <div className="colonna"><h3>Yoga, tecnica e respiro</h3><p>Iyengar · Hatha · Yin · Pranayama</p></div>
              </div>
              <p className="chiusa">Equilibrio tra flessibilità, forza, potenza e resistenza; atmosfera e ascolto, con chiusura di rilassamento e integrazione.</p>
              <p className="logistica"><span aria-hidden="true">☽ &nbsp;</span>Kairos Spazio Olistico — mercoledì 20:30–21:45<br /><span className="logistica-nota">+ sostituzioni in altre palestre</span></p>
              <div className="cta-row">
                <button type="button" className="cta" title="Presto disponibile" disabled>Comprendi la pratica</button>
                <button type="button" className="cta" title="Presto disponibile" disabled>Scopri le discipline</button>
                <button type="button" className="cta" title="Presto disponibile" disabled>Vedi lezioni e incontri</button>
              </div>
            </div>
          </div>
        </section>

        <section className="scene" id="ispirazione" data-scene="3" data-tint="#5B4A96" aria-label="La Via dell'Arte — arte, parola e contemplazione">
          <div className="pin">
            <div className="moment" data-window="0.02,0.46">
              <p className="kicker"><span aria-hidden="true">◇ &nbsp;</span>Arte, parola e contemplazione</p>
              <h2>La Via dell’Arte</h2>
              <p className="manifesto">L’arte dà forma al mondo interiore: trasforma simboli, parole e ascolto in espressione e consapevolezza.</p>
            </div>
            <div className="moment" data-window="0.44,0.96">
              <div className="filoni">
                <div className="filone"><h3><span aria-hidden="true">✦ </span>Editoriale</h3><p>Articoli su simbolismo e alchimia interiore</p></div>
                <div className="filone"><h3><span aria-hidden="true">◈ </span>Sonoro</h3><p>Ascolti e paesaggi sonori esoterici</p></div>
                <div className="filone"><h3><span aria-hidden="true">❖ </span>Letterario</h3><p>Testi sacri e poesia mistica</p></div>
                <div className="filone"><h3><span aria-hidden="true">◯ </span>Culturale</h3><p>Eventi e progetti</p></div>
              </div>
              <div className="cta-row">
                <button type="button" className="cta" title="Presto disponibile" disabled>Leggi le riflessioni</button>
                <button type="button" className="cta" title="Presto disponibile" disabled>Esplora l’arte</button>
                <button type="button" className="cta" title="Presto disponibile" disabled>Scopri i progetti</button>
              </div>
            </div>
          </div>
        </section>

        <section className="scene" id="centro" data-scene="4" data-tint="#D4AF6A" aria-label="Il Centro del Tempio — scegli la tua via">
          <div className="pin">
            <div className="moment finale" data-window="0.1,1">
              <p className="kicker"><span aria-hidden="true">△ &nbsp;</span>Il Centro del Tempio</p>
              <h2>Scegli la soglia<br />che ti chiama</h2>
              <div className="porte">
                <button type="button" className="porta" onClick={() => enterPath("arcani")} disabled={Boolean(activeDestination)}>
                  <span className="porta-glifo" aria-hidden="true">✦</span><span className="porta-nome">La Via degli Arcani</span>
                </button>
                <button type="button" className="porta" onClick={() => enterPath("respiro")} disabled={Boolean(activeDestination)}>
                  <span className="porta-glifo" aria-hidden="true">◯</span><span className="porta-nome">La Via del Respiro</span>
                </button>
                <button type="button" className="porta" onClick={() => enterPath("ispirazione")} disabled={Boolean(activeDestination)}>
                  <span className="porta-glifo" aria-hidden="true">◇</span><span className="porta-nome">La Via dell’Arte</span>
                </button>
              </div>
              <footer className="colophon">© Jessica Marin — Tempio delle Tre Vie<span aria-hidden="true"> &nbsp;·&nbsp; ✦ ◈ ☽ &nbsp;·&nbsp; </span><Link to="/privacy">Privacy</Link></footer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CinematicHome;
