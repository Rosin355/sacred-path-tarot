import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface ViaLayoutProps {
  children: ReactNode;
  viaClass: string;
  title: string;
}

const ViaLayout = ({ children, viaClass, title }: ViaLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen bg-background ${viaClass}`}>
      {/* Top bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/20">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm tracking-wide"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna al Tempio
        </button>
        <span className="text-muted-foreground/60 text-xs tracking-[0.2em] uppercase hidden sm:block">
          {title}
        </span>
      </nav>

      {/* Content */}
      <main className="pt-20">{children}</main>

      {/* Minimal footer */}
      <footer className="py-12 px-6 border-t border-border/20 text-center">
        <button
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm tracking-wide elegant-underline"
        >
          ← Torna al Tempio delle Tre Vie
        </button>
        <p className="text-muted-foreground/40 text-xs mt-4">
          Jessica Marin — Un solo tempio. Tre vie interiori.
        </p>
      </footer>
    </div>
  );
};

export default ViaLayout;
