import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import templeArch from "@/assets/temple-arch.jpg";

const doors = [
  {
    id: "arcani",
    title: "La Via degli Arcani",
    subtitle: "Tarocchi, consulti ed eventi esoterici",
    route: "/arcani",
    colorClass: "door-arcani",
  },
  {
    id: "respiro",
    title: "La Via del Respiro",
    subtitle: "Yoga, pranayama, corpo e presenza",
    route: "/respiro",
    colorClass: "door-respiro",
  },
  {
    id: "ispirazione",
    title: "La Via dell'Ispirazione",
    subtitle: "Arte, musica e letteratura esoterica",
    route: "/ispirazione",
    colorClass: "door-ispirazione",
  },
];

const Threshold = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { isMuted, toggleMute } = useBackgroundMusic();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-background threshold-bg">
      {/* Ambient background drift */}
      <div className="absolute inset-0 z-[1] threshold-ambient" aria-hidden="true" />

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="fixed top-6 right-6 z-50 p-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
        aria-label={isMuted ? "Attiva audio" : "Disattiva audio"}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        {/* Invocation */}
        <header
          className={`text-center mb-12 md:mb-16 transition-all duration-[1200ms] ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          }`}
        >
          <p className="text-muted-foreground text-sm tracking-[0.25em] uppercase mb-4 font-caption">
            Jessica Marin — Un solo tempio. Tre vie interiori.
          </p>
          <h1 className="text-foreground leading-none mb-6 font-display">
            Il Tempio delle Tre Vie
          </h1>
          <p className="text-muted-foreground text-base italic font-body max-w-md mx-auto leading-relaxed">
            "Ogni via si apre a chi è pronto ad ascoltare."
          </p>
        </header>

        {/* Three Doors */}
        <nav
          aria-label="Le tre vie"
          className={`flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10 transition-all duration-[1500ms] ease-out delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {doors.map((door) => (
            <button
              key={door.id}
              onClick={() => navigate(door.route)}
              className={`group relative w-[200px] md:w-[230px] cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
                transition-transform duration-700 ease-out hover:scale-[1.03]
                ${door.colorClass}
              `}
              aria-label={`Entra ne ${door.title}`}
            >
              {/* Arch container */}
              <div className="relative">
                {/* Divine light glow behind the arch */}
                <div className="absolute inset-0 divine-light-glow rounded-t-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" aria-hidden="true" />

                {/* Divine light animation inside arch */}
                <div className="absolute inset-[8%] top-[5%] bottom-[3%] overflow-hidden">
                  <div className="absolute inset-0 divine-light-inner" aria-hidden="true" />
                  {/* Fog effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-[40%] fog-effect" aria-hidden="true" />
                </div>

                {/* Arch image */}
                <img
                  src={templeArch}
                  alt=""
                  className="relative z-10 w-full h-auto pointer-events-none select-none"
                  draggable={false}
                />
              </div>

              {/* Text below arch */}
              <div className="relative z-10 mt-4 text-center space-y-2">
                <h3 className="text-foreground text-base md:text-lg tracking-[0.06em] font-display group-hover:text-accent transition-colors duration-500">
                  {door.title}
                </h3>
                <p className="text-muted-foreground text-[0.65rem] tracking-wide font-caption leading-relaxed">
                  {door.subtitle}
                </p>
              </div>
            </button>
          ))}
        </nav>

        {/* Bottom subtle text */}
        <p
          className={`mt-12 md:mt-16 text-muted-foreground/40 text-xs tracking-[0.3em] uppercase font-caption transition-all duration-[1800ms] ease-out delay-1000 ${
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
