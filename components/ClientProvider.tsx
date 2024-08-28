"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (
    pathname === "/" ||
    pathname === "/auth/signin" ||
    pathname === "/auth/signup"
  ) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <Navbar />
      {children}
    </SessionProvider>
  );
}
