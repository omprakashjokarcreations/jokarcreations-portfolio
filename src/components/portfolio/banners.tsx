import { MessageCircle } from "lucide-react";

const WA_NUMBER = "917010115185";

const WA_MESSAGES = {
  design:
    "Hi JOKAR Creations! I'd love to elevate my brand with striking graphic design — could we discuss my project?",
  web: "Hi JOKAR Creations! I'm looking for a sleek, high-performing website for my business — let's talk.",
  marketing:
    "Hi JOKAR Creations! I want to put my brand in front of millions — let's plan a winning digital campaign together.",
  general: "Hi JOKAR Creations! I have a project in mind and would love to team up with your studio.",
} as const;

export type WAService = keyof typeof WA_MESSAGES;

export const waLink = (service: WAService) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGES[service])}`;

/** Giant cinematic divider announcing each service in huge type mid-page. */
export function ServiceBanner({
  index,
  title,
  tagline,
}: {
  index: string;
  title: string;
  tagline: string;
}) {
  return (
    <div className="relative overflow-hidden py-16 text-center sm:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow/10 blur-[130px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
          {index} · Our Services
        </span>
        <h2 className="text-outline mt-4 text-[clamp(2.6rem,9vw,7.5rem)] font-black uppercase leading-[0.95] tracking-tight">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">{tagline}</p>
      </div>
    </div>
  );
}

/** Full-width WhatsApp call-to-action shown after every service section. */
export function WhatsAppCTA({
  service,
  heading,
  sub,
}: {
  service: WAService;
  heading: string;
  sub: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
      <div className="glass relative overflow-hidden rounded-3xl px-6 py-10 text-center sm:py-12">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-glow/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan/15 blur-3xl" />
        </div>
        <div className="relative">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">{heading}</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">{sub}</p>
          <a
            href={waLink(service)}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.04]"
          >
            <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
