"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { waLink } from "@/features/landing/content";
import { formatDimensions, formatPacking } from "../dimensions";
import type { Product } from "../types";

type ProductDialogProps = { product: Product | null; onClose: () => void };

export function ProductDialog({ product, onClose }: ProductDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (product && !dialog.open) dialog.showModal();
    if (!product && dialog.open) dialog.close();
  }, [product]);

  const { id = "", name = "", code = "", series = "", capacity = null, dims = {}, packing = null, isNew = false, img } = product ?? {};
  const rows = formatDimensions(dims);
  const enquiry = waLink(`Hi, I'd like a quote for ${name} (code ${code})${capacity ? `, ${capacity}` : ""}.\nQuantity: `);

  return (
    <dialog
      ref={ref}
      className="pd"
      aria-labelledby="pd-title"
      onClose={onClose}
      onClick={(event) => event.target === ref.current && onClose()}
    >
      {product && img && (
        <div className="pd-inner" key={id}>
          <button type="button" className="pd-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
          <div className="pd-art">
            <Image src={img.src} width={img.w} height={img.h} alt={`${name} glass`} unoptimized className="pd-img" style={{ height: Math.min(360, Math.round(img.h * 1.6)) }} />
          </div>
          <div className="pd-info">
            <p className="pd-eyebrow">
              {series}
              {isNew && <span className="pd-new">New</span>}
            </p>
            <h2 id="pd-title">{name}</h2>
            <p className="pd-code">Item code {code}</p>
            <dl className="pd-specs">
              {capacity && (
                <div>
                  <dt>Capacity</dt>
                  <dd>{capacity}</dd>
                </div>
              )}
              {rows.map(({ key, label, value }) => (
                <div key={key}>
                  <dt>{label}</dt>
                  <dd>{value} mm</dd>
                </div>
              ))}
              {packing && (
                <div>
                  <dt>Packing</dt>
                  <dd>{formatPacking(packing)}</dd>
                </div>
              )}
            </dl>
            <a className="btn gold pd-cta" href={enquiry} target="_blank" rel="noopener noreferrer">
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      )}
    </dialog>
  );
}
