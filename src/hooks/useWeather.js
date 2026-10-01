import { useCallback, useEffect, useState } from "react";
import { fetchWeather } from "../api/weather";

export const useWeather = (place) => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });
  const [attempt, setAttempt] = useState(0);

  const lat = place?.lat;
  const lon = place?.lon;

  useEffect(() => {
    if (lat == null || lon == null) return;
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetchWeather({ lat, lon })
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err.response?.data?.message ||
          (!err.request && err.message) ||
          (err.code === "ECONNABORTED"
            ? "The request timed out."
            : "Couldn't reach the weather service.");
        setState((prev) => ({ ...prev, loading: false, error: message }));
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lon, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
};
