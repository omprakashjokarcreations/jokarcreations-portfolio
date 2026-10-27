import akarsh from "@/assets/portfolio/client-logos/akarsh-specialities.png.asset.json";
import apollo from "@/assets/portfolio/client-logos/apollo-hospitals.png.asset.json";
import asianPaints from "@/assets/portfolio/client-logos/asian-paints.png.asset.json";
import bni from "@/assets/portfolio/client-logos/bni-kanchipuram-chengalpattu.png.asset.json";
import cavinkare from "@/assets/portfolio/client-logos/cavinkare.png.asset.json";
import classiccart from "@/assets/portfolio/client-logos/classiccart.png.asset.json";
import depl from "@/assets/portfolio/client-logos/depl.png.asset.json";
import dumont from "@/assets/portfolio/client-logos/dumont.png.asset.json";
import earthSense from "@/assets/portfolio/client-logos/earth-sense-recycle.png.asset.json";
import florentek from "@/assets/portfolio/client-logos/florentek.png.asset.json";
import flourish from "@/assets/portfolio/client-logos/flourish.png.asset.json";
import flourishBreads from "@/assets/portfolio/client-logos/flourish-breads.png.asset.json";
import gjMulticlave from "@/assets/portfolio/client-logos/gj-multiclave.png.asset.json";
import infosky from "@/assets/portfolio/client-logos/infosky-technologies.png.asset.json";
import luxaria from "@/assets/portfolio/client-logos/luxaria.png.asset.json";
import mithran from "@/assets/portfolio/client-logos/mithran-superstores.png.asset.json";
import neutralSolar from "@/assets/portfolio/client-logos/neutral-solar.png.asset.json";
import petronas from "@/assets/portfolio/client-logos/petronas.png.asset.json";
import rafeeq from "@/assets/portfolio/client-logos/rafeeq-biriyani.png.asset.json";
import saven from "@/assets/portfolio/client-logos/saven-boutique.png.asset.json";
import shreePharma from "@/assets/portfolio/client-logos/shree-pharma.png.asset.json";
import technoEngineers from "@/assets/portfolio/client-logos/techno-engineers.png.asset.json";
import tvs from "@/assets/portfolio/client-logos/tvs-motor.png.asset.json";
import virtusa from "@/assets/portfolio/client-logos/virtusa-chairs.png.asset.json";

export interface ClientLogo {
  name: string;
  src: string;
  /** Dark wordmarks are rendered as a clean white silhouette on the dark background. */
  invert?: boolean;
}

// Every logo is a transparent PNG, background-stripped from the originals.
// `invert` marks logos whose artwork is too dark to read on the near-black page.
export const CLIENT_LOGOS: ClientLogo[] = [
  { name: "Mithran Super Stores", src: mithran.url },
  { name: "Rafeeq Biriyani", src: rafeeq.url },
  { name: "Infosky Technologies", src: infosky.url },
  { name: "Neutral Solar", src: neutralSolar.url, invert: true },
  { name: "Classiccart", src: classiccart.url, invert: true },
  { name: "Saven Boutique", src: saven.url },
  { name: "Dumont", src: dumont.url },
  { name: "Luxaria Developers", src: luxaria.url },
  { name: "Flourish", src: flourish.url },
  { name: "Shree Pharma", src: shreePharma.url, invert: true },
  { name: "Florentek", src: florentek.url, invert: true },
  { name: "Virtusa Chairs", src: virtusa.url, invert: true },
  { name: "Flourish Breads", src: flourishBreads.url, invert: true },
  { name: "Techno Engineers", src: technoEngineers.url, invert: true },
  { name: "TVS Motor Company", src: tvs.url, invert: true },
  { name: "Petronas", src: petronas.url, invert: true },
  { name: "Apollo Hospitals", src: apollo.url, invert: true },
  { name: "CavinKare", src: cavinkare.url },
  { name: "Earth Sense Recycle", src: earthSense.url, invert: true },
  { name: "Asian Paints", src: asianPaints.url },
  { name: "BNI Kanchipuram Chengalpattu", src: bni.url, invert: true },
  { name: "DEPL — Dynamic Electroplaters Private Limited", src: depl.url },
  { name: "Akarsh Specialities", src: akarsh.url, invert: true },
  { name: "GJ Multiclave (India) Pvt. Ltd.", src: gjMulticlave.url },
];
