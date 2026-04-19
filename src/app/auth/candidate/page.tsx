"use client";

import { Suspense, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { signInWithGoogle, signInWithIKnow } from "@/lib/actions/auth";
import { GraduationCap } from "lucide-react";

function CandidateAuthContent() {
  const [isPendingGoogle, startGoogle] = useTransition();
  const [isPendingIKnow, startIKnow] = useTransition();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "signup" ? "signup" : "signin";

  const socialButtons = [
    {
      label: "Google",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      ),
      onClick: () => startGoogle(() => { signInWithGoogle("candidate"); }),
      disabled: isPendingGoogle,
    },
    {
      label: "iKnow (UKIM)",
      icon: (
        <span className="flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-blue-500" />
          <span className="text-[11px] font-semibold text-blue-500 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full leading-none">
            UKIM
          </span>
        </span>
      ),
      onClick: () => startIKnow(() => { signInWithIKnow(); }),
      disabled: isPendingIKnow,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-rose-50 to-white flex flex-col">
      <header className="px-6 py-5">
        <Link href="/">
          <img src="/Logo LINKER FINAL 3.png" alt="Linker" className="h-7 w-auto" />
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <AuthCard
          accountType="candidate"
          title="Sign in with email"
          subtitle="Find internships and jobs that match you."
          socialButtons={socialButtons}
          defaultMode={mode}
        />
        <Link href={`/auth?mode=${mode}`} className="mt-5 text-xs text-gray-400 hover:text-gray-600 transition">
          ← Choose a different account type
        </Link>
      </main>
    </div>
  );
}

export default function CandidateAuthPage() {
  return (
    <Suspense fallback={null}>
      <CandidateAuthContent />
    </Suspense>
  );
}
