"use client";

import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Powerful Sound. Total Comfort. Meet Your Next Headphones.",
      offer: "Flash Deal: Save 30% Today",
      buttonText1: "Shop Now",
      buttonText2: "View Collection",
      imgSrc: "/bose_headphone_image.png",
    },
    {
      id: 2,
      title: "Next-Gen Gaming Starts with PlayStation 5.",
      offer: "Limited Stock — Order Before It’s Gone",
      buttonText1: "Get Yours Now",
      buttonText2: "View Offers",
      imgSrc: "/header_playstation_image.png",
    },
    {
      id: 3,
      title: "Unleash Power & Performance with MacBook Pro.",
      offer: "Special Deal: Save 40% Instantly",
      buttonText1: "Shop Deals",
      buttonText2: "Learn More",
      imgSrc: "/side-view-laptop-black-wall-removebg-preview.png",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    // <div className="relative w-full overflow-hidden rounded-3xl">
    //   {/* === Slider Wrapper === */}
    //   <div
    //     className="flex transition-transform duration-700 ease-in-out"
    //     style={{ transform: `translateX(-${currentSlide * 100}%)` }}
    //   >
    //     {sliderData.map((slide, index) => (
    //       <div
    //         key={slide.id}
    //         className="
    //           flex flex-col-reverse md:flex-row items-center justify-between
    //           min-w-full py-10 md:py-16 px-6 md:px-20
    //           bg-gradient-to-r from-[#FAFAFA] to-[#F3F4F8] dark:from-gray-900 dark:to-gray-800
    //           gap-10 md:gap-16
    //         "
    //       >
    //         {/* === Text Section === */}
    //         <div className="flex flex-col md:w-1/2 text-center md:text-left">
    //           <p className="uppercase tracking-widest text-xs md:text-sm text-orange-600 font-medium mb-3">
    //             {slide.offer}
    //           </p>

    //           <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-[46px] font-light leading-snug text-gray-900 dark:text-white mb-5">
    //             {slide.title}
    //           </h1>

    //           {/* Buttons */}
    //           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
    //             <button className="px-6 md:px-8 py-2.5 md:py-3 bg-orange-600 hover:bg-orange-700 text-white text-sm font-light rounded-full shadow-md transition">
    //               {slide.buttonText1}
    //             </button>
    //             <button className="group flex items-center justify-center sm:justify-start gap-2 px-6 py-2.5 text-gray-800 dark:text-white text-sm font-light hover:text-orange-600 transition">
    //               {slide.buttonText2}
    //               <Image
    //                 className="w-4 h-4 group-hover:translate-x-1 transition-transform"
    //                 src={assets.arrow_icon}
    //                 alt="arrow_icon"
    //               />
    //             </button>
    //           </div>
    //         </div>

    //         {/* === Image Section === */}
    //         <div className="flex justify-center md:w-1/2">
    //           <Image
    //             className="w-[260px] sm:w-[320px] md:w-[420px] lg:w-[500px] h-auto object-contain drop-shadow-xl"
    //             src={slide.imgSrc}
    //             alt={`Slide ${index + 1}`}
    //             priority
    //           />
    //         </div>
    //       </div>
    //     ))}
    //   </div>

    //   {/* === Dots / Indicators === */}
    //   <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3">
    //     {sliderData.map((_, index) => (
    //       <button
    //         key={index}
    //         onClick={() => handleSlideChange(index)}
    //         className={`h-3 w-3 rounded-full transition-all ${
    //           currentSlide === index
    //             ? "bg-orange-600 scale-110 shadow-md"
    //             : "bg-gray-400/40 hover:bg-gray-500/60"
    //         }`}
    //       />
    //     ))}
    //   </div>
    // </div>

    <div className="relative w-full overflow-hidden">
      {/* === Slider Wrapper === */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="
              flex flex-col-reverse md:flex-row items-center justify-between
              min-w-full py-10 md:py-16 px-6 md:px-20
              bg-gradient-to-r from-[#FAFAFA] to-[#F3F4F8] dark:from-gray-900 dark:to-gray-800
              gap-10 md:gap-16
            "
          >
            {/* === Text Section === */}
            <div className="flex flex-col md:w-1/2 text-center md:text-left">
              <p className="uppercase tracking-widest text-xs md:text-sm text-orange-600 font-medium mb-3">
                {slide.offer}
              </p>

              <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-[46px] font-light leading-snug text-gray-900 dark:text-white mb-5">
                {slide.title}
              </h1>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                <button className="px-6 md:px-8 py-2.5 md:py-3 bg-orange-600 hover:bg-orange-700 text-white text-sm font-light rounded-full shadow-md transition">
                  {slide.buttonText1}
                </button>
                <button className="group flex items-center justify-center sm:justify-start gap-2 px-6 py-2.5 text-gray-800 dark:text-white text-sm font-light hover:text-orange-600 transition">
                  {slide.buttonText2}
                  <Image
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    src={assets.arrow_icon}
                    alt="arrow_icon"
                  />
                </button>
              </div>
            </div>

            {/* === Image Section === */}
            <div className="flex justify-center md:w-1/2">
              <Image
                className="w-[260px] sm:w-[320px] md:w-[420px] lg:w-[500px] h-auto object-contain drop-shadow-xl"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
                width={560}
                height={560}
                priority
              />
            </div>
          </div>
        ))}
      </div>

      {/* === Dots / Indicators === */}
      {/* <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3">
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
      </div> */}
    </div>






  );
};

export default HeaderSlider;
