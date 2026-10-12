"use client";

import { useEffect } from "react";
import { CATALOGUE_PDF_URL } from "../content";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

const isConstrainedNetwork = () => {
  const { saveData = false, effectiveType = "4g" } =
    (navigator as Navigator & { connection?: NetworkInformation }).connection ?? {};
  return saveData || effectiveType === "slow-2g" || effectiveType === "2g";
};

let warmed = false;

const warmCatalogue = () => {
  if (warmed || isConstrainedNetwork()) return;
  warmed = true;
  fetch(CATALOGUE_PDF_URL, { priority: "low" } as RequestInit).catch(() => {
    warmed = false;
  });
};

/** Warms the browser cache once the products section nears the viewport, or on first hover/touch of a PDF link. */
export function PdfPreloader({ targetId }: { targetId: string }) {
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          warmCatalogue();
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(target);

    const links = target.querySelectorAll("a.pdf");
    links.forEach((link) => {
      link.addEventListener("pointerenter", warmCatalogue, { once: true });
      link.addEventListener("touchstart", warmCatalogue, { once: true, passive: true });
    });

    return () => {
      observer.disconnect();
      links.forEach((link) => {
        link.removeEventListener("pointerenter", warmCatalogue);
        link.removeEventListener("touchstart", warmCatalogue);
      });
    };
  }, [targetId]);

  return null;
}
