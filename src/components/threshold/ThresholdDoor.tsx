import { forwardRef } from "react";
import templeArch from "@/assets/temple-arch.png";

export interface DoorData {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  colorClass: string;
}

interface Props {
  door: DoorData;
  phase: "idle" | "title-centering" | "petal-burst" | "navigating";
  isActive: boolean;
  onClick: (door: DoorData) => void;
  onTitleRef?: (id: string, el: HTMLHeadingElement | null) => void;
}

const ThresholdDoor = forwardRef<HTMLButtonElement, Props>(
  ({ door, phase, isActive, onClick, onTitleRef }, ref) => {
    const dimmed = phase !== "idle" && !isActive;
    const hideTitle = phase !== "idle" && isActive;

    return (
      <button
        ref={ref}
        onClick={() => onClick(door)}
        disabled={phase !== "idle"}
        className={`group relative w-[200px] md:w-[230px] cursor-pointer
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
          transition-all duration-700 ease-out hover:scale-[1.03]
          ${door.colorClass}
          ${dimmed ? "opacity-0 scale-95 pointer-events-none" : ""}
        `}
        style={{
          transition: dimmed
            ? "opacity 600ms ease-out, transform 600ms ease-out"
            : "transform 700ms ease-out",
        }}
        aria-label={`Entra ne ${door.title}`}
      >
        {/* Arch container */}
        <div className="relative">
          <div
            className="absolute inset-0 divine-light-glow rounded-t-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            aria-hidden="true"
          />
          <div className="absolute inset-[8%] top-[5%] bottom-[3%] overflow-hidden">
            <div className="absolute inset-0 divine-light-inner" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 right-0 h-[40%] fog-effect" aria-hidden="true" />
          </div>
          <img
            src={templeArch}
            alt=""
            className="relative z-10 w-full h-auto pointer-events-none select-none"
            draggable={false}
          />
        </div>

        {/* Text below arch */}
        <div className="relative z-10 mt-4 text-center space-y-2">
          <h3
            ref={(el) => onTitleRef?.(door.id, el)}
            className={`text-foreground text-base md:text-lg tracking-[0.06em] font-display group-hover:text-accent transition-colors duration-500 ${
              hideTitle ? "invisible" : ""
            }`}
          >
            {door.title}
          </h3>
          <p className="text-muted-foreground text-[0.65rem] tracking-wide font-caption leading-relaxed">
            {door.subtitle}
          </p>
        </div>
      </button>
    );
  }
);

ThresholdDoor.displayName = "ThresholdDoor";
export default ThresholdDoor;
