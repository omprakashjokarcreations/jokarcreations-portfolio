/**
 * Motion foundation for the portfolio.
 *
 * - GSAP + ScrollTrigger drive scroll choreography (reveals, pinning, parallax).
 * - Lenis provides smooth scrolling on top of native scroll, synced to GSAP's ticker.
 * - Everything checks `prefers-reduced-motion` and degrades to static content.
 */
import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

let lenis: Lenis | null = null;

/** Freeze page scroll (menus, modals) — works with or without Lenis. */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

/** Smoothly scroll to an in-page anchor, e.g. "#work". */
export function scrollToHash(hash: string) {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
  else target.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Mount once at the page root. */
export function SmoothScroll() {
  useEffect(() => {
    // Keep ScrollTrigger positions correct as lazy images and filters change page height.
    let lastHeight = document.body.scrollHeight;
    let timer: number | undefined;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const h = document.body.scrollHeight;
        if (Math.abs(h - lastHeight) > 2) {
          lastHeight = h;
          ScrollTrigger.refresh();
          lastHeight = document.body.scrollHeight;
        }
      }, 180);
    });
    ro.observe(document.body);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      return () => {
        ro.disconnect();
        window.clearTimeout(timer);
      };
    }

    const instance = new Lenis({ lerp: 0.11, anchors: true, autoRaf: false });
    lenis = instance;
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, []);

  return null;
}

// ---------- Reveal: fade + rise as the element enters ----------

export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 48,
  stagger,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  /** When set, animates direct children in sequence instead of the wrapper. */
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const targets = stagger ? Array.from(el.children) : el;
        gsap.from(targets, {
          y,
          autoAlpha: 0,
          duration: 1.2,
          ease: "expo.out",
          delay,
          stagger: stagger ?? 0,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

// ---------- SplitHeading: masked line-by-line rise ----------

export function SplitHeading({
  children,
  as: Tag = "h2",
  className,
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "split-line",
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.09,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          },
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}

// ---------- CountUp: numeric stats roll up on enter ----------

const NUMBER_RE = /^(\D*)([\d.,]+)(.*)$/;

export function CountUp({
  value,
  className,
  suffixClassName,
}: {
  value: string;
  className?: string;
  suffixClassName?: string;
}) {
  const numRef = useRef<HTMLSpanElement>(null);
  const match = NUMBER_RE.exec(value);

  useGSAP(() => {
    const el = numRef.current;
    if (!el || !match) return;
    const raw = match[2] ?? "0";
    const target = parseFloat(raw.replace(/,/g, ""));
    const decimals = raw.includes(".") ? (raw.split(".")[1]?.length ?? 0) : 0;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const counter = { v: 0 };
      el.textContent = (0).toFixed(decimals);
      gsap.to(counter, {
        v: target,
        duration: 2,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: () => {
          el.textContent = counter.v.toFixed(decimals);
        },
      });
      return () => {
        el.textContent = raw;
      };
    });
  });

  if (!match) return <span className={className}>{value}</span>;

  return (
    <span className={className}>
      <span className="sr-only">{value}</span>
      <span aria-hidden>{match[1]}</span>
      <span ref={numRef} aria-hidden className="tabular-nums">
        {match[2]}
      </span>
      {match[3] && (
        <span aria-hidden className={suffixClassName}>
          {match[3]}
        </span>
      )}
    </span>
  );
}
