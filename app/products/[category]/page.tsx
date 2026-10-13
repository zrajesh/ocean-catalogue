import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductBrowser } from "@/features/catalogue/components/ProductBrowser";
import { CATEGORIES } from "@/features/catalogue/data/categories";
import { getCategory, getProductsByCategory } from "@/features/catalogue/data/products";
import { Footer } from "@/features/landing/components/Footer";
import { Header } from "@/features/landing/components/Header";
import { WhatsAppFab } from "@/features/landing/components/WhatsAppFab";

export const generateStaticParams = () => CATEGORIES.map(({ slug }) => ({ category: slug }));

export async function generateMetadata({ params }: PageProps<"/products/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const { title = "Catalogue", blurb = "" } = getCategory(slug) ?? {};
  return { title: `${title} | Ocean Catalogue`, description: blurb };
}

export default async function CategoryPage({ params }: PageProps<"/products/[category]">) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const { title, blurb } = category;
  const products = getProductsByCategory(slug);

  return (
    <>
      <Header home={false} />
      <main>
        <section className="ph ph-sm">
          <div className="wrap">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/products">Catalogue</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{title}</span>
            </nav>
            <h1>{title}</h1>
            <p className="lede">{blurb}</p>
          </div>
        </section>
        <section className="pbs">
          <div className="wrap">
            <ProductBrowser products={products} />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
