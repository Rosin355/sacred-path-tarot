import { MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { templePaths, type TemplePathId } from "@/config/templePaths";
import "./temple-navigation.css";

interface TempleNavigationProps {
  variant: "cinematic" | "page";
  onSelect?: (path: TemplePathId) => void;
}

export function TempleNavigation({ variant, onSelect }: TempleNavigationProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSelect = (
    event: MouseEvent<HTMLAnchorElement>,
    path: (typeof templePaths)[number],
  ) => {
    event.preventDefault();

    if (pathname === path.route) return;
    if (onSelect) {
      onSelect(path.id);
      return;
    }

    navigate(path.route, {
      state: { doorColor: path.color, from: "temple-navigation" },
    });
  };

  const renderLinks = (mobile: boolean) =>
    templePaths.map((path) => {
      const current = pathname === path.route;
      return (
        <a
          key={path.id}
          href={path.route}
          className="temple-path-navigation__link"
          aria-current={current ? "page" : undefined}
          onClick={(event) => handleSelect(event, path)}
        >
          <span className="temple-path-navigation__glyph" aria-hidden="true">{path.glyph}</span>
          <span>{path.label}</span>
          {mobile && <span className="sr-only"> — apri la Via</span>}
        </a>
      );
    });

  return (
    <nav
      className={`temple-path-navigation temple-path-navigation--${variant}`}
      aria-label="Navigazione principale delle Tre Vie"
    >
      <div className="temple-path-navigation__desktop">{renderLinks(false)}</div>
      <div className="temple-path-navigation__mobile">{renderLinks(true)}</div>
    </nav>
  );
}
