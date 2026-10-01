import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

import CitySelector from "./components/CitySelector";
import UnitToggle from "./components/UnitToggle";
import CurrentWeather from "./components/CurrentWeather";
import WeatherDetails from "./components/WeatherDetails";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import { ErrorState, LoadingSkeleton } from "./components/StatusViews";
import ApiKeyForm from "./components/ApiKeyForm";

import { useWeather } from "./hooks/useWeather";
import { useGeolocation } from "./hooks/useGeolocation";
import { summarizeDays, themeFor } from "./utils/forecast";
import { FALLBACK_PLACE } from "./utils/places";

const STORAGE_KEY = "weather-app:prefs:v2";
const MAX_RECENTS = 5;

const isPlace = (p) =>
  p && typeof p.lat === "number" && typeof p.lon === "number" && p.name;

// mode "auto" means detect the location on every visit; "manual" restores the
// last searched place (recents[0]).
const loadPrefs = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const recents = Array.isArray(saved.recents)
      ? saved.recents.filter(isPlace).slice(0, MAX_RECENTS)
      : [];
    return {
      mode: saved.mode === "manual" && recents.length ? "manual" : "auto",
      unit: saved.unit === "F" ? "F" : "C",
      recents,
    };
  } catch {
    return { mode: "auto", unit: "C", recents: [] };
  }
};

const App = () => {
  const [prefs] = useState(loadPrefs);
  const [place, setPlace] = useState(
    prefs.mode === "manual" ? prefs.recents[0] : null
  );
  const [unit, setUnit] = useState(prefs.unit);
  const [recents, setRecents] = useState(prefs.recents);
  const [notice, setNotice] = useState(null);
  const [editingKey, setEditingKey] = useState(false);

  const placeRef = useRef(place);
  placeRef.current = place;

  const { locate, locating } = useGeolocation();
  const { data, loading, error, keyError, retry } = useWeather(place);

  const onKeySaved = () => {
    setEditingKey(false);
    retry();
  };

  const detectLocation = useCallback(async () => {
    try {
      const coords = await locate();
      setPlace({ id: "geo", name: "My location", source: "geo", ...coords });
      setNotice(null);
    } catch (err) {
      // Keep whatever is already showing; otherwise fall back to a known place.
      if (placeRef.current) {
        setNotice(err.message);
        return;
      }
      const fallback = recents[0] || FALLBACK_PLACE;
      setPlace(fallback);
      setNotice(
        `${err.message} Showing ${fallback.name} instead. Search for a city or allow location access.`
      );
    }
  }, [locate, recents]);

  // Auto-detect the base location on first visit (or when last used).
  useEffect(() => {
    if (prefs.mode === "auto") detectLocation();
    // Only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectPlace = (next) => {
    setPlace(next);
    setNotice(null);
    setRecents((list) =>
      [next, ...list.filter((p) => p.id !== next.id)].slice(0, MAX_RECENTS)
    );
  };

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          mode: place?.source === "search" ? "manual" : "auto",
          unit,
          recents,
        })
      );
    } catch {
      // Storage unavailable (private mode etc.) — preferences just won't persist.
    }
  }, [place, unit, recents]);

  const current = data?.current;
  const forecast = data?.forecast;
  const timezone = current?.timezone ?? 0;

  // A detected location only gets a real name once the weather arrives.
  const displayPlace = useMemo(() => {
    if (place?.source !== "geo" || !current) return place;
    return {
      ...place,
      name: current.name || "My location",
      country: current.sys?.country,
    };
  }, [place, current]);

  const days = useMemo(
    () => (forecast ? summarizeDays(forecast.list, timezone, current.dt) : []),
    [forecast, timezone, current]
  );

  const showSkeleton = (loading && !data) || (!place && locating);

  return (
    <div className={`app theme-${themeFor(current)}`}>
      <header className="topbar">
        <h1 className="brand">
          <span className="brand__mark" aria-hidden="true" />
          Weather
        </h1>
        <div className="topbar__controls">
          <CitySelector
            value={displayPlace}
            recents={recents}
            onSelect={selectPlace}
            onLocate={detectLocation}
            locating={locating}
          />
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
      </header>

      <main
        className={`content ${(loading || locating) && data ? "is-refreshing" : ""}`}
      >
        {notice && (
          <div className="notice" role="status">
            <span>{notice}</span>
            <button
              type="button"
              className="notice__close"
              onClick={() => setNotice(null)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {editingKey ? (
          <ApiKeyForm
            onSaved={onKeySaved}
            onCancel={() => setEditingKey(false)}
          />
        ) : keyError && !loading ? (
          <ApiKeyForm message={error} onSaved={onKeySaved} />
        ) : error && !loading ? (
          <ErrorState message={error} onRetry={retry} />
        ) : showSkeleton ? (
          <LoadingSkeleton />
        ) : current ? (
          <div className="layout">
            <CurrentWeather data={current} place={displayPlace} unit={unit} />
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
        {" · "}
        <button
          type="button"
          className="link-button"
          onClick={() => setEditingKey(true)}
        >
          API key
        </button>
      </footer>
    </div>
  );
};

export default App;
