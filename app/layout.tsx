import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/context";
import { BottomNav } from "@/components/navigation/bottom-nav";

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
      <body className="font-sans antialiased">
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
