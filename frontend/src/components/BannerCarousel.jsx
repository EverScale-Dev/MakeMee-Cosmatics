import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import laptop1 from "../assets/shopbanners/laptop/1.png";
import laptop2 from "../assets/shopbanners/laptop/2.png";
import laptop3 from "../assets/shopbanners/laptop/3.png";
import laptop4 from "../assets/shopbanners/laptop/4.png";

import mobile1 from "../assets/shopbanners/mobile/1.png";
import mobile2 from "../assets/shopbanners/mobile/2.png";
import mobile3 from "../assets/shopbanners/mobile/3.png";
import mobile4 from "../assets/shopbanners/mobile/4.png";

const banners = [
  {
    desktop: laptop1,
    mobile: mobile1,
    alt: "Banner 1"
  },
  {
    desktop: laptop2,
    mobile: mobile2,
    alt: "Banner 2"
  },
  {
    desktop: laptop3,
    mobile: mobile3,
    alt: "Banner 3"
  },
{
    desktop: laptop4,
    mobile: mobile4,
    alt: "Banner 4"
  }
    
];

const BannerCarousel = () => {
  return (
    <div className="w-full ">
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false
        }}
        loop
        slidesPerView={1}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <picture>
              {/* Mobile */}
              <source media="(max-width: 768px)" srcSet={banner.mobile} />
              {/* Desktop */}
              <img
                src={banner.desktop}
                alt={banner.alt}
                className="w-full h-auto object-cover"
              />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerCarousel;
