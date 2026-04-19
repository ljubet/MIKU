"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithEmail, signInWithEmail } from "@/lib/actions/auth";
import { AccountType } from "@/types";
import { Loader2 } from "lucide-react";

interface Props {
  accountType: AccountType;
  onBack: () => void;
}

export function EmailAuthForm({ accountType, onBack }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    data.set("accountType", accountType);

    startTransition(async () => {
      const action = mode === "signup" ? signUpWithEmail : signInWithEmail;
      const result = await action(data);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="text-xs text-gray-400 hover:text-gray-600 text-left -mb-1 transition-colors"
      >
        ← Back
      </button>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setMode("signin")}
          className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${
            mode === "signin" ? "bg-white shadow-sm text-gray-900" : "text-gray-500"
          }`}
        >
          Sign in
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${
            mode === "signup" ? "bg-white shadow-sm text-gray-900" : "text-gray-500"
          }`}
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === "signup" && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full name
            </Label>
            <Input id="name" name="name" required placeholder="Alex Johnson" />
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Min. 8 characters"
          />
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="bg-[#FF0078] hover:bg-[#d60065] font-semibold mt-1"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : mode === "signin" ? (
            "Sign in"
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </div>
  );
}
