import React, { ReactNode } from "react";
import Head from "next/head";
import Navbar from "./Navbar";
import Notifications from "./Notifications";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "ProConnect Platform",
}) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <Notifications />
        </div>
        <main>{children}</main>
      </div>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          © {new Date().getFullYear()} ProConnect Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
