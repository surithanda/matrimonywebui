// app/_utils/aos.ts
"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export function useAOS() {
  useEffect(() => {
    AOS.init({
      duration: 800, // animation duration
      once: false, // replay on every scroll
      offset: 100, // trigger point
      easing: "ease-in-out",
    });
  }, []);
}
