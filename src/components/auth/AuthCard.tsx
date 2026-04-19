"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AccountType } from "@/types";
import { Loader2, Mail, Lock, Eye, EyeOff, User, LogIn, UserPlus } from "lucide-react";

interface SocialButton {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface Props {
  accountType: AccountType;
  title: string;
  subtitle: string;
  socialButtons?: SocialButton[];
  defaultMode?: "signin" | "signup";
}

export function AuthCard({ accountType, title, subtitle, socialButtons, defaultMode = "signin" }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dest = accountType === "candidate" ? "/student/dashboard" : "/org/dashboard";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const name = (form.get("name") as string) || email.split("@")[0];

    // Persist mock user so the rest of the app can read it
    localStorage.setItem("mock_user", JSON.stringify({ name, email, accountType }));

    // Small delay so it feels like something happened
    setTimeout(() => router.push(dest), 400);
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-black/10 px-8 py-9">
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center shadow-sm">
          {mode === "signin"
            ? <LogIn className="w-6 h-6 text-gray-700" />
            : <UserPlus className="w-6 h-6 text-gray-700" />
          }
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-[22px] font-bold text-gray-900 text-center mb-1.5 tracking-tight">
        {mode === "signin" ? title : "Create your account"}
      </h1>
      <p className="text-sm text-gray-400 text-center mb-7 leading-snug">
        {mode === "signin" ? subtitle : `Join Linker as a ${accountType}`}
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === "signup" && (
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              name="name"
              placeholder="Full name"
              className="w-full bg-gray-100 rounded-full pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-900/10 transition"
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full bg-gray-100 rounded-full pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-900/10 transition"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full bg-gray-100 rounded-full pl-11 pr-11 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-900/10 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            tabIndex={-1}
          >
            {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        {mode === "signin" && (
          <div className="flex justify-end -mt-0.5">
            <button type="button" className="text-xs text-gray-500 hover:text-gray-800 transition">
              Forgot password?
            </button>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-full py-3 text-sm transition flex items-center justify-center gap-2 mt-1 disabled:opacity-60"
        >
          {loading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : mode === "signin" ? "Get Started" : "Create account"
          }
        </button>
      </form>

      {/* Mode toggle */}
      <p className="text-center text-xs text-gray-400 mt-5">
        {mode === "signin" ? (
          <>
            Don't have an account?{" "}
            <button
              onClick={() => { setMode("signup"); setError(null); }}
              className="text-gray-700 font-semibold hover:underline"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => { setMode("signin"); setError(null); }}
              className="text-gray-700 font-semibold hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </p>

      {/* Social divider + buttons */}
      {socialButtons && socialButtons.length > 0 && (
        <>
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 border-t border-dashed border-gray-200" />
            <span className="text-xs text-gray-400 whitespace-nowrap">Or sign in with</span>
            <div className="flex-1 border-t border-dashed border-gray-200" />
          </div>

          <div className="flex gap-2">
            {socialButtons.map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                disabled={btn.disabled}
                title={btn.label}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition disabled:opacity-50"
              >
                {btn.icon}
                {socialButtons.length === 1 && (
                  <span className="text-xs font-medium text-gray-600">{btn.label}</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
