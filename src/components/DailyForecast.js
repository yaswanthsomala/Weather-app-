import React from "react";
import { iconUrl } from "../api/weather";
import {
  capitalize,
  formatShortWeekday,
  formatTemp,
  formatWeekday,
} from "../utils/format";

const DailyForecast = ({ days, unit }) => {
  if (!days.length) return null;

  // Shared scale so each day's bar shows where it sits in the week's range.
  const low = Math.min(...days.map((d) => d.min));
  const high = Math.max(...days.map((d) => d.max));
  const span = high - low || 1;

  return (
    <section className="card" aria-labelledby="daily-title">
      <h3 id="daily-title" className="card__title">
        {days.length}-day forecast
      </h3>
      <ul className="daily">
        {days.map((day) => (
          <li className="daily__row" key={day.key}>
            <span className="daily__day">
              <span className="daily__day-long">{formatWeekday(day.date)}</span>
              <span className="daily__day-short">
                {formatShortWeekday(day.date)}
              </span>
            </span>
            <span className="daily__cond">
              <img
                src={iconUrl(day.weather.icon)}
                alt=""
                width="40"
                height="40"
              />
              <span className="daily__desc">
                {capitalize(day.weather.description)}
              </span>
            </span>
            <span className="daily__pop" title="Chance of precipitation">
              {day.pop >= 0.2 ? `${Math.round(day.pop * 100)}%` : ""}
            </span>
            <span className="daily__temps">
              <span className="daily__min">{formatTemp(day.min, unit)}</span>
              <span className="daily__bar" aria-hidden="true">
                <span
                  style={{
                    left: `${((day.min - low) / span) * 100}%`,
                    right: `${((high - day.max) / span) * 100}%`,
                  }}
                />
              </span>
              <span className="daily__max">{formatTemp(day.max, unit)}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DailyForecast;
