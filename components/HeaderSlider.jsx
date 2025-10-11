// import React, { useState, useEffect } from "react";
// import { assets } from "@/assets/assets";
// import Image from "next/image";

// const HeaderSlider = () => {
//   const sliderData = [
//     // {
//     //   id: 1,
//     //   title: "Turn Up the Volume – Headphones That Redefine Sound!",
//     //   offer: "Limited Time: Enjoy 30% Off!",
//     //   buttonText1: "Shop Now",
//     //   buttonText2: "Browse More",
//     //   imgSrc: assets.header_headphone_image,
//     // },
//     {
//       id: 2,
//       title: "Own the Game – Snag Your PlayStation 5 Today!",
//       offer: "Hurry! Only a Few Left in Stock!",
//       buttonText1: "Shop Now",
//       buttonText2: "View Deals",
//       imgSrc: assets.header_playstation_image,
//     },
//     {
//       id: 3,
//       title: "Work Hard. Create More. Dominate with MacBook Pro!",
//       offer: "Special Offer: Save 40% Today!",
//       buttonText1: "Order Now",
//       buttonText2: "Discover More",
//       imgSrc: assets.header_macbook_image,
//     },
//   ];

//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % sliderData.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [sliderData.length]);

//   const handleSlideChange = (index) => {
//     setCurrentSlide(index);
//   };

//   return (
//   <div className="relative w-full overflow-hidden">
//     {/* Slider Wrapper */}
//     <div
//       className="flex transition-transform duration-700 ease-in-out"
//       style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//     >
//       {sliderData.map((slide, index) => (
//         <div
//           key={slide.id}
//           className="
//             flex flex-col md:flex-row items-center justify-center
//             py-8 md:py-12 md:px-16 px-4 min-w-full rounded-2xl
//             bg-gradient-to-r from-[#F8F9FB] to-[#E6E9F2]
//             dark:from-gray-900 dark:to-gray-800 shadow-md
//             gap-6 md:gap-12
//           "
//         >
//           {/* Text Section */}
//           <div className="text-center md:text-left md:pl-8 max-w-xl">
//             <p className="uppercase tracking-wide text-sm text-orange-600 font-light mb-2">
//               {slide.offer}
//             </p>
//             <h1 className="text-2xl md:text-[42px] font-normal leading-snug text-gray-900 dark:text-white">
//               {slide.title}
//             </h1>

//             {/* Buttons */}
//             <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-3 mt-6">
//               <button className="px-6 md:px-8 py-3 md:py-3 bg-orange-600 hover:bg-orange-700 text-white text-sm font-light rounded-full shadow-md transition w-full sm:w-auto">
//                 {slide.buttonText1}
//               </button>
//               <button className="group flex items-center justify-center sm:justify-start gap-2 px-6 py-3 text-gray-800 dark:text-white font-light hover:text-orange-600 transition w-full sm:w-auto">
//                 {slide.buttonText2}
//                 <Image
//                   className="w-4 h-4 group-hover:translate-x-1 transition-transform"
//                   src={assets.arrow_icon}
//                   alt="arrow_icon"
//                 />
//               </button>
//             </div>
//           </div>

//           {/* Image Section */}
//           <div className="flex items-center justify-center md:flex-1">
//             <Image
//               className="max-w-full h-auto md:w-80 drop-shadow-lg"
//               src={slide.imgSrc}
//               alt={`Slide ${index + 1}`}
//             />
//           </div>
//         </div>
//       ))}
//     </div>

//     {/* Dots / Indicators */}
//     <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
//       {sliderData.map((_, index) => (
//         <button
//           key={index}
//           onClick={() => handleSlideChange(index)}
//           className={`h-3 w-3 rounded-full transition-all ${
//             currentSlide === index
//               ? "bg-orange-600 scale-110 shadow-md"
//               : "bg-gray-400/40 hover:bg-gray-500/60"
//           }`}
//         />
//       ))}
//     </div>
//   </div>
//   );
// };

// export default HeaderSlider;











































"use client";

import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const HeaderSlider = () => {
  const sliderData = [
  // {
  //     id: 1,
  //     title: "Turn Up the Volume – Headphones That Redefine Sound!",
  //     offer: "Limited Time: Enjoy 30% Off!",
  //     buttonText1: "Shop Now",
  //     buttonText2: "Browse More",
  //     imgSrc: assets.header_headphone_image,
  //   },
  //   {
  //     id: 2,
  //     title: "Own the Game – Snag Your PlayStation 5 Today!",
  //     offer: "Hurry! Only a Few Left in Stock!",
  //     buttonText1: "Shop Now",
  //     buttonText2: "View Deals",
  //     imgSrc: assets.header_playstation_image,
  //   },
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
              min-w-full py-10 md:py-16 px-6 md:px-20 lg:px-0
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














































// "use client";

// import React, { useState, useEffect } from "react";
// import { assets } from "@/assets/assets";
// import Image from "next/image";

// const HeaderSlider = () => {
//   const sliderData = [
//     {
//       id: 1,
//       title: "Own the Game – Snag Your PlayStation 5 Today!",
//       deal: "Deal of the Week",
//       sale: "Sale of ₦6,000",
//       offerEnd: new Date(Date.now() + 1000 * 60 * 60 * 6), // 6-hour timer
//       imgSrc: assets.header_playstation_image,
//       buttonText: "Shop Now",
//     },
//     {
//       id: 2,
//       title: "Work Hard. Create More. Dominate with MacBook Pro!",
//       deal: "Limited Time Offer",
//       sale: "Save ₦8,000",
//       offerEnd: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12-hour timer
//       imgSrc: assets.header_macbook_image,
//       buttonText: "Shop Now",
//     },
//   ];

//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

//   const currentOfferEnd = sliderData[currentSlide].offerEnd;

//   // Timer logic
//   useEffect(() => {
//     const updateTimer = () => {
//       const now = new Date().getTime();
//       const distance = currentOfferEnd.getTime() - now;

//       if (distance <= 0) {
//         setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
//         return;
//       }

//       const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
//       const minutes = Math.floor((distance / (1000 * 60)) % 60);
//       const seconds = Math.floor((distance / 1000) % 60);

//       setTimeLeft({ hours, minutes, seconds });
//     };

//     updateTimer();
//     const timer = setInterval(updateTimer, 1000);

//     return () => clearInterval(timer);
//   }, [currentOfferEnd]);

//   // Auto-slide effect
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % sliderData.length);
//     }, 8000);
//     return () => clearInterval(interval);
//   }, [sliderData.length]);

//   const handleSlideChange = (index) => setCurrentSlide(index);

//   const slide = sliderData[currentSlide];

//   return (
//     <div className="relative w-full overflow-hidden rounded-3xl">
//       <div className="flex transition-transform duration-700 ease-in-out">
//         {/* Slide */}
//         <div
//           key={slide.id}
//           className="
//             flex flex-col-reverse md:flex-row items-center justify-between
//             min-w-full py-10 md:py-16 px-6 md:px-20
//             bg-gradient-to-r from-[#FFF8F3] via-[#FFF3E8] to-[#FFE5D0]
//             dark:from-gray-900 dark:to-gray-800 gap-10 md:gap-16
//           "
//         >
//           {/* === Text Section === */}
//           <div className="flex flex-col md:w-1/2 text-center md:text-left">
//             <span className="inline-block px-4 py-1 mb-3 text-xs font-medium bg-orange-100 text-orange-700 rounded-full w-fit mx-auto md:mx-0">
//               {slide.deal}
//             </span>

//             <h1 className="text-2xl sm:text-3xl md:text-5xl font-light text-gray-900 dark:text-white mb-3">
//               {slide.title}
//             </h1>

//             <p className="text-lg font-semibold text-orange-600 mb-4">{slide.sale}</p>

//             {/* Countdown Timer */}
//             <div className="flex justify-center md:justify-start gap-2 md:gap-3 mb-6">
//               {[
//                 { label: "Hrs", value: timeLeft.hours },
//                 { label: "Min", value: timeLeft.minutes },
//                 { label: "Sec", value: timeLeft.seconds },
//               ].map((unit, i) => (
//                 <div
//                   key={i}
//                   className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 border border-orange-200 dark:border-gray-700 rounded-lg w-14 h-14 shadow-sm"
//                 >
//                   <span className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
//                     {String(unit.value).padStart(2, "0")}
//                   </span>
//                   <span className="text-[10px] text-gray-500">{unit.label}</span>
//                 </div>
//               ))}
//             </div>

//             {/* Shop Now Button */}
//             <button className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-full shadow-md transition w-fit mx-auto md:mx-0">
//               {slide.buttonText}
//             </button>
//           </div>

//           {/* === Image Section === */}
//           <div className="flex justify-center md:w-1/2">
//             <Image
//               className="w-[260px] sm:w-[340px] md:w-[480px] lg:w-[560px] h-auto object-contain drop-shadow-2xl"
//               src={slide.imgSrc}
//               alt={`Slide ${slide.id}`}
//               priority
//             />
//           </div>
//         </div>
//       </div>

//       {/* === Dots / Indicators === */}
//       <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3">
//         {sliderData.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => handleSlideChange(index)}
//             className={`h-3 w-3 rounded-full transition-all ${
//               currentSlide === index
//                 ? "bg-orange-600 scale-110 shadow-md"
//                 : "bg-gray-400/40 hover:bg-gray-500/60"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HeaderSlider;
