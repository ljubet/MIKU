"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { useLang } from "@/lib/language-context";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Building2,
  Sparkles,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  const { setRole } = useApp();
  const { t } = useLang();

  const stats = [
    { value: "200+", label: t('stats_openPositions') },
    { value: "50+", label: t('stats_verifiedCompanies') },
    { value: "< 60s", label: t('stats_toApply') },
    { value: "3 days", label: t('stats_avgResponse') },
  ];

  const features = [
    {
      icon: Sparkles,
      title: t('feature1_title'),
      description: t('feature1_desc'),
    },
    {
      icon: ShieldCheck,
      title: t('feature2_title'),
      description: t('feature2_desc'),
    },
    {
      icon: Clock,
      title: t('feature3_title'),
      description: t('feature3_desc'),
    },
    {
      icon: TrendingUp,
      title: t('feature4_title'),
      description: t('feature4_desc'),
    },
  ];

  const steps = [
    { step: "1", title: t('step1_title'), desc: t('step1_desc') },
    { step: "2", title: t('step2_title'), desc: t('step2_desc') },
    { step: "3", title: t('step3_title'), desc: t('step3_desc') },
    { step: "4", title: t('step4_title'), desc: t('step4_desc') },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img src="/Logo LINKER FINAL 3.png" alt="Linker" className="h-8 w-auto" />
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/student/dashboard" className="hidden sm:block">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 font-medium"
                onClick={() => setRole("student")}
              >
                {t('landing_forStudents')}
              </Button>
            </Link>
            <Link href="/org/dashboard" className="hidden sm:block">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 font-medium"
                onClick={() => setRole("org")}
              >
                {t('landing_forOrgs')}
              </Button>
            </Link>
            <Link href="/student/dashboard">
              <Button
                size="sm"
                className="bg-[#FF0078] hover:bg-[#d60065] font-semibold"
                onClick={() => setRole("student")}
              >
                {t('landing_getStarted')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-14 pb-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.15] mb-5 tracking-tight">
          <span className="whitespace-nowrap">
            {t('landing_headline_1')}{' '}
            <span className="line-through text-gray-300">{t('landing_headline_strike')}</span>
          </span>
          <br />
          {t('landing_headline_2')}
        </h1>

        <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('landing_subheadline')}
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/student/dashboard" onClick={() => setRole("student")}>
            <Button
              size="lg"
              className="bg-[#FF0078] hover:bg-[#d60065] gap-2 px-8 font-semibold text-base"
            >
              {t('landing_browseBtn')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/org/dashboard" onClick={() => setRole("org")}>
            <Button size="lg" variant="outline" className="gap-2 px-8 font-medium text-base">
              <Building2 className="w-4 h-4" />
              {t('landing_postBtn')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y border-gray-100 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
            {t('features_title')}
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            {t('features_subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white border border-gray-100 rounded-xl p-6 hover:border-[#FF0078]/30 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FF0078]/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#FF0078]" />
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
              {t('howItWorks_title')}
            </h2>
            <p className="text-gray-500 text-base">{t('howItWorks_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative">
            {steps.map(({ step, title, desc }, i) => (
              <div key={step} className="relative">
                <div className="bg-white border border-gray-100 rounded-xl p-5 h-full">
                  <div className="w-8 h-8 rounded-full bg-[#FF0078] flex items-center justify-center mb-3">
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
      <div className="bg-[#FF0078]/10 border-y border-[#FF0078]/20 py-6">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-sm text-[#FF0078] font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> {t('social_verified')}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> {t('social_hiringProcess')}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> {t('social_skillMatch')}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> {t('social_free')}
          </span>
        </div>
      </div>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-14 text-center">
        <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl px-8 py-14 text-white shadow-lg shadow-violet-200">
          <h2 className="text-3xl font-extrabold mb-3 tracking-tight">
            {t('cta_title')}
          </h2>
          <p className="text-white/60 mb-8 text-base max-w-md mx-auto">
            {t('cta_subtitle')}
          </p>
          <Link href="/student/dashboard" onClick={() => setRole("student")}>
            <Button
              size="lg"
              className="bg-white text-[#FF0078] hover:bg-[#FF0078]/10 gap-2 font-bold px-8 text-base shadow-sm"
            >
              {t('cta_btn')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <div className="flex items-center justify-center gap-2">
          <img src="/Logo LINKER FINAL 3.png" alt="Linker" className="h-5 w-auto" />
          <span>{t('footer_tagline')}</span>
        </div>
      </footer>
    </div>
  );
}
