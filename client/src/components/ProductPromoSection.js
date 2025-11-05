"use client";
import React from "react";
import Link from "next/link";

const ProductPromoSection = () => {
  const promoImages = [
    { id: "68ea55fc4b75f7495d81386c", image: "/promo/p1.avif" },
    { id: "68ea54e94b75f7495d81373d", image: "/promo/p2.avif" },
    { id: "68ea54064b75f7495d8136f6", image: "/promo/p3.avif" },
    { id: "68ea38e367a24f0c66fde087", image: "/promo/p4.avif" },
  ];

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-10 py-12">

      {/* ✅ Responsive Grid (stacked on mobile, row on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
