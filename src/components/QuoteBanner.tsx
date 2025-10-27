import bannerImage from "@/assets/jm-thelema.png";

const QuoteBanner = () => {
  return (
    <section className="relative w-full h-[80vh] lg:h-[90vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bannerImage}
          alt="Thelema Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
      </div>

      {/* Quote Text */}
      <div className="relative h-full flex items-center justify-center px-6">
        <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-consent font-bold text-center tracking-tight text-foreground animate-fade-in">
          Ogni uomo e ogni donna è una stella
        </h3>
      </div>
    </section>
  );
};

export default QuoteBanner;
