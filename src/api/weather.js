import axios from "axios";

const API_KEY =
  process.env.REACT_APP_OWM_API_KEY || "114b1c822d3b4540a2d6ccd02edd1f9e";

const client = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  params: { appid: API_KEY, units: "metric" },
  timeout: 10000,
});

// Fetches current conditions and the 5-day / 3-hour forecast in parallel.
export const fetchWeather = async ({ lat, lon }) => {
  const params = { lat, lon };
  const [current, forecast] = await Promise.all([
    client.get("/weather", { params }),
    client.get("/forecast", { params }),
  ]);
  return { current: current.data, forecast: forecast.data };
};

export const iconUrl = (code, size = "2x") =>
  `https://openweathermap.org/img/wn/${code}@${size}.png`;
