import axios from "axios";

// Set in .env.local (see .env.example). Never commit a real key.
const API_KEY = process.env.REACT_APP_OWM_API_KEY;

const MISSING_KEY_MESSAGE =
  "No OpenWeather API key configured. Set REACT_APP_OWM_API_KEY in .env.local and restart the dev server.";

const weatherClient = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  params: { appid: API_KEY, units: "metric" },
  timeout: 10000,
});

const geoClient = axios.create({
  baseURL: "https://api.openweathermap.org/geo/1.0",
  params: { appid: API_KEY },
  timeout: 8000,
});

const requireKey = () => {
  if (!API_KEY) throw new Error(MISSING_KEY_MESSAGE);
};

// Fetches current conditions and the 5-day / 3-hour forecast in parallel.
export const fetchWeather = async ({ lat, lon }) => {
  requireKey();
  const params = { lat, lon };
  const [current, forecast] = await Promise.all([
    weatherClient.get("/weather", { params }),
    weatherClient.get("/forecast", { params }),
  ]);
  return { current: current.data, forecast: forecast.data };
};

// Worldwide city search. Accepts "London", "London, GB" or
// "Springfield, IL, US" style queries.
export const searchPlaces = async (query) => {
  requireKey();
  const { data } = await geoClient.get("/direct", {
    params: { q: query, limit: 8 },
  });
  // The API can return the same place more than once (e.g. per admin level).
  const seen = new Set();
  return data
    .map((place) => ({
      id: `${place.lat.toFixed(2)},${place.lon.toFixed(2)}`,
      name: place.local_names?.en || place.name,
      state: place.state,
      country: place.country,
      lat: place.lat,
      lon: place.lon,
      source: "search",
    }))
    .filter((place) => !seen.has(place.id) && seen.add(place.id));
};

export const iconUrl = (code, size = "2x") =>
  `https://openweathermap.org/img/wn/${code}@${size}.png`;
