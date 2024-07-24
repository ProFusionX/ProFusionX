import "../app/globals.css"; // Ensure the path is correct
import type { AppProps } from "next/app";
import RootLayout from "../app/layout"; // Updated import to layout.tsx

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default MyApp;
