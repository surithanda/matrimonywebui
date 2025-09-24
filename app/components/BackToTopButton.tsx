"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react"; // or use any icon library
import clsx from "clsx";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={clsx(
        "fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 z-50",
        "bg-[#f7ac03] text-white hover:bg-[#e69b00]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
