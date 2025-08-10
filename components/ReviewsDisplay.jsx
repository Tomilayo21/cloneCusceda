
//Testimonials Display
"use client";

import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ReviewsDisplay() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await fetch("/api/reviews");
        if (!res.ok) throw new Error("Failed to fetch reviews");

        const data = await res.json();
        const list = data.reviews ?? data;

        const approved = list
          .filter((r) => r.approved)
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

        setEntries(approved);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApproved();
  }, []);

  // Group by section
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
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-16">
        <h1 className="text-3xl font-bold text-center mb-12">Customer Testimonials</h1>

        {grouped.map(([section, items]) => (
          <section key={section} className="space-y-12">
            <h2 className="text-2xl font-semibold border-b pb-2 mb-8 text-center">
              {items[0]?.heading || section}
            </h2>

            {items.map((review) => (
              <blockquote
                key={review._id}
                className="flex items-start border-l-4 border-yellow-500 pl-6 italic bg-white p-6 rounded-lg shadow-sm"
              >
                {/* Image on the left */}
                {review.imageUrl && (
                  <img
                    src={review.imageUrl}
                    alt={review.username || review.name || "User"}
                    className="w-20 h-20 rounded-full object-cover flex-shrink-0 mr-6"
                  />
                )}

                {/* Content on the right */}
                <div className="text-gray-800 max-w-[600px]">
                  <p
                    className="mb-4 text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: review.comment || review.description || "" }}
                  ></p>

                  <footer className="not-italic text-right font-semibold text-gray-600">
                    — {review.username || review.name || "Anonymous"}
                    {review.location ? `, ${review.location}` : ""}
                  </footer>
                </div>
              </blockquote>
            ))}
          </section>
        ))}

        <p className="text-center mt-12 italic text-gray-600">
          Tag us with <strong>#MyCuscedaExperience</strong> to get featured!
        </p>
      </div>
      <Footer />
    </>
  );
}
