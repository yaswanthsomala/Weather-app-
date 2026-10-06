import React from "react";
import {
  formatTime,
  formatVisibility,
  formatWind,
  toCityDate,
  windDirection,
} from "../utils/format";

const WeatherDetails = ({ data, unit }) => {
  const { main, wind, visibility, sys, clouds, timezone } = data;

  const items = [
    { label: "Humidity", value: `${main.humidity}%` },
    {
      label: "Wind",
      value: formatWind(wind.speed, unit),
      hint: windDirection(wind.deg),
    },
    { label: "Pressure", value: `${main.pressure} hPa` },
    { label: "Visibility", value: formatVisibility(visibility, unit) },
    { label: "Cloud cover", value: `${clouds?.all ?? 0}%` },
    {
      label: "Sunrise / Sunset",
      value: `${formatTime(toCityDate(sys.sunrise, timezone))} / ${formatTime(
        toCityDate(sys.sunset, timezone)
      )}`,
    },
  ];

  return (
    <section className="card" aria-labelledby="details-title">
      <h3 id="details-title" className="card__title">
        Current details
      </h3>
      <dl className="details">
        {items.map(({ label, value, hint }) => (
          <div className="details__item" key={label}>
            <dt>{label}</dt>
            <dd>
              {value}
              {hint && <span className="details__hint"> {hint}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default WeatherDetails;
