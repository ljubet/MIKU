"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { useLang } from "@/lib/language-context";
import { useLandingScrollAnimations } from "@/lib/useLandingScrollAnimations";
import { AnimatedVisualPlaceholder } from "@/components/shared/AnimatedVisualPlaceholder";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Building2,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Zap,
} from "lucide-react";

const pricingTiers = [
  {
    name: "Starter",
    price: "€0",
    period: "/месечно",
    tagline: "За мали компании",
    highlight: false,
    cta: "Започни бесплатно",
    ctaHref: "/auth/provider",
    features: ["2 активни огласи месечно", "Основна листа на кандидати", "Стандарден профил на компанија", "Пристап до апликации"],
  },
  {
    name: "Basic",
    price: "119 ден",
    period: "/мес",
    sub: "~€1.99",
    tagline: "За редовно огласување",
    highlight: false,
    cta: "Започни",
    ctaHref: "/auth/provider",
    features: ["Сè од Starter", "5–7 активни огласи месечно", "Основен кандидат pipeline", "Основен AI ranking"],
  },
  {
    name: "Growth",
    price: "239 ден",
    period: "/мес",
    sub: "~€3.99",
    tagline: "Најдобар баланс за раст",
    highlight: true,
    cta: "Започни",
    ctaHref: "/auth/provider",
    features: ["Сè од Basic", "10–12 активни огласи месечно", "Напреден pipeline (applied → interview)", "Подобрен AI ranking и shortlist", "Приоритетна обработка"],
  },
  {
    name: "Pro",
    price: "599 ден",
    period: "/мес",
    sub: "~€9.99",
    tagline: "За максимален reach",
    highlight: false,
    cta: "Започни",
    ctaHref: "/auth/provider",
    features: ["Сè од Growth", "Неограничени огласи", "Advanced AI matching", "Featured visibility", "Напредна аналитика", "Приоритетна поддршка"],
  },
];

export default function LandingPage() {
  const { setRole } = useApp();
  const { t } = useLang();
  const rootRef = useRef<HTMLDivElement>(null);

  useLandingScrollAnimations(rootRef);

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
    <div ref={rootRef} className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img src="/Logo LINKER FINAL 3.png" alt="Linker" className="h-8 w-auto" />
          <div className="flex items-center gap-2 sm:gap-3">
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
      <section data-anim="hero" className="relative max-w-4xl mx-auto px-6 pt-14 pb-8 text-center overflow-hidden">
        <AnimatedVisualPlaceholder
          id="hero"
          className="hidden md:block absolute -top-10 left-1/2 -translate-x-1/2 w-56 h-56 bg-[#FF0078]/15"
        />
        <h1 data-anim="hero-item" className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.15] mb-5 tracking-tight">
          <span className="whitespace-nowrap">
            {t('landing_headline_1')}{' '}
            <span className="line-through text-gray-300">{t('landing_headline_strike')}</span>
          </span>
          <br />
          {t('landing_headline_2')}
        </h1>

        <p data-anim="hero-item" className="text-sm font-semibold uppercase tracking-wide text-[#FF0078] mb-3">
          {t('landing_tagline')}
        </p>

        <p data-anim="hero-item" className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('landing_subheadline')}
        </p>

        <div data-anim="hero-item" className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/auth/candidate">
            <Button
              size="lg"
              className="bg-[#FF0078] hover:bg-[#d60065] gap-2 px-8 font-semibold text-base"
            >
              {t('landing_browseBtn')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/auth/provider">
            <Button size="lg" variant="outline" className="gap-2 px-8 font-medium text-base">
              <Building2 className="w-4 h-4" />
              {t('landing_postBtn')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <div data-anim="stats" className="border-y border-gray-100 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
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
      <section data-anim="features" className="relative max-w-4xl mx-auto px-6 py-14 overflow-hidden">
        <AnimatedVisualPlaceholder
          id="features"
          className="hidden md:block absolute -right-12 top-6 w-40 h-40 bg-[#FF0078]/10"
        />
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
      <section data-anim="steps" className="relative bg-gray-50 border-y border-gray-100 py-14 overflow-hidden">
        <AnimatedVisualPlaceholder
          id="steps"
          className="hidden md:block absolute -left-10 top-10 w-44 h-44 bg-[#FF0078]/10"
        />
        <div className="max-w-4xl mx-auto px-6">
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
      <section data-anim="pricing" className="relative max-w-6xl mx-auto px-6 py-16 overflow-hidden">
        <AnimatedVisualPlaceholder
          id="pricing"
          className="hidden md:block absolute right-6 -bottom-10 w-52 h-52 bg-[#FF0078]/10"
        />
        <div className="text-center mb-12">
          <h2 className="text-3xl font-medium text-gray-900 tracking-tight mb-3">
            Едноставен, транспарентен pricing{" "}
            <span className="underline decoration-[#FF0078] underline-offset-4">за компании</span>
          </h2>
          <p className="text-gray-500 text-base">Почни бесплатно и расти со платформата. Без обврски.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              data-anim="pricing-card"
              className={`relative rounded-3xl p-6 flex flex-col gap-5 ${
                tier.highlight
                  ? "bg-[#FF0078] text-white shadow-2xl shadow-[#FF0078]/30 scale-[1.03]"
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Популарно
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

      {/* CTA */}
      <section data-anim="cta" className="relative max-w-6xl mx-auto px-6 py-14 overflow-hidden">
        <AnimatedVisualPlaceholder
          id="cta"
          className="hidden md:block absolute -right-6 -top-6 w-44 h-44 bg-[#FF0078]/15"
        />
        <div className="bg-[#FFF0F6] rounded-[36px] px-8 py-12 lg:px-14 lg:py-16 shadow-[0_24px_60px_rgba(255,0,120,0.15)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#FF0078] mb-5">
                {t('cta_title')}
              </h2>
              <p className="text-lg text-[#9E4A74] mb-10 max-w-xl">
                {t('cta_subtitle')}
              </p>
              <Link href="/auth/candidate">
                <Button
                  size="lg"
                  className="bg-[#FF0078] hover:bg-[#d60065] text-white gap-2 font-semibold px-8 text-base rounded-2xl shadow-md shadow-[#FF0078]/30"
                >
                  {t('cta_btn')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-[280px] sm:h-[320px]">
              <div className="absolute right-0 top-2 h-48 w-64 rounded-3xl bg-white shadow-[0_20px_50px_rgba(255,0,120,0.18)] border border-white/60" />
              <div className="absolute right-10 top-16 h-36 w-56 rounded-3xl bg-gradient-to-br from-[#FF4DA3] to-[#FF0078] shadow-[0_20px_50px_rgba(255,0,120,0.35)]" />
              <div className="absolute left-0 bottom-0 h-28 w-[70%] rounded-3xl bg-white shadow-[0_20px_50px_rgba(255,0,120,0.18)] border border-white/60" />
              <div className="absolute left-6 bottom-8 h-6 w-1.5 rounded-full bg-[#FF0078]" />
              <div className="absolute left-10 bottom-10 text-xs font-semibold text-[#8B2A5C]">
                Linker match
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section data-anim="footer-cta" className="relative bg-gray-50 border-t border-gray-100 overflow-hidden">
        <AnimatedVisualPlaceholder
          id="footer"
          className="hidden md:block absolute left-1/2 -translate-x-1/2 -top-14 w-64 h-64 bg-[#FF0078]/10"
        />
        <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16 text-center">
          <p className="text-sm sm:text-base text-gray-500 mb-6">{t('footer_cta_tagline')}</p>
          <Link href="/auth?mode=signup">
            <Button
              size="lg"
              className="rounded-full bg-[#FF0078] hover:bg-[#d60065] text-white font-semibold px-10 shadow-md shadow-[#FF0078]/25"
            >
              {t('landing_getStarted')}
            </Button>
          </Link>
        </div>
        <div className="border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
