import React from "react";

const Forecast = ({ data, forecastTiles, getIcon, getDayInfo, getInfo }) => {
  return (
    <div className="container">
      <div className="row">
        {Object.values(data).length ? (
          <div className="col d-grid gap-2 mt-4 primary-info">
            <img
              className="weather-icon"
              src="https://i.pinimg.com/originals/77/0b/80/770b805d5c99c7931366c2e84e88f251.png"
              alt=""
            />
            <h5 className="weather-city">{data?.name}</h5>
            <h6 className="weather-temp">
              {(data?.main?.temp - 273.15).toFixed(2)}°C
            </h6>
          </div>
        ) : null}
      </div>
      <div className="row">
        {forecastTiles.map((item, i) => (
          <div className="col">
            <div key={i} className="text-center" style={{ color: "#fff" }}>
              <img src={getIcon(item)} alt="" />
              {getDayInfo(item)}
            </div>
            <div>{getInfo(item)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
