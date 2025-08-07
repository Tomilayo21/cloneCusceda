"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// ✅ Make sure these components exist
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FAQPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    fetch("/api/faq").then(res => res.json()).then(setFaqs);
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
            Frequently Asked <span className="text-orange-600">Questions</span>
          </p>
          <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
        </div>


        {/* FAQ Content */}
        <div className="space-y-6 leading-relaxed">
          {faqs.map((faq, i) => (
            <div key={faq._id}>
              <h2 className="font-semibold">{i + 1}. {faq.question}</h2>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </motion.div>
      <Footer />
    </>
  );
}
