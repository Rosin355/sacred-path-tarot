import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { FrameScrubber } from "./frameScrubber";

type Atmosphere = {
  setProgress: (value: number) => void;
  destroy: () => void;
};

type CinematicManifest = {
  base: string;
  width: number;
  height: number;
  scenes: Array<{ id: string; count: number }>;
};

type NetworkInformation = {
  saveData?: boolean;
};

type NavigatorWithHints = Navigator & {
  connection?: NetworkInformation;
  deviceMemory?: number;
};

const CINEMATIC_ROOT = "cinematic";

function cinematicProgress(progress: number) {
  const edgeScroll = 0.14;
  const edgeFrames = 0.2;

  if (progress < edgeScroll) return progress * (edgeFrames / edgeScroll);
  if (progress > 1 - edgeScroll) {
    return 1 - edgeFrames + (progress - (1 - edgeScroll)) * (edgeFrames / edgeScroll);
  }

  return edgeFrames + (progress - edgeScroll) * ((1 - edgeFrames * 2) / (1 - edgeScroll * 2));
}

export async function initializeCinematicJourney(root: HTMLElement, signal?: AbortSignal) {
  gsap.registerPlugin(ScrollTrigger);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const smallViewport = Math.min(window.innerWidth, window.innerHeight) < 500 || window.innerWidth < 768;
  const navigatorHints = navigator as NavigatorWithHints;
  const saveData = navigatorHints.connection?.saveData === true;
  const lowMemory = Boolean(navigatorHints.deviceMemory && navigatorHints.deviceMemory < 4);
  const canScrub = "createImageBitmap" in window;
  const base = `${import.meta.env.BASE_URL}${CINEMATIC_ROOT}/`;
  const initialHash = window.location.hash;
  const sections = Array.from(root.querySelectorAll<HTMLElement>(".scene"));
  const waypoints = Array.from(root.querySelectorAll<HTMLAnchorElement>("#waypoints [data-waypoint]"));
  const disposers: Array<() => void> = [];
  let atmosphere: Atmosphere | null = null;
  let destroyed = signal?.aborted ?? false;
  let staticInitialized = false;

  const query = <T extends Element>(selector: string) => root.querySelector<T>(selector);

  const onAbort = () => {
    destroyed = true;
  };
  signal?.addEventListener("abort", onAbort, { once: true });
  disposers.push(() => signal?.removeEventListener("abort", onAbort));

  const setActiveWaypoint = (index: number, syncHash = false) => {
    waypoints.forEach((waypoint, currentIndex) => {
      const active = index === currentIndex;
      waypoint.classList.toggle("active", active);
      if (active) waypoint.setAttribute("aria-current", "step");
      else waypoint.removeAttribute("aria-current");
    });

    const homePath = new URL(import.meta.env.BASE_URL, window.location.origin).pathname;
    if (
      syncHash &&
      window.location.pathname === homePath &&
      sections[index] &&
      window.location.hash !== `#${sections[index].id}`
    ) {
      window.history.replaceState(window.history.state, "", `#${sections[index].id}`);
    }
  };

  const initAtmosphere = async () => {
    if (reducedMotion || saveData || smallViewport || lowMemory || !canScrub || destroyed) return;

    try {
      const { createAtmosphere } = await import("./atmosphere");
      const instance = createAtmosphere(query<HTMLElement>("#atmosphere"));
      if (destroyed) {
        instance?.destroy();
        return;
      }
      atmosphere = instance;
      if (atmosphere) document.documentElement.classList.add("has-webgl-atmosphere");
    } catch {
      // Progressive enhancement: il percorso resta disponibile senza WebGL.
    }
  };

  const destroyAtmosphere = () => {
    atmosphere?.destroy();
    atmosphere = null;
    document.documentElement.classList.remove("has-webgl-atmosphere");
  };

  const initStatic = () => {
    if (destroyed || staticInitialized) return;
    staticInitialized = true;
    document.body.classList.add("cinematic-static");
    document.body.classList.remove("cinematic-loading");

    root.querySelectorAll<HTMLElement>(".moment").forEach((moment) => {
      moment.inert = false;
    });

    sections.forEach((section, index) => {
      const id = String(index + 1).padStart(2, "0");
      section.style.backgroundImage =
        `linear-gradient(rgba(13,15,26,.42), rgba(13,15,26,.6)), url(${base}stills/${id}.webp)`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveWaypoint(Number((entry.target as HTMLElement).dataset.scene));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    disposers.push(() => observer.disconnect());

    const initialIndex = sections.findIndex((section) => `#${section.id}` === initialHash);
    setActiveWaypoint(Math.max(0, initialIndex));
    if (initialIndex > 0) {
      requestAnimationFrame(() => sections[initialIndex]?.scrollIntoView({ block: "start" }));
    }
  };

  const loadManifest = async (): Promise<CinematicManifest> => {
    const candidates = smallViewport ? ["frames-mobile", "frames"] : ["frames"];

    for (const directory of candidates) {
      try {
        const response = await fetch(`${base}${directory}/manifest.json`, { signal });
        if (response.ok) {
          return { base: `${base}${directory}`, ...(await response.json()) } as CinematicManifest;
        }
      } catch {
        // Prova il manifest successivo.
      }
    }

    throw new Error("Manifest della sequenza cinematica non trovato");
  };

  const originalScrollRestoration = window.history.scrollRestoration;
  if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  void initAtmosphere();

  if (reducedMotion || saveData || !canScrub) {
    initStatic();
  } else {
    try {
      const manifest = await loadManifest();
      if (destroyed) return () => undefined;

      const canvas = query<HTMLCanvasElement>("#scrub");
      if (!canvas) throw new Error("Canvas cinematografico non disponibile");

      const scrubber = new FrameScrubber(canvas, manifest, {
        concurrency: smallViewport ? 4 : 6,
        maxDpr: 1.5,
        bitmapWindow: smallViewport ? 64 : 48,
      });
      disposers.push(() => scrubber.destroy());

      const lenis = new Lenis({
        autoRaf: false,
        lerp: 0.09,
        prevent: (node) =>
          node.classList?.contains("pin") && node.scrollHeight > node.clientHeight + 1,
      });
      lenis.stop();
      lenis.on("scroll", ScrollTrigger.update);
      disposers.push(() => lenis.destroy());

      const ticker = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
      disposers.push(() => gsap.ticker.remove(ticker));

      const triggers: ScrollTrigger[] = [];
      const timelines: gsap.core.Timeline[] = [];
      disposers.push(() => {
        timelines.forEach((timeline) => timeline.kill());
        triggers.forEach((trigger) => trigger.kill());
      });

      const goToScene = (index: number, options: Record<string, unknown> = {}) => {
        const section = sections[index];
        const firstMoment = section?.querySelector<HTMLElement>(".moment");
        if (!section || !firstMoment?.dataset.window) return;

        const [start] = firstMoment.dataset.window.split(",").map(Number);
        const range = Math.max(0, section.offsetHeight - window.innerHeight);
        const offset = index === 0 ? 0 : Math.min(range, range * (start + 0.13));

        lenis.scrollTo(section, {
          offset,
          duration: 2.2,
          easing: (value) => 1 - Math.pow(1 - value, 3),
          ...options,
        });
      };

      let revealTimeout = 0;
      let revealed = false;
      let syncingInitialPosition = true;
      const loaderFill = query<HTMLElement>("#loader-fill");
      const loaderProgress = query<HTMLElement>("[role='progressbar']");
      const readyAt = Math.min(smallViewport ? 24 : 36, manifest.scenes[0].count);

      const switchToStatic = () => {
        window.clearTimeout(revealTimeout);
        scrubber.destroy();
        lenis.destroy();
        gsap.ticker.remove(ticker);
        timelines.forEach((timeline) => timeline.kill());
        triggers.forEach((trigger) => trigger.kill());
        destroyAtmosphere();
        initStatic();
      };

      const reveal = () => {
        if (revealed || destroyed) return;
        revealed = true;
        if (scrubber.loadedCount === 0) {
          switchToStatic();
          return;
        }

        if (loaderFill) loaderFill.style.width = "100%";
        loaderProgress?.setAttribute("aria-valuenow", "100");
        const loader = query<HTMLElement>("#loader");
        if (loader) gsap.to(loader, { autoAlpha: 0, duration: 0.65, ease: "sine.inOut", delay: 0.12 });
        document.body.classList.remove("cinematic-loading");
        lenis.start();

        const hashTarget = sections.findIndex((section) => `#${section.id}` === initialHash);
        if (hashTarget > 0) goToScene(hashTarget, { immediate: true });
        else lenis.scrollTo(0, { immediate: true, force: true });

        syncingInitialPosition = false;
        ScrollTrigger.refresh();
        ScrollTrigger.update();
        setActiveWaypoint(Math.max(0, hashTarget), true);
      };

      scrubber.onProgress((loaded: number) => {
        const percentage = Math.min(100, Math.round((loaded / readyAt) * 100));
        if (!revealed) {
          if (loaderFill) loaderFill.style.width = `${percentage}%`;
          loaderProgress?.setAttribute("aria-valuenow", String(percentage));
        }
        if (loaded >= readyAt) reveal();
      });
      revealTimeout = window.setTimeout(reveal, 8000);
      disposers.push(() => window.clearTimeout(revealTimeout));
      scrubber.start();

      sections.forEach((section, index) => {
        const moments = Array.from(section.querySelectorAll<HTMLElement>(".moment")).map((element) => ({
          element,
          window: element.dataset.window?.split(",").map(Number) ?? [0, 1],
        }));

        moments.forEach(({ element, window: momentWindow }) => {
          element.inert = momentWindow[0] > 0;
        });

        triggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
              if (syncingInitialPosition) return;
              scrubber.setTarget(scrubber.frameAt(index, cinematicProgress(self.progress)));
              moments.forEach(({ element, window: [start, end] }) => {
                const visible = self.progress >= start && self.progress <= end;
                if (element.inert === visible) element.inert = !visible;
              });
            },
          }),
        );

        triggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: "top 55%",
            end: "bottom 45%",
            onToggle: (self) => {
              if (!self.isActive) return;
              setActiveWaypoint(index, !syncingInitialPosition);
              const tint = query<HTMLElement>("#tint");
              if (tint) {
                gsap.to(tint, {
                  backgroundColor: section.dataset.tint,
                  duration: 1.4,
                  ease: "sine.inOut",
                  overwrite: "auto",
                });
              }
            },
          }),
        );

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: true },
        });
        timelines.push(timeline);
        timeline.set({}, {}, 1);

        moments.forEach(({ element, window: [start, end] }) => {
          const ramp = 0.06;
          if (start === 0) gsap.set(element, { opacity: 1 });
          else timeline.fromTo(element, { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: ramp }, start);
          if (end < 1) timeline.to(element, { opacity: 0, y: -44, duration: ramp }, end - ramp);
        });
      });

      const railFill = query<HTMLElement>("#rail-fill");
      const journey = query<HTMLElement>("#journey");
      if (railFill && journey) {
        triggers.push(
          ScrollTrigger.create({
            trigger: journey,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
              railFill.style.transform = `scaleY(${self.progress})`;
              atmosphere?.setProgress(self.progress);
            },
          }),
        );
      }

      waypoints.forEach((waypoint) => {
        const onClick = (event: Event) => {
          event.preventDefault();
          const index = Number(waypoint.dataset.waypoint);
          const target = sections[index];
          if (!target) return;
          window.history.pushState(window.history.state, "", `#${target.id}`);
          goToScene(index);
        };
        waypoint.addEventListener("click", onClick);
        disposers.push(() => waypoint.removeEventListener("click", onClick));
      });

      const onPopState = () => {
        const index = sections.findIndex((section) => `#${section.id}` === window.location.hash);
        if (index >= 0) goToScene(index);
      };
      window.addEventListener("popstate", onPopState);
      disposers.push(() => window.removeEventListener("popstate", onPopState));
    } catch (error) {
      console.error("Inizializzazione cinematica fallita: attivo il fallback statico", error);
      destroyAtmosphere();
      initStatic();
    }
  }

  return () => {
    destroyed = true;
    disposers.reverse().forEach((dispose) => dispose());
    destroyAtmosphere();
    window.history.scrollRestoration = originalScrollRestoration;
    document.body.classList.remove("cinematic-loading", "cinematic-static");
    document.documentElement.classList.remove("lenis", "lenis-smooth");
  };
}
