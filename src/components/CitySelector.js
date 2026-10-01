import React from "react";
import Select from "react-select";

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
  dropdownIndicator: (base) => ({ ...base, color: "rgba(255, 255, 255, 0.8)" }),
  menu: (base) => ({
    ...base,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.25)",
    zIndex: 10,
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    color: "#1c2333",
    background: isSelected ? "#dbe7ff" : isFocused ? "#f1f5ff" : "#fff",
    cursor: "pointer",
  }),
};

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CitySelector = ({ cities, value, onChange }) => (
  <div className="city-selector">
    <span className="city-selector__icon">
      <SearchIcon />
    </span>
    <Select
      inputId="city-search"
      aria-label="Search for a city"
      options={cities}
      value={value}
      onChange={(option) => option && onChange(option)}
      placeholder="Search for a city…"
      styles={selectStyles}
      noOptionsMessage={() => "No matching city"}
      // The list has thousands of entries; only render matches once typing.
      filterOption={(option, input) =>
        option.label.toLowerCase().startsWith(input.toLowerCase())
      }
      maxMenuHeight={280}
    />
  </div>
);

export default CitySelector;
