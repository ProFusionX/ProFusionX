"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "./Navbar";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Navbar />
      {children}
    </SessionProvider>
  );
}
