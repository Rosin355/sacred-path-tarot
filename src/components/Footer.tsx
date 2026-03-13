import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-20 px-6 lg:px-12 border-t border-border/20">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, hsla(262, 25%, 12%, 0.5) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Grid principale */}
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Colonna 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-accent text-xl leading-none">♆</span>
              <span className="font-display font-bold text-lg tracking-tight">Jessica Marin</span>
            </div>
            <p className="text-sm text-muted-foreground/70 font-light leading-relaxed">
              Guida esoterica specializzata in Tarocchi, Cabala e Alchimia Spirituale.
              13 anni di pratica dedicata all'illuminazione.
            </p>
          </div>

          {/* Colonna 2: Navigazione */}
          <div className="space-y-5">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/50 font-caption">
              Navigazione
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground/70 font-light">
              <li><a href="#metodo" className="elegant-underline hover:text-foreground transition-colors duration-300">Il Metodo</a></li>
              <li><a href="#tarocchi" className="elegant-underline hover:text-foreground transition-colors duration-300">Lettura Tarocchi</a></li>
              <li><a href="#viaggio" className="elegant-underline hover:text-foreground transition-colors duration-300">Il Viaggio</a></li>
              <li><a href="#chi-sono" className="elegant-underline hover:text-foreground transition-colors duration-300">Chi Sono</a></li>
            </ul>
          </div>

          {/* Colonna 3: Servizi */}
          <div className="space-y-5">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/50 font-caption">
              Servizi
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground/70 font-light">
              <li>Lettura Approfondita</li>
              <li>Percorso Iniziatico</li>
              <li>Rituale Alchemico</li>
              <li>Consulenza Privata</li>
            </ul>
          </div>

          {/* Colonna 4: Contatti */}
          <div className="space-y-5">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/50 font-caption">
              Contatti
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground/70 font-light">
              <li>info@jessicamarin.com</li>
              <li>+39 XXX XXX XXXX</li>
              <li>Milano, Italia</li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8 opacity-20" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground/40 font-light font-caption tracking-wider">
            © {currentYear} Jessica Marin. Tutti i diritti riservati.
          </p>

          <div className="flex items-center gap-5 text-accent/30 text-sm">
            {['♀', '♂', '♃', '♄', '♆', '☉'].map((symbol, index) => (
              <span key={index} className="leading-none">{symbol}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
