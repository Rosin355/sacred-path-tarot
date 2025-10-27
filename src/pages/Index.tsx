import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Method from "@/components/Method";
import TarotReading from "@/components/TarotReading";
import Journey from "@/components/Journey";
import About from "@/components/About";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <Hero />
        <Method />
        <TarotReading />
        <Journey />
        <About />
      </main>
    </div>
  );
};

export default Index;
