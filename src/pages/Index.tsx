import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Method from "@/components/Method";
import TarotReading from "@/components/TarotReading";
import Journey from "@/components/Journey";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <Hero />
        <Method />
        <TarotReading />
        <Journey />
      </main>
    </div>
  );
};

export default Index;
