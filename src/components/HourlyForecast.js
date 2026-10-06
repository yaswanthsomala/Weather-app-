import React from "react";
import { iconUrl } from "../api/weather";
import { formatHour, formatTemp, toCityDate } from "../utils/format";

// Next 24 hours, in 3-hour steps.
const HourlyForecast = ({ list, timezone, unit }) => (
  <section className="card" aria-labelledby="hourly-title">
    <h3 id="hourly-title" className="card__title">
      Next 24 hours
    </h3>
    <ol className="hourly">
      {list.slice(0, 8).map((item, i) => (
        <li className="hourly__item" key={item.dt}>
          <span className="hourly__time">
            {i === 0 ? "Now" : formatHour(toCityDate(item.dt, timezone))}
          </span>
          <img
            src={iconUrl(item.weather[0].icon)}
            alt={item.weather[0].description}
            width="48"
            height="48"
          />
          <span className="hourly__temp">{formatTemp(item.main.temp, unit)}</span>
          {item.pop >= 0.2 && (
            <span className="hourly__pop">{Math.round(item.pop * 100)}%</span>
          )}
        </li>
      ))}
    </ol>
  </section>
);

export default HourlyForecast;
