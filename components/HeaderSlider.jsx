import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const HeaderSlider = () => {
  const sliderData = [
    // {
    //   id: 1,
    //   title: "Turn Up the Volume – Headphones That Redefine Sound!",
    //   offer: "Limited Time: Enjoy 30% Off!",
    //   buttonText1: "Shop Now",
    //   buttonText2: "Browse More",
    //   imgSrc: assets.header_headphone_image,
    // },
    {
      id: 2,
      title: "Own the Game – Snag Your PlayStation 5 Today!",
      offer: "Hurry! Only a Few Left in Stock!",
      buttonText1: "Shop Now",
      buttonText2: "View Deals",
      imgSrc: assets.header_playstation_image,
    },
    {
      id: 3,
      title: "Work Hard. Create More. Dominate with MacBook Pro!",
      offer: "Special Offer: Save 40% Today!",
      buttonText1: "Order Now",
      buttonText2: "Discover More",
      imgSrc: assets.header_macbook_image,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
  <div className="relative w-full overflow-hidden">
    {/* Slider Wrapper */}
    <div
      className="flex transition-transform duration-700 ease-in-out"
      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
    >
      {sliderData.map((slide, index) => (
        <div
          key={slide.id}
          className="
            flex flex-col md:flex-row items-center justify-center
            py-8 md:py-12 md:px-16 px-4 min-w-full rounded-2xl
            bg-gradient-to-r from-[#F8F9FB] to-[#E6E9F2]
            dark:from-gray-900 dark:to-gray-800 shadow-md
            gap-6 md:gap-12
          "
        >
          {/* Text Section */}
          <div className="text-center md:text-left md:pl-8 max-w-xl">
            <p className="uppercase tracking-wide text-sm text-orange-600 font-bold mb-2">
              {slide.offer}
            </p>
            <h1 className="text-2xl md:text-[42px] font-bold leading-snug text-gray-900 dark:text-white">
              {slide.title}
            </h1>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-3 mt-6">
              <button className="px-6 md:px-8 py-3 md:py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-full shadow-md transition w-full sm:w-auto">
                {slide.buttonText1}
              </button>
              <button className="group flex items-center justify-center sm:justify-start gap-2 px-6 py-3 text-gray-800 dark:text-white font-medium hover:text-orange-600 transition w-full sm:w-auto">
                {slide.buttonText2}
                <Image
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  src={assets.arrow_icon}
                  alt="arrow_icon"
                />
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex items-center justify-center md:flex-1">
            <Image
              className="max-w-full h-auto md:w-80 drop-shadow-lg"
              src={slide.imgSrc}
              alt={`Slide ${index + 1}`}
            />
          </div>
        </div>
      ))}
    </div>

    {/* Dots / Indicators */}
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
      {sliderData.map((_, index) => (
        <button
          key={index}
          onClick={() => handleSlideChange(index)}
          className={`h-3 w-3 rounded-full transition-all ${
            currentSlide === index
              ? "bg-orange-600 scale-110 shadow-md"
              : "bg-gray-400/40 hover:bg-gray-500/60"
          }`}
        />
      ))}
    </div>
  </div>
  );
};

export default HeaderSlider;
