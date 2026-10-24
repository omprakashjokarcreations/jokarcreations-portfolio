import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Instagram, X } from "lucide-react";

import {
  CAMPAIGNS,
  CLIENTS,
  DESIGN_PROJECTS,
  WEB_PROJECTS,
  clientById,
  m,
  type Campaign,
  type DesignProject,
  type WebProject,
} from "@/data/portfolio";

type Kind = "all" | "design" | "web" | "marketing";

const KIND_TABS: { id: Kind; label: string }[] = [
  { id: "all", label: "All Work" },
  { id: "design", label: "Branding & Graphic Design" },
  { id: "web", label: "Web Development" },
  { id: "marketing", label: "Digital Marketing" },
];

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{subtitle}</p>}
    </div>
  );
}

// ---------- Web card (also used in the Websites section) ----------

export function WebCard({ project }: { project: WebProject }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-glow/40">
      <div className="relative px-4 pt-4 pb-10">
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <div className="flex items-center gap-1.5 border-b border-border bg-card px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-magenta/70" />
            <span className="h-2 w-2 rounded-full bg-glow/70" />
            <span className="h-2 w-2 rounded-full bg-cyan/70" />
          </div>
          <img
            src={project.desktop}
            alt={`${project.name} website — desktop view`}
            loading="lazy"
            className="w-full transition duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <img
          src={project.mobile}
          alt={`${project.name} website — mobile view`}
          loading="lazy"
          className="absolute bottom-0 right-6 w-16 rounded-lg border-2 border-card bg-background shadow-xl shadow-black/50 sm:w-20"
        />
      </div>
      <div className="border-t border-border p-4">
        <h3 className="font-semibold">{project.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{project.tagline}</p>
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-glow transition-colors hover:text-cyan"
        >
          Visit live site <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

// ---------- Marketing card ----------

export function CampaignCard({ campaign, large = false }: { campaign: Campaign; large?: boolean }) {
  return (
    <div className={`glass relative overflow-hidden rounded-2xl p-6 ${large ? "sm:p-8" : ""}`}>
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-glow/15 blur-3xl" />
      <div className="relative">
        <div className={`text-gradient font-bold ${large ? "text-5xl sm:text-6xl" : "text-4xl"}`}>{campaign.metric}</div>
        <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {campaign.metricLabel}
        </div>
        <h3 className="mt-4 font-semibold">{campaign.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{campaign.detail}</p>
        {campaign.instagram && (
          <a
            href={campaign.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold transition-colors hover:bg-accent"
          >
            <Instagram className="h-4 w-4 text-magenta" /> @JOKAR campaign on Instagram
          </a>
        )}
      </div>
    </div>
  );
}

// ---------- Project modal ----------

function ProjectModal({ project, onClose }: { project: DesignProject; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const client = clientById(project.clientId);
  const total = project.images.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % total);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [total, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${client.name} — ${project.label}`}
    >
      <div
        className="glass relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <div className="font-semibold">{client.name}</div>
            <div className="text-sm text-muted-foreground">{project.label}</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full border border-border p-2 transition-colors hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative flex-1 overflow-hidden bg-background">
          <img
            src={m(project.images[index] ?? "")}
            alt={`${client.name} — ${project.label}, view ${index + 1}`}
            className="mx-auto max-h-[62vh] w-auto max-w-full object-contain"
          />
          {total > 1 && (
            <>
              <button
                aria-label="Previous image"
                onClick={() => setIndex((i) => (i - 1 + total) % total)}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/70 p-2 backdrop-blur transition-colors hover:bg-accent"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                aria-label="Next image"
                onClick={() => setIndex((i) => (i + 1) % total)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/70 p-2 backdrop-blur transition-colors hover:bg-accent"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                {index + 1} / {total}
              </span>
            </>
          )}
        </div>

        {total > 1 && (
          <div className="flex gap-2 overflow-x-auto border-t border-border p-3">
            {project.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setIndex(i)}
                aria-label={`View image ${i + 1}`}
                className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition-opacity ${
                  i === index ? "border-glow opacity-100" : "border-border opacity-50 hover:opacity-80"
                }`}
              >
                <img src={m(img)} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Section ----------

export function WorkSection() {
  const [kind, setKind] = useState<Kind>("all");
  const [clientId, setClientId] = useState<string>("all");
  const [active, setActive] = useState<DesignProject | null>(null);

  const items = useMemo(() => {
    const design = DESIGN_PROJECTS.filter((p) => clientId === "all" || p.clientId === clientId);
    const web = WEB_PROJECTS.filter((p) => clientId === "all" || p.id === clientId);
    const marketing = CAMPAIGNS.filter((c) => clientId === "all" || c.name.toLowerCase().startsWith(clientId.split("-")[0] ?? ""));
    if (kind === "design") return design.map((p) => ({ type: "design" as const, p }));
    if (kind === "web") return web.map((p) => ({ type: "web" as const, p }));
    if (kind === "marketing") return marketing.map((c) => ({ type: "marketing" as const, p: c }));
    return [
      ...design.map((p) => ({ type: "design" as const, p })),
      ...web.map((p) => ({ type: "web" as const, p })),
      ...marketing.map((c) => ({ type: "marketing" as const, p: c })),
    ];
  }, [kind, clientId]);

  const chipClients = useMemo(() => {
    const ids =
      kind === "design"
        ? DESIGN_PROJECTS.map((p) => p.clientId)
        : kind === "web"
          ? []
          : kind === "marketing"
            ? []
            : [...DESIGN_PROJECTS.map((p) => p.clientId), ...WEB_PROJECTS.map((w) => w.id)];
    return CLIENTS.filter((c) => ids.includes(c.id));
  }, [kind]);

  const showChips = kind !== "web" && kind !== "marketing";

  return (
    <section id="work" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Selected Work"
        title="One studio, every angle"
        subtitle="Filter by service, or pick a client to see everything we delivered for them."
      />

      {/* service tabs */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {KIND_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setKind(t.id);
              setClientId("all");
            }}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              kind === t.id
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* client chips */}
      {showChips && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setClientId("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              clientId === "all"
                ? "bg-secondary text-secondary-foreground"
                : "border border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            All Clients
          </button>
          {chipClients.map((c) => (
            <button
              key={c.id}
              onClick={() => setClientId(clientId === c.id ? "all" : c.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                clientId === c.id
                  ? "bg-secondary text-secondary-foreground"
                  : "border border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* grid */}
      <div className="mt-10 columns-1 gap-4 sm:columns-2 xl:columns-3 [&>*]:mb-4">
        {items.map((item) => {
          if (item.type === "design") {
            const p = item.p;
            const client = clientById(p.clientId);
            return (
              <div key={p.id} className="break-inside-avoid">
                <button
                  onClick={() => setActive(p)}
                  className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-card text-left transition-colors hover:border-glow/40"
                >
                  <img
                    src={m(p.images[0] ?? "")}
                    alt={`${client.name} — ${p.label} by JOKAR Creations`}
                    loading="lazy"
                    className="w-full transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span
                      className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        client.tier === "full-service"
                          ? "bg-glow/20 text-glow"
                          : "bg-cyan/15 text-cyan"
                      }`}
                    >
                      {client.tier === "full-service" ? "Full-Service" : "Specialist"}
                    </span>
                    <div className="font-semibold">{client.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {p.label} · {p.images.length} {p.images.length === 1 ? "piece" : "pieces"}
                    </div>
                  </div>
                </button>
              </div>
            );
          }
          if (item.type === "web") {
            return (
              <div key={item.p.id} className="break-inside-avoid">
                <WebCard project={item.p} />
              </div>
            );
          }
          return (
            <div key={item.p.id} className="break-inside-avoid">
              <CampaignCard campaign={item.p} />
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">No work in this combination yet.</p>
      )}

      {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
    </section>
  );
}
