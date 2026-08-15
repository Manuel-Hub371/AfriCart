import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
            <div className="text-center md:text-left space-y-1">
              <h3 className="text-lg sm:text-2xl font-black text-white">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-xs sm:text-base text-gray-400">
                Get the latest updates on new products and exclusive deals!
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2 max-w-md">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-9 sm:h-12 px-3 sm:px-4 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 text-xs sm:text-sm rounded-xl"
              />
              <Button className="gradient-primary h-9 sm:h-12 px-4 sm:px-6 text-xs sm:text-sm font-bold rounded-xl shadow-md flex-shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 mb-2 lg:mb-0">
            <Link href="/" className="flex items-center gap-2 mb-3 sm:mb-6 group">
              <div className="w-8 h-8 sm:w-11 sm:h-11 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-base sm:text-xl">A</span>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-white">AfriCart</span>
            </Link>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 leading-relaxed max-w-sm">
              Your trusted multi-vendor marketplace for quality products from
              verified sellers across Africa.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                <MapPin className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                <span>123 Market Street, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                <Phone className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                <span>+234 800 123 4567</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                <Mail className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                <span>support@africart.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 sm:gap-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Youtube, href: "#" }
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-green-600 hover:to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 group"
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Marketplace Column */}
          <div>
            <h3 className="text-white font-bold mb-3 sm:mb-5 text-xs sm:text-sm uppercase tracking-wider">Marketplace</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              {["About Us", "Contact", "Careers", "Press", "Blog"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(" ", "")}`} className="hover:text-green-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Column */}
          <div>
            <h3 className="text-white font-bold mb-3 sm:mb-5 text-xs sm:text-sm uppercase tracking-wider">Customer</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              {["Help Center", "Shipping Info", "Returns", "FAQs", "Track Order"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(" ", "")}`} className="hover:text-green-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Seller Column */}
          <div>
            <h3 className="text-white font-bold mb-3 sm:mb-5 text-xs sm:text-sm uppercase tracking-wider">Seller</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              {["Become a Seller", "Seller Guide", "Seller Dashboard", "Seller Support"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/ /g, "-")}`} className="hover:text-green-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-bold mb-3 sm:mb-5 text-xs sm:text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              {["Privacy Policy", "Terms & Conditions", "Cookie Policy", "Disclaimer"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/ /g, "-").replace("&", "")}`} className="hover:text-green-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-400 text-center sm:text-left">
              © 2024 AfriCart. All rights reserved. Made with <span className="text-red-500">❤</span> in Africa
            </p>
            <div className="flex gap-4 text-xs text-gray-400">
              {["Sitemap", "Accessibility", "Security"].map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`} className="hover:text-green-400 transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
