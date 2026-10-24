import akarsh from "@/assets/portfolio/client-logos/akarsh-specialities.jpg.asset.json";
import apollo from "@/assets/portfolio/client-logos/apollo-hospitals.png.asset.json";
import asianPaints from "@/assets/portfolio/client-logos/asian-paints.jpg.asset.json";
import bni from "@/assets/portfolio/client-logos/bni-kanchipuram-chengalpattu.png.asset.json";
import cavinkare from "@/assets/portfolio/client-logos/cavinkare.jpg.asset.json";
import classiccart from "@/assets/portfolio/client-logos/classiccart.png.asset.json";
import depl from "@/assets/portfolio/client-logos/depl.png.asset.json";
import dumont from "@/assets/portfolio/client-logos/dumont.jpg.asset.json";
import earthSense from "@/assets/portfolio/client-logos/earth-sense-recycle.png.asset.json";
import florentek from "@/assets/portfolio/client-logos/florentek.png.asset.json";
import flourish from "@/assets/portfolio/client-logos/flourish.png.asset.json";
import flourishBreads from "@/assets/portfolio/client-logos/flourish-breads.png.asset.json";
import gjMulticlave from "@/assets/portfolio/client-logos/gj-multiclave.jpg.asset.json";
import infosky from "@/assets/portfolio/client-logos/infosky-technologies.png.asset.json";
import luxaria from "@/assets/portfolio/client-logos/luxaria.png.asset.json";
import mithran from "@/assets/portfolio/client-logos/mithran-superstores.png.asset.json";
import neutralSolar from "@/assets/portfolio/client-logos/neutral-solar.png.asset.json";
import petronas from "@/assets/portfolio/client-logos/petronas.png.asset.json";
import rafeeq from "@/assets/portfolio/client-logos/rafeeq-biriyani.png.asset.json";
import saven from "@/assets/portfolio/client-logos/saven-boutique.png.asset.json";
import shreePharma from "@/assets/portfolio/client-logos/shree-pharma.png.asset.json";
import technoEngineers from "@/assets/portfolio/client-logos/techno-engineers.jpg.asset.json";
import tvs from "@/assets/portfolio/client-logos/tvs-motor.png.asset.json";
import virtusa from "@/assets/portfolio/client-logos/virtusa-chairs.png.asset.json";

export interface ClientLogo {
  name: string;
  src: string;
}

// Every logo is normalized onto the same 8:5 canvas, so a fixed display
// height keeps the scroller visually balanced.
export const CLIENT_LOGOS: ClientLogo[] = [
  { name: "Mithran Super Stores", src: mithran.url },
  { name: "Rafeeq Biriyani", src: rafeeq.url },
  { name: "Infosky Technologies", src: infosky.url },
  { name: "Neutral Solar", src: neutralSolar.url },
  { name: "Classiccart", src: classiccart.url },
  { name: "Saven Boutique", src: saven.url },
  { name: "Dumont", src: dumont.url },
  { name: "Luxaria Developers", src: luxaria.url },
  { name: "Flourish", src: flourish.url },
  { name: "Shree Pharma", src: shreePharma.url },
  { name: "Florentek", src: florentek.url },
  { name: "Virtusa Chairs", src: virtusa.url },
  { name: "Flourish Breads", src: flourishBreads.url },
  { name: "Techno Engineers", src: technoEngineers.url },
  { name: "TVS Motor Company", src: tvs.url },
  { name: "Petronas", src: petronas.url },
  { name: "Apollo Hospitals", src: apollo.url },
  { name: "CavinKare", src: cavinkare.url },
  { name: "Earth Sense Recycle", src: earthSense.url },
  { name: "Asian Paints", src: asianPaints.url },
  { name: "BNI Kanchipuram Chengalpattu", src: bni.url },
  { name: "DEPL — Dynamic Electroplaters Private Limited", src: depl.url },
  { name: "Akarsh Specialities", src: akarsh.url },
  { name: "GJ Multiclave (India) Pvt. Ltd.", src: gjMulticlave.url },
];
