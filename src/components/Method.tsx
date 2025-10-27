import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const Method = () => {
  const { playNavigation } = useSoundEffects();
  
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
    <section id="metodo" className="py-32 lg:py-40 px-6 lg:px-12 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-24 space-y-6 animate-fade-in">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight">
            IL METODO
            <br />
            <span className="text-accent-gradient">ESOTERICO</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl font-light leading-relaxed">
            Un approccio unico che unisce tradizione antica e pratica contemporanea
            per chi cerca vera trasformazione spirituale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              onClick={playNavigation}
              className="bg-transparent minimal-border hover-lift group cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="p-8">
                <div className="flex items-start gap-6">
                  <span className="text-5xl font-display font-bold text-accent/20 group-hover:text-accent/40 transition-colors">
                    {feature.number}
                  </span>
                  <CardTitle className="text-2xl font-display tracking-tight pt-2">
                    {feature.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-muted-foreground leading-relaxed font-light pl-20">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Method;
