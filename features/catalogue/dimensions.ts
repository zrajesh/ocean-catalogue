const LABELS: Record<string, string> = {
  TD: "Top diameter",
  BD: "Bottom diameter",
  FD: "Foot diameter",
  MD: "Max diameter",
  MAXD: "Max dimension",
  H: "Height",
  AC: "Across corner",
  L: "Length",
  W: "Width",
};

const SUFFIX: Record<string, string> = { AC: "across corner", L: "length" };

export const dimensionLabel = (key: string) => {
  const [base = key, suffix] = key.split(":");
  const label = LABELS[base] ?? base;
  const note = suffix ? SUFFIX[suffix] : null;
  return note ? `${label} (${note})` : label;
};

export const formatDimensions = (dims: Record<string, number>) =>
  Object.entries(dims).map(([key, value]) => ({ key, label: dimensionLabel(key), value }));

export const formatPacking = (packing: string) => {
  const [inner, carton] = packing.split("/");
  return carton ? `${inner} per inner box, ${carton} per carton` : `${inner} per carton`;
};
