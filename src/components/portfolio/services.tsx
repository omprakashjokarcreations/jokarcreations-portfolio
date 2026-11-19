import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { m } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { Reveal, SplitHeading, scrollToHash } from "./motion";
import { SHELL } from "./ui-bits";

/** Fired by the services list; the Work section listens and switches its filter. */
export const WORK_FILTER_EVENT = "jokar:work-filter";
export type WorkKind = "all" | "design" | "web" | "marketing";

export function requestWorkFilter(kind: WorkKind) {
  window.dispatchEvent(new CustomEvent<WorkKind>(WORK_FILTER_EVENT, { detail: kind }));
  scrollToHash("#work");
}

const SERVICES: {
  kind: WorkKind;
  title: string;
  body: string;
  items: string[];
  images: string[];
}[] = [
  {
    kind: "design",
    title: "Branding & Graphic Design",
    body: "Logos, guidelines and every printed touchpoint: cards, menus, brochures, packaging and signage that carry one consistent voice.",
    items: [
      "Logo & guidelines",
      "Visiting cards",
      "Brochures",
      "Posters",
      "Packaging",
      "Menu cards",
      "Signage",
    ],
    images: [
      m("rafeeq/guideline-03.jpg"),
      m("shree-pharma/package-front.jpg"),
      m("dumont/poster-3.jpg"),
    ],
  },
  {
    kind: "web",
    title: "Web Development",
    body: "Responsive websites designed and shipped end-to-end, from restaurants and retail to corporate and industrial brands.",
    items: ["Responsive sites", "Landing pages", "Corporate sites", "Hosting & launch"],
    images: [
      m("webdev/virtusa-chairs-desktop.jpg"),
      m("webdev/onefps-desktop.jpg"),
      m("webdev/ocean-lifespaces-desktop.jpg"),
    ],
  },
  {
    kind: "marketing",
    title: "Digital Marketing",
    body: "Reels, paid social and always-on content engines that turn small budgets into reach, views and qualified leads.",
    items: ["Instagram growth", "Reels", "Paid ads", "Lead generation", "Content calendars"],
    images: [m("dumont/social-2.jpg"), m("infosky/poster-07.jpg"), m("rafeeq/thumbnail-1.jpg")],
  },
];

export function ServicesSection() {
  const listRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const rect = listRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative scroll-mt-24 py-24 sm:py-32"
    >
      <div className={SHELL}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SplitHeading
              id="services-title"
              className="text-[clamp(2.6rem,6.5vw,6rem)] font-bold leading-[1.15] tracking-[-0.025em]"
            >
              What we do
            </SplitHeading>
          </div>
          <Reveal className="text-base leading-relaxed text-muted-foreground lg:col-span-4 lg:col-start-9">
            Hire us for one service or all three. Branding, websites and marketing, handled by one
            team.
          </Reveal>
        </div>

        <div
          ref={listRef}
          onPointerMove={onMove}
          onPointerLeave={() => setHovered(null)}
          className="relative mt-16 border-t border-border sm:mt-20"
        >
          {SERVICES.map((s, i) => (
            <Reveal key={s.kind} y={30}>
              <button
                type="button"
                onClick={() => requestWorkFilter(s.kind)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                className="group grid w-full gap-6 border-b border-border py-10 text-left transition-colors duration-500 hover:bg-card/40 sm:py-14 lg:grid-cols-12 lg:items-start"
                aria-label={`${s.title}: see related work`}
              >
                <span className="lg:col-span-7">
                  <span className="block text-[clamp(2rem,4.6vw,4.2rem)] font-bold leading-[1.15] tracking-[-0.025em] transition-transform duration-700 ease-out-expo group-hover:translate-x-3">
                    {s.title}
                  </span>
                </span>
                <span className="flex flex-col gap-5 lg:col-span-5 lg:pl-6">
                  <span className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {s.body}
                  </span>
                  <span className="flex flex-wrap gap-2">
                    {s.items.map((it) => (
                      <span
                        key={it}
                        className="rounded-full border border-border px-3 py-1 text-xs text-foreground/75 transition-colors group-hover:border-foreground/25"
                      >
                        {it}
                      </span>
                    ))}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold">
                    See the work
                    <span className="grid h-7 w-7 place-items-center rounded-full border border-border transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-foreground group-hover:text-background">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </span>

                {/* touch devices: inline preview strip */}
                <span className="flex gap-2 lg:hidden" aria-hidden>
                  {s.images.map((src) => (
                    <span
                      key={src}
                      className="aspect-[4/3] flex-1 overflow-hidden rounded-lg ring-1 ring-white/10"
                    >
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top"
                      />
                    </span>
                  ))}
                </span>
              </button>
            </Reveal>
          ))}

          {/* desktop: cursor-following preview stack */}
          <motion.div
            aria-hidden
            style={{ x: sx, y: sy }}
            className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block"
          >
            <AnimatePresence>
              {hovered !== null && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  className="relative -ml-36 -mt-28 h-56 w-72"
                >
                  {SERVICES[hovered]?.images.map((src, j) => (
                    <motion.img
                      key={src}
                      src={src}
                      alt=""
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, rotate: (j - 1) * 7, x: (j - 1) * 34 }}
                      transition={{ delay: j * 0.05, type: "spring", stiffness: 260, damping: 24 }}
                      className={cn(
                        "absolute inset-0 h-full w-full rounded-xl object-cover object-top shadow-2xl shadow-black/70 ring-1 ring-white/10",
                      )}
                      style={{ zIndex: j === 1 ? 3 : 1 }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
