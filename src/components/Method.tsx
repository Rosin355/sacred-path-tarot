const Method = () => {
  const features = [
    {
      number: "01",
      title: "Studio Esoterico Profondo",
      description: "13 anni di pratica magica e ricerca nelle tradizioni ermetiche, cabalistiche e alchemiche.",
    },
    {
      number: "02",
      title: "Approccio Magico-Pratico",
      description: "Non solo teoria: ogni lettura include pratiche concrete, rituali e corrispondenze operative.",
    },
    {
      number: "03",
      title: "Oltre la Divinazione",
      description: "I Tarocchi come strumento di illuminazione e crescita spirituale, non semplice predizione.",
    },
    {
      number: "04",
      title: "Trasformazione Autentica",
      description: "Percorsi guidati per ricercatori seri della Saggezza, non intrattenimento superficiale.",
    },
  ];

  return (
    <section id="method-section" className="sacred-section py-28 lg:py-36 px-6 lg:px-12">
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="mb-20 space-y-6 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-display tracking-tight lg:text-8xl">
            Il Metodo
            <br />
            <span className="text-accent-gradient">Esoterico</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl font-light leading-relaxed text-xl md:text-2xl">
            Un approccio unico che unisce tradizione antica e pratica contemporanea
            per chi cerca vera trasformazione spirituale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="sacred-card p-8 md:p-10 group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-6">
                <span className="text-4xl md:text-5xl font-display font-bold text-accent/15 group-hover:text-accent/30 transition-colors duration-500">
                  {feature.number}
                </span>
                <div className="space-y-3 pt-1">
                  <h3 className="font-display tracking-tight text-xl md:text-2xl text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-light text-sm md:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Method;
