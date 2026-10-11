import type { Metadata } from "next";
import Link from "next/link";
import { CATALOGUE_PDF_URL } from "@/features/landing/content";

export const metadata: Metadata = { title: "Catalogue | Ocean Catalogue" };

export default function CataloguePage() {
  return (
    <main style={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
      <div
        style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", padding: "12px 16px", flexWrap: "wrap" }}
      >
        <Link href="/">&larr; Back</Link>
        <a className="btn gold" href={CATALOGUE_PDF_URL} download="Ocean-Catalogue.pdf">
          Download PDF
        </a>
      </div>
      <iframe src={CATALOGUE_PDF_URL} title="Ocean Catalogue PDF" style={{ flex: 1, border: 0, width: "100%" }} />
      <p style={{ padding: "8px 16px", margin: 0 }}>
        PDF not showing? <a href={CATALOGUE_PDF_URL}>Open it directly</a>.
      </p>
    </main>
  );
}
