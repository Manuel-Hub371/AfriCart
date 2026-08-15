import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send } from "lucide-react";

export function Newsletter() {
  return (
    <section className="py-8 sm:py-12 md:py-16 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-primary opacity-95"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTIgMTItMTItNS4zNzMtMTItMTJ6bTAgMjhjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 sm:mb-6 shadow-xl">
          <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 sm:mb-4">
          Stay in the Loop! 💌
        </h2>
        <p className="text-xs sm:text-base text-white/90 mb-6 max-w-xl mx-auto leading-relaxed">
          Subscribe to our newsletter and be the first to know about new
          products, exclusive deals, and special offers delivered to your inbox.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="email"
              placeholder="Enter your email address"
              className="pl-9 pr-3 h-10 sm:h-12 bg-white border-0 shadow-lg rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-white/50 transition-all"
            />
          </div>
          <Button
            size="sm"
            className="bg-white text-green-700 hover:bg-gray-100 h-10 sm:h-12 px-6 rounded-xl shadow-lg font-bold text-xs sm:text-sm hover:scale-105 transition-all duration-300"
          >
            <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
            Subscribe
          </Button>
        </div>

        <p className="text-[10px] sm:text-xs text-white/70 mt-4">
          🔒 We respect your privacy. Unsubscribe at any time.
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 mt-6 sm:mt-10 pt-6 sm:pt-10 border-t border-white/20">
          <div className="text-white/90">
            <p className="text-xl sm:text-2xl font-extrabold">10K+</p>
            <p className="text-[10px] sm:text-xs text-white/70">Subscribers</p>
          </div>
          <div className="text-white/90">
            <p className="text-xl sm:text-2xl font-extrabold">Weekly</p>
            <p className="text-[10px] sm:text-xs text-white/70">Updates</p>
          </div>
          <div className="text-white/90">
            <p className="text-xl sm:text-2xl font-extrabold">0</p>
            <p className="text-[10px] sm:text-xs text-white/70">Spam</p>
          </div>
        </div>
      </div>
    </section>
  );
}
