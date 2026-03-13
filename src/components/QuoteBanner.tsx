import bannerImage from "@/assets/jm-thelema.png";

const QuoteBanner = () => {
  return (
    <section className="relative w-full h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bannerImage}
          alt="Thelema Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/65 backdrop-blur-[2px]" />
        {/* Top/bottom gradient fade */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, hsl(var(--background)) 0%, transparent 15%, transparent 85%, hsl(var(--background)) 100%)",
          }}
        />
      </div>

      {/* Quote Text */}
      <div className="relative h-full flex flex-col items-center justify-center px-6 gap-6">
        <div className="sacred-divider" />
        <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-light text-center tracking-tight text-foreground animate-fade-in italic">
          "Ogni uomo e ogni donna è una stella"
        </h3>
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground/50 font-caption">
          Liber AL vel Legis
        </p>
      </div>
    </section>
  );
};

export default QuoteBanner;
