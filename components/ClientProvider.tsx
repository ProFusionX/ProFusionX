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

  // Add the root path to the list of paths where the navbar shouldn't appear
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
