"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
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
      "5–7 активни огласи месечно",
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
      "10–12 активни огласи месечно",
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

      {/* CTA Footer */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16 text-center">
          <p className="text-sm sm:text-base text-gray-500 mb-6">
            Стоп за масовно аплицирање. Започни да се совпаѓаш.
          </p>
          <Link href="/auth?mode=signup">
            <Button
              size="lg"
              className="rounded-full bg-[#FF0078] hover:bg-[#d60065] text-white font-semibold px-10 shadow-md shadow-[#FF0078]/25"
            >
              Започни бесплатно
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
