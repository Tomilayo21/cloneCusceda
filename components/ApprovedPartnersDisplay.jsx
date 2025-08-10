

"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ApprovedPartnersDisplay() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchApprovedPartners = async () => {
      try {
        const res = await fetch("/api/partners");
        if (!res.ok) throw new Error("Failed to fetch partners");

        const data = await res.json();

        const approved = (data.partners ?? data)
          .filter((p) => p.approved)
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

        setPartners(approved);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApprovedPartners();
  }, []);

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
            Our Trusted Partners
          </h2>

          {partners.length === 0 ? (
            <p className="text-center text-gray-500">No approved partners found.</p>
          ) : (
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {partners.map((partner) => {
                const imageUrl = Array.isArray(partner.imageUrl)
                  ? partner.imageUrl[0]
                  : partner.imageUrl;

                return (
                  <div
                    key={partner._id}
                    className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={partner.name || partner.username || "Partner"}
                        className="w-24 h-24 object-cover rounded-full mb-4"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {partner.name || partner.username || "Anonymous"}
                    </h3>

                    {partner.comment && (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {partner.comment}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want to partner with us?
            </h3>
            <p className="text-gray-700 text-lg">
              We’re always looking to collaborate with amazing brands and
              individuals. Reach out to join our growing network of trusted
              partners and create something great together.
            </p>
            {/* Optional: add a button or link here */}
            {/* <a href="/contact" className="inline-block mt-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
              Contact Us
            </a> */}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}



