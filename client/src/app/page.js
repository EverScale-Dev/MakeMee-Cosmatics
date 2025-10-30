"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Banner } from "@/components/banner";
import { ProductList } from "@/components/product";  // ⬅️ updated import
import Header from "@/components/header";
import Footer from "@/components/footer";
import UspsSection from "@/components/uspsSection";
import WhyChooseUs from "@/components/whychooseus";

const Home = () => {
  return (
    <div>
      <Header />
      <Banner />
      <ProductList />
      <UspsSection />
      <WhyChooseUs />
      <Footer />
    </div>
  );
};

export default Home;
