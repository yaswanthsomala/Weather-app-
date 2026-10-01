// Helpers for describing places: country names, flags and labels.

let regionNames;
try {
  regionNames = new Intl.DisplayNames(undefined, { type: "region" });
} catch {
  regionNames = null;
}

export const countryName = (code) => {
  if (!code) return "";
  try {
    return regionNames?.of(code) || code;
  } catch {
    return code;
  }
};

// Turns an ISO 3166-1 alpha-2 code into its flag emoji.
export const countryFlag = (code) =>
  code && /^[A-Za-z]{2}$/.test(code)
    ? String.fromCodePoint(
        ...[...code.toUpperCase()].map((c) => 127397 + c.charCodeAt(0))
      )
    : "";

export const placeSubtitle = ({ state, country }) =>
  [state, countryName(country)].filter(Boolean).join(", ");

export const placeLabel = (place) =>
  [place.name, placeSubtitle(place)].filter(Boolean).join(", ");

// Shown when location access is unavailable and nothing was saved.
export const FALLBACK_PLACE = {
  id: "51.51,-0.13",
  name: "London",
  state: "England",
  country: "GB",
  lat: 51.5073,
  lon: -0.1277,
  source: "search",
};
