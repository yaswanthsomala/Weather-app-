import { useEffect, useMemo, useState } from "react";
import "./App.css";

import CitySelector from "./components/CitySelector";
import UnitToggle from "./components/UnitToggle";
import CurrentWeather from "./components/CurrentWeather";
import WeatherDetails from "./components/WeatherDetails";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import { ErrorState, LoadingSkeleton } from "./components/StatusViews";

import { useWeather } from "./hooks/useWeather";
import { cityOptions, DEFAULT_CITY } from "./utils/cities";
import { summarizeDays, themeFor } from "./utils/forecast";

const STORAGE_KEY = "weather-app:prefs";

const loadPrefs = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    return {
      city: cityOptions.find((c) => c.value === saved.cityId) || DEFAULT_CITY,
      unit: saved.unit === "F" ? "F" : "C",
    };
  } catch {
    return { city: DEFAULT_CITY, unit: "C" };
  }
};

const App = () => {
  const [prefs] = useState(loadPrefs);
  const [city, setCity] = useState(prefs.city);
  const [unit, setUnit] = useState(prefs.unit);
  const { data, loading, error, retry } = useWeather(city);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ cityId: city.value, unit })
      );
    } catch {
      // Storage unavailable (private mode etc.) — preferences just won't persist.
    }
  }, [city, unit]);

  const current = data?.current;
  const forecast = data?.forecast;
  const timezone = current?.timezone ?? 0;

  const days = useMemo(
    () => (forecast ? summarizeDays(forecast.list, timezone, current.dt) : []),
    [forecast, timezone, current]
  );

  const showSkeleton = loading && !data;

  return (
    <div className={`app theme-${themeFor(current)}`}>
      <header className="topbar">
        <h1 className="brand">
          <span className="brand__mark" aria-hidden="true" />
          Weather
        </h1>
        <div className="topbar__controls">
          <CitySelector cities={cityOptions} value={city} onChange={setCity} />
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
      </header>

      <main className={`content ${loading && data ? "is-refreshing" : ""}`}>
        {error && !loading ? (
          <ErrorState message={error} onRetry={retry} />
        ) : showSkeleton ? (
          <LoadingSkeleton />
        ) : current ? (
          <div className="layout">
            <CurrentWeather data={current} unit={unit} />
            <WeatherDetails data={current} unit={unit} />
            <HourlyForecast list={forecast.list} timezone={timezone} unit={unit} />
            <DailyForecast days={days} unit={unit} />
          </div>
        ) : null}
      </main>

      <footer className="footer">
        Data from{" "}
        <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">
          OpenWeather
        </a>
      </footer>
    </div>
  );
};

export default App;
