import { Json } from "../frJson";

// Deduplicated, alphabetised city options for the selector. The dataset has
// many same-name entries; the first occurrence wins.
export const cityOptions = (() => {
  const byName = new Map();
  Json.forEach(({ id, nm, lat, lon }) => {
    if (nm && !byName.has(nm)) {
      byName.set(nm, { value: id, label: nm, lat, lon });
    }
  });
  return [...byName.values()].sort((a, b) => a.label.localeCompare(b.label));
})();

export const DEFAULT_CITY =
  cityOptions.find((c) => c.label === "Paris") || cityOptions[0];
