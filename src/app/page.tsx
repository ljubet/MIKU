"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { useLang } from "@/lib/language-context";
import { LANGUAGES } from "@/lib/translations";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Building2,
  Sparkles,
  CheckCircle2,
  Plus,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const { setRole } = useApp();
  const { t, lang, setLang } = useLang();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billing, setBilling] = useState<"weekly" | "yearly">("weekly");
  const pricingTiers = [
    {
      name: t("pricing_tier_starter_name"),
      price: "€0",
      period: t("pricing_period_month"),
      tagline: t("pricing_tier_starter_tagline"),
      highlight: false,
      cta: t("pricing_cta_start_free"),
      ctaHref: "/auth/provider",
      billing: "weekly" as const,
      features: [
        t("pricing_feature_starter_1"),
        t("pricing_feature_starter_2"),
        t("pricing_feature_starter_3"),
        t("pricing_feature_starter_4"),
      ],
    },
    {
      name: t("pricing_tier_basic_name"),
      price: "119 ден",
      period: t("pricing_period_month_short"),
      sub: "~€1.99",
      tagline: t("pricing_tier_basic_tagline"),
      highlight: false,
      cta: t("pricing_cta_start"),
      ctaHref: "/auth/provider",
      billing: "weekly" as const,
      features: [
        t("pricing_feature_basic_1"),
        t("pricing_feature_basic_2"),
        t("pricing_feature_basic_3"),
        t("pricing_feature_basic_4"),
      ],
    },
    {
      name: t("pricing_tier_growth_name"),
      price: "239 ден",
      period: t("pricing_period_month_short"),
      sub: "~€3.99",
      tagline: t("pricing_tier_growth_tagline"),
      highlight: true,
      cta: t("pricing_cta_start"),
      ctaHref: "/auth/provider",
      billing: "weekly" as const,
      features: [
        t("pricing_feature_growth_1"),
        t("pricing_feature_growth_2"),
        t("pricing_feature_growth_3"),
        t("pricing_feature_growth_4"),
        t("pricing_feature_growth_5"),
      ],
    },
    {
      name: t("pricing_tier_pro_name"),
      price: "599 ден",
      period: t("pricing_period_month_short"),
      sub: "~€9.99",
      tagline: t("pricing_tier_pro_tagline"),
      highlight: false,
      cta: t("pricing_cta_start"),
      ctaHref: "/auth/provider",
      billing: "weekly" as const,
      features: [
        t("pricing_feature_pro_1"),
        t("pricing_feature_pro_2"),
        t("pricing_feature_pro_3"),
        t("pricing_feature_pro_4"),
        t("pricing_feature_pro_5"),
        t("pricing_feature_pro_6"),
      ],
    },
    {
      name: t("pricing_tier_yearly_name"),
      price: "3068 ден",
      period: t("pricing_period_year"),
      sub: t("pricing_save_label"),
      tagline: t("pricing_tier_yearly_tagline"),
      highlight: false,
      cta: t("pricing_cta_start"),
      ctaHref: "/auth/provider",
      billing: "yearly" as const,
      features: [
        t("pricing_feature_growth_1"),
        t("pricing_feature_growth_2"),
        t("pricing_feature_growth_3"),
        t("pricing_feature_growth_4"),
        t("pricing_feature_growth_5"),
      ],
    },
  ];
  const displayedTiers = pricingTiers.filter((tier) => tier.billing === billing);

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
            <select
              value={lang}
              onChange={(event) => setLang(event.target.value as typeof lang)}
              aria-label="Select language"
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-[#FF0078]/40 hover:text-[#FF0078] focus:outline-none focus:ring-2 focus:ring-[#FF0078]/30 focus:border-[#FF0078]/50 sm:text-sm"
            >
              {LANGUAGES.map(({ code, label, flag }) => (
                <option key={code} value={code}>
                  {flag} {label}
                </option>
              ))}
            </select>
            <Link href="/auth?mode=signin" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-gray-500 font-medium">
                {t('landing_login')}
              </Button>
            </Link>
            <Link href="/auth?mode=signup">
              <Button size="sm" className="bg-[#FF0078] hover:bg-[#d60065] font-semibold">
                {t('landing_getStarted')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        data-anim="hero"
        className="relative mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 text-center overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.92) 55%, rgba(255,255,255,1) 100%), url('/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-4xl mx-auto">
        <h1 data-anim="hero-item" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.15] mb-5 tracking-tight max-w-4xl mx-auto">
          {t('landing_headline_1')}{' '}
          {t('landing_headline_strike')}{' '}
          {t('landing_headline_2')}
        </h1>

        <p data-anim="hero-item" className="text-sm font-semibold uppercase tracking-wide text-[#FF0078] mb-3">
          {t('landing_tagline')}
        </p>

        <p data-anim="hero-item" className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('landing_subheadline')}
        </p>

        <div data-anim="hero-item" className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link href="/auth/candidate">
            <Button
              size="lg"
              className="bg-[#FF0078] hover:bg-[#d60065] gap-2 px-8 font-semibold text-base w-full sm:w-auto"
            >
              {t('landing_browseBtn')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/auth/provider">
            <Button size="lg" variant="outline" className="gap-2 px-8 font-medium text-base w-full sm:w-auto">
              <Building2 className="w-4 h-4" />
              {t('landing_postBtn')}
            </Button>
          </Link>
        </div>
        </div>
      </section>

      {/* Stats bar */}
      <div data-anim="stats" className="border-y border-gray-100 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} data-anim="stat" className="text-center">
                <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</p>
                <p className="text-sm text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <section data-anim="features" className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-14 overflow-hidden">
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
              data-anim="feature-card"
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
      <section data-anim="steps" className="relative bg-gray-50 border-y border-gray-100 py-12 sm:py-14 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              {t('howItWorks_title')}
            </h2>
            <p className="text-gray-500 text-base">{t('howItWorks_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative">
            {steps.map(({ step, title, desc }, i) => (
              <div key={step} data-anim="step-card" className="relative">
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

      {/* Pricing */}
      <section data-anim="pricing" className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16 overflow-hidden">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-medium text-gray-900 tracking-tight mb-3">
            {t("pricing_title")}{" "}
            <span className="underline decoration-[#FF0078] underline-offset-4">{t("pricing_title_companies")}</span>
          </h2>
          <p className="text-gray-500 text-base">{t("pricing_subtitle")}</p>
        </div>
        <div className="flex justify-center sm:justify-end mb-6">
          <div className="inline-flex rounded-full border border-gray-200 bg-white p-1 text-xs font-semibold text-gray-500">
            <button
              type="button"
              onClick={() => setBilling("weekly")}
              className={`px-3 py-1 rounded-full transition ${billing === "weekly" ? "bg-[#FF0078] text-white" : "hover:text-gray-700"}`}
            >
              {t("pricing_toggle_weekly")}
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={`px-3 py-1 rounded-full transition ${billing === "yearly" ? "bg-[#FF0078] text-white" : "hover:text-gray-700"}`}
            >
              {t("pricing_toggle_yearly")}
            </button>
          </div>
        </div>
        <div
          className={`grid gap-5 items-start ${billing === "yearly" ? "grid-cols-1 max-w-md mx-auto" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}
        >
          {displayedTiers.map((tier) => (
            <div
              key={tier.name}
              data-anim="pricing-card"
              className={`relative rounded-3xl p-6 flex flex-col gap-5 ${
                tier.highlight
                  ? "bg-[#FF0078] text-white lg:shadow-2xl lg:shadow-[#FF0078]/30 lg:scale-[1.03]"
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {t("pricing_badge_popular")}
                  </span>
                </div>
              )}
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${tier.highlight ? "text-white/70" : "text-gray-400"}`}>{tier.name}</p>
                <div className="flex items-end gap-1.5">
                  <span className="text-3xl font-extrabold leading-none">{tier.price}</span>
                  <span className={`text-xs mb-1 ${tier.highlight ? "text-white/70" : "text-gray-400"}`}>{tier.period}</span>
                </div>
                {"sub" in tier && <p className={`text-xs mt-0.5 ${tier.highlight ? "text-white/60" : "text-gray-400"}`}>{tier.sub}</p>}
                <p className={`text-sm mt-1.5 ${tier.highlight ? "text-white/80" : "text-gray-500"}`}>{tier.tagline}</p>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlight ? "text-white" : "text-[#FF0078]"}`} />
                    <span className={tier.highlight ? "text-white/90" : "text-gray-700"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.ctaHref}
                className={`text-center text-sm font-bold py-2.5 rounded-xl transition-all ${
                  tier.highlight ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-[#FF0078] text-white hover:bg-[#e0006b]"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#FFE9F1] border-y border-[#FF0078]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-10">
            {t('faq_title')}
          </h2>
          <div className="space-y-4">
            {[
              { q: t('faq_q1'), a: t('faq_a1') },
              { q: t('faq_q2'), a: t('faq_a2') },
              { q: t('faq_q3'), a: t('faq_a3') },
              { q: t('faq_q4'), a: t('faq_a4') },
            ].map(({ q, a }, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={q}
                  className="rounded-2xl border border-[#FF0078]/10 bg-white/70 backdrop-blur-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-semibold text-gray-900">{q}</span>
                    <Plus
                      className={`w-5 h-5 text-[#FF0078] transition-transform ${isOpen ? "rotate-45" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-gray-600 max-w-2xl">
                      {a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section data-anim="footer-cta" className="relative bg-gray-50 border-t border-gray-100 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <p className="text-sm sm:text-base text-gray-500 mb-6">{t('footer_cta_tagline')}</p>
          <Link href="/auth?mode=signup">
            <Button
              size="lg"
              className="rounded-full bg-[#FF0078] hover:bg-[#d60065] text-white font-semibold px-10 shadow-md shadow-[#FF0078]/25 w-full sm:w-auto"
            >
              {t('landing_getStarted')}
            </Button>
          </Link>
        </div>
        <div className="border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <img src="/Logo LINKER FINAL 3.png" alt="Linker" className="h-5 w-auto" />
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" aria-label="X" className="hover:text-gray-700 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                  <path
                    d="M4 4h4.9l4.1 5.5L17.6 4H20l-6 7.3L20.6 20H16l-4.4-6-4.6 6H4.6l6.6-8L4 4z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-gray-700 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                  <path
                    d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7zm5 3.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5zm4.25-3.75a.75.75 0 1 1-.75.75.75.75 0 0 1 .75-.75z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-gray-700 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                  <path
                    d="M6.5 9H4v11h2.5V9zm.2-3.2A1.6 1.6 0 1 1 5.1 4.2a1.6 1.6 0 0 1 1.6 1.6zM20 14.2V20h-2.5v-5.1c0-1.3-.5-2.1-1.7-2.1-1 0-1.5.7-1.7 1.3-.1.2-.1.5-.1.8V20H11.5s.1-10 0-11h2.5v1.6c.3-.5 1.1-1.7 2.8-1.7 2 0 3.2 1.4 3.2 3.3z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
