"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Banner } from "@/components/banner";
import { ProductList } from "@/components/product";  // ⬅️ updated import
import { Cta } from "@/components/cta";
import Header from "@/components/header";
import Footer from "@/components/footer";
import UspsSection from "@/components/uspsSection";
import WhyChooseMakeMee from "@/components/whyChooseUs";

const Home = () => {
  return (
    <div>
      <Header />
      <Banner />
      <ProductList />   {/* ⬅️ replaced Category with ProductList */}
      <UspsSection />
      <WhyChooseMakeMee />
      <Footer />
    </div>
  );
};

export default Home;
