import Hero from "./Components/Hero";
import Features from "./Components/Features";
import Categories from "./Components/Categories";
import ProductGrid from "./Components/ProductGrid";
import Slider from "./Components/Slider";
import Graphics from "./Components/Graphics";
import Testimonials from "./Components/Testimonials";
import FAQ from "./Components/FAQ";
import Newsletter from "./Components/Newsletter";
import Footer from "./Components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      <Hero />
      <Features />
      <Categories />
      <ProductGrid />
      <Slider />
      <Graphics />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <Footer />
    </div>
  );
}
