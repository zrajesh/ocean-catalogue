export type ProductImage = { src: string; w: number; h: number };

export type Product = {
  id: string;
  code: string;
  series: string;
  type: string | null;
  name: string;
  category: string;
  capacity: string | null;
  ml: number | null;
  dims: Record<string, number>;
  packing: string | null;
  isNew: boolean;
  img: ProductImage;
  order: number;
};

export type Category = { slug: string; title: string; blurb: string };
