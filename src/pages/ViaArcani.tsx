import ViaLayout from "@/components/ViaLayout";
import Hero from "@/components/Hero";
import Method from "@/components/Method";
import TarotReading from "@/components/TarotReading";
import Journey from "@/components/Journey";
import About from "@/components/About";
import Services from "@/components/Services";
import QuoteBanner from "@/components/QuoteBanner";
import Footer from "@/components/Footer";

const ViaArcani = () => {
  return (
    <ViaLayout viaClass="via-arcani" title="La Via degli Arcani">
      <Hero />
      <Method />
      <TarotReading />
      <Journey />
      <About />
      <Services />
      <QuoteBanner />
      <Footer />
    </ViaLayout>
  );
};

export default ViaArcani;
