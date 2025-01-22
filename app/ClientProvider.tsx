"use client"; // Mark this file as a Client Component

import { Provider } from "react-redux";
import store from "@/app/store/store";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
