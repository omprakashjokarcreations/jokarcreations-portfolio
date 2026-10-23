import { MEDIA } from "./media";

export const m = (key: string): string => MEDIA[key] ?? "";

// ---------- Clients ----------

export interface Client {
  id: string;
  name: string;
  tier: "full-service" | "specialist";
  industry: string;
  instagram?: string;
}

export const CLIENTS: Client[] = [
  { id: "classiccart", name: "Classiccart", tier: "full-service", industry: "Retail" },
  { id: "infosky", name: "Infosky Technologies", tier: "full-service", industry: "Technology", instagram: "https://www.instagram.com/infoskytechnologies/" },
  { id: "luxaria", name: "Luxaria", tier: "full-service", industry: "Lifestyle" },
  { id: "rafeeq", name: "Rafeeq Biriyani", tier: "full-service", industry: "Restaurant", instagram: "https://www.instagram.com/rafeeq_briyani/" },
  { id: "saven", name: "Saven Boutique", tier: "full-service", industry: "Fashion retail" },
  { id: "shree-pharma", name: "Shree Pharma", tier: "specialist", industry: "Pharmaceuticals" },
  { id: "flourish", name: "Flourish", tier: "specialist", industry: "Hospitality" },
  { id: "dumont", name: "Dumont", tier: "specialist", industry: "Desserts & cafe", instagram: "https://www.instagram.com/dumont.selaiyur/" },
  { id: "neutral-solar", name: "Neutral Solar", tier: "specialist", industry: "Solar energy" },
  { id: "florentek", name: "Florentek", tier: "specialist", industry: "Industrial" },
];

export const clientById = (id: string): Client =>
  CLIENTS.find((c) => c.id === id) ?? CLIENTS[0];

const range = (base: string, from: number, to: number, pad = 2): string[] =>
  Array.from({ length: to - from + 1 }, (_, i) => `${base}-${String(from + i).padStart(pad, "0")}.jpg`);

// ---------- Graphic design projects ----------

export interface DesignProject {
  id: string;
  clientId: string;
  label: string;
  images: string[];
}

export const DESIGN_PROJECTS: DesignProject[] = [
  { id: "classiccart-logo", clientId: "classiccart", label: "Logo Design", images: ["classiccart/logo/logo.jpg"] },
  { id: "classiccart-letterhead", clientId: "classiccart", label: "Letterhead", images: ["classiccart/letterhead/letterhead.jpg"] },
  { id: "classiccart-id-card", clientId: "classiccart", label: "ID Card", images: ["classiccart/id-card/id-card.jpg"] },

  { id: "infosky-logo", clientId: "infosky", label: "Logo Design", images: ["infosky/logo/logo.jpg"] },
  { id: "infosky-letterpad", clientId: "infosky", label: "Letterpad", images: ["infosky/letterpad/letterpad.jpg"] },
  {
    id: "infosky-posters",
    clientId: "infosky",
    label: "Poster Series",
    images: [...range("infosky/poster", 1, 17), "infosky/poster/poster-23.jpg", ...range("infosky/poster", 18, 22)],
  },

  { id: "luxaria-logo", clientId: "luxaria", label: "Logo Design", images: ["luxaria/logo/logo.jpg"] },
  { id: "luxaria-banner", clientId: "luxaria", label: "Banner", images: ["luxaria/banner/banner.jpg"] },
  { id: "luxaria-visiting-card", clientId: "luxaria", label: "Visiting Cards", images: ["luxaria/visiting-card/visiting-card-1.jpg", "luxaria/visiting-card/visiting-card-2.jpg"] },

  { id: "rafeeq-menu-card", clientId: "rafeeq", label: "Menu Card", images: ["rafeeq/menu-card/menu-card.jpg"] },
  { id: "rafeeq-logo-guidelines", clientId: "rafeeq", label: "Logo Guidelines", images: range("rafeeq/logo-guideline/guideline", 0, 12) },
  { id: "rafeeq-brand-identity", clientId: "rafeeq", label: "Brand Identity", images: ["rafeeq/brand-identity/brand-identity-rgb.jpg", "rafeeq/brand-identity/brand-identity-banner.jpg"] },
  { id: "rafeeq-thumbnails", clientId: "rafeeq", label: "YouTube Thumbnails", images: ["rafeeq/thumbnail/thumbnail-1.jpg", "rafeeq/thumbnail/thumbnail-2.jpg", "rafeeq/thumbnail/thumbnail-3.jpg"] },

  { id: "saven-wall-poster", clientId: "saven", label: "Wall Poster", images: ["saven/wall-poster/wall-poster.jpg"] },
  { id: "saven-visiting-card", clientId: "saven", label: "Visiting Cards", images: ["saven/visiting-card/visiting-card-1.jpg", "saven/visiting-card/visiting-card-2.jpg"] },
  {
    id: "saven-pamphlets",
    clientId: "saven",
    label: "Pamphlets",
    images: [
      "saven/pamphlet/pamphlet-front.jpg",
      "saven/pamphlet/pamphlet-back.jpg",
      "saven/pamphlet/opening-pamphlet-front.jpg",
      "saven/pamphlet/opening-pamphlet-back.jpg",
    ],
  },
  {
    id: "saven-signage",
    clientId: "saven",
    label: "Signage & Boards",
    images: [
      "saven/signage/no-parking-board.jpg",
      "saven/signage/signage-4x4.jpg",
      "saven/signage/banner-4x6.jpg",
      "saven/signage/invitation-poster.jpg",
    ],
  },
  { id: "saven-logo", clientId: "saven", label: "Logo Design", images: ["saven/logo/logo.jpg"] },

  {
    id: "shree-pharma-package",
    clientId: "shree-pharma",
    label: "Package Design",
    images: [
      "shree-pharma/package-design/package-front.jpg",
      "shree-pharma/package-design/package-back.jpg",
      "shree-pharma/package-design/package-3.jpg",
    ],
  },
  { id: "shree-pharma-logo", clientId: "shree-pharma", label: "Logo Design", images: ["shree-pharma/logo/logo.jpg"] },

  {
    id: "flourish-cards",
    clientId: "flourish",
    label: "Card Designs",
    images: ["flourish/cards/card-1.jpg", "flourish/cards/card-2.jpg", "flourish/cards/card-3.jpg", "flourish/cards/card-4.jpg"],
  },
  { id: "flourish-menu", clientId: "flourish", label: "Menu Design", images: range("flourish/menu/menu", 0, 9, 1) },
  { id: "flourish-visiting-card", clientId: "flourish", label: "Visiting Cards", images: ["flourish/visiting-card/visiting-card-1.jpg", "flourish/visiting-card/visiting-card-2.jpg"] },
  { id: "flourish-sticker", clientId: "flourish", label: "Sticker Design", images: ["flourish/sticker/sticker.jpg"] },
  { id: "flourish-logo", clientId: "flourish", label: "Logo Design", images: ["flourish/logo/logo.jpg"] },

  {
    id: "dumont-coupons",
    clientId: "dumont",
    label: "Coupons",
    images: [
      "dumont/coupons/coupon-red.jpg",
      "dumont/coupons/coupon-yellow.jpg",
      "dumont/coupons/coupon-blue.jpg",
      "dumont/coupons/turf-coupon-1.jpg",
      "dumont/coupons/turf-coupon-2.jpg",
    ],
  },
  {
    id: "dumont-menu",
    clientId: "dumont",
    label: "Menu Card",
    images: ["dumont/menu/menu-1.jpg", "dumont/menu/menu-2.jpg", "dumont/menu/menu-3.jpg", "dumont/menu/menu-4.jpg", "dumont/menu/menu-5.jpg", "dumont/menu/menu-6.jpg", "dumont/menu/menu-7.jpg", "dumont/menu/menu-8.jpg"],
  },
  {
    id: "dumont-posters",
    clientId: "dumont",
    label: "Posters",
    images: [
      "dumont/posters/poster-1.jpg",
      "dumont/posters/poster-2.jpg",
      "dumont/posters/poster-3.jpg",
      "dumont/posters/poster-4.jpg",
      "dumont/posters/poster-5.jpg",
      "dumont/posters/poster-6.jpg",
      "dumont/posters/poster-final.jpg",
      "dumont/posters/flavor-sundea.jpg",
      "dumont/posters/flavor-hot-chocolate.jpg",
      "dumont/posters/flavor-dolce.jpg",
      "dumont/posters/flavor-cookie.jpg",
      "dumont/posters/flavor-cone.jpg",
      "dumont/posters/flavor-chocolate.jpg",
      "dumont/posters/flavor-cake.jpg",
      "dumont/posters/flavor-butter-scotch.jpg",
      "dumont/posters/flavor-brownie.jpg",
      "dumont/posters/flavor-bourban-brownies.jpg",
      "dumont/posters/flavor-blue-berry.jpg",
      "dumont/posters/flavor-blodie.jpg",
      "dumont/posters/flavor-biscoff.jpg",
      "dumont/posters/flavor-begian-chocolate.jpg",
      "dumont/posters/flavor-biscoff-cake.jpg",
      "dumont/posters/social-1.jpg",
      "dumont/posters/social-2.jpg",
      "dumont/posters/social-3.jpg",
      "dumont/posters/social-4.jpg",
      "dumont/posters/social-5.jpg",
      "dumont/posters/social-14.jpg",
    ],
  },

  {
    id: "neutral-solar-brochures",
    clientId: "neutral-solar",
    label: "Brochures",
    images: ["neutral-solar/brochure/brochure-4page-1.jpg", "neutral-solar/brochure/brochure-4page-2.jpg", ...range("neutral-solar/brochure", 1, 20)],
  },
  {
    id: "neutral-solar-visiting-card",
    clientId: "neutral-solar",
    label: "Visiting Cards",
    images: ["neutral-solar/visiting-card/visiting-card-front.jpg", "neutral-solar/visiting-card/visiting-card-back.jpg"],
  },
  { id: "neutral-solar-standee", clientId: "neutral-solar", label: "4x8 Standee", images: ["neutral-solar/standee/standee-4x8.jpg"] },
  {
    id: "neutral-solar-print",
    clientId: "neutral-solar",
    label: "Print & Signage",
    images: [
      "neutral-solar/print/banner.jpg",
      "neutral-solar/print/certificate.jpg",
      "neutral-solar/print/name-board.jpg",
      "neutral-solar/print/invitation.jpg",
    ],
  },
  { id: "neutral-solar-logo", clientId: "neutral-solar", label: "Logo Design", images: ["neutral-solar/logo/logo.jpg"] },

  { id: "florentek-logo", clientId: "florentek", label: "Logo Design", images: ["florentek/logo/logo.jpg"] },
];

// ---------- Web development ----------

export interface WebProject {
  id: string;
  name: string;
  url: string;
  tagline: string;
  desktop: string;
  mobile: string;
}

export const WEB_PROJECTS: WebProject[] = [
  { id: "rafeeq-biriyani", name: "Rafeeq Biriyani", url: "https://rafeeqbiriyani.com/", tagline: "Restaurant brand with a full online presence", desktop: m("webdev/rafeeq-biriyani-desktop.jpg"), mobile: m("webdev/rafeeq-biriyani-mobile.jpg") },
  { id: "virtusa-chairs", name: "Virtusa Chairs", url: "https://virtusachairs.com/", tagline: "Furniture showcase website", desktop: m("webdev/virtusa-chairs-desktop.jpg"), mobile: m("webdev/virtusa-chairs-mobile.jpg") },
  { id: "onefps", name: "One FPS", url: "https://onefps.in/", tagline: "Brand & campaign website", desktop: m("webdev/onefps-desktop.jpg"), mobile: m("webdev/onefps-mobile.jpg") },
  { id: "sensor-home", name: "Sensor Home Automation", url: "https://sensorhomeautomation.in/", tagline: "Smart home automation solutions site", desktop: m("webdev/sensor-home-desktop.jpg"), mobile: m("webdev/sensor-home-mobile.jpg") },
  { id: "ocean-lifespaces", name: "Ocean Lifespaces India Pvt. Ltd.", url: "https://olipllatest.netlify.app/", tagline: "Corporate website for interiors & infrastructure", desktop: m("webdev/ocean-lifespaces-desktop.jpg"), mobile: m("webdev/ocean-lifespaces-mobile.jpg") },
  { id: "my-response", name: "My Response — Integrated Services", url: "https://myresponsesintegrated.netlify.app/", tagline: "Integrated services business website", desktop: m("webdev/my-response-desktop.jpg"), mobile: m("webdev/my-response-mobile.jpg") },
  { id: "ej-associates", name: "EJ Associates", url: "https://grand-chebakia-011c80.netlify.app/", tagline: "Business website", desktop: m("webdev/ej-associates-desktop.jpg"), mobile: m("webdev/ej-associates-mobile.jpg") },
];

// ---------- Digital marketing ----------

export interface Campaign {
  id: string;
  name: string;
  metric: string;
  metricLabel: string;
  detail: string;
  instagram?: string;
}

export const CAMPAIGNS: Campaign[] = [
  { id: "mithran", name: "Mithran Superstores", metric: "1M+", metricLabel: "Instagram accounts reached in 1 month", detail: "A launch-month content engine that pushed the new superstore past one million accounts reached on Instagram.", instagram: "https://www.instagram.com/mithransuperstores/" },
  { id: "neutral-reel", name: "Neutral Solar", metric: "1.1M", metricLabel: "Reel views in 4 days", detail: "One product reel crossed 1.1 million views in four days, backed by brochures, standees and print collateral.", instagram: "https://www.instagram.com/mithransuperstores/" },
  { id: "infosky-leads", name: "Infosky Technologies", metric: "20", metricLabel: "Leads from a ₹3,000 spend", detail: "A lean ₹3,000 ad spend returned 20 qualified leads for the technology brand.", instagram: "https://www.instagram.com/infoskytechnologies/" },
  { id: "dumont-social", name: "Dumont", metric: "Always-on", metricLabel: "Social content & coupons", detail: "Flavor-drop posters, coupon campaigns and daily social content for the dessert brand.", instagram: "https://www.instagram.com/dumont.selaiyur/" },
  { id: "rafeeq-social", name: "Rafeeq Biriyani", metric: "Brand + Web", metricLabel: "Social amplified by identity", detail: "Social content riding on a complete logo guideline, menu card and a live ordering website.", instagram: "https://www.instagram.com/rafeeq_briyani/" },
];

// Campaign corrected Instagram for Neutral Solar:
CAMPAIGNS[1].instagram = "https://www.instagram.com/mithransuperstores/" === CAMPAIGNS[1].instagram ? "https://www.instagram.com/mithransuperstores/" : "https://www.instagram.com/mithransuperstores/";

// ---------- Stats ----------

export const STATS = [
  { value: "1M+", label: "Instagram reach in 30 days" },
  { value: "1.1M", label: "Reel views in 4 days" },
  { value: "20", label: "Leads on a ₹3,000 spend" },
  { value: "150+", label: "Design deliverables shipped" },
  { value: "7", label: "Websites built & launched" },
  { value: "10+", label: "Brands served end-to-end" },
];

// ---------- Client stories ----------

export const STORIES = [
  {
    id: "mithran-story",
    name: "Mithran Superstores",
    text: "From launch day to one million accounts reached inside a single month — reels, geo-targeted creative and store branding working as one system.",
    tags: ["Branding", "Social", "Launch"],
  },
  {
    id: "neutral-story",
    name: "Neutral Solar",
    text: "A single product reel crossed 1.1 million views in four days. The same energy system runs through brochures, a 4x8 standee and site signage.",
    tags: ["Reels", "Brochures", "Signage"],
  },
  {
    id: "infosky-story",
    name: "Infosky Technologies",
    text: "A complete identity — logo, letterpad and a 23-poster launch series — turned a ₹3,000 spend into 20 qualified leads.",
    tags: ["Identity", "Posters", "Lead gen"],
  },
  {
    id: "rafeeq-story",
    name: "Rafeeq Biriyani",
    text: "Thirteen-page logo guidelines, menu cards and a live website — one brand language across print, screen and social.",
    tags: ["Guidelines", "Menu", "Website"],
  },
];
