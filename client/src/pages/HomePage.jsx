import React, { useEffect } from "react";
import Header from "../components/Layouts/Header.jsx";
import HeroSection from "../components/Home/HeroSection.jsx";
import Categories from "../components/Home/Categories.jsx";
import BestDeals from "../components/Home/BestDeals.jsx";
import FeaturedProduct from "../components/Home/FeaturedProducts.jsx";
import Events from "../components/Home/Events.jsx";
import Sponsored from "../components/Home/Sponsored.jsx";
import Footer from "../components/Layouts/Footer.jsx";

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <Header />
      <HeroSection />
      <Categories />
      <BestDeals />
      <FeaturedProduct />
      <Events />
      <Sponsored />
      <Footer />
    </div>
  );
};

export default HomePage;
