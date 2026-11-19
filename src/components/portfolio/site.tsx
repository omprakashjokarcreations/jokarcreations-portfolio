import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";

import { CLIENT_LOGOS } from "@/data/client-logos";
import { STATS, m } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { CountUp, MOTION_OK, Reveal, gsap, lockScroll, scrollToHash, useGSAP } from "./motion";
import { CtaLink, SHELL } from "./ui-bits";

const whiteLogo = "/brand/jokar-logo-white.png";
export const CONTACT_EMAIL = "admin@jokarcreations.com";

export const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Websites", href: "#websites" },
  { label: "Results", href: "#marketing" },
  { label: "Stories", href: "#stories" },
];

// ======================================================================
// Navigation
// ======================================================================

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ids) {
      const el = document.querySelector(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const SECTION_IDS = [...NAV_LINKS.map((l) => l.href), "#contact"];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = useActiveSection(SECTION_IDS);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 400 && y > prev + 2 && !open);
    if (y < prev - 2) setHidden(false);
  });

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // Wait for the menu to release the scroll lock before travelling.
    window.setTimeout(() => scrollToHash(href), open ? 350 : 0);
  };

  const pillTarget = hovered ?? active;

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out-expo",
          hidden && "-translate-y-full",
        )}
      >
        <div className={cn(SHELL, "flex h-20 items-center justify-between gap-4")}>
          <a
            href="#top"
            onClick={go("#top")}
            className="relative z-10 shrink-0"
            aria-label="JOKAR Creations — back to top"
          >
            <img
              src={whiteLogo}
              alt="JOKAR Creations"
              className="h-8 w-auto sm:h-9"
              width={140}
              height={36}
            />
          </a>

          <nav
            aria-label="Primary"
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "hidden items-center gap-1 rounded-full border p-1 transition-colors duration-500 lg:flex",
              scrolled ? "border-border bg-background/70 backdrop-blur-xl" : "border-transparent",
            )}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={go(link.href)}
                onMouseEnter={() => setHovered(link.href)}
                aria-current={active === link.href ? "true" : undefined}
                className={cn(
                  "relative isolate rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  pillTarget === link.href
                    ? "text-background"
                    : "text-foreground/75 hover:text-foreground",
                )}
              >
                {pillTarget === link.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <CtaLink href="#contact" className="hidden h-11 sm:inline-flex">
              Start a project
            </CtaLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative z-10 flex h-11 items-center gap-3 rounded-full border border-foreground/20 bg-background/60 px-4 text-sm font-semibold backdrop-blur-xl lg:hidden"
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span aria-hidden className="relative block h-2.5 w-5">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-[1.5px] w-full bg-foreground transition-transform duration-500",
                    open && "translate-y-[4.5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[1.5px] w-full bg-foreground transition-transform duration-500",
                    open && "-translate-y-[4.5px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-background pt-24 lg:hidden"
          >
            <nav
              aria-label="Mobile"
              className={cn(SHELL, "flex flex-1 flex-col justify-center gap-1")}
            >
              {[...NAV_LINKS, { label: "Contact", href: "#contact" }].map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={go(link.href)}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-baseline gap-4 border-b border-border py-3"
                >
                  <span className="text-[clamp(2.4rem,11vw,4.5rem)] font-bold leading-none tracking-[-0.025em] transition-colors group-hover:text-magenta">
                    {link.label}
                  </span>
                </motion.a>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={cn(
                SHELL,
                "flex flex-wrap items-center justify-between gap-4 pb-10 pt-6 text-sm text-muted-foreground",
              )}
            >
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-foreground underline-offset-4 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              <span>Branding · Web · Marketing</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ======================================================================
// Hero — "The Ink Line"
// ======================================================================

interface CollagePiece {
  src: string;
  alt: string;
  caption: string;
  /** Wrapper position + size (mobile first, then desktop). */
  place: string;
  tilt: string;
  aspect: string;
  /** Scroll parallax strength. */
  speed: number;
  /** Pointer drift depth. */
  depth: number;
}

const COLLAGE: CollagePiece[] = [
  {
    src: m("dumont/poster-1.jpg"),
    alt: "Biscoff Brownie poster designed for Dumont Creamery",
    caption: "Dumont — Poster",
    place: "left-[2%] top-[6%] w-[36%] lg:left-[8%] lg:top-[4%] lg:w-[34%]",
    tilt: "-rotate-6",
    aspect: "aspect-[4/5]",
    speed: 28,
    depth: 18,
  },
  {
    src: m("rafeeq/brand-identity-rgb.jpg"),
    alt: "Rafeeq Biriyani brand identity — gold calligraphic logo on purple",
    caption: "Rafeeq — Identity",
    place: "right-[3%] top-[0%] w-[32%] lg:right-[4%] lg:top-[12%] lg:w-[31%]",
    tilt: "rotate-[5deg]",
    aspect: "aspect-square",
    speed: 60,
    depth: 34,
  },
  {
    src: m("infosky/poster-01.jpg"),
    alt: "Infosky Technologies home-automation campaign poster",
    caption: "Infosky — Campaign",
    place: "left-[34%] top-[44%] w-[30%] lg:left-[30%] lg:top-[52%] lg:w-[28%]",
    tilt: "rotate-[3deg]",
    aspect: "aspect-square",
    speed: 14,
    depth: 10,
  },
  {
    src: m("neutral-solar/brochure-01.jpg"),
    alt: "Neutral Solar company profile brochure cover",
    caption: "Neutral Solar — Brochure",
    place: "right-[6%] top-[52%] w-[24%] lg:right-[10%] lg:top-[58%] lg:w-[22%]",
    tilt: "-rotate-3",
    aspect: "aspect-[7/10]",
    speed: 44,
    depth: 26,
  },
];

/** The ink stroke — a single cursive line echoing the pen in the JOKAR mark. */
function InkLine() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      fill="none"
    >
      <defs>
        <linearGradient id="ink" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--magenta)" />
          <stop offset="50%" stopColor="var(--glow)" />
          <stop offset="100%" stopColor="var(--cyan)" />
        </linearGradient>
      </defs>
      <path
        className="hero-ink"
        pathLength={1}
        strokeDasharray="1"
        stroke="url(#ink)"
        strokeWidth={2.5}
        strokeLinecap="round"
        d="M -60 700 C 140 640, 300 760, 470 670 S 700 430, 610 380 S 420 470, 560 560 S 880 690, 1040 520 S 1220 200, 1330 150"
      />
      <circle className="hero-nib" cx="1330" cy="150" r="7" fill="var(--magenta)" />
    </svg>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ motion: MOTION_OK, reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        gsap.set("[data-hero-reveal]", { visibility: "visible" });
        if (!ctx.conditions?.["motion"]) return;

        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(".hero-word", { yPercent: 115, duration: 1.6, stagger: 0.12 }, 0.1)
          .from(".hero-ink", { strokeDashoffset: 1, duration: 2.6, ease: "power2.inOut" }, 0.2)
          .from(
            ".hero-nib",
            { scale: 0, transformOrigin: "50% 50%", duration: 0.8, ease: "back.out(3)" },
            2.5,
          )
          .from(
            ".hero-card",
            { y: 160, autoAlpha: 0, rotate: 0, duration: 1.8, stagger: 0.1 },
            0.35,
          )
          .from(".hero-meta", { y: 24, autoAlpha: 0, duration: 1.1, stagger: 0.07 }, 0.8);

        // Scroll parallax: cards drift at different speeds, headline sinks slightly.
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.utils.toArray<HTMLElement>(".hero-float").forEach((el) => {
          gsap.to(el, {
            yPercent: -Number(el.dataset["speed"] ?? 20),
            ease: "none",
            scrollTrigger: st,
          });
        });
        gsap.to(".hero-headline", { yPercent: 14, ease: "none", scrollTrigger: st });

        // Pointer drift on precise pointers only.
        if (!window.matchMedia("(pointer: fine)").matches) return;
        const movers = gsap.utils.toArray<HTMLElement>(".hero-drift").map((el) => ({
          depth: Number(el.dataset["depth"] ?? 10),
          x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
        }));
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          for (const mv of movers) {
            mv.x(nx * mv.depth * 2);
            mv.y(ny * mv.depth * 2);
          }
        };
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pb-10 pt-28 sm:pt-32"
    >
      <div data-hero-reveal>
        <InkLine />
      </div>

      <div className={cn(SHELL, "relative flex flex-1 flex-col")} data-hero-reveal>
        <div className="relative mt-4 flex-1 lg:mt-6">
          <h1 className="hero-headline relative z-10 font-bold display-tight text-[clamp(3.6rem,13vw,11.5rem)]">
            <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span className="hero-word block">Design.</span>
            </span>
            <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em] pl-[14vw] lg:pl-[10vw]">
              <span className="hero-word block text-magenta">Web.</span>
            </span>
            <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
              <span className="hero-word block">Growth.</span>
            </span>
            <span className="sr-only"> JOKAR Creations, a full-service creative studio.</span>
          </h1>

          {/* Floating collage of real client work */}
          <div className="relative mt-8 h-[78vw] max-h-[520px] lg:absolute lg:inset-y-[-4%] lg:right-[-2%] lg:mt-0 lg:h-auto lg:max-h-none lg:w-[54%]">
            {COLLAGE.map((piece, i) => (
              <div
                key={piece.src}
                className={cn("hero-float absolute", piece.place)}
                data-speed={piece.speed}
              >
                <div className="hero-drift" data-depth={piece.depth}>
                  <figure className={cn("hero-card group relative", piece.tilt)}>
                    <div
                      className={cn(
                        "overflow-hidden rounded-xl shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] ring-1 ring-white/10 sm:rounded-2xl",
                        piece.aspect,
                      )}
                    >
                      <img
                        src={piece.src}
                        alt={piece.alt}
                        loading={i < 2 ? "eager" : "lazy"}
                        fetchPriority={i === 0 ? "high" : undefined}
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                      />
                    </div>
                  </figure>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-10 grid items-end gap-8 lg:mt-0 lg:grid-cols-12">
          <p className="hero-meta max-w-md text-base leading-relaxed text-foreground/80 sm:text-lg lg:col-span-5">
            JOKAR Creations is a full-service creative studio. Brand identity, print, websites and
            digital campaigns, all under one roof.
          </p>
          <div className="hero-meta flex flex-wrap gap-3 lg:col-span-4">
            <CtaLink href="#work">See the work</CtaLink>
            <CtaLink href="#contact" variant="outline">
              Start a project
            </CtaLink>
          </div>
          <div className="hero-meta hidden items-end justify-end gap-5 lg:col-span-3 lg:flex">
            <div className="text-right">
              <div className="text-4xl font-bold tracking-tight">1M+</div>
              <div className="mt-1 text-xs leading-snug text-muted-foreground">
                accounts reached in 30 days
                <br />
                for Mithran Superstores
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ======================================================================
// Client marquee
// ======================================================================

function LogoRow({ reverse = false, logos }: { reverse?: boolean; logos: typeof CLIENT_LOGOS }) {
  return (
    <div className="mask-fade-x overflow-hidden">
      <div
        className={cn(
          "flex w-max items-center gap-4",
          reverse ? "marquee-track-reverse" : "marquee-track",
        )}
      >
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            aria-hidden={i >= logos.length}
            className="logo-tile flex h-20 w-40 shrink-0 items-center justify-center rounded-2xl px-4 grayscale-[35%] transition duration-500 hover:grayscale-0 sm:h-24 sm:w-48"
          >
            <img
              src={logo.src}
              alt={i < logos.length ? logo.name : ""}
              loading="lazy"
              decoding="async"
              className="h-auto max-h-14 w-auto max-w-[130px] object-contain sm:max-h-16 sm:max-w-[150px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClientMarquee() {
  const half = Math.ceil(CLIENT_LOGOS.length / 2);
  return (
    <section
      aria-label="Clients"
      className="marquee-group relative border-y border-border py-12 sm:py-16"
    >
      <div className={cn(SHELL, "mb-8 flex flex-wrap items-end justify-between gap-3")}>
        <h2 className="text-lg font-semibold sm:text-xl">Brands we&rsquo;ve worked with</h2>
        <p className="text-sm text-muted-foreground">
          {CLIENT_LOGOS.length}+ clients, from local favourites to national names
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <LogoRow logos={CLIENT_LOGOS.slice(0, half)} />
        <LogoRow logos={CLIENT_LOGOS.slice(half)} reverse />
      </div>
    </section>
  );
}

// ======================================================================
// Studio manifesto + stats
// ======================================================================

export function StatsBand() {
  return (
    <section
      id="studio"
      aria-labelledby="studio-title"
      className="relative scroll-mt-24 py-24 sm:py-36"
    >
      <div className={SHELL}>
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <h2
              id="studio-title"
              className="text-[clamp(2.2rem,4.5vw,3.75rem)] font-semibold leading-[1.1] tracking-[-0.02em]"
            >
              One studio for your whole brand.
            </h2>
          </Reveal>
          <Reveal
            className="flex flex-col gap-5 text-base leading-relaxed text-muted-foreground sm:text-lg lg:col-span-5 lg:col-start-8"
            stagger={0.1}
          >
            <p>
              From the logo on your visiting card and the menu on the table to the website in your
              customer&rsquo;s pocket, we design every touchpoint so it all looks and sounds like
              one brand.
            </p>
            <p>
              When it&rsquo;s time to grow, we run the campaigns too. One of them reached over a
              million Instagram accounts in a single month.
            </p>
          </Reveal>
        </div>

        <dl className="mt-20 grid grid-cols-2 border-l border-t border-border sm:mt-28 md:grid-cols-3 lg:grid-cols-6">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "group relative flex flex-col justify-between gap-10 border-b border-r border-border p-5 transition-colors duration-500 hover:bg-card sm:p-7",
                i === 0 && "md:col-span-1",
              )}
            >
              <dt className="order-2 text-xs leading-snug text-muted-foreground sm:text-sm">
                {s.label}
              </dt>
              <dd className="order-1 text-[clamp(2.6rem,6vw,4.5rem)] font-bold leading-none tracking-[-0.025em]">
                <CountUp value={s.value} />
              </dd>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-magenta transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
              />
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
