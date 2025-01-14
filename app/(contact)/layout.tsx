import React from "react";
import { Navbar } from "../_components/Navbar";
import "../ui/clientStyles.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
