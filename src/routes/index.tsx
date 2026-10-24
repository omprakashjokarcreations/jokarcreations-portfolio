import { createFileRoute } from "@tanstack/react-router";

import { Hero, Navbar, StatsBand } from "@/components/portfolio/site";
import { WorkSection } from "@/components/portfolio/work";
import {
  ContactSection,
  Footer,
  MarketingSection,
  StoriesSection,
  WebsitesSection,
} from "@/components/portfolio/more";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JOKAR Creations — Design. Web. Growth." },
      {
        name: "description",
        content:
          "JOKAR Creations is a full-service creative studio — brand identity, print, websites and digital marketing campaigns that have reached millions.",
      },
      { property: "og:title", content: "JOKAR Creations — Design. Web. Growth." },
      {
        property: "og:description",
        content:
          "Full-service creative studio: branding & graphic design, web development and digital marketing, under one roof.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <StatsBand />
        <WorkSection />
        <WebsitesSection />
        <MarketingSection />
        <StoriesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
