import axios from "axios";

// The key comes from the browser (entered in the app) or, failing that, from
// REACT_APP_OWM_API_KEY in .env.local. Never commit a real key.
const ENV_API_KEY = process.env.REACT_APP_OWM_API_KEY;
const KEY_STORAGE = "weather-app:api-key";

export const getApiKey = () => {
  try {
    return localStorage.getItem(KEY_STORAGE) || ENV_API_KEY || "";
  } catch {
    return ENV_API_KEY || "";
  }
};

export const hasStoredApiKey = () => {
  try {
    return Boolean(localStorage.getItem(KEY_STORAGE));
  } catch {
    return false;
  }
};

export const saveApiKey = (key) => {
  try {
    localStorage.setItem(KEY_STORAGE, key.trim());
    return true;
  } catch {
    return false;
  }
};

export const clearApiKey = () => {
  try {
    localStorage.removeItem(KEY_STORAGE);
  } catch {
    // Nothing stored.
  }
};

// Errors the UI handles by asking for a key instead of offering a retry.
export const API_KEY_MISSING = "API_KEY_MISSING";
export const API_KEY_INVALID = "API_KEY_INVALID";

const keyError = (code, message) => Object.assign(new Error(message), { code });

const weatherClient = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  params: { units: "metric" },
  timeout: 10000,
});

const geoClient = axios.create({
  baseURL: "https://api.openweathermap.org/geo/1.0",
  timeout: 8000,
});

// Attach the current key to every request and translate a 401 into a key error.
[weatherClient, geoClient].forEach((client) => {
  client.interceptors.request.use((config) => {
    const appid = config.params?.appid || getApiKey();
    if (!appid) {
      throw keyError(API_KEY_MISSING, "Add an OpenWeather API key to load weather.");
    }
    config.params = { ...config.params, appid };
    return config;
  });
  client.interceptors.response.use(undefined, (err) => {
    if (err.response?.status === 401) {
      throw keyError(
        API_KEY_INVALID,
        "OpenWeather rejected the API key. New keys can take up to 2 hours to activate."
      );
    }
    throw err;
  });
});

// Checks a key with one cheap request before it is saved.
export const validateApiKey = (key) =>
  weatherClient.get("/weather", { params: { lat: 0, lon: 0, appid: key.trim() } });

// Fetches current conditions and the 5-day / 3-hour forecast in parallel.
export const fetchWeather = async ({ lat, lon }) => {
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
