import Image from "next/image";
import Link from "next/link";
import { getCategoryCount, getCategoryCover } from "../data/products";
import type { Category } from "../types";

type CategoryCardProps = { category: Category };

export function CategoryCard({ category }: CategoryCardProps) {
  const { slug, title, blurb } = category;
  const cover = getCategoryCover(slug);
  const count = getCategoryCount(slug);

  return (
    <li className="cc">
      <Link href={`/products/${slug}`} className="cc-link">
        <span className="cc-art">
          {cover && <Image src={cover.img.src} width={cover.img.w} height={cover.img.h} alt="" unoptimized className="cc-img" style={{ height: Math.min(168, Math.round(cover.img.h * 1.2)) }} />}
        </span>
        <span className="cc-body">
          <span className="cc-count">{count} products</span>
          <span className="cc-title">{title}</span>
          <span className="cc-blurb">{blurb}</span>
          <span className="cc-go" aria-hidden="true">
            Browse &rarr;
          </span>
        </span>
      </Link>
    </li>
  );
}
