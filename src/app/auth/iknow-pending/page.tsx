import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowLeft } from "lucide-react";

export default function IKnowPendingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-100 px-6 py-4">
        <Link href="/">
          <img src="/Logo LINKER FINAL 3.png" alt="Linker" className="h-8 w-auto" />
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="w-full max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-5">
            <GraduationCap className="w-7 h-7 text-blue-500" />
          </div>

          <h1 className="text-xl font-extrabold text-gray-900 mb-2 tracking-tight">
            iKnow integration coming soon
          </h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            The iKnow (UKIM) login is not live yet. Once connected, UKIM students will be
            able to sign in directly through their university account and receive a{" "}
            <span className="text-blue-600 font-medium">Verified via iKnow</span> badge.
          </p>

          <Link href="/auth/candidate">
            <Button variant="outline" className="gap-2 font-medium">
              <ArrowLeft className="w-4 h-4" />
              Use a different method
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
