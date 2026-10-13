import Image from "next/image";
import type { Product } from "../types";

type ProductCardProps = { product: Product; onSelect: (product: Product) => void };

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const { name, code, capacity, isNew, img } = product;
  const { src, w, h } = img;

  return (
    <li className="pc">
      <button type="button" className="pc-btn" onClick={() => onSelect(product)} aria-label={`${name}, code ${code}. View details`}>
        <span className="pc-art">
          {isNew && <span className="pc-new">New</span>}
          <Image src={src} width={w} height={h} alt="" sizes="(max-width:560px) 45vw, 200px" unoptimized className="pc-img" style={{ height: Math.min(168, Math.round(h * 1.2)) }} />
        </span>
        <span className="pc-body">
          <span className="pc-code">{code}</span>
          <span className="pc-name">{name}</span>
          {capacity && <span className="pc-cap">{capacity}</span>}
        </span>
      </button>
    </li>
  );
}
