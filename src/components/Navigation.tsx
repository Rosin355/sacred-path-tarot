import { Button } from "@/components/ui/button";
import { Sparkles, Menu } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent animate-glow-pulse" />
            <span className="text-xl font-bold gold-gradient">
              Tarocchi per Illuminarsi
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-muted-foreground hover:text-accent transition-colors">
              Home
            </a>
            <a href="#metodo" className="text-muted-foreground hover:text-accent transition-colors">
              Il Metodo
            </a>
            <a href="#lettura" className="text-muted-foreground hover:text-accent transition-colors">
              Consultazione
            </a>
            <a href="#percorso" className="text-muted-foreground hover:text-accent transition-colors">
              Percorso
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="mystic-gradient border border-accent/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Inizia Ora
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-6 h-6 text-accent" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in">
            <a href="#home" className="block text-muted-foreground hover:text-accent transition-colors">
              Home
            </a>
            <a href="#metodo" className="block text-muted-foreground hover:text-accent transition-colors">
              Il Metodo
            </a>
            <a href="#lettura" className="block text-muted-foreground hover:text-accent transition-colors">
              Consultazione
            </a>
            <a href="#percorso" className="block text-muted-foreground hover:text-accent transition-colors">
              Percorso
            </a>
            <Button className="w-full mystic-gradient border border-accent/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Inizia Ora
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
