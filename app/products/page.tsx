import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/features/catalogue/components/CategoryCard";
import { CATEGORIES } from "@/features/catalogue/data/categories";
import { PRODUCTS } from "@/features/catalogue/data/products";
import { Footer } from "@/features/landing/components/Footer";
import { Header } from "@/features/landing/components/Header";
import { WhatsAppFab } from "@/features/landing/components/WhatsAppFab";

export const metadata: Metadata = {
  title: "Catalogue | Ocean Catalogue",
  description: "Browse the full range of wholesale glassware: stemware, tumblers, beer glasses, cups, carafes, pitchers, bowls and jars.",
};

export default function ProductsPage() {
  return (
    <>
      <Header home={false} />
      <main>
        <section className="ph">
          <div className="wrap">
            <p className="eyebrow">The collection</p>
            <h1>{PRODUCTS.length} glassware products, ready to order in bulk</h1>
            <p className="lede">Choose a category to see every size, capacity and packing detail. Tap any product to enquire on WhatsApp.</p>
            <div className="cta">
              <Link className="btn gold" href="/catalogue">
                View the PDF catalogue
              </Link>
            </div>
          </div>
        </section>
        <section className="cats">
          <div className="wrap">
            <ul className="cc-grid">
              {CATEGORIES.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
