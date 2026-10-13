import { CATEGORIES } from "@/features/catalogue/data/categories";

export const CATALOGUE_PDF_URL = "/pdf/ocean-catalogue.pdf";

export const WHATSAPP_NUMBER = "919220338853";

export const waLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const NAV_LINKS = [
  { href: "/products", label: "Catalogue" },
  { href: "#why", label: "Why us" },
  { href: "#clients", label: "Clients" },
  { href: "#quote", label: "Contact" },
] as const;

export const HERO_FACTS = [
  { value: "50+", label: "Designs in stock" },
  { value: "Bulk", label: "Pricing on 100+ pcs" },
  { value: "Pan-India", label: "Safe, packed delivery" },
] as const;

export const WHY_US = [
  { title: "Low minimum order", body: "Start with a trial lot, then scale to full cartons." },
  { title: "Bulk pricing", body: "Tiered rates that drop as your quantity grows." },
  { title: "Custom branding", body: "Your logo printed or etched on selected ranges." },
  { title: "Breakage-safe packing", body: "Double-wall cartons, checked before dispatch." },
] as const;

export const CLIENTS = ["Hotels", "Restaurants", "Bars and pubs", "Cafes", "Caterers", "Corporate gifting"] as const;

export const CONTACT_DETAILS = [
  { label: "Phone", value: "+91 92203 38853" },
  { label: "Email", value: "brilliaskincare@gmail.com" },
  { label: "Address", value: "Gurugram, Haryana" },
] as const;

export const PRODUCT_OPTIONS = [...CATEGORIES.map(({ title }) => title), "Other"] as const;
