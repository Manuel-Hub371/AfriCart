import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send } from "lucide-react";

export function Newsletter() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-primary opacity-95"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6bTAgMjhjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-2xl animate-float">
          <Mail className="h-10 w-10 text-white" />
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Stay in the Loop! 💌
        </h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Subscribe to our newsletter and be the first to know about new
          products, exclusive deals, and special offers delivered to your inbox.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="email"
              placeholder="Enter your email address"
              className="pl-12 pr-4 h-14 bg-white border-0 shadow-2xl rounded-xl text-base focus:ring-4 focus:ring-white/30 transition-all"
            />
          </div>
          <Button
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-50 h-14 px-8 rounded-xl shadow-2xl font-bold hover:scale-105 transition-all duration-300"
          >
            <Send className="h-5 w-5 mr-2" />
            Subscribe
          </Button>
        </div>

        <p className="text-sm text-white/70 mt-6">
          🔒 We respect your privacy. Unsubscribe at any time.
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-12 border-t border-white/20">
          <div className="text-white/90">
            <p className="text-3xl font-bold">10K+</p>
            <p className="text-sm text-white/70">Subscribers</p>
          </div>
          <div className="text-white/90">
            <p className="text-3xl font-bold">Weekly</p>
            <p className="text-sm text-white/70">Updates</p>
          </div>
          <div className="text-white/90">
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-white/70">Spam</p>
          </div>
        </div>
      </div>
    </section>
  );
}
