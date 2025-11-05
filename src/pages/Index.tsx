import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Method from "@/components/Method";
import TarotReading from "@/components/TarotReading";
import Journey from "@/components/Journey";
import About from "@/components/About";
import Services from "@/components/Services";
import QuoteBanner from "@/components/QuoteBanner";
import Footer from "@/components/Footer";
import ScrollMorphSymbol from "@/components/ScrollMorphSymbol";
const Index = () => {
  return <div className="min-h-screen bg-background">
      <Navigation />
      <ScrollMorphSymbol />
      <main className="pt-16">
        <Hero />
        <Method className="py-0" />
        <TarotReading className="py-0" />
        <Journey className="py-0" />
        <About className="py-0" />
        <Services className="py-0" />
      </main>
      <QuoteBanner />
      <Footer />
    </div>;
};
export default Index;