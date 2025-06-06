import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Provider from "@/Provider/Provider";

import Navbar from "@/components/elements/Navbar";
import Footer from "@/components/elements/Footer";

const geistSans = Geist({
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CaseCobra",
  description: "A Modern Ecommerce App",
  icons: {
    icon: "/snake-1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} ${geistMono.className} antialiased`}>
       <Provider>
        <Navbar />
       </Provider>
        <main className="flex grainy-light flex-col min-h-[calc(100vh-3.5rem-1px)]">
          <div className="flex-1 flex flex-col h-full">
            <Provider>{children}</Provider>
          </div>
          <Footer />
        </main>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
