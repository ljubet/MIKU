import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserCircle2, Building2, ArrowRight } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-rose-50 to-white flex flex-col">
      <header className="border-b border-gray-100 px-6 py-4">
        <Link href="/">
          <img src="/Logo LINKER FINAL 3.png" alt="Linker" className="h-8 w-auto" />
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">
            Get started
          </h1>
          <p className="text-sm text-gray-500 mb-8">Choose how you want to use Linker</p>

          <div className="flex flex-col gap-3">
            <Link href="/auth/candidate" className="group">
              <div className="flex items-center justify-between border border-gray-200 rounded-xl p-5 hover:border-[#FF0078] hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FF0078]/10 flex items-center justify-center flex-shrink-0">
                    <UserCircle2 className="w-5 h-5 text-[#FF0078]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">I'm a Candidate</p>
                    <p className="text-xs text-gray-400 mt-0.5">Looking for internships or jobs</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF0078] transition-colors" />
              </div>
            </Link>

            <Link href="/auth/provider" className="group">
              <div className="flex items-center justify-between border border-gray-200 rounded-xl p-5 hover:border-violet-500 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">I'm a Provider</p>
                    <p className="text-xs text-gray-400 mt-0.5">Posting positions for my organization</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-violet-500 transition-colors" />
              </div>
            </Link>
          </div>

          <p className="text-xs text-gray-400 text-center mt-8">
            By continuing, you agree to Linker's{" "}
            <span className="underline cursor-pointer">Terms</span> and{" "}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </main>
    </div>
  );
}
