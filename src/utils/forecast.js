import { toCityDate } from "./format";

const dateKey = (date) => date.toISOString().slice(0, 10);

// Picks the most frequent value; ties go to the entry closest to midday.
const dominantCondition = (items) => {
  const counts = {};
  items.forEach((item) => {
    const id = item.weather[0].main;
    counts[id] = (counts[id] || 0) + 1;
  });
  const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  const candidates = items.filter((item) => item.weather[0].main === top);
  const midday = candidates.reduce((best, item) =>
    Math.abs(item.hour - 13) < Math.abs(best.hour - 13) ? item : best
  );
  return midday.weather[0];
};

// Groups 3-hour forecast entries into per-day summaries in the city's local
// time, skipping today (covered by the current conditions and hourly strip).
export const summarizeDays = (list = [], tzOffset = 0, nowUnix) => {
  const today = dateKey(toCityDate(nowUnix, tzOffset));
  const groups = {};

  list.forEach((item) => {
    const local = toCityDate(item.dt, tzOffset);
    const key = dateKey(local);
    if (key === today) return;
    (groups[key] = groups[key] || []).push({
      ...item,
      hour: local.getUTCHours(),
      local,
    });
  });

  return Object.entries(groups)
    .filter(([, items]) => items.length >= 4) // drop partial trailing days
    .map(([key, items]) => ({
      key,
      date: items[0].local,
      min: Math.min(...items.map((i) => i.main.temp_min)),
      max: Math.max(...items.map((i) => i.main.temp_max)),
      humidity: Math.round(
        items.reduce((sum, i) => sum + i.main.humidity, 0) / items.length
      ),
      pop: Math.max(...items.map((i) => i.pop || 0)),
      weather: dominantCondition(items),
    }));
};

// Maps an OpenWeather condition to a background theme name.
export const themeFor = (current) => {
  if (!current) return "default";
  const { main, icon = "" } = current.weather?.[0] || {};
  const night = icon.endsWith("n");
  switch (main) {
    case "Clear":
      return night ? "clear-night" : "clear";
    case "Clouds":
      return night ? "clouds-night" : "clouds";
    case "Rain":
    case "Drizzle":
      return "rain";
    case "Thunderstorm":
      return "storm";
    case "Snow":
      return "snow";
    default:
      return night ? "clouds-night" : "mist";
  }
};
