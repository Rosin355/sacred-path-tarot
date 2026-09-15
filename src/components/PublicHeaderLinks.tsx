import { Link, useLocation } from "react-router-dom";
import "./public-header-links.css";

export function PublicHeaderLinks({ variant = "page" }: { variant?: "page" | "cinematic" }) {
  const { pathname } = useLocation();
  return <nav className={`public-header-links public-header-links--${variant}`} aria-label="Informazioni e appuntamenti">
    <Link to="/chi-sono" aria-current={pathname === "/chi-sono" ? "page" : undefined}>Chi sono</Link>
    <Link to="/eventi" aria-current={pathname === "/eventi" ? "page" : undefined}>Eventi</Link>
  </nav>;
}
