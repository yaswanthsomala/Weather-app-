import { useCallback, useState } from "react";

const ERROR_MESSAGES = {
  1: "Location access was denied.",
  2: "Your location couldn't be determined.",
  3: "Finding your location took too long.",
};

// Wraps navigator.geolocation in a promise-friendly hook.
export const useGeolocation = () => {
  const [status, setStatus] = useState("idle"); // idle | locating | error

  const locate = useCallback(
    () =>
      new Promise((resolve, reject) => {
        if (!("geolocation" in navigator)) {
          setStatus("error");
          reject(new Error("This browser doesn't support location detection."));
          return;
        }
        setStatus("locating");
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            setStatus("idle");
            resolve({ lat: coords.latitude, lon: coords.longitude });
          },
          (err) => {
            setStatus("error");
            reject(new Error(ERROR_MESSAGES[err.code] || err.message));
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 }
        );
      }),
    []
  );

  return { locate, locating: status === "locating" };
};
