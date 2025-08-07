"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsAndConditionsPage() {
  const router = useRouter();
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    fetch("/api/terms")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched terms:", data);
        setTerms(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch terms:", err);
        setTerms([]);
      });
  }, []);

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto px-3 py-10 space-y-6 text-gray-800 dark:text-gray-100"
      >
        {/* Title */}
        <div className="flex flex-col items-center mt-8 mb-8">
          <p className="text-3xl font-medium">
            Terms & <span className="text-orange-600">Conditions</span>
          </p>
          <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
        </div>

        {/* Content */}
        <div className="space-y-6 leading-relaxed">
          {terms.length > 0 ? (
            terms.map((term) => (
              <div key={term._id}>
                <h2 className="font-semibold text-lg">{term.title}</h2>
                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                  {term.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No terms available.</p>
          )}
        </div>

      </motion.div>
      <Footer />
    </>
  );
}
