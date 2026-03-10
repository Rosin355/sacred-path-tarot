import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const doors = [
  {
    id: "arcani",
    title: "La Via degli Arcani",
    subtitle: "Tarocchi, consulti ed eventi esoterici",
    glowClass: "via-arcani-glow",
  },
  {
    id: "respiro",
    title: "La Via del Respiro",
    subtitle: "Yoga, pranayama, corpo e presenza",
    glowClass: "via-respiro-glow",
  },
  {
    id: "ispirazione",
    title: "La Via dell'Ispirazione",
    subtitle: "Arte, musica e letteratura esoterica",
    glowClass: "via-ispirazione-glow",
  },
];

const Threshold = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-background threshold-bg">
      {/* Ambient background drift */}
      <div className="absolute inset-0 threshold-ambient" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        {/* Invocation */}
        <header
          className={`text-center mb-16 transition-all duration-[1200ms] ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          }`}
        >
          <p className="text-muted-foreground text-sm tracking-[0.25em] uppercase mb-4 font-caption">
            Jessica Marin — Un solo tempio. Tre vie interiori.
          </p>
          <h1 className="text-foreground leading-none mb-6">
            Il Tempio delle Tre Vie
          </h1>
          <p className="text-muted-foreground text-base italic font-body max-w-md mx-auto">
            "Ogni via si apre a chi è pronto ad ascoltare."
          </p>
        </header>

        {/* Three Doors */}
        <nav
          aria-label="Le tre vie"
          className={`flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 transition-all duration-[1500ms] ease-out delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {doors.map((door) => (
            <button
              key={door.id}
              onClick={() => navigate(`/transition/${door.id}`)}
              className={`group relative flex flex-col items-center justify-end
                w-56 h-80 md:w-64 md:h-96
                border border-border/40 rounded-t-[2rem]
                bg-gradient-to-b from-card/60 to-background/80
                backdrop-blur-sm
                transition-all duration-700 ease-out
                hover:border-border/70
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                ${door.glowClass}
              `}
              aria-label={`Entra ne ${door.title}`}
            >
              {/* Stone texture overlay */}
              <div className="absolute inset-0 rounded-t-[2rem] opacity-[0.03] bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,currentColor_2px,currentColor_3px)]" aria-hidden="true" />
              
              {/* Glow backdrop on hover */}
              <div className="absolute inset-0 rounded-t-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 door-glow-backdrop" aria-hidden="true" />

              {/* Door arch line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-gradient-to-b from-muted-foreground/30 to-transparent" aria-hidden="true" />

              {/* Content */}
              <div className="relative z-10 p-6 text-center space-y-3">
                <h3 className="text-foreground text-lg tracking-[0.08em] group-hover:text-accent transition-colors duration-500">
                  {door.title}
                </h3>
                <p className="text-muted-foreground text-xs tracking-wide font-body leading-relaxed">
                  {door.subtitle}
                </p>
                {/* Threshold symbol */}
                <div className="w-8 h-[1px] mx-auto bg-muted-foreground/30 group-hover:bg-accent/60 transition-colors duration-500" aria-hidden="true" />
              </div>
            </button>
          ))}
        </nav>

        {/* Bottom subtle text */}
        <p
          className={`mt-16 text-muted-foreground/40 text-xs tracking-[0.3em] uppercase transition-all duration-[1800ms] ease-out delay-1000 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          Scegli la soglia che ti chiama
        </p>
      </div>
    </div>
  );
};

export default Threshold;
