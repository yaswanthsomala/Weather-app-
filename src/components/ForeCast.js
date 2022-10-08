import React from "react";

const Forecast = ({ data, forecastTiles, getIcon, getDayInfo, getInfo }) => {
  return (
    <div className="container">
      <div className="row">
        {Object.values(data).length ? (
          <div className="col">
            <div className="gap-1">
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
          </div>
        ) : null}
        {forecastTiles.map((item, i) => (
          <>
            <div className="col">
              <div key={i} style={{ padding: "20px 10px 20px 10px" }}>
                <img src={getIcon(item)} alt="" />
                {getDayInfo(item)}
              </div>
            </div>
            <div className="col">{getInfo(item)}</div>
          </>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
