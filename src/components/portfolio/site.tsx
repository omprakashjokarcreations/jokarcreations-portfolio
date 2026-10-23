import { useEffect, useState } from "react";
import { Menu, X, ArrowDown } from "lucide-react";

import gradientLogo from "@/assets/brand/jokar-logo-gradient.png.asset.json";
import whiteLogo from "@/assets/brand/jokar-logo-white.png.asset.json";
import { STATS } from "@/data/portfolio";

const NAV_LINKS: [string, string][] = [
  ["Work", "#work"],
  ["Websites", "#websites"],
  ["Marketing", "#marketing"],
  ["Stories", "#stories"],
  ["Contact", "#contact"],
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "glass shadow-lg shadow-black/40" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2" aria-label="JOKAR Creations home">
          <img src={whiteLogo.url} alt="JOKAR Creations" className="h-7 w-auto sm:h-9" />
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Start a Project
          </a>
        </nav>

        <button
          className="rounded-lg border border-border p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="glass border-t border-border px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              Start a Project
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

const MARQUEE_CLIENTS = [
  "Mithran Superstores",
  "Rafeeq Biriyani",
  "Infosky Technologies",
  "Neutral Solar",
  "Classiccart",
  "Saven Boutique",
  "Dumont",
  "Luxaria",
  "Shree Pharma",
  "Flourish",
  "Virtusa Chairs",
  "Florentek",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
      {/* ambient lighting */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-260px] h-[560px] w-[880px] -translate-x-1/2 rounded-full bg-glow/25 blur-[150px]" />
        <div className="absolute -left-40 top-64 h-[380px] w-[380px] rounded-full bg-magenta/15 blur-[130px]" />
        <div className="absolute -right-40 top-40 h-[380px] w-[380px] rounded-full bg-cyan/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <img
          src={gradientLogo.url}
          alt="JOKAR Creations"
          className="mx-auto w-[min(540px,82vw)] drop-shadow-[0_0_45px_rgba(139,92,246,0.35)]"
        />
        <h1 className="mt-8 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Design. <span className="text-gradient">Web.</span> Growth.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          JOKAR Creations is a full-service creative studio — brand identity, print,
          websites and digital campaigns that have reached millions.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#work"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Explore the Work <ArrowDown className="h-4 w-4" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Start a Project
          </a>
        </div>
      </div>

      {/* client marquee */}
      <div className="relative mt-16 overflow-hidden border-y border-border py-4">
        <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
          {[...MARQUEE_CLIENTS, ...MARQUEE_CLIENTS].map((name, i) => (
            <span key={i} className="flex items-center gap-10 text-sm font-medium tracking-wide text-muted-foreground">
              {name}
              <span className="text-gradient text-base">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STATS.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5 text-center">
            <div className="text-gradient text-3xl font-bold sm:text-4xl">{s.value}</div>
            <div className="mt-2 text-xs leading-snug text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
