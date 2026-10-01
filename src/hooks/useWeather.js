import { useCallback, useEffect, useState } from "react";
import { fetchWeather } from "../api/weather";

export const useWeather = (city) => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!city) return;
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetchWeather(city)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err.response?.data?.message ||
          (err.code === "ECONNABORTED"
            ? "The request timed out."
            : "Couldn't reach the weather service.");
        setState((prev) => ({ ...prev, loading: false, error: message }));
      });

    return () => {
      cancelled = true;
    };
  }, [city, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
};
