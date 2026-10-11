export const WHATSAPP_NUMBER = "919999999999";

export const waLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export type GlassIconId = "wine" | "beer" | "cup" | "tumbler";

export const NAV_LINKS = [
  { href: "#products", label: "Products" },
  { href: "#why", label: "Why us" },
  { href: "#clients", label: "Clients" },
  { href: "#quote", label: "Contact" },
] as const;

export const HERO_FACTS = [
  { value: "50+", label: "Designs in stock" },
  { value: "Bulk", label: "Pricing on 100+ pcs" },
  { value: "Pan-India", label: "Safe, packed delivery" },
] as const;

export const COLLECTIONS: ReadonlyArray<{
  icon: GlassIconId;
  viewBox: string;
  title: string;
  blurb: string;
  pdf: string;
}> = [
  { icon: "wine", viewBox: "0 0 100 200", title: "Wine glasses", blurb: "Red, white and sparkling, from 180 ml to 600 ml.", pdf: "/pdf/wine-glasses.pdf" },
  { icon: "beer", viewBox: "0 0 100 200", title: "Beer glasses", blurb: "Pints, mugs and pilsners for bars and pubs.", pdf: "/pdf/beer-glasses.pdf" },
  { icon: "cup", viewBox: "0 0 120 200", title: "Coffee cups", blurb: "Cups, saucers and mugs for cafes and hotel rooms.", pdf: "/pdf/coffee-cups.pdf" },
  { icon: "tumbler", viewBox: "0 0 100 200", title: "Tumblers", blurb: "Water, juice and whisky tumblers in heavy-base glass.", pdf: "/pdf/tumblers.pdf" },
];

export const WHY_US = [
  { title: "Low minimum order", body: "Start with a trial lot, then scale to full cartons." },
  { title: "Bulk pricing", body: "Tiered rates that drop as your quantity grows." },
  { title: "Custom branding", body: "Your logo printed or etched on selected ranges." },
  { title: "Breakage-safe packing", body: "Double-wall cartons, checked before dispatch." },
] as const;

export const CLIENTS = ["Hotels", "Restaurants", "Bars and pubs", "Cafes", "Caterers", "Corporate gifting"] as const;

export const CONTACT_DETAILS = [
  { label: "Phone", value: "+91 99999 99999" },
  { label: "Email", value: "sales@yourbrand.com" },
  { label: "Address", value: "Your address, City, State" },
  { label: "GST", value: "Your GST number" },
] as const;

export const PRODUCT_OPTIONS = [...COLLECTIONS.map(({ title }) => title), "Other"] as const;
