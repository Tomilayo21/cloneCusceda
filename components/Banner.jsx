import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Banner = () => {
  const router = useRouter();
  

  return (
    // <div
    //   className="
    //     flex flex-col md:flex-row items-center justify-between 
    //     md:pl-20 py-14 md:py-0 my-16 rounded-xl overflow-hidden 
    //     bg-[#E6E9F2] dark:bg-transparent 
    //     border border-transparent dark:border-gray-700
    //   "
    // >
    //   <Image
    //     className="max-w-56"
    //     src={assets.jbl_soundbox_image}
    //     alt="jbl_soundbox_image"
    //   />
    //   <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
    //     <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px] text-black dark:text-white">
    //       Game On: Experience Next-Level Action
    //     </h2>
    //     <p className="max-w-[343px] font-medium text-gray-800/60 dark:text-gray-400">
    //       Immersive audio meets precise controls—your winning combo.
    //     </p>
    //     <button className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-orange-600 rounded text-white">
    //       Add to Cart
    //       <Image
    //         className="group-hover:translate-x-1 transition"
    //         src={assets.arrow_icon_white}
    //         alt="arrow_icon_white"
    //       />
    //     </button>
    //   </div>
    //   <Image
    //     className="hidden md:block max-w-80"
    //     src={assets.md_controller_image}
    //     alt="md_controller_image"
    //   />
    //   <Image
    //     className="md:hidden"
    //     src={assets.sm_controller_image}
    //     alt="sm_controller_image"
    //   />
    // </div>
    <div
      className="
        flex flex-col md:flex-row items-center justify-between 
        md:pl-20 py-14 md:py-0 my-16 rounded-2xl overflow-hidden 
        bg-gradient-to-r from-[#E6E9F2] to-[#F4F6FA] 
        dark:from-transparent dark:to-transparent
        border border-gray-200 dark:border-gray-700 shadow-sm
      "
    >
      {/* Left Product Image */}
      <Image
        className="max-w-56 md:max-w-64 drop-shadow-md"
        src={assets.jbl_soundbox_image}
        alt="jbl_soundbox_image"
      />

      {/* Text + Button */}
      <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left space-y-4 px-6 md:px-0">
        <h2 className="text-3xl md:text-4xl font-bold leading-snug text-gray-900 dark:text-white">
          Game On: <span className="text-orange-600">Next-Level Action</span>
        </h2>
        <p className="max-w-md text-base md:text-lg font-medium text-gray-700/70 dark:text-gray-400">
          Immersive audio meets precise controls—your winning combo.
        </p>
        <button
          onClick={() => router.push("/all-products")}
          className="
            group flex items-center justify-center gap-2 px-8 py-3 
            bg-orange-600 hover:bg-orange-700 
            rounded-xl text-white font-medium text-lg
            shadow-md hover:shadow-lg transition
          "
        >
          Check Out
          <Image
            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            src={assets.arrow_icon_white}
            alt="arrow_icon_white"
          />
        </button>
      </div>

      {/* Right Product Image */}
      <Image
        className="hidden md:block max-w-80 drop-shadow-md"
        src={assets.md_controller_image}
        alt="md_controller_image"
      />
      <Image
        className="md:hidden w-56"
        src={assets.sm_controller_image}
        alt="sm_controller_image"
      />
    </div>

  );
};

export default Banner;







































// "use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, Navigation } from "swiper/modules";
// import Image from "next/image";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// import { assets } from "@/assets/assets"; // adjust import path

// export default function PromoCarousel() {
//   const offers = [
//     {
//       id: 1,
//       title: "Game On: Experience Next-Level Action",
//       desc: "Immersive audio meets precise controls—your winning combo.",
//       imgMain: assets.jbl_soundbox_image,
//       imgMd: assets.md_controller_image,
//       imgSm: assets.sm_controller_image,
//     },
//     {
//       id: 2,
//       title: "Crystal Clear Sound for Every Beat",
//       desc: "Premium quality headphones with noise cancellation.",
//       imgMain: assets.jbl_soundbox_image,
//       imgMd: assets.md_controller_image,
//       imgSm: assets.sm_controller_image,
//     },
//     {
//       id: 3,
//       title: "Upgrade Your Gaming Setup",
//       desc: "Exclusive discounts on controllers and sound systems.",
//       imgMain: assets.jbl_soundbox_image,
//       imgMd: assets.md_controller_image,
//       imgSm: assets.sm_controller_image,
//     },
//   ];

//   return (
//     <div className="w-full my-16">
//       <Swiper
//         spaceBetween={30}
//         centeredSlides={true}
//         autoplay={{
//           delay: 4000,
//           disableOnInteraction: false,
//         }}
//         pagination={{
//           clickable: true,
//         }}
//         navigation={true}
//         modules={[Autoplay, Pagination, Navigation]}
//         className="rounded-2xl overflow-hidden shadow-lg"
//       >
//         {offers.map((offer) => (
//           <SwiperSlide key={offer.id}>
//             <div
//               className="
//                 flex flex-col md:flex-row items-center justify-between 
//                 md:pl-20 py-14 md:py-0 rounded-xl overflow-hidden 
//                 bg-[#E6E9F2] dark:bg-transparent 
//                 border border-transparent dark:border-gray-700
//               "
//             >
//               <Image
//                 className="max-w-56"
//                 src={offer.imgMain}
//                 alt="main_product"
//               />
//               <div className="flex flex-col items-center justify-center text-center space-y-3 px-6 md:px-0">
//                 <h2 className="text-2xl md:text-3xl font-bold max-w-[320px] text-black dark:text-white">
//                   {offer.title}
//                 </h2>
//                 <p className="max-w-[360px] font-medium text-gray-800/70 dark:text-gray-400">
//                   {offer.desc}
//                 </p>
//                 <button className="group flex items-center justify-center gap-1 px-12 py-3 bg-orange-600 hover:bg-orange-700 transition rounded-xl text-white font-medium shadow-lg">
//                   Add to Cart
//                   <Image
//                     className="group-hover:translate-x-1 transition"
//                     src={assets.arrow_icon_white}
//                     alt="arrow_icon_white"
//                   />
//                 </button>
//               </div>
//               <Image
//                 className="hidden md:block max-w-80"
//                 src={offer.imgMd}
//                 alt="md_controller"
//               />
//               <Image
//                 className="md:hidden"
//                 src={offer.imgSm}
//                 alt="sm_controller"
//               />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// }
