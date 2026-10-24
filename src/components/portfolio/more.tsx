import { useState } from "react";
import { Globe, Instagram, Mail, Send } from "lucide-react";

import gradientLogo from "@/assets/brand/jokar-logo-gradient.png.asset.json";
import { CAMPAIGNS, STORIES, WEB_PROJECTS } from "@/data/portfolio";
import { CampaignCard, SectionHeading, WebCard } from "./work";

const CONTACT_EMAIL = "admin@jokarcreations.com";
const MAIN_SITE = "https://www.jokarcreations.com/";

const SERVICES = ["Branding & Graphic Design", "Website Development", "Digital Marketing", "All-in-One"];

export function WebsitesSection() {
  return (
    <section id="websites" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Web Development"
        title="Live websites, built to perform"
        subtitle="Seven responsive sites designed and shipped — captured here on desktop and mobile."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WEB_PROJECTS.map((p) => (
          <WebCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}

export function MarketingSection() {
  const featured = CAMPAIGNS.slice(0, 3);
  const rest = CAMPAIGNS.slice(3);
  return (
    <section id="marketing" className="relative scroll-mt-20 overflow-hidden py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow/10 blur-[140px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Digital Marketing"
          title="Campaigns that move millions"
          subtitle="Real numbers from real campaigns — reach, views and leads."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[first, second, third].map((c) => (
            <CampaignCard key={c.id} campaign={c} large />
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {rest.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function StoriesSection() {
  return (
    <section id="stories" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Client Stories"
        title="From brief to breakthrough"
        subtitle="How full-service and specialist engagements came together for our clients."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {STORIES.map((s) => (
          <div key={s.id} className="glass rounded-2xl p-6">
            <h3 className="text-gradient font-semibold">{s.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {s.tags.map((t) => (
                <span key={t} className="rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ContactSection() {
  const [service, setService] = useState(SERVICES[0]);
  const [form, setForm] = useState({ name: "", contact: "", message: "" });

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

  const inputCls =
    "w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-glow/60";

  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-52 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-glow/15 blur-[150px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Project Inquiry" title="Let's build your brand" />
            <p className="mx-auto mt-4 max-w-md text-center text-sm leading-relaxed text-muted-foreground lg:text-left">
              Tell us what you need — a full identity, a website, a campaign, or all three.
              We'll reply from our studio inbox.
            </p>
            <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 lg:mx-0">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors hover:border-glow/40"
              >
                <Mail className="h-4 w-4 text-glow" /> {CONTACT_EMAIL}
              </a>
              <a
                href={MAIN_SITE}
                target="_blank"
                rel="noreferrer"
                className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors hover:border-glow/40"
              >
                <Globe className="h-4 w-4 text-cyan" /> jokarcreations.com
              </a>
              <a
                href="https://www.instagram.com/mithransuperstores/"
                target="_blank"
                rel="noreferrer"
                className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors hover:border-glow/40"
              >
                <Instagram className="h-4 w-4 text-magenta" /> Latest campaign on Instagram
              </a>
            </div>
          </div>

          <form onSubmit={submit} className="glass rounded-3xl p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className={inputCls}
                aria-label="Your name"
              />
              <input
                required
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                placeholder="Email or phone"
                className={inputCls}
                aria-label="Email or phone"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setService(s)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    service === s
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell us about your project…"
              className={`${inputCls} mt-4 resize-none`}
              aria-label="Project details"
            />
            <button
              type="submit"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] sm:w-auto"
            >
              Send Inquiry <Send className="h-4 w-4" />
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              This opens an email draft to {CONTACT_EMAIL} with your details filled in.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <img src={gradientLogo.url} alt="JOKAR Creations" className="w-[min(320px,70vw)]" />
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href="#work" className="hover:text-foreground">Work</a>
          <a href="#websites" className="hover:text-foreground">Websites</a>
          <a href="#marketing" className="hover:text-foreground">Marketing</a>
          <a href="#stories" className="hover:text-foreground">Stories</a>
          <a href="#contact" className="hover:text-foreground">Contact</a>
        </nav>
        <p className="text-xs text-muted-foreground">
          © 2026 JOKAR Creations Pvt. Ltd. ·{" "}
          <a href={MAIN_SITE} target="_blank" rel="noreferrer" className="hover:text-foreground">
            jokarcreations.com
          </a>
        </p>
      </div>
    </footer>
  );
}
