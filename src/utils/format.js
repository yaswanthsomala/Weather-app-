// All API values are requested in metric; conversion happens on display so
// toggling units never triggers a refetch.

export const formatTemp = (celsius, unit) => {
  if (celsius == null || Number.isNaN(celsius)) return "--";
  const value = unit === "F" ? (celsius * 9) / 5 + 32 : celsius;
  return `${Math.round(value)}°`;
};

export const formatWind = (metersPerSecond, unit) =>
  unit === "F"
    ? `${Math.round(metersPerSecond * 2.237)} mph`
    : `${Math.round(metersPerSecond * 3.6)} km/h`;

export const formatVisibility = (meters, unit) => {
  if (meters == null) return "--";
  return unit === "F"
    ? `${(meters / 1609.34).toFixed(1)} mi`
    : `${(meters / 1000).toFixed(1)} km`;
};

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
export const windDirection = (deg) =>
  deg == null ? "" : COMPASS[Math.round(deg / 45) % 8];

// Shifts a unix timestamp into the city's local time. Format the result with
// timeZone "UTC" so the browser's own timezone doesn't leak in.
export const toCityDate = (unixSeconds, tzOffsetSeconds = 0) =>
  new Date((unixSeconds + tzOffsetSeconds) * 1000);

const fmt = (options) =>
  new Intl.DateTimeFormat(undefined, { timeZone: "UTC", ...options });

export const formatTime = (date) =>
  fmt({ hour: "numeric", minute: "2-digit" }).format(date);
export const formatHour = (date) => fmt({ hour: "numeric" }).format(date);
export const formatWeekday = (date) => fmt({ weekday: "long" }).format(date);
export const formatShortWeekday = (date) =>
  fmt({ weekday: "short" }).format(date);
export const formatFullDate = (date) =>
  fmt({ weekday: "long", month: "long", day: "numeric" }).format(date);

export const capitalize = (text = "") =>
  text.charAt(0).toUpperCase() + text.slice(1);
