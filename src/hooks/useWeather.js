import { useCallback, useEffect, useState } from "react";
import { API_KEY_INVALID, API_KEY_MISSING, fetchWeather } from "../api/weather";

const KEY_ERRORS = [API_KEY_MISSING, API_KEY_INVALID];

export const useWeather = (place) => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
    keyError: false,
  });
  const [attempt, setAttempt] = useState(0);

  const lat = place?.lat;
  const lon = place?.lon;

  useEffect(() => {
    if (lat == null || lon == null) return;
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null, keyError: false }));

    fetchWeather({ lat, lon })
      .then((data) => {
        if (!cancelled)
          setState({ data, loading: false, error: null, keyError: false });
      })
      .catch((err) => {
        if (cancelled) return;
        const keyError = KEY_ERRORS.includes(err.code);
        const message =
          (keyError && err.message) ||
          err.response?.data?.message ||
          (err.code === "ECONNABORTED"
            ? "The request timed out."
            : "Couldn't reach the weather service.");
        setState((prev) => ({
          ...prev,
          loading: false,
          error: message,
          keyError,
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lon, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
};
