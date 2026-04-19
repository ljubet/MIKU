"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLang } from "@/lib/language-context";
import { useApp } from "@/lib/app-context";
import { UserCircle2, Building2, ArrowLeft } from "lucide-react";

function AuthPageContent() {
  const { t } = useLang();
  const { setRole } = useApp();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const modeQuery = `?mode=${mode}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-rose-50 to-white flex flex-col">
      <header className="border-b border-gray-100 px-6 py-4">
        <Link href="/" className="max-w-6xl mx-auto block">
          <img src="/Logo LINKER FINAL 3.png" alt="Linker" className="h-8 w-auto" />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="flex items-center justify-start mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('auth_back')}
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {t('auth_title')}
          </h1>
          <p className="text-sm text-gray-500 mb-8">{t('auth_subtitle')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <Link href={`/auth/candidate${modeQuery}`} className="group" onClick={() => setRole("student")}>
              <div className="h-full border border-gray-200 rounded-2xl p-6 hover:border-[#FF0078] hover:shadow-sm transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[#FF0078]/10 flex items-center justify-center mb-4">
                  <UserCircle2 className="w-6 h-6 text-[#FF0078]" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">{t('auth_candidate_title')}</p>
                <p className="text-xs text-gray-400">{t('auth_candidate_desc')}</p>
              </div>
            </Link>

            <Link href={`/auth/provider${modeQuery}`} className="group" onClick={() => setRole("org")}>
              <div className="h-full border border-gray-200 rounded-2xl p-6 hover:border-[#FF0078] hover:shadow-sm transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[#FF0078]/10 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-[#FF0078]" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">{t('auth_org_title')}</p>
                <p className="text-xs text-gray-400">{t('auth_org_desc')}</p>
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

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthPageContent />
    </Suspense>
  );
}
