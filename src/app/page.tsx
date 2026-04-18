"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/app-context";
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Clock,
  Building2,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

const painPoints = [
  "Scrolling through Discord for internship links",
  "Applying and never hearing back",
  "Not knowing if you even qualify",
  "No idea what the interview process looks like",
];

const features = [
  {
    icon: Sparkles,
    title: "Matched to you",
    description:
      "Every listing shows your match score based on your skills. No more guessing if you qualify.",
  },
  {
    icon: ShieldCheck,
    title: "Verified companies only",
    description:
      "Every organisation on Miku is verified. Real listings, active companies, real responses.",
  },
  {
    icon: Clock,
    title: "Apply in under 60 seconds",
    description:
      "Your profile is pre-filled. Add a note, hit apply. The fastest internship application you'll ever do.",
  },
  {
    icon: TrendingUp,
    title: "Know what to expect",
    description:
      "Every listing shows the full hiring process — stages, timelines, and what each step involves.",
  },
];

const stats = [
  { value: "200+", label: "Open positions" },
  { value: "50+", label: "Verified companies" },
  { value: "< 60s", label: "To apply" },
  { value: "3 days", label: "Avg. first response" },
];

export default function LandingPage() {
  const { setRole } = useApp();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Miku</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/student/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 font-medium"
                onClick={() => setRole("student")}
              >
                For Students
              </Button>
            </Link>
            <Link href="/org/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 font-medium"
                onClick={() => setRole("org")}
              >
                For Organizations
              </Button>
            </Link>
            <Link href="/student/dashboard">
              <Button
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 font-semibold"
                onClick={() => setRole("student")}
              >
                Get started free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-14 pb-8 text-center">
        <Badge
          variant="outline"
          className="mb-6 text-violet-700 border-violet-200 bg-violet-50 px-3 py-1 text-xs inline-flex items-center gap-1.5 font-medium"
        >
          <ShieldCheck className="w-3 h-3" />
          Built for students at UKIM & beyond
        </Badge>

        <h1 className="text-5xl font-extrabold text-gray-900 leading-[1.15] mb-5 tracking-tight">
          Stop hunting through{" "}
          <span className="line-through text-gray-300">Discord groups.</span>
          <br />
          Find your internship here.
        </h1>

        <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
          Every verified internship and junior job in one place. See your match score before you
          apply, know the full hiring process upfront, and apply in under 60 seconds.
        </p>

        {/* Pain point list */}
        <div className="flex flex-col items-center gap-2 mb-10">
          {painPoints.map((point) => (
            <div key={point} className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-4 h-4 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <span className="text-red-400 text-xs">✕</span>
              </div>
              {point}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/student/dashboard" onClick={() => setRole("student")}>
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 gap-2 px-8 font-semibold text-base"
            >
              Browse open internships
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/org/dashboard" onClick={() => setRole("org")}>
            <Button size="lg" variant="outline" className="gap-2 px-8 font-medium text-base">
              <Building2 className="w-4 h-4" />
              Post a role
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y border-gray-100 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</p>
                <p className="text-sm text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            Everything you were missing
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            We built Miku to solve the exact frustrations you already have with internship hunting.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white border border-gray-100 rounded-xl p-6 hover:border-violet-200 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 border-y border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              From zero to applied in 60 seconds
            </h2>
            <p className="text-gray-500 text-base">Here's exactly how it works.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {[
              { step: "1", title: "Browse", desc: "See verified listings matched to your skills and year." },
              { step: "2", title: "Understand", desc: "Read the full hiring process before you even apply." },
              { step: "3", title: "Apply", desc: "Your profile is pre-filled. Add a note and submit." },
              { step: "4", title: "Track", desc: "Follow every application status in one dashboard." },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="relative">
                <div className="bg-white border border-gray-100 rounded-xl p-5 h-full">
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center mb-3">
                    <span className="text-white text-sm font-bold">{step}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:flex absolute top-9 -right-2 z-10 w-4 h-4 items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-violet-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <div className="bg-violet-50 border-y border-violet-100 py-6">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-sm text-violet-700 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> All companies manually verified
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Hiring process shown for every role
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Skill matching before you apply
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Free for students, always
          </span>
        </div>
      </div>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-14 text-center">
        <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl px-8 py-14 text-white shadow-lg shadow-violet-200">
          <h2 className="text-3xl font-extrabold mb-3 tracking-tight">
            Your internship is already posted.
          </h2>
          <p className="text-violet-200 mb-8 text-base max-w-md mx-auto">
            Hundreds of students from UKIM are already using Miku. Don't miss the deadline.
          </p>
          <Link href="/student/dashboard" onClick={() => setRole("student")}>
            <Button
              size="lg"
              className="bg-white text-violet-700 hover:bg-violet-50 gap-2 font-bold px-8 text-base shadow-sm"
            >
              Find my match now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 rounded bg-violet-600 flex items-center justify-center">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span>Miku — Made for students who deserve better than Discord DMs</span>
        </div>
      </footer>
    </div>
  );
}
