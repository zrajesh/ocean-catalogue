import type { Product } from "../types";
import raw from "./products.json";
import { CATEGORIES } from "./categories";

export const PRODUCTS = raw as unknown as Product[];

export const getCategory = (slug: string) => CATEGORIES.find((category) => category.slug === slug);

export const getProductsByCategory = (slug: string) =>
  PRODUCTS.filter(({ category }) => category === slug).sort((a, b) => a.order - b.order);

export const getCategoryCount = (slug: string) => PRODUCTS.filter(({ category }) => category === slug).length;

export const getCategoryCover = (slug: string) => {
  const items = getProductsByCategory(slug);
  const pool = items.filter(({ isNew }) => !isNew);
  return (pool.length ? pool : items).reduce<Product | undefined>((best, item) => (!best || item.img.h > best.img.h ? item : best), undefined);
};
