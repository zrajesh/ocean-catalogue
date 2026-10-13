"use client";

import { useMemo, useState } from "react";
import type { Product } from "../types";
import { ProductCard } from "./ProductCard";
import { ProductDialog } from "./ProductDialog";

type SortKey = "range" | "small" | "large";

const ALL = "all";
const norm = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "");
const bySize = (dir: 1 | -1) => (a: Product, b: Product) => ((a.ml ?? 1e9) - (b.ml ?? 1e9)) * dir;

const groupBySeries = (items: Product[]) => {
  const groups = new Map<string, Product[]>();
  items.forEach((item) => groups.set(item.series, [...(groups.get(item.series) ?? []), item]));
  return [...groups.entries()];
};

type ProductBrowserProps = { products: Product[] };

export function ProductBrowser({ products }: ProductBrowserProps) {
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState(ALL);
  const [sort, setSort] = useState<SortKey>("range");
  const [selected, setSelected] = useState<Product | null>(null);

  const seriesList = useMemo(() => groupBySeries(products).map(([name, items]) => ({ name, count: items.length })), [products]);

  const visible = useMemo(() => {
    const needle = norm(query);
    const matched = products.filter(
      (item) => (series === ALL || item.series === series) && (!needle || norm(`${item.code}${item.name}${item.series}${item.capacity ?? ""}`).includes(needle)),
    );
    if (sort === "small") return [...matched].sort(bySize(1));
    if (sort === "large") return [...matched].sort(bySize(-1));
    return matched;
  }, [products, query, series, sort]);

  const grouped = sort === "range" ? groupBySeries(visible) : [["", visible] as [string, Product[]]];
  const hasFilters = query !== "" || series !== ALL || sort !== "range";
  const reset = () => {
    setQuery("");
    setSeries(ALL);
    setSort("range");
  };

  return (
    <div className="pb">
      <div className="pb-bar">
        <label className="pb-search">
          <span className="sr-only">Search by name, code or size</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, code or size" autoComplete="off" />
        </label>
        <label className="pb-sort">
          <span className="sr-only">Sort</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
            <option value="range">Catalogue order</option>
            <option value="small">Capacity: small to large</option>
            <option value="large">Capacity: large to small</option>
          </select>
        </label>
      </div>

      {seriesList.length > 1 && (
        <div className="pb-chips" role="group" aria-label="Filter by collection">
          <button type="button" className="chip" aria-pressed={series === ALL} onClick={() => setSeries(ALL)}>
            All <span>{products.length}</span>
          </button>
          {seriesList.map(({ name, count }) => (
            <button key={name} type="button" className="chip" aria-pressed={series === name} onClick={() => setSeries(name)}>
              {name} <span>{count}</span>
            </button>
          ))}
        </div>
      )}

      <p className="pb-count" role="status" aria-live="polite">
        Showing {visible.length} of {products.length} products
        {hasFilters && (
          <button type="button" className="pb-reset" onClick={reset}>
            Clear filters
          </button>
        )}
      </p>

      {visible.length === 0 ? (
        <div className="pb-empty">
          <h3>No products match</h3>
          <p>Try a different name or product code, or clear the filters.</p>
          <button type="button" className="btn gold" onClick={reset}>
            Clear filters
          </button>
        </div>
      ) : (
        grouped.map(([name, items]) => (
          <section key={name || "all"} className="pb-group">
            {name && (
              <h2 className="pb-series">
                {name} <span>{items.length} {items.length === 1 ? "item" : "items"}</span>
              </h2>
            )}
            <ul className="pb-grid">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} onSelect={setSelected} />
              ))}
            </ul>
          </section>
        ))
      )}

      <ProductDialog product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
