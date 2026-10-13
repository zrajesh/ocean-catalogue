import Link from "next/link";
import { CategoryCard } from "@/features/catalogue/components/CategoryCard";
import { CATEGORIES } from "@/features/catalogue/data/categories";
import { PdfPreloader } from "./PdfPreloader";

export function Collections() {
  return (
    <section id="products">
      <PdfPreloader targetId="products" />
      <div className="wrap">
        <div className="head">
          <h2>Browse by category</h2>
          <p>Every size, capacity and packing detail, ready to enquire on.</p>
        </div>
        <ul className="cc-grid">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </ul>
        <div className="cc-more">
          <Link className="btn gold" href="/products">
            Open the full catalogue
          </Link>
          <Link className="pdf" href="/catalogue">
            View as PDF
          </Link>
        </div>
      </div>
    </section>
  );
}
