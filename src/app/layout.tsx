'use client';
import type { Metadata } from "next";
import { Inter, } from "next/font/google";
import "./globals.css";
import { Sidebar } from "../components/Sidebar"
import { Provider } from "./Providers";
import { Navbar } from "../components/Navbar";
import '@rainbow-me/rainbowkit/styles.css';
import { useAccount, useReadContract } from "wagmi";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body className={inter.className}>
            <div className="bg-[#ffffff] h-screen relative ">
              <Navbar />
              {children}
            </div>
        </body>
      </Provider>
    </html>
  );
}
