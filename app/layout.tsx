import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/context";
import { BottomNav } from "@/components/navigation/bottom-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AfriCart - Discover Everything You Need",
  description: "Shop from trusted sellers, explore thousands of products, and enjoy a seamless shopping experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="pb-16 md:pb-0">
            {children}
          </div>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
