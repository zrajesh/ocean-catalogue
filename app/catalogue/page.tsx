import type { Metadata } from "next";
import Link from "next/link";
import { PdfViewer } from "@/features/catalogue/components/PdfViewer";
import { CATALOGUE_PDF_URL } from "@/features/landing/content";

export const metadata: Metadata = { title: "Catalogue | Ocean Catalogue" };

export default function CataloguePage() {
  return (
    <main className="pdf-page">
      <div className="pdf-bar">
        <Link href="/">&larr; Back</Link>
        <a className="btn gold" href={CATALOGUE_PDF_URL} download="Ocean-Catalogue.pdf">
          Download PDF
        </a>
      </div>
      <PdfViewer url={CATALOGUE_PDF_URL} title="Ocean Catalogue PDF" />
    </main>
  );
}
