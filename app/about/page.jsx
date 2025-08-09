// 'use client'
// import React from 'react';
// import Head from 'next/head';
// import Footer from '@/components/Footer';
// import Navbar from '@/components/Navbar';

// export default function About() {
//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 pt-8">
//         <Head>
//           <title>About Cusceda</title>
//         </Head>
//         <div className="container">
//           <section className="intro">
//            <div className="flex flex-col items-center mt-8 mb-4">
//               <p className="text-3xl font-medium">
//                 About <span className="text-orange-600">Cusceda</span>
//               </p>
//               <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
//             </div>
//             <div>
//               <p>
//                 <strong>Cusceda</strong> is a forward-thinking eCommerce platform that specializes in 
//                 providing top-quality gadgets and electronic accessories to customers across every region of Nigeria. 
//                 With a user-friendly shopping experience, secure payment systems, and fast nationwide delivery, 
//                 Cusceda is redefining how Nigerians shop for technology—making it smarter, easier, and 
//                 more accessible than ever.
//               </p>
//             </div>
//           </section>

//           <section>
//             <h2>🧑‍🤝‍🧑 Who We Are</h2>
//             <p>
//               Founded by a passionate team of tech lovers, logistics experts, and customer service professionals, 
//               Cusceda was born out of a simple but powerful idea:
//               Everyone in Nigeria deserves easy access to the gadgets they need, no matter where they live.
//               We understand the frustrations of unreliable online shopping, delayed deliveries, and counterfeit products. 
//               That's why we built Cusceda—to deliver not just gadgets, but trust, quality, and convenience.
//             </p>
//           </section>
          
//           <section>
//             <h2>🚀 Our Story</h2>
//             <p>
//               Cusceda began with a small team and a big vision—to bridge the tech accessibility gap in Nigeria. 
//               We noticed that many people outside major cities were underserved and 
//               often had to pay extra or wait weeks for gadgets to arrive—sometimes receiving the wrong or fake product.
//               With backgrounds in tech, eCommerce, logistics, and customer care, we launched Cusceda to change that. What started as a small operation has grown into a fast-rising platform trusted by thousands of Nigerians nationwide.
//             </p>
//           </section>

//           <section>
//             <h2>🛍️ What You Can Buy</h2>
//             <ul>
//               <li>📱 Smartphones</li>
//               <li>⌚ Smartwatches & Wearables</li>
//               <li>🎧 Earphones, Headsets & Bluetooth Speakers</li>
//               <li>🔌 Power Banks, Chargers, and Cables</li>
//               <li>💻 Laptop Accessories & Peripherals</li>
//               <li>🏠 Smart Home Devices</li>
//               <li>🖱️ Office Tech & Electronics</li>
//             </ul>
//           </section>
          

//           <section>
//             <h2>🇳🇬 Delivery, Anywhere in Nigeria</h2>
//             <ul className="list-style-none">
//               <li>✅ Nationwide coverage across all 36 states + FCT</li>
//               <li>✅ Real-time tracking & notifications</li>
//               <li>✅ Optional express delivery in select cities</li>
//             </ul>
//           </section>

//           <section>
//             <h2>💳 Flexible & Secure Payments</h2>
//             <ul>
//               <li>💳 Debit/Credit Card (Visa, Mastercard, Verve)</li>
//               <li>🏦 Bank Transfer</li>
//               <li>📲 USSD Payments</li>
//               <li>💼 Wallet Integration (coming soon)</li>
//               <li>💵 Cash on Delivery (select areas)</li>
//             </ul>
//             <p>All transactions are protected with <strong>bank-grade encryption</strong>.</p>
//           </section>

//           <section>
//             <h2>🌟 Why Thousands Choose Cusceda</h2>
//             <ul>
//               <li>✅ 100% Authentic Products</li>
//               <li>📦 Reliable Nationwide Delivery</li>
//               <li>💬 Responsive Customer Care</li>
//               <li>🔁 Easy Returns & Replacements</li>
//               <li>💸 Affordable Prices & Exclusive Deals</li>
//             </ul>
//           </section>

//           <section>
//             <h2>📱 Get the App (Coming Soon!)</h2>
//             <ul>
//               <li>🟢 Track orders on the go</li>
//               <li>🟢 Shop with faster checkout</li>
//               <li>🟢 Receive special app-only offers</li>
//             </ul>
//             <p><strong>Coming to Android & iOS soon!</strong> Sign up for our newsletter to be notified.</p>
//           </section>

//           <section>
//             <h2>🙌 Meet the Cusceda Team</h2>
//             <ul>
//               <li>🛠 Tech developers building secure platforms</li>
//               <li>📦 Operations experts managing logistics</li>
//               <li>🎧 Friendly customer support</li>
//               <li>🌍 Advocates of digital inclusion across Nigeria</li>
//             </ul>
//           </section>

//           <section>
//             <h2>💬 What Customers Are Saying</h2>
//             <blockquote>
//               “Cusceda delivered to my village in Osun within 4 days. I’m impressed!”<br />
//               — Adebayo O.
//             </blockquote>
//             <blockquote>
//               “The power bank I ordered was original and came with warranty.”<br />
//               — Nkechi M., Port Harcourt
//             </blockquote>
//             <blockquote>
//               “Their support team actually responds on WhatsApp. That’s how it should be.”<br />
//               — Idris A., Kaduna
//             </blockquote>
//             <p><em>Tag us with <strong>#MyCuscedaExperience</strong> to get featured!</em></p>
//           </section>

//           <section>
//             <h2>📲 Stay Connected</h2>
//             <ul>
//               <li><a href="https://facebook.com/cusceda" target="_blank">Facebook</a></li>
//               <li><a href="https://instagram.com/cusceda" target="_blank">Instagram</a></li>
//               <li><a href="https://twitter.com/cusceda" target="_blank">Twitter/X</a></li>
//               <li><a href="https://tiktok.com/@cusceda" target="_blank">TikTok</a></li>
//               <li><a href="https://linkedin.com/company/cusceda" target="_blank">LinkedIn</a></li>
//             </ul>
//           </section>

//           <section>
//             <h2>🤝 Partner With Us</h2>
//             <p>Are you a brand, distributor, or delivery provider? Let’s work together to expand access to tech across Nigeria.</p>
//             <p>Email: <a href="mailto:partners@cusceda.com">cusceda@yahoo.com</a></p>
//           </section>

//           <section>
//             <h2>🚀 Join the Cusceda Experience</h2>
//             <p>
//               We believe in a Nigeria where everyone—no matter their location—can access tech easily and affordably. That’s what we stand for.
//             </p>
//             <ul>
//               <li><a href="#">🛒 Visit the store</a></li>
//               <li><a href="#">📦 Track an order</a></li>
//               <li><a href="#">💬 Contact support</a></li>
//             </ul>
//           </section>
//         </div>

//         <style jsx>{`
//           .container {
//             max-width: 900px;
//             margin: auto;
//             padding: 2rem 1rem;
//             font-family: 'Segoe UI', sans-serif;
//             color: #333;
//           }
//           section {
//             margin-bottom: 3rem;
//           }
//           h1 {
//             font-size: 2.5rem;
//             margin-bottom: 1rem;
//             color: #111;
//           }
//           h2 {
//             font-size: 1.75rem;
//             margin-bottom: 0.5rem;
//             color: #0d6efd;
//           }
//           p {
//             font-size: 1rem;
//             line-height: 1.6;
//           }
//           ul {
//             list-style-type: disc;
//             margin-left: 1.5rem;
//           }
//           li {
//             margin-bottom: 0.5rem;
//           }
//           a {
//             color: #0d6efd;
//             text-decoration: none;
//           }
//           a:hover {
//             text-decoration: underline;
//           }
//           blockquote {
//             background: #f8f9fa;
//             padding: 1rem;
//             margin: 1rem 0;
//             border-left: 4px solid #0d6efd;
//             font-style: italic;
//           }
//           @media (max-width: 600px) {
//             h1 {
//               font-size: 2rem;
//             }
//             h2 {
//               font-size: 1.5rem;
//             }
//           }
//         `}</style>
//       </div>
//       <Footer />
//     </>
//   );
// }































// "use client";

// import { useEffect, useState } from "react";

// export default function AboutPage() {
//   const [entries, setEntries] = useState([]);

//   useEffect(() => {
//     fetch("/api/about")
//       .then((res) => res.json())
//       .then((data) => {
//         const sorted = data.sort((a, b) => a.position - b.position);
//         setEntries(sorted);
//       });
//   }, []);

//   const grouped = [];
//   const sectionMap = {};

//   entries.forEach((item) => {
//     if (!sectionMap[item.section]) {
//       sectionMap[item.section] = [];
//       grouped.push([item.section, sectionMap[item.section]]);
//     }
//     sectionMap[item.section].push(item);
//   });

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
//       <h1 className="text-3xl font-bold text-center mb-4">About Us</h1>

//       {grouped.map(([section, items]) => (
//         <div key={section}>
//           <h2 className="text-2xl font-semibold border-b pb-2 mb-4">{section}</h2>

//           <div className="space-y-6">
//             {items.map((entry) => (
//             <div
//               key={entry._id}
//               className="flex flex-col md:flex-row gap-4 items-start border p-4 rounded-lg shadow-sm bg-white"
//             >
//               {entry.image?.length > 0 && (
//                 <div className="flex gap-2">
//                   {entry.image.map((imgUrl, idx) => (
//                     <img
//                       key={`${entry._id}-img-${idx}`} // ✅ unique key
//                       src={imgUrl}
//                       alt={entry.heading}
//                       className="w-32 h-32 object-cover rounded"
//                     />
//                   ))}
//                 </div>
//               )}

//               <div className="flex-1">
//                 <h3 className="text-xl font-bold">{entry.heading}</h3>
//                 {entry.subheading && (
//                   <p className="text-md text-gray-600 mb-1">{entry.subheading}</p>
//                 )}
//                 <p className="text-gray-700 whitespace-pre-line">
//                   {entry.description}
//                 </p>
//               </div>
//             </div>
//           ))}

//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


























// "use client";

// import { useEffect, useState } from "react";

// export default function AboutPage() {
//   const [entries, setEntries] = useState([]);

//   useEffect(() => {
//     fetch("/api/about")
//       .then((res) => res.json())
//       .then((data) => {
//         const sorted = data.sort((a, b) => a.position - b.position);
//         setEntries(sorted);
//       });
//   }, []);

//   const grouped = [];
//   const sectionMap = {};

//   entries.forEach((item) => {
//     if (!sectionMap[item.section]) {
//       sectionMap[item.section] = [];
//       grouped.push([item.section, sectionMap[item.section]]);
//     }
//     sectionMap[item.section].push(item);
//   });

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
//       <h1 className="text-3xl font-bold text-center mb-4">About Us</h1>

//       {grouped.map(([section, items]) => (
//         <div key={section}>
//           <h2 className="text-2xl font-semibold border-b pb-2 mb-4">{section}</h2>

//           <div className="space-y-6">
//             {items.map((entry) => (
//               <div
//                 key={entry._id}
//                 className="flex flex-col gap-4 border p-4 rounded-lg shadow-sm bg-white"
//               >
//                 <div className="flex-1">
//                   <h3 className="text-xl font-bold">{entry.heading}</h3>
//                   {entry.subheading && (
//                     <p className="text-md text-gray-600 mb-1">{entry.subheading}</p>
//                   )}
//                   <p className="text-gray-700 whitespace-pre-line">
//                     {entry.description}
//                   </p>
//                 </div>

//                 {entry.image?.length > 0 && (
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {entry.image.map((imgUrl, idx) => (
//                       <img
//                         key={`${entry._id}-img-${idx}`}
//                         src={imgUrl}
//                         alt={entry.heading}
//                         className="w-32 h-32 object-cover rounded"
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }




































"use client";

import { useEffect, useState } from "react";

export default function AboutPage() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => a.position - b.position);
        setEntries(sorted);
      });
  }, []);

  const grouped = [];
  const sectionMap = {};

  entries.forEach((item) => {
    if (!sectionMap[item.section]) {
      sectionMap[item.section] = [];
      grouped.push([item.section, sectionMap[item.section]]);
    }
    sectionMap[item.section].push(item);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-3xl font-bold text-center mb-4">About Us</h1>

      {grouped.map(([section, items]) => (
        <div key={section}>
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4 text-center">
            {items[0]?.heading}
          </h2>

          <div className="space-y-10">
            {items.map((entry) => (
              <div
                key={entry._id}
                className="flex flex-col items-center text-center border p-6 rounded-lg shadow-sm bg-white"
              >
                

                <h3 className="text-xl font-semibold text-gray-700 mb-2">{entry.subheading}</h3>


                <div
                  className="text-gray-700 mb-4 prose"
                  dangerouslySetInnerHTML={{ __html: entry.description }}
                ></div>



                {entry.image?.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {entry.image.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${entry.heading} - image ${index + 1}`}
                        className="w-32 h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* {grouped.map(([section, items]) => (
        <div key={section}>
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4 text-center">
            {section}
          </h2>

          <div className="space-y-10">
            {items.map((entry) => (
              <div
                key={entry._id}
                className="flex flex-col items-center text-center border p-6 rounded-lg shadow-sm bg-white"
              >

                <h3 className="text-xl font-bold">{entry.heading}</h3>


                {entry.subheading && (
                  <p className="text-md text-gray-600 mb-2">{entry.subheading}</p>
                )}


                <p className="text-gray-700 whitespace-pre-line mb-4">
                  {entry.description}
                </p>


                {entry.image?.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {entry.image.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${entry.heading} - image ${index + 1}`}
                        className="w-32 h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))} */}
    </div>
  );
}
