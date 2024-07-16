import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WalletProvider } from "@/context/WalletContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana Wallet with Web3js",
  description: "Not Your Keys, Not Your Coins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <div className="md:hidden">
          <WalletProvider>{children}</WalletProvider>
        </div>
        <div className="hidden md:flex md:min-h-screen md:justify-center md:items-center">
          Try It On Screen Under 768px
        </div>
      </body>
    </html>
  );
}
