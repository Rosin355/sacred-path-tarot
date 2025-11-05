import { Separator } from "@/components/ui/separator";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const celestialSymbols = ['♀', '♂', '♃', '♄', '♆', '☉'];
  return <footer className="py-16 px-6 lg:px-12 relative border-t border-border/30">
      <div className="container mx-auto max-w-7xl">
        
        {/* Grid principale: 4 colonne su desktop */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          {/* Colonna 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-accent text-2xl leading-none">♆</span>
              <span className="font-display font-bold text-2xl">Jessica Marin | Tarocchi per Illumiarsi</span>
            </div>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Guida esoterica specializzata in Tarocchi, Cabala e Alchimia Spirituale. 
              13 anni di pratica dedicata all'illuminazione.
            </p>
          </div>

          {/* Colonna 2: Link rapidi */}
          <div className="space-y-4">
            <h4 className="font-display tracking-wider text-xl">Navigazione</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-light">
              <li><a href="#metodo" className="elegant-underline">Il Metodo</a></li>
              <li><a href="#tarocchi" className="elegant-underline">Lettura Tarocchi</a></li>
              <li><a href="#viaggio" className="elegant-underline">Il Viaggio</a></li>
              <li><a href="#chi-sono" className="elegant-underline">Chi Sono</a></li>
            </ul>
          </div>

          {/* Colonna 3: Servizi */}
          <div className="space-y-4">
            <h4 className="text-sm font-display tracking-wider">Servizi</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-light">
              <li>Lettura Approfondita</li>
              <li>Percorso Iniziatico</li>
              <li>Rituale Alchemico</li>
              <li>Consulenza Privata</li>
            </ul>
          </div>

          {/* Colonna 4: Contatti */}
          <div className="space-y-4">
            <h4 className="text-sm font-display tracking-wider">Contatti</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-light">
              <li>info@jessicamarin.com</li>
              <li>+39 XXX XXX XXXX</li>
              <li>Milano, Italia</li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom row: Copyright + simboli */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground font-light">
            © {currentYear} Jessica Marin. Tutti i diritti riservati.
          </p>
          
          <div className="flex items-center gap-4 text-accent text-lg">
            {celestialSymbols.map((symbol, index) => <span key={index} className="leading-none">{symbol}</span>)}
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;