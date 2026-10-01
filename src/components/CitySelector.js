import React, { useCallback, useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { searchPlaces } from "../api/weather";
import { countryFlag, placeLabel, placeSubtitle } from "../utils/places";

const selectStyles = {
  control: (base, { isFocused }) => ({
    ...base,
    minHeight: 44,
    borderRadius: 12,
    background: "rgba(255, 255, 255, 0.18)",
    borderColor: isFocused ? "rgba(255, 255, 255, 0.7)" : "transparent",
    boxShadow: "none",
    backdropFilter: "blur(12px)",
    cursor: "text",
    "&:hover": { borderColor: "rgba(255, 255, 255, 0.5)" },
  }),
  valueContainer: (base) => ({ ...base, paddingLeft: 40 }),
  input: (base) => ({ ...base, color: "#fff" }),
  singleValue: (base) => ({ ...base, color: "#fff", fontWeight: 500 }),
  placeholder: (base) => ({ ...base, color: "rgba(255, 255, 255, 0.75)" }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: () => ({ display: "none" }),
  loadingIndicator: (base) => ({ ...base, color: "rgba(255, 255, 255, 0.8)" }),
  menu: (base) => ({
    ...base,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.25)",
    zIndex: 10,
  }),
  groupHeading: (base) => ({ ...base, color: "#6b7385" }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    color: "#1c2333",
    background: isSelected ? "#dbe7ff" : isFocused ? "#f1f5ff" : "#fff",
    cursor: "pointer",
  }),
  noOptionsMessage: (base) => ({ ...base, color: "#6b7385" }),
  loadingMessage: (base) => ({ ...base, color: "#6b7385" }),
};

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const LocateIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 2v3M12 19v3M2 12h3M19 12h3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const formatOptionLabel = (place, { context }) => {
  if (place.source === "geo") {
    return <span className="place-option">📍 {place.name}</span>;
  }
  if (context === "value") {
    return (
      <span className="place-option">
        {countryFlag(place.country)} {place.name}
      </span>
    );
  }
  return (
    <span className="place-option">
      <span className="place-option__flag" aria-hidden="true">
        {countryFlag(place.country)}
      </span>
      <span>
        <span className="place-option__name">{place.name}</span>
        <span className="place-option__sub">{placeSubtitle(place)}</span>
      </span>
    </span>
  );
};

const SEARCH_DELAY_MS = 350;

const CitySelector = ({ value, recents, onSelect, onLocate, locating }) => {
  const timer = useRef();
  const cache = useRef(new Map());
  const [searchError, setSearchError] = useState(null);

  // Debounced, cached lookups against the geocoding API.
  const loadOptions = useCallback((input, callback) => {
    const query = input.trim().toLowerCase();
    clearTimeout(timer.current);
    if (query.length < 2) return callback([]);
    if (cache.current.has(query)) return callback(cache.current.get(query));

    timer.current = setTimeout(() => {
      searchPlaces(query)
        .then((places) => {
          cache.current.set(query, places);
          setSearchError(null);
          callback(places);
        })
        .catch((err) => {
          setSearchError(
            err.response?.data?.message || err.message || "Search failed."
          );
          callback([]);
        });
    }, SEARCH_DELAY_MS);
  }, []);

  const defaultOptions = recents.length
    ? [{ label: "Recent", options: recents }]
    : [];

  return (
    <div className="search">
      <div className="city-selector">
        <span className="city-selector__icon">
          <SearchIcon />
        </span>
        <AsyncSelect
          inputId="city-search"
          aria-label="Search for a city anywhere in the world"
          defaultOptions={defaultOptions}
          loadOptions={loadOptions}
          value={value}
          onChange={(place) => place && onSelect(place)}
          getOptionLabel={placeLabel}
          getOptionValue={(place) => place.id}
          formatOptionLabel={formatOptionLabel}
          placeholder="Search any city…"
          styles={selectStyles}
          loadingMessage={() => "Searching…"}
          noOptionsMessage={({ inputValue }) =>
            searchError && inputValue.trim().length >= 2
              ? searchError
              : inputValue.trim().length < 2
              ? "Type a city name, e.g. Tokyo or Lima, PE"
              : "No matching places"
          }
          maxMenuHeight={320}
        />
      </div>
      <button
        type="button"
        className={`icon-button ${locating ? "is-busy" : ""}`}
        onClick={onLocate}
        disabled={locating}
        aria-label="Use my current location"
        title="Use my current location"
      >
        <LocateIcon />
      </button>
    </div>
  );
};

export default CitySelector;
