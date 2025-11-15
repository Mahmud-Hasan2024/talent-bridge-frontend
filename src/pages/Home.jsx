import Hero from "../components/Home/Hero.jsx";
import Features from "../components/Home/Features.jsx";
import Testimonials from "../components/Home/Testimonials.jsx";
import FeaturedJob from "../components/Jobs/FeaturedJob.jsx";
import Category from "../Categories/Category.jsx";

function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Category />
      <FeaturedJob />
      <Testimonials />
    </div>
  );
}

export default Home;
