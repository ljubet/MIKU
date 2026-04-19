"use client";

import Link from "next/link";
import { CheckCircle2, Zap } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "€0",
    period: "/месечно",
    tagline: "Идеално за мали компании",
    highlight: false,
    cta: "Започни бесплатно",
    ctaHref: "/auth/provider",
    features: [
      "2 активни огласи неделно",
      "Основна листа на кандидати",
      "Стандарден профил на компанија",
      "Пристап до апликации",
    ],
  },
  {
    name: "Basic",
    price: "119 ден",
    period: "/месечно",
    sub: "~€1.99",
    tagline: "За редовно огласување",
    highlight: false,
    cta: "Започни",
    ctaHref: "/auth/provider",
    features: [
      "Сè од Starter",
      "5–7 активни огласи неделно",
      "Основен кандидат pipeline",
      "Основен AI ranking",
      "Стандарден профил",
    ],
  },
  {
    name: "Growth",
    price: "239 ден",
    period: "/месечно",
    sub: "~€3.99",
    tagline: "Најдобар баланс за раст",
    highlight: true,
    cta: "Започни",
    ctaHref: "/auth/provider",
    features: [
      "Сè од Basic",
      "10–12 активни огласи неделно",
      "Напреден pipeline (applied → interview)",
      "Подобрен AI ranking и shortlist",
      "Приоритетна обработка на апликации",
    ],
  },
  {
    name: "Pro",
    price: "599 ден",
    period: "/месечно",
    sub: "~€9.99",
    tagline: "За максимален reach",
    highlight: false,
    cta: "Започни",
    ctaHref: "/auth/provider",
    features: [
      "Сè од Growth",
      "Неограничени огласи",
      "Advanced AI matching",
      "Featured visibility",
      "Напредна аналитика",
      "Приоритетна поддршка",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="text-center pt-20 pb-14 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
          Едноставен, транспарентен pricing
        </h1>
        <p className="text-gray-500 text-lg">
          Почни бесплатно и расти со платформата. Без обврски.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-3xl p-7 flex flex-col gap-5 ${
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

            {/* Tier name */}
            <div>
              <p className={`text-sm font-semibold uppercase tracking-widest mb-2 ${tier.highlight ? "text-white/70" : "text-gray-400"}`}>
                {tier.name}
              </p>
              <div className="flex items-end gap-1.5">
                <span className="text-4xl font-extrabold leading-none">{tier.price}</span>
                <span className={`text-sm mb-1 ${tier.highlight ? "text-white/70" : "text-gray-400"}`}>{tier.period}</span>
              </div>
              {tier.sub && (
                <p className={`text-xs mt-1 ${tier.highlight ? "text-white/60" : "text-gray-400"}`}>{tier.sub}</p>
              )}
              <p className={`text-sm mt-2 ${tier.highlight ? "text-white/80" : "text-gray-500"}`}>{tier.tagline}</p>
            </div>

            {/* Features */}
            <ul className="flex flex-col gap-2.5 flex-1">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlight ? "text-white" : "text-[#FF0078]"}`} />
                  <span className={tier.highlight ? "text-white/90" : "text-gray-700"}>{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={tier.ctaHref}
              className={`text-center text-sm font-bold py-3 rounded-xl transition-all ${
                tier.highlight
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-[#FF0078] text-white hover:bg-[#e0006b]"
              }`}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="text-center pb-16 text-sm text-gray-400">
        Сите цени се без ДДВ · <Link href="/auth/provider" className="text-[#FF0078] hover:underline font-medium">Контактирај нè за enterprise</Link>
      </div>
    </div>
  );
}
