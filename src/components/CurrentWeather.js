import React from "react";
import { iconUrl } from "../api/weather";
import {
  capitalize,
  formatFullDate,
  formatTemp,
  formatTime,
  toCityDate,
} from "../utils/format";

const CurrentWeather = ({ data, unit }) => {
  const { name, sys, main, weather, dt, timezone } = data;
  const condition = weather[0];

  return (
    <section className="card current" aria-labelledby="current-city">
      <div className="current__meta">
        <h2 id="current-city" className="current__city">
          {name}
          {sys?.country && <span className="current__country">{sys.country}</span>}
        </h2>
        <p className="current__date">
          {formatFullDate(toCityDate(dt, timezone))} · Updated{" "}
          {formatTime(toCityDate(dt, timezone))}
        </p>
      </div>

      <div className="current__body">
        <img
          className="current__icon"
          src={iconUrl(condition.icon, "4x")}
          alt=""
          width="128"
          height="128"
        />
        <div>
          <div className="current__temp">{formatTemp(main.temp, unit)}</div>
          <div className="current__desc">{capitalize(condition.description)}</div>
          <div className="current__range">
            H {formatTemp(main.temp_max, unit)} · L{" "}
            {formatTemp(main.temp_min, unit)} · Feels like{" "}
            {formatTemp(main.feels_like, unit)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentWeather;
