import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageX, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
          <PackageX className="h-10 w-10 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          The page or product listing you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 rounded-xl font-bold gap-2">
            <ArrowLeft className="h-4 w-4" /> Return to Homepage
          </Button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}
