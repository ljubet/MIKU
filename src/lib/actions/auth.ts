"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AccountType } from "@/types";

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const accountType = formData.get("accountType") as AccountType;
  const name = formData.get("name") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { account_type: accountType, full_name: name },
    },
  });

  if (error) return { error: error.message };

  redirect(accountType === "candidate" ? "/student/dashboard" : "/org/dashboard");
}

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const accountType = formData.get("accountType") as AccountType;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  redirect(accountType === "candidate" ? "/student/dashboard" : "/org/dashboard");
}

export async function signInWithGoogle(accountType: AccountType) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?account_type=${accountType}`,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });

  if (error) return { error: error.message };
  if (data.url) redirect(data.url);
}

export async function signInWithIKnow() {
  const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?account_type=candidate&provider=iknow`;
  const iknowUrl = process.env.IKNOW_AUTH_URL;

  if (!iknowUrl) {
    redirect(`/auth/iknow-pending`);
  }

  redirect(`${iknowUrl}?redirect_uri=${encodeURIComponent(callbackUrl)}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
