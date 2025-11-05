"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Banner } from "@/components/banner";
import { ProductList } from "@/components/product";
import Header from "@/components/header";
import Footer from "@/components/footer";
import UspsSection from "@/components/uspsSection";
import WhyChooseUs from "@/components/whyChooseUs";
import ProductPromoSection from "@/components/ProductPromoSection";

const Home = () => {
  return (
    <div>
      <Header />
      <Banner />
      <ProductPromoSection />
      <ProductList />
      <UspsSection />
      <WhyChooseUs />
      <Footer />
    </div>
  );
};

export default Home;
