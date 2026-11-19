import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, LayoutGrid, List, Plus, X } from "lucide-react";

import {
  CAMPAIGNS,
  CLIENTS,
  DELIVERABLE_CATEGORIES,
  DESIGN_PROJECTS,
  WEB_PROJECTS,
  clientById,
  deliverableLabel,
  m,
  type Campaign,
  type DeliverableCategory,
  type DesignProject,
  type WebProject,
} from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { SplitHeading, lockScroll } from "./motion";
import { WORK_FILTER_EVENT, type WorkKind } from "./services";
import { SHELL } from "./ui-bits";

type Kind = WorkKind;
type View = "grid" | "index";

type Item =
  | { type: "design"; p: DesignProject }
  | { type: "web"; p: WebProject }
  | { type: "marketing"; p: Campaign };

const KIND_TABS: { id: Kind; label: string; count: number }[] = [
  {
    id: "all",
    label: "All Work",
    count: DESIGN_PROJECTS.length + WEB_PROJECTS.length + CAMPAIGNS.length,
  },
  { id: "design", label: "Branding & Graphic Design", count: DESIGN_PROJECTS.length },
  { id: "web", label: "Web Development", count: WEB_PROJECTS.length },
  { id: "marketing", label: "Digital Marketing", count: CAMPAIGNS.length },
];

const PAGE_SIZE = 12;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Bento rhythm — repeats every six tiles: feature, square, tall, square, wide, square.
 * `grid-flow-dense` back-fills any gaps the spans leave behind.
 */
const SPANS = ["col-span-2 row-span-2", "", "row-span-2", "", "col-span-2", ""] as const;

/** Flat identity pieces read better whole than cropped. */
const CONTAIN: DeliverableCategory[] = ["logo"];

/** Lead with the most visual deliverables; quiet stationery and marks come later. */
const VISUAL_PRIORITY: DeliverableCategory[] = [
  "poster",
  "menu",
  "brochure",
  "social",
  "packaging",
  "signage",
  "coupon",
  "visiting-card",
  "letterhead",
  "logo",
];

/** Sort by visual weight, then deal clients round-robin so neighbours differ. */
function curate(projects: DesignProject[]): DesignProject[] {
  const ranked = [...projects].sort(
    (a, b) => VISUAL_PRIORITY.indexOf(a.category) - VISUAL_PRIORITY.indexOf(b.category),
  );
  const out: DesignProject[] = [];
  const pool = [...ranked];
  let lastClient = "";
  while (pool.length) {
    const i = pool.findIndex((p) => p.clientId !== lastClient);
    const [next] = pool.splice(i === -1 ? 0 : i, 1);
    if (!next) break;
    out.push(next);
    lastClient = next.clientId;
  }
  return out;
}

const itemKey = (item: Item) => `${item.type}-${item.p.id}`;

// ---------- Normalised view of any work item ----------

function describe(item: Item) {
  if (item.type === "design") {
    const client = clientById(item.p.clientId);
    return {
      title: client.name,
      subtitle: item.p.label,
      tag: deliverableLabel(item.p.category),
      thumb: m(item.p.images[0] ?? ""),
      pieces: item.p.images.length,
    };
  }
  if (item.type === "web") {
    return {
      title: item.p.name,
      subtitle: item.p.tagline,
      tag: "Website",
      thumb: item.p.desktop,
      pieces: 1,
    };
  }
  return {
    title: item.p.name,
    subtitle: item.p.metricLabel,
    tag: "Campaign",
    thumb: null,
    pieces: 1,
  };
}

// ---------- Grid tile ----------

function Tile({ item, index, onOpen }: { item: Item; index: number; onOpen: () => void }) {
  const d = describe(item);
  const contain = item.type === "design" && CONTAIN.includes(item.p.category);
  // Logos never take the big or tall slots — they read better compact.
  const span = contain ? "" : SPANS[index % SPANS.length];
  const feature = !contain && index % SPANS.length === 0;

  let media: React.ReactNode;
  if (item.type === "marketing") {
    media = (
      <span className="flex h-full flex-col justify-between bg-paper p-5 text-ink sm:p-6">
        <span className="text-[10px] font-semibold text-magenta">Campaign</span>
        <span>
          <span
            className={cn(
              "block font-bold leading-[1.15] tracking-[-0.025em]",
              feature ? "text-[clamp(3.5rem,8vw,7rem)]" : "text-[clamp(2.2rem,4vw,3.6rem)]",
            )}
          >
            {item.p.metric}
          </span>
          <span className="mt-2 block text-xs leading-snug text-ink-soft">
            {item.p.metricLabel}
          </span>
        </span>
      </span>
    );
  } else if (item.type === "web") {
    media = (
      <>
        <img
          src={item.p.desktop}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.05]"
        />
        <img
          src={item.p.mobile}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute bottom-3 right-3 aspect-[9/19] w-[18%] min-w-12 rounded-lg border-[3px] border-[#1b1a22] object-cover object-top shadow-xl shadow-black/60 transition-transform duration-700 ease-out-expo group-hover:-translate-y-1.5"
        />
      </>
    );
  } else {
    media = (
      <img
        src={d.thumb ?? ""}
        alt=""
        loading="lazy"
        decoding="async"
        className={cn(
          "h-full w-full transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.05]",
          contain ? "object-contain p-[8%]" : "object-cover object-top",
        )}
      />
    );
  }

  const body = (
    <>
      <span
        className={cn(
          "relative block min-h-0 flex-1 overflow-hidden rounded-2xl ring-1 ring-border transition-shadow duration-500 group-hover:ring-foreground/30",
          contain ? "bg-logo-tile" : "bg-card",
        )}
      >
        {media}
        {d.pieces > 1 && (
          <span
            className={cn(
              "absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur",
              !feature && "hidden sm:block",
            )}
          >
            {d.pieces} pieces
          </span>
        )}
        {item.type !== "marketing" && (
          <span
            aria-hidden
            className="absolute bottom-3 left-3 grid h-10 w-10 scale-75 place-items-center rounded-full bg-white text-black opacity-0 transition-all duration-500 ease-out-expo group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        )}
      </span>
      <span className="flex h-12 shrink-0 items-end justify-between gap-3 px-1 sm:h-14">
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold tracking-tight transition-colors group-hover:text-magenta sm:text-base">
            {d.title}
          </span>
          <span className="block truncate text-sm text-muted-foreground sm:text-base">
            {d.subtitle}
          </span>
        </span>
        <span className="hidden shrink-0 pb-0.5 text-[10px] text-muted-foreground sm:block">
          {d.tag}
        </span>
      </span>
    </>
  );

  const cls = "group flex h-full w-full flex-col text-left";

  let control: React.ReactNode;
  if (item.type === "web") {
    control = (
      <a
        href={item.p.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Visit ${d.title} website (opens in a new tab)`}
        className={cls}
      >
        {body}
      </a>
    );
  } else if (item.type === "design") {
    control = (
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${d.title} — ${d.subtitle} (${d.pieces} ${d.pieces === 1 ? "image" : "images"})`}
        className={cls}
      >
        {body}
      </button>
    );
  } else if (item.p.instagram) {
    control = (
      <a
        href={item.p.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label={`${d.title} campaign on Instagram (opens in a new tab)`}
        className={cls}
      >
        {body}
      </a>
    );
  } else {
    control = <div className={cls}>{body}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay: (index % 3) * 0.06 }}
      className={span}
    >
      {control}
    </motion.div>
  );
}

// ---------- Index (list) view ----------

function IndexView({ items, onOpen }: { items: Item[]; onOpen: (p: DesignProject) => void }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
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

  const preview = hovered ? items.find((it) => itemKey(it) === hovered) : undefined;
  const previewInfo = preview ? describe(preview) : null;

  return (
    <div className="relative" onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
      <ol ref={listRef} className="border-t border-border">
        {items.map((item, i) => {
          const d = describe(item);
          const key = itemKey(item);
          const row = (
            <>
              {/* touch thumbnail — no hover preview on phones */}
              <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-card ring-1 ring-border sm:hidden">
                {d.thumb ? (
                  <img
                    src={d.thumb}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center bg-paper text-[10px] font-bold text-ink">
                    {item.type === "marketing" ? item.p.metric : ""}
                  </span>
                )}
              </span>
              <span className="min-w-0 flex-1 sm:col-span-6">
                <span className="block truncate text-lg font-semibold tracking-[-0.02em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2 sm:text-2xl lg:text-3xl">
                  {d.title}
                </span>
                <span className="block truncate text-sm text-muted-foreground sm:hidden">
                  {d.subtitle}
                </span>
              </span>
              <span className="hidden truncate text-lg text-muted-foreground sm:col-span-3 sm:block">
                {d.subtitle}
              </span>
              <span className="hidden text-[10px] text-muted-foreground sm:col-span-2 sm:block">
                {d.tag}
                {d.pieces > 1 && <span className="text-foreground/50"> · {d.pieces}</span>}
              </span>
              <span className="flex shrink-0 justify-end sm:col-span-1">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-border transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-foreground group-hover:text-background">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </span>
            </>
          );
          const cls =
            "group flex w-full items-center gap-4 border-b border-border py-4 text-left transition-colors duration-300 hover:bg-card/40 sm:grid sm:grid-cols-12 sm:px-2 sm:py-6";
          const hover = {
            onPointerEnter: (e: React.PointerEvent) => {
              if (e.pointerType === "mouse") setHovered(key);
            },
          };
          const external =
            item.type === "web"
              ? item.p.url
              : item.type === "marketing"
                ? item.p.instagram
                : undefined;

          return (
            <li key={key}>
              {item.type === "design" ? (
                <button type="button" className={cls} onClick={() => onOpen(item.p)} {...hover}>
                  {row}
                </button>
              ) : external ? (
                <a href={external} target="_blank" rel="noreferrer" className={cls} {...hover}>
                  {row}
                </a>
              ) : (
                <div className={cls} {...hover}>
                  {row}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* cursor-following preview (desktop) */}
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy }}
        className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block"
      >
        <AnimatePresence>
          {preview && previewInfo && (
            <motion.span
              key={hovered}
              initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              exit={{ opacity: 0, scale: 0.7, rotate: 4 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="absolute -left-32 -top-24 block h-48 w-64 overflow-hidden rounded-xl bg-card shadow-2xl shadow-black/70 ring-1 ring-white/10"
            >
              {previewInfo.thumb ? (
                <img
                  src={previewInfo.thumb}
                  alt=""
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <span className="flex h-full flex-col justify-end bg-paper p-5 text-ink">
                  <span className="text-5xl font-bold tracking-[-0.025em]">
                    {preview.type === "marketing" ? preview.p.metric : ""}
                  </span>
                </span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ---------- Project modal ----------

function ProjectModal({ project, onClose }: { project: DesignProject; onClose: () => void }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const client = clientById(project.clientId);
  const total = project.images.length;
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const step = useCallback((d: number) => setState(([i]) => [(i + d + total) % total, d]), [total]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      previous?.focus();
    };
  }, [onClose, step]);

  useEffect(() => {
    const thumb = thumbsRef.current?.children[index] as HTMLElement | undefined;
    thumb?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[80] flex flex-col bg-background/95 backdrop-blur-xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${client.name} — ${project.label}`}
      data-lenis-prevent
    >
      <div
        className={cn(SHELL, "flex items-center justify-between gap-4 py-5")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">{client.name}</span>
            <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground">
              {deliverableLabel(project.category)}
            </span>
          </div>
          <div className="text-lg text-muted-foreground">
            {project.label} · {client.industry}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {total > 1 && (
            <span className="hidden text-sm tabular-nums text-muted-foreground sm:block">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          )}
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close gallery"
            className="grid h-11 w-11 place-items-center rounded-full border border-border transition-colors hover:bg-foreground hover:text-background"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={index}
            custom={dir}
            src={m(project.images[index] ?? "")}
            alt={`${client.name} — ${project.label}, image ${index + 1} of ${total}`}
            variants={{
              enter: (d: number) => ({ x: d * 80, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d * -80, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: EASE }}
            drag={total > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) step(1);
              else if (info.offset.x > 60) step(-1);
            }}
            className="max-h-full max-w-full cursor-grab select-none rounded-lg object-contain shadow-2xl shadow-black/60 active:cursor-grabbing"
            draggable={false}
          />
        </AnimatePresence>

        {total > 1 && (
          <>
            <button
              aria-label="Previous image"
              onClick={() => step(-1)}
              className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/70 backdrop-blur transition-colors hover:bg-foreground hover:text-background sm:grid"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Next image"
              onClick={() => step(1)}
              className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/70 backdrop-blur transition-colors hover:bg-foreground hover:text-background sm:grid"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {total > 1 ? (
        <div
          ref={thumbsRef}
          className="no-scrollbar mx-auto flex max-w-full gap-2 overflow-x-auto px-4 py-4"
          onClick={(e) => e.stopPropagation()}
        >
          {project.images.map((img, i) => (
            <button
              key={img}
              onClick={() => setState(([cur]) => [i, i > cur ? 1 : -1])}
              aria-label={`View image ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-1 transition-all duration-300",
                i === index
                  ? "opacity-100 ring-2 ring-magenta"
                  : "opacity-45 ring-border hover:opacity-80",
              )}
            >
              <img src={m(img)} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : (
        <div className="h-6" />
      )}
    </motion.div>
  );
}

// ---------- Sidebar filter controls ----------

function FilterHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-sm font-semibold text-foreground">{children}</h3>;
}

function Chip({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
      )}
    >
      {children}
      {count !== undefined && (
        <span
          className={cn(
            "text-[10px] tabular-nums",
            active ? "text-background/60" : "text-muted-foreground/70",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ---------- Section ----------

export function WorkSection() {
  const [kind, setKind] = useState<Kind>("all");
  const [deliverable, setDeliverable] = useState<"all" | DeliverableCategory>("all");
  const [clientId, setClientId] = useState<string>("all");
  const [active, setActive] = useState<DesignProject | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [view, setView] = useState<View>("grid");

  const selectKind = useCallback((id: Kind) => {
    setKind(id);
    setClientId("all");
    if (id === "web" || id === "marketing") setDeliverable("all");
  }, []);

  // Services list can deep-link into a filter.
  useEffect(() => {
    const onFilter = (e: Event) => selectKind((e as CustomEvent<Kind>).detail);
    window.addEventListener(WORK_FILTER_EVENT, onFilter);
    return () => window.removeEventListener(WORK_FILTER_EVENT, onFilter);
  }, [selectKind]);

  const items = useMemo<Item[]>(() => {
    const design = DESIGN_PROJECTS.filter((p) => {
      const matchClient = clientId === "all" || p.clientId === clientId;
      const matchDeliverable = deliverable === "all" || p.category === deliverable;
      return matchClient && matchDeliverable;
    });

    const web = (deliverable === "all" ? WEB_PROJECTS : []).filter(
      (p) => clientId === "all" || p.id === clientId,
    );
    const marketing = (deliverable === "all" ? CAMPAIGNS : []).filter(
      (c) => clientId === "all" || c.name.toLowerCase().startsWith(clientId.split("-")[0] ?? ""),
    );

    const d: Item[] = curate(design).map((p) => ({ type: "design", p }));
    const w: Item[] = web.map((p) => ({ type: "web", p }));
    const c: Item[] = marketing.map((p) => ({ type: "marketing", p }));
    if (kind === "design") return d;
    if (kind === "web") return w;
    if (kind === "marketing") return c;

    // "All": weave the disciplines together so the wall reads as one studio, not three lists.
    const woven: Item[] = [];
    let wi = 0;
    let ci = 0;
    d.forEach((entry, i) => {
      woven.push(entry);
      if (i % 3 === 2 && wi < w.length) woven.push(w[wi++]!);
      if (i % 6 === 5 && ci < c.length) woven.push(c[ci++]!);
    });
    return [...woven, ...w.slice(wi), ...c.slice(ci)];
  }, [kind, clientId, deliverable]);

  const chipClients = useMemo(() => {
    let ids: string[] = [];
    if (kind === "design" || kind === "all") {
      ids = DESIGN_PROJECTS.filter((p) => deliverable === "all" || p.category === deliverable).map(
        (p) => p.clientId,
      );
      if (kind === "all" && deliverable === "all") {
        ids = [...ids, ...WEB_PROJECTS.map((w) => w.id)];
      }
    }
    return CLIENTS.filter((c) => ids.includes(c.id));
  }, [kind, deliverable]);

  // Keep client filter valid if current client has no items for the active deliverable filter
  useEffect(() => {
    if (clientId !== "all" && !chipClients.some((c) => c.id === clientId)) setClientId("all");
  }, [chipClients, clientId]);

  // New filter → start from the first page again.
  useEffect(() => setVisible(PAGE_SIZE), [kind, deliverable, clientId]);

  const closeModal = useCallback(() => setActive(null), []);

  const showChips = kind !== "web" && kind !== "marketing";
  const showDeliverables = kind === "all" || kind === "design";
  const filtered = deliverable !== "all" || clientId !== "all";
  const shown = view === "grid" ? items.slice(0, visible) : items;
  const filterKey = `${view}|${kind}|${deliverable}|${clientId}`;

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="relative scroll-mt-20 py-24 sm:py-32"
    >
      <div className={SHELL}>
        {/* Masthead */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-10">
          <div>
            <SplitHeading
              id="work-title"
              className="text-[clamp(3rem,10vw,9.5rem)] font-bold leading-[1.15] tracking-[-0.025em]"
            >
              Selected work
            </SplitHeading>
          </div>
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground sm:text-right">
              {KIND_TABS[0]?.count} projects across branding, print, web and campaigns.
            </p>
            <div
              role="group"
              aria-label="Layout"
              className="flex rounded-full border border-border p-1"
            >
              {(
                [
                  { id: "grid", label: "Grid", Icon: LayoutGrid },
                  { id: "index", label: "Index", Icon: List },
                ] as const
              ).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={view === id}
                  onClick={() => setView(id)}
                  className={cn(
                    "relative isolate inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                    view === id ? "text-background" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {view === id && (
                    <motion.span
                      layoutId="work-view"
                      className="absolute inset-0 -z-10 rounded-full bg-foreground"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Sidebar filters — sticky on desktop, swipe rows on mobile */}
          <aside aria-label="Filter work" className="min-w-0 lg:col-span-3">
            <div
              data-lenis-prevent
              className="no-scrollbar flex flex-col gap-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pb-4"
            >
              <div>
                <FilterHeading>Service</FilterHeading>
                <div
                  role="tablist"
                  aria-label="Service"
                  className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
                >
                  {KIND_TABS.map((t) => (
                    <button
                      key={t.id}
                      role="tab"
                      aria-selected={kind === t.id}
                      onClick={() => selectKind(t.id)}
                      className={cn(
                        "relative isolate flex shrink-0 items-center justify-between gap-4 rounded-full px-4 py-2 text-left text-sm font-semibold transition-colors duration-300 lg:rounded-none lg:border-b lg:border-border lg:px-0 lg:py-3.5",
                        kind === t.id
                          ? "text-background lg:text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {kind === t.id && (
                        <motion.span
                          layoutId="work-tab"
                          className="absolute inset-0 -z-10 rounded-full bg-foreground lg:inset-auto lg:bottom-[-1px] lg:left-0 lg:z-0 lg:h-[2px] lg:w-full lg:rounded-none lg:bg-magenta"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                      <span className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className={cn(
                            "hidden h-1.5 w-1.5 rounded-full transition-colors lg:block",
                            kind === t.id ? "bg-magenta" : "bg-foreground/20",
                          )}
                        />
                        {t.label}
                      </span>
                      <span
                        className={cn(
                          "hidden text-base tabular-nums lg:block",
                          kind === t.id ? "text-magenta" : "text-muted-foreground",
                        )}
                      >
                        {t.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {showDeliverables && (
                <div>
                  <FilterHeading>Type</FilterHeading>
                  <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0">
                    {DELIVERABLE_CATEGORIES.map((cat) => {
                      const count = DESIGN_PROJECTS.filter(
                        (p) =>
                          (cat.id === "all" || p.category === cat.id) &&
                          (clientId === "all" || p.clientId === clientId),
                      ).length;
                      return (
                        <Chip
                          key={cat.id}
                          active={deliverable === cat.id}
                          onClick={() => setDeliverable(cat.id)}
                          count={count}
                        >
                          {cat.id === "all" ? "All types" : cat.label}
                        </Chip>
                      );
                    })}
                  </div>
                </div>
              )}

              {showChips && chipClients.length > 0 && (
                <div>
                  <FilterHeading>Client</FilterHeading>
                  <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0">
                    <Chip active={clientId === "all"} onClick={() => setClientId("all")}>
                      All Clients
                    </Chip>
                    {chipClients.map((c) => (
                      <Chip
                        key={c.id}
                        active={clientId === c.id}
                        onClick={() => setClientId(clientId === c.id ? "all" : c.id)}
                      >
                        {c.name}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
                <span aria-live="polite">
                  Showing <span className="font-semibold text-foreground">{shown.length}</span> of{" "}
                  {items.length} {items.length === 1 ? "project" : "projects"}
                </span>
                {filtered && (
                  <button
                    onClick={() => {
                      setDeliverable("all");
                      setClientId("all");
                    }}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reset filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="min-w-0 lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={filterKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {view === "grid" ? (
                  <div className="grid grid-flow-dense auto-rows-[190px] grid-cols-2 gap-x-4 gap-y-6 sm:auto-rows-[230px] md:grid-cols-3 xl:auto-rows-[260px] xl:gap-x-5">
                    {shown.map((item, i) => (
                      <Tile
                        key={itemKey(item)}
                        item={item}
                        index={i}
                        onOpen={() => {
                          if (item.type === "design") setActive(item.p);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <IndexView items={shown} onOpen={setActive} />
                )}
              </motion.div>
            </AnimatePresence>

            {items.length === 0 && (
              <p className="py-20 text-center text-2xl text-muted-foreground">
                No work in this combination yet.
              </p>
            )}

            {view === "grid" && items.length > visible && (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="group inline-flex h-14 items-center gap-3 rounded-full border border-foreground/20 pl-7 pr-2 text-sm font-semibold transition-colors hover:border-foreground/60"
                >
                  Show more work
                  <span className="text-muted-foreground">({items.length - visible})</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background transition-transform duration-500 group-hover:rotate-90">
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && <ProjectModal key={active.id} project={active} onClose={closeModal} />}
      </AnimatePresence>
    </section>
  );
}
