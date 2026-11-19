import { useId, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, Globe, Instagram, Mail } from "lucide-react";

import { CAMPAIGNS, STORIES, WEB_PROJECTS, m } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { CountUp, MOTION_OK, Reveal, SplitHeading, gsap, scrollToHash, useGSAP } from "./motion";
import { CONTACT_EMAIL, NAV_LINKS } from "./site";
import { CtaLink, SHELL } from "./ui-bits";

const whiteLogo = "/brand/jokar-logo-white.png";
const MAIN_SITE = "https://www.jokarcreations.com/";

const SERVICES = [
  "Branding & Graphic Design",
  "Website Development",
  "Digital Marketing",
  "All-in-One",
];

// ======================================================================
// Websites — pinned horizontal gallery on desktop, swipeable on touch
// ======================================================================

export function WebsitesSection() {
  const section = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(1);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        const w = wrap.current;
        const t = track.current;
        if (!w || !t) return;
        w.classList.add("is-pinned");
        const distance = () => Math.max(0, t.scrollWidth - window.innerWidth);

        gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
              setCurrent(
                Math.min(WEB_PROJECTS.length, Math.floor(self.progress * WEB_PROJECTS.length) + 1),
              );
            },
          },
        });

        return () => w.classList.remove("is-pinned");
      });
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="websites"
      aria-labelledby="websites-title"
      className="relative flex scroll-mt-0 flex-col justify-center overflow-hidden py-24 lg:h-screen lg:py-0"
    >
      <div className={cn(SHELL, "flex flex-wrap items-end justify-between gap-6")}>
        <div>
          <SplitHeading
            id="websites-title"
            className="text-[clamp(2.6rem,6vw,5.5rem)] font-bold leading-[1.15] tracking-[-0.025em]"
          >
            Live websites, built to perform.
          </SplitHeading>
        </div>
        <div className="hidden w-56 flex-col gap-3 lg:flex">
          <div className="flex items-baseline justify-between text-sm tabular-nums text-muted-foreground">
            <span className="text-3xl font-bold text-foreground">
              {String(current).padStart(2, "0")}
            </span>
            <span>/ {String(WEB_PROJECTS.length).padStart(2, "0")}</span>
          </div>
          <span className="relative block h-px w-full bg-border">
            <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-magenta" />
          </span>
        </div>
        <p className="text-sm text-muted-foreground lg:hidden">Swipe to browse →</p>
      </div>

      <div ref={wrap} className="web-track no-scrollbar mt-10 lg:mt-14">
        <div ref={track} className="flex w-max gap-5 px-4 sm:gap-8 sm:px-8 lg:px-12">
          {WEB_PROJECTS.map((p, i) => (
            <article
              key={p.id}
              className="group w-[84vw] shrink-0 snap-start sm:w-[68vw] lg:w-[min(58vw,62vh*1.6)]"
            >
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="block"
                aria-label={`Visit ${p.name} (opens in a new tab)`}
              >
                <div className="relative pb-6 pr-6 sm:pb-10 sm:pr-10">
                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_50px_100px_-40px_rgb(0_0_0/0.9)]">
                    <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-magenta/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-glow/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan/70" />
                      <span className="ml-3 hidden truncate rounded-full bg-background px-3 py-1 text-[11px] text-muted-foreground sm:block">
                        {p.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </span>
                    </div>
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={p.desktop}
                        alt={`${p.name} website — desktop view`}
                        loading="lazy"
                        decoding="async"
                        width={1440}
                        height={900}
                        className="h-full w-full object-cover object-top transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.04]"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-[22%] min-w-20 overflow-hidden rounded-[1.1rem] border-[5px] border-[#1b1a22] bg-background shadow-2xl shadow-black/70 transition-transform duration-700 ease-out-expo group-hover:-translate-y-3 sm:rounded-[1.6rem] sm:border-[7px]">
                    <img
                      src={p.mobile}
                      alt={`${p.name} website — mobile view`}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[9/19] w-full object-cover object-top"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-start justify-between gap-4 pr-6 sm:pr-10">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{p.tagline}</p>
                  </div>
                  <span className="mt-6 inline-flex shrink-0 items-center gap-2 text-sm font-semibold">
                    <span className="hidden sm:inline">Visit live site</span>
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-border transition-all duration-500 group-hover:rotate-45 group-hover:bg-foreground group-hover:text-background">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </span>
                </div>
              </a>
            </article>
          ))}
          <div aria-hidden className="w-[6vw] shrink-0" />
        </div>
      </div>
    </section>
  );
}

// ======================================================================
// Marketing — light "paper" section with oversized numbers
// ======================================================================

export function MarketingSection() {
  const featured = CAMPAIGNS.slice(0, 3);
  const rest = CAMPAIGNS.slice(3);

  return (
    <section
      id="marketing"
      aria-labelledby="marketing-title"
      className="relative z-10 scroll-mt-0 rounded-t-[2rem] bg-paper py-24 text-ink sm:rounded-t-[4rem] sm:py-32"
    >
      <div className={SHELL}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SplitHeading
              id="marketing-title"
              className="text-[clamp(2.8rem,7vw,6.5rem)] font-bold leading-[1.15] tracking-[-0.025em]"
            >
              Campaigns that move millions.
            </SplitHeading>
          </div>
          <Reveal className="text-base leading-relaxed text-ink-soft lg:col-span-4">
            Real numbers from real campaigns: reach, views and leads. No vanity decks, just results
            our clients can check on their own dashboards.
          </Reveal>
        </div>

        <div className="mt-16 sm:mt-24">
          {featured.map((c, i) => (
            <Reveal key={c.id} y={60}>
              <article className="group grid gap-6 border-t border-ink/15 py-10 sm:py-14 lg:grid-cols-12 lg:items-end">
                <div className="flex items-start gap-4 lg:col-span-7">
                  <div className="text-[clamp(5rem,17vw,15rem)] font-bold leading-[1.15] tracking-[-0.025em] transition-transform duration-700 ease-out-expo group-hover:-translate-y-2">
                    <CountUp value={c.metric} />
                  </div>
                </div>
                <div className="lg:col-span-5">
                  <div className="text-xs font-semibold text-ink-soft">{c.metricLabel}</div>
                  <h3 className="mt-3 text-3xl font-semibold sm:text-4xl">{c.name}</h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-ink-soft">
                    {c.detail}
                  </p>
                  {c.instagram && (
                    <a
                      href={c.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-transform duration-300 hover:scale-[1.03]"
                    >
                      <Instagram className="h-4 w-4" /> See the campaign
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="grid gap-4 border-t border-ink/15 pt-10 sm:grid-cols-2" stagger={0.1}>
          {rest.map((c) => (
            <article
              key={c.id}
              className="flex flex-col justify-between gap-8 rounded-3xl bg-ink p-7 text-paper transition-transform duration-500 hover:-translate-y-1 sm:p-9"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold text-paper/60">{c.metricLabel}</div>
                  <div className="mt-2 text-4xl font-bold tracking-[-0.025em] sm:text-5xl">
                    {c.metric}
                  </div>
                </div>
                {c.instagram && (
                  <a
                    href={c.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${c.name} on Instagram`}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper text-ink transition-transform hover:rotate-12"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-semibold">{c.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/70">{c.detail}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// ======================================================================
// Stories — sticky stacking cards
// ======================================================================

const STORY_VISUALS: Record<string, { src: string; contain?: boolean }> = {
  "mithran-story": { src: "/client-logos/mithran-superstores.png", contain: true },
  "neutral-story": { src: m("neutral-solar/brochure-02.jpg") },
  "infosky-story": { src: m("infosky/poster-05.jpg") },
  "rafeeq-story": { src: m("rafeeq/guideline-01.jpg") },
};

export function StoriesSection() {
  return (
    <section
      id="stories"
      aria-labelledby="stories-title"
      className="relative z-20 -mt-8 scroll-mt-0 rounded-t-[2rem] bg-background py-24 sm:-mt-16 sm:rounded-t-[4rem] sm:py-32"
    >
      <div className={cn(SHELL, "grid gap-12 lg:grid-cols-12")}>
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SplitHeading
              id="stories-title"
              className="text-[clamp(2.4rem,3.8vw,3.75rem)] font-bold leading-[1.15] tracking-[-0.025em]"
            >
              From brief to breakthrough.
            </SplitHeading>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground">
              How full-service and specialist engagements came together for our clients.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-8">
          {STORIES.map((s, i) => {
            const visual = STORY_VISUALS[s.id];
            return (
              <article
                key={s.id}
                style={{ top: `calc(6.5rem + ${i * 1.75}rem)` }}
                className="sticky grid overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[0_-30px_60px_-30px_rgb(0_0_0/0.8)] sm:grid-cols-5"
              >
                <div className="flex flex-col justify-between gap-8 p-7 sm:col-span-3 sm:p-10">
                  <div>
                    <h3 className="text-3xl font-bold tracking-[-0.025em] sm:text-4xl">{s.name}</h3>
                    <p className="mt-4 text-base leading-relaxed text-foreground/75 sm:text-lg">
                      {s.text}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {visual && (
                  <div
                    className={cn(
                      "relative h-56 overflow-hidden sm:col-span-2 sm:h-auto",
                      visual.contain ? "grid place-items-center bg-logo-tile p-10" : "",
                    )}
                  >
                    <img
                      src={visual.src}
                      alt={`${s.name} — work by JOKAR Creations`}
                      loading="lazy"
                      decoding="async"
                      className={cn(
                        visual.contain
                          ? "max-h-32 w-auto object-contain"
                          : "absolute inset-0 h-full w-full object-cover",
                      )}
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ======================================================================
// Contact
// ======================================================================

export function ContactSection() {
  const [service, setService] = useState(SERVICES[0]);
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const id = useId();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Project inquiry — ${service}`;
    const body = [
      `Name: ${form.name}`,
      `Reach me at: ${form.contact}`,
      `Service: ${service}`,
      "",
      form.message,
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const field =
    "peer w-full border-0 border-b border-foreground/20 bg-transparent px-0 pb-3 pt-6 text-lg text-foreground outline-none transition-colors placeholder:text-transparent focus:border-foreground focus-visible:outline-none";
  const label =
    "pointer-events-none absolute left-0 top-6 text-lg text-muted-foreground transition-all duration-300 peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs";

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative scroll-mt-0 overflow-hidden py-24 sm:py-36"
    >
      <div className={SHELL}>
        <SplitHeading
          id="contact-title"
          className="text-[clamp(3rem,8vw,7.5rem)] font-bold leading-[1.15] tracking-[-0.025em]"
        >
          Let&rsquo;s build your brand.
        </SplitHeading>

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12">
          <Reveal className="flex flex-col gap-10 lg:col-span-5" stagger={0.08}>
            <p className="max-w-md text-lg leading-relaxed text-foreground/75">
              Tell us what you need: a full identity, a website, a campaign, or all three.
              We&rsquo;ll reply from our studio inbox.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group inline-flex w-fit items-center gap-3 text-[clamp(1.3rem,2.6vw,2.2rem)] font-semibold tracking-[-0.02em]"
            >
              <Mail className="h-6 w-6 text-magenta" />
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                {CONTACT_EMAIL}
              </span>
            </a>
            <div className="flex flex-col divide-y divide-border border-y border-border">
              <a
                href={MAIN_SITE}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between py-4 text-sm transition-colors hover:text-foreground"
              >
                <span className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-cyan" /> jokarcreations.com
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
              </a>
              <a
                href="https://www.instagram.com/mithransuperstores/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between py-4 text-sm transition-colors hover:text-foreground"
              >
                <span className="flex items-center gap-3">
                  <Instagram className="h-4 w-4 text-magenta" /> Latest campaign on Instagram
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
              </a>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-6 lg:col-start-7" y={60}>
            <form
              onSubmit={submit}
              className="flex flex-col gap-8"
              aria-label="Project inquiry form"
            >
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="relative">
                  <input
                    id={`${id}-name`}
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className={field}
                  />
                  <label htmlFor={`${id}-name`} className={label}>
                    Your name
                  </label>
                </div>
                <div className="relative">
                  <input
                    id={`${id}-contact`}
                    required
                    autoComplete="email"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    placeholder="Email or phone"
                    className={field}
                  />
                  <label htmlFor={`${id}-contact`} className={label}>
                    Email or phone
                  </label>
                </div>
              </div>

              <fieldset>
                <legend className="mb-3 text-xs text-muted-foreground">
                  I&rsquo;m interested in
                </legend>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((s) => (
                    <label
                      key={s}
                      className={cn(
                        "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cyan",
                        service === s
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                      )}
                    >
                      <input
                        type="radio"
                        name={`${id}-service`}
                        value={s}
                        checked={service === s}
                        onChange={() => setService(s)}
                        className="sr-only"
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="relative">
                <textarea
                  id={`${id}-message`}
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your project"
                  className={cn(field, "resize-none")}
                />
                <label htmlFor={`${id}-message`} className={label}>
                  Tell us about your project
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  className="group inline-flex h-14 items-center gap-3 rounded-full bg-foreground pl-7 pr-2 text-sm font-semibold text-background transition-transform duration-300 hover:scale-[1.02]"
                >
                  Send inquiry
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-magenta text-white transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </button>
                <p className="max-w-[16rem] text-xs leading-relaxed text-muted-foreground">
                  Opens an email draft to {CONTACT_EMAIL} with your details filled in.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ======================================================================
// Footer
// ======================================================================

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".footer-mark", {
          yPercent: 45,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-border pt-20">
      <div className={SHELL}>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-2xl font-semibold sm:text-3xl">Have a project in mind?</p>
            <div className="mt-6">
              <CtaLink href="#contact">Start a project</CtaLink>
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-[1fr_1fr_1.5fr] lg:col-span-6"
          >
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Explore</h3>
              <ul className="flex flex-col gap-2.5">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToHash(l.href);
                      }}
                      className="text-foreground/80 transition-colors hover:text-magenta"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Services</h3>
              <ul className="flex flex-col gap-2.5 text-foreground/80">
                <li>Branding & Design</li>
                <li>Web Development</li>
                <li>Digital Marketing</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Contact</h3>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="break-words text-foreground/80 transition-colors hover:text-magenta"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </li>
                <li>
                  <a
                    href={MAIN_SITE}
                    target="_blank"
                    rel="noreferrer"
                    className="text-foreground/80 transition-colors hover:text-magenta"
                  >
                    jokarcreations.com
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

      <div className="mt-20 overflow-hidden px-4 sm:px-8 lg:px-12">
        <img
          src={whiteLogo}
          alt=""
          aria-hidden
          loading="lazy"
          className="footer-mark mx-auto w-full max-w-[1440px] select-none"
        />
      </div>

      <div
        className={cn(
          SHELL,
          "flex flex-wrap items-center justify-between gap-4 border-t border-border py-6 text-xs text-muted-foreground",
        )}
      >
        <p>© 2026 JOKAR Creations Pvt. Ltd. All rights reserved.</p>
        <button
          type="button"
          onClick={() => scrollToHash("#top")}
          className="group inline-flex items-center gap-2 transition-colors hover:text-foreground"
        >
          Back to top
          <span className="grid h-8 w-8 place-items-center rounded-full border border-border transition-transform duration-500 group-hover:-translate-y-1">
            <ArrowUp className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>
    </footer>
  );
}
