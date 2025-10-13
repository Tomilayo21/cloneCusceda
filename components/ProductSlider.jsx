// "use client";

// import React, { useState, useEffect } from "react";
// import { assets } from "@/assets/assets";
// import Image from "next/image";

// const ProductSlider = () => {
//   const sliderData = [
//   {
//       id: 1,
//       title: "Turn Up the Volume – Headphones That Redefine Sound!",
//       offer: "Limited Time: Enjoy 30% Off!",
//       buttonText1: "Shop Now",
//       buttonText2: "Browse More",
//       imgSrc: "/bose_headphone_image.png",
//     },
//     {
//       id: 2,
//       title: "Own the Game – Snag Your PlayStation 5 Today!",
//       offer: "Hurry! Only a Few Left in Stock!",
//       buttonText1: "Shop Now",
//       buttonText2: "View Deals",
//       imgSrc: "/header_playstation_image.png",
//     },
//     {
//       id: 3,
//       title: "Work Hard. Create More. Dominate with MacBook Pro!",
//       offer: "Special Offer: Save 40% Today!",
//       buttonText1: "Order Now",
//       buttonText2: "Discover More",
//       imgSrc: "/macbook_image.png",
//     },
//   ];

//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % sliderData.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [sliderData.length]);

//   const handleSlideChange = (index) => {
//     setCurrentSlide(index);
//   };

//   return (
//     <div className="relative w-full overflow-hidden">
//       {/* === Slider Wrapper === */}
//       <div
//         className="flex transition-transform duration-700 ease-in-out"
//         style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//       >
//         {sliderData.map((slide, index) => (
//           <div
//             key={slide.id}
//             className="
//               flex flex-col-reverse md:flex-row items-center justify-between
//               min-w-full py-10 md:py-16 px-6 md:px-20 lg:px-0
//               bg-gradient-to-r from-[#FAFAFA] to-[#F3F4F8] dark:from-gray-900 dark:to-gray-800
//               gap-10 md:gap-16
//             "
//           >
//             {/* === Text Section === */}
//             <div className="flex flex-col md:w-1/2 text-center md:text-left">
//               <p className="uppercase tracking-widest text-xs md:text-sm text-orange-600 font-medium mb-3">
//                 {slide.offer}
//               </p>

//               <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-[46px] font-light leading-snug text-gray-900 dark:text-white mb-5">
//                 {slide.title}
//               </h1>

//               {/* Buttons */}
//               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
//                 <button className="px-6 md:px-8 py-2.5 md:py-3 bg-orange-600 hover:bg-orange-700 text-white text-sm font-light rounded-full shadow-md transition">
//                   {slide.buttonText1}
//                 </button>
//                 <button className="group flex items-center justify-center sm:justify-start gap-2 px-6 py-2.5 text-gray-800 dark:text-white text-sm font-light hover:text-orange-600 transition">
//                   {slide.buttonText2}
//                   <Image
//                     className="w-4 h-4 group-hover:translate-x-1 transition-transform"
//                     src={assets.arrow_icon}
//                     alt="arrow_icon"
//                   />
//                 </button>
//               </div>
//             </div>

//             {/* === Image Section === */}
//             <div className="flex justify-center md:w-1/2">
//               <img
//                 className="w-[260px] sm:w-[320px] md:w-[420px] lg:w-[500px] h-auto object-contain drop-shadow-xl"
//                 src={slide.imgSrc}
//                 alt={`Slide ${index + 1}`}
//                 priority
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* === Dots / Indicators === */}
//       {/* <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3">
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
//       </div> */}
//     </div>

//   );
// };

// export default ProductSlider;


































"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const ProductSlider = () => {
  const sliderData = [
    {
      id: 2,
      title: "Think Big. Work Smart.Achieve More with MacBook Pro!",
      deal: "Limited Time Offer",
      sale: "80,000",
      offerEnd: new Date(Date.now() + 1000 * 60 * 60 * 12), 
      imgSrc: "/macbook_image.png",
      buttonText: "View Deals",
    },
  ];
  const { currency } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [offerEnd, setOfferEnd] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const currentOfferEnd = sliderData[currentSlide].offerEnd;


  useEffect(() => {
    const storedEnd = localStorage.getItem("offerEnd");
    if (storedEnd) {
      setOfferEnd(new Date(storedEnd));
    } else {
      const end = new Date(Date.now() + 1000 * 60 * 60 * 12); // 12 hours
      localStorage.setItem("offerEnd", end.toISOString());
      setOfferEnd(end);
    }
  }, []);

  // 🕒 Countdown timer logic
  useEffect(() => {
    if (!offerEnd) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = offerEnd.getTime() - now;

      if (distance <= 0) {
        const newEnd = new Date(Date.now() + 1000 * 60 * 60 * 12); // restart timer
        localStorage.setItem("offerEnd", newEnd.toISOString());
        setOfferEnd(newEnd);
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [offerEnd]);  


  const slide = sliderData[currentSlide];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl">
      <div className="flex transition-transform duration-700 ease-in-out">
        {/* Slide */}
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
            <span className="inline-block px-4 py-1 mb-3 text-xs font-medium bg-orange-100 text-orange-700 rounded-md w-fit mx-auto md:mx-0">
              {slide.deal}
            </span>

            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-[46px] font-light leading-snug text-gray-900 dark:text-white mb-5">
              {slide.title}
            </h1>

            <p className="text-lg font-normal text-orange-600 mb-4">Save {currency}{slide.sale}</p>

   
            {/* Countdown Timer */}
            <div className="">
              <p className="text-sm text-gray-700 dark:text-gray-400 mb-3 font-medium tracking-wide">
                Offer ends in:
              </p>

              <div className="flex justify-center md:justify-start gap-3">
                {[
                  { label: "HRS", value: timeLeft.hours },
                  { label: "MIN", value: timeLeft.minutes },
                  { label: "SEC", value: timeLeft.seconds },
                ].map((unit, i) => (
                  <div key={i} className="flex flex-col items-center">
                    {/* Flip-style box */}
                    <div
                      className="relative bg-gray-900 text-orange-400 rounded-md shadow-lg w-14 h-16 flex items-center justify-center 
                      font-mono text-2xl md:text-3xl font-bold tracking-widest select-none overflow-hidden"
                    >
                      {/* top half (light reflection) */}
                      <div className="absolute top-0 left-0 w-full h-1/2 bg-gray-800/60"></div>
                      {/* number */}
                      <span className="z-10">{String(unit.value).padStart(2, "0")}</span>
                      {/* subtle glow */}
                      <div className="absolute inset-0 rounded-md ring-1 ring-orange-500/20 shadow-[0_0_8px_#fb923c40]"></div>
                    </div>

                    {/* Label */}
                    <span className="text-[10px] mt-2 text-gray-600 dark:text-gray-400 tracking-widest font-medium">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* View Deals Button */}
              <button className="
                  mt-8 px-8 py-3 
                  bg-orange-600 hover:bg-orange-700 
                  text-white text-sm font-medium rounded-full 
                  shadow-md transition-all duration-300
                  flex items-center justify-center gap-2
                ">
                <span>View Deals</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='w-4 h-4'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 4.5L21 12l-7.5 7.5M21 12H3' />
                </svg>
              </button>
            </div>

          </div>

          {/* === Image Section === */}
          <div className="flex justify-center md:w-1/2">
            <Image
              className="w-[260px] sm:w-[340px] md:w-[480px] lg:w-[560px] h-auto object-contain drop-shadow-2xl"
              src={slide.imgSrc}
              alt={`Slide ${slide.id}`}
              width={560}
              height={560}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
