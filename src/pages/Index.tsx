import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Method from "@/components/Method";
import TarotReading from "@/components/TarotReading";
import Journey from "@/components/Journey";
import About from "@/components/About";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
const Index = () => {
  return <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <Hero />
        <Method />
        <TarotReading />
        <Journey />
        <About className="my-0" />
        <Services />
      </main>
      <Footer />
    </div>;
};
export default Index;