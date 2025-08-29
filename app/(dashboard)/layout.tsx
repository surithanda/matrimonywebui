import React from "react";
import { Navbar } from "../_components/Navbar";
import Footer from "../_components/Footer";
import "../ui/dashboardStyles.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
