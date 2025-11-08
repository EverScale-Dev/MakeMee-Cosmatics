"use client";
import React from "react";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react"; // lightweight icons

// ✅ Custom Arrow Components
const NextArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition"
    onClick={onClick}
  >
    <ChevronRight className="w-5 h-5 text-gray-700" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    className="absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition"
    onClick={onClick}
  >
    <ChevronLeft className="w-5 h-5 text-gray-700" />
  </button>
);

const ProductPromoSection = () => {
  const promoImages = [
    { id: "68ea55fc4b75f7495d81386c", image: "/Promo/p1.jpg" },
    { id: "68ea54e94b75f7495d81373d", image: "/Promo/p2.jpg" },
    { id: "68ea54064b75f7495d8136f6", image: "/Promo/p3.jpg" },
    { id: "68ea38e367a24f0c66fde087", image: "/Promo/p4.jpg" },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: "unslick", // ✅ stacked layout on mobile
      },
    ],
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-10 py-12 relative">
      {/* ✅ Carousel for desktop/tablet */}
      <div className="hidden sm:block relative">
        <Slider {...settings}>
          {promoImages.map((promo) => (
            <div key={promo.id} className="px-3">
              <Link
                href={`/products/${promo.id}`}
                className="block relative rounded-2xl shadow-md hover:shadow-2xl bg-white transition-all duration-500 overflow-hidden transform hover:scale-[1.03]"
              >
                <img
                  src={promo.image}
                  alt="Product Banner"
                  className="w-full h-auto object-cover aspect-[3/2] transition-transform duration-500"
                  width={900}
                  height={600}
                />
              </Link>
            </div>
          ))}
        </Slider>
      </div>

      {/* ✅ Stacked layout for mobile */}
      <div className="grid grid-cols-1 gap-6 sm:hidden">
        {promoImages.map((promo) => (
          <Link
            key={promo.id}
            href={`/products/${promo.id}`}
            className="relative rounded-2xl shadow-md hover:shadow-2xl bg-white transition-all duration-500 overflow-hidden transform hover:scale-[1.03]"
          >
            <img
              src={promo.image}
              alt="Product Banner"
              className="w-full h-auto object-cover aspect-[3/2] transition-transform duration-500"
              width={900}
              height={600}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductPromoSection;
