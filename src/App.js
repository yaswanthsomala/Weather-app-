import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import { Json } from "./frJson";

import Forecast from "./components/ForeCast";
import CitySelector from "./components/CitySelector";

import loader from "./Spinner.gif";

const App = () => {
  const apiKey = "114b1c822d3b4540a2d6ccd02edd1f9e";
  const [weatherData, setWeatherData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [cities, setCities] = useState([]);

  // Set dropdown cities data
  const onSetCityData = () => {
    const cityData = [];
    Json.forEach((c) => {
      if (c.nm) {
        cityData.push({ value: c.nm, label: c.nm });
      }
    });
    const cityDataCpy = [...new Set(cityData)];
    setCities(cityDataCpy);
    return cityDataCpy;
  };

  // render the cities data in dropdown
  useEffect(() => {
    onSetCityData();
    getWeatherDetails(Json[0].nm);
  }, []);

  // On select city
  const onChange = (value) => {
    getWeatherDetails(value?.value);
  };

  // get weather details for selected city
  const getWeatherDetails = async (formData) => {
    let lat = "";
    let lon = "";
    if (!formData) return;
    setLoading(true);

    const getUrl1 = `https://api.openweathermap.org/data/2.5/weather?q=${formData}&appid=${apiKey}`;
    await axios
      .get(getUrl1)
      .then((res) => {
        setWeatherData(res.data);
        lat = res.data.coord.lat;
        lon = res.data.coord.lat;
      })
      .catch((err) => console.log("err", err));

    // if (!lon || !lat) return;
    const getUrl2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    axios
      .get(getUrl2)
      .then((res) => {
        setForecastData(res.data?.list);
      })
      .catch((err) => console.log("err", err));
    setTimeout(() => setLoading(false), 2000);
  };

  // Filters the data by date and returns an Object containing a list of 3-day forecast.
  const _groupByDays = (data) => {
    return data.reduce((list, item) => {
      const forecastDate = item.dt_txt.substr(0, 10);
      list[forecastDate] = list[forecastDate] || [];
      list[forecastDate].push(item);

      return list;
    }, {});
  };

  // Returns week of the day
  const _getDayInfo = (data) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[new Date(data?.[0]?.dt * 1000).getDay()];
  };

  // Gets the Minimum, Maximum and Avg Humidity temperatures of the day.
  const _getInfo = (data, min = [], max = [], humidity = []) => {
    data.forEach((item) => {
      max.push(item.main.temp_max);
      min.push(item.main.temp_min);
      humidity.push(item.main.humidity);
    });

    const minMax = {
      min: Math.round(Math.min(...min)),
      max: Math.round(Math.max(...max)),
    };

    // Gets the day's average humdity
    const avgHumdity = Math.round(
      humidity.reduce((curr, next) => curr + next) / humidity.length
    );

    return (
      <div className="weather-info text-center">
        <div className="min-max">
          <strong>{`${(minMax.max - 273.15).toFixed(2)}°C`}</strong> /{" "}
          {`${(minMax.min - 273.15).toFixed(2)}°C`}
        </div>
        <div>{`Avg. Humidity: ${avgHumdity}%`}</div>
      </div>
    );
  };

  // Fetches the icon using the icon code available in the forecast data.
  const _getIcon = (data) =>
    `https://openweathermap.org/img/w/${data?.[0]?.weather?.[0]?.icon}.png`;

  const tiles = Object.values(_groupByDays(forecastData));

  // Edge case:
  // When the webservice returns data for 6 calendar days during evenings as a result of offset,
  // this ensures that we are showing only 3-days of forecast.
  const forecastTiles = tiles.length > 3 ? tiles.slice(0, 3) : tiles;

  // const loading = setTimeout(() => isLoading, 2000);
  return (
    <div className="app">
      <div className="col-md-12">
        <CitySelector cities={cities} onChange={onChange} />
        <div
          style={{
            backgroundColor: "black",
            height: "50vh",
          }}
        >
          {isLoading ? (
            <div
              style={{
                position: "absolute",
                top: "70vh",
                left: "50%",
              }}
            >
              <img src={`${loader}`} alt="" />
            </div>
          ) : (
            <Forecast
              data={weatherData}
              forecastTiles={forecastTiles}
              getIcon={_getIcon}
              getDayInfo={_getDayInfo}
              getInfo={_getInfo}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
