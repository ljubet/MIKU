"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useLandingScrollAnimations(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set("[data-anim]", { clearProps: "all" });
        return;
      }

      const heroItems = gsap.utils.toArray<HTMLElement>("[data-anim='hero-item']");
      const stats = gsap.utils.toArray<HTMLElement>("[data-anim='stat']");
      const featureCards = gsap.utils.toArray<HTMLElement>("[data-anim='feature-card']");
      const stepCards = gsap.utils.toArray<HTMLElement>("[data-anim='step-card']");
      const pricingCards = gsap.utils.toArray<HTMLElement>("[data-anim='pricing-card']");
      const visuals = gsap.utils.toArray<HTMLElement>("[data-visual]");

      gsap.from(heroItems, {
        y: 28,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.to("[data-anim='hero']", {
        y: -30,
        opacity: 0.98,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-anim='hero']",
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      gsap.from(stats, {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-anim='stats']",
          start: "top 80%",
        },
      });

      gsap.from(featureCards, {
        y: 36,
        opacity: 0,
        scale: 0.98,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-anim='features']",
          start: "top 75%",
        },
      });

      gsap.from(stepCards, {
        y: 28,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-anim='steps']",
          start: "top 78%",
        },
      });

      gsap.to(stepCards, {
        y: -12,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-anim='steps']",
          start: "top 80%",
          end: "bottom 30%",
          scrub: 0.6,
        },
      });

      pricingCards.forEach((card, index) => {
        gsap.from(card, {
          y: 30 + index * 6,
          opacity: 0,
          scale: 0.98,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-anim='pricing']",
            start: "top 78%",
          },
        });
      });

      gsap.to(pricingCards, {
        y: (i) => (i % 2 === 0 ? -12 : 12),
        ease: "none",
        scrollTrigger: {
          trigger: "[data-anim='pricing']",
          start: "top 70%",
          end: "bottom 20%",
          scrub: 0.7,
        },
      });

      gsap.from("[data-anim='cta']", {
        y: 30,
        opacity: 0,
        scale: 0.98,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-anim='cta']",
          start: "top 75%",
        },
      });

      gsap.from("[data-anim='footer-cta']", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-anim='footer-cta']",
          start: "top 85%",
        },
      });

      gsap.to(visuals, {
        y: (i) => (i % 2 === 0 ? -30 : 24),
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-anim='hero']",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });
    }, rootRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [rootRef]);
}
