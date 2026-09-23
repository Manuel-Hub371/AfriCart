import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Administrator Gateway | AfriCart",
  description: "AfriCart administrator access gateway",
};

/**
 * Public layout for the /admin gateway pages (login / register / forgot /
 * reset). Styled after the admin dashboard but deliberately NOT wrapped by the
 * sidebar-shell AdminLayout, which requires an existing admin session.
 */
export default function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col relative overflow-hidden">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-3xl rounded-full" />
      </div>

      <header className="relative z-10 px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-emerald-500/20">
            A
          </div>
          <div>
            <span className="font-extrabold text-white tracking-tight block leading-none">AfriCart</span>
            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3 h-3" /> Admin Control
            </span>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        {children}
      </main>

      <footer className="relative z-10 px-6 py-4 text-center text-[10px] text-slate-600 border-t border-slate-800/60">
        Restricted area — administrator access only. Unauthorized use is prohibited.
      </footer>
    </div>
  );
}