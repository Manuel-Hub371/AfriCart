import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-gray-400">
                Get the latest updates on new products and exclusive deals!
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-12 px-4 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl min-w-[280px]"
              />
              <Button className="gradient-primary h-12 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-11 h-11 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold text-white">AfriCart</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Your trusted multi-vendor marketplace for quality products from
              verified sellers. Shop with confidence and enjoy seamless delivery.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <MapPin className="h-4 w-4 text-green-400" />
                <span>123 Market Street, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-green-400" />
                <span>+234 800 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-green-400" />
                <span>support@africart.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
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
                    className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-green-600 hover:to-emerald-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                  >
                    <Icon className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Marketplace Column */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Marketplace</h3>
            <ul className="space-y-3 text-sm">
              {["About Us", "Contact", "Careers", "Press", "Blog"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(" ", "")}`} className="hover:text-green-400 transition-colors flex items-center group">
                    <span className="w-0 h-px bg-green-400 group-hover:w-4 transition-all mr-0 group-hover:mr-2"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Column */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Customer</h3>
            <ul className="space-y-3 text-sm">
              {["Help Center", "Shipping Info", "Returns", "FAQs", "Track Order"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(" ", "")}`} className="hover:text-green-400 transition-colors flex items-center group">
                    <span className="w-0 h-px bg-green-400 group-hover:w-4 transition-all mr-0 group-hover:mr-2"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Seller Column */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Seller</h3>
            <ul className="space-y-3 text-sm">
              {["Become a Seller", "Seller Guide", "Seller Dashboard", "Seller Support"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/ /g, "-")}`} className="hover:text-green-400 transition-colors flex items-center group">
                    <span className="w-0 h-px bg-green-400 group-hover:w-4 transition-all mr-0 group-hover:mr-2"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3 text-sm">
              {["Privacy Policy", "Terms & Conditions", "Cookie Policy", "Disclaimer"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/ /g, "-").replace("&", "")}`} className="hover:text-green-400 transition-colors flex items-center group">
                    <span className="w-0 h-px bg-green-400 group-hover:w-4 transition-all mr-0 group-hover:mr-2"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2024 AfriCart. All rights reserved. Made with <span className="text-red-500">❤</span> in Africa
            </p>
            <div className="flex gap-6 text-sm">
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
