import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Wand2, Eye, Flame } from "lucide-react";

const Method = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Studio Esoterico Profondo",
      description: "13 anni di pratica magica e ricerca nelle tradizioni ermetiche, cabalistiche e alchemiche.",
    },
    {
      icon: Wand2,
      title: "Approccio Magico-Pratico",
      description: "Non solo teoria: ogni lettura include pratiche concrete, rituali e corrispondenze operative.",
    },
    {
      icon: Eye,
      title: "Oltre la Divinazione",
      description: "I Tarocchi come strumento di illuminazione e crescita spirituale, non semplice predizione.",
    },
    {
      icon: Flame,
      title: "Trasformazione Autentica",
      description: "Percorsi guidati per ricercatori seri della Saggezza, non intrattenimento superficiale.",
    },
  ];

  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-glow">Il Metodo</span>{" "}
            <span className="gold-gradient">Esoterico</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un approccio unico che unisce tradizione antica e pratica contemporanea
            per chi cerca vera trasformazione spirituale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="bg-card/50 backdrop-blur-sm border-primary/30 hover:card-glow transition-all duration-300 hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10 border border-accent/30">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-xl">{feature.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Method;
