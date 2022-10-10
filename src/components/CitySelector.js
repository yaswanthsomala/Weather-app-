import React from "react";
import Select from "react-select";

const CitySelector = ({ cities, onChange }) => {
  return (
    <div className="weatherBg">
      <h1 className="heading">Weather App</h1>
      <div className="d-grid gap-3 col-4 mt-4">
        <Select
          isClearable
          styles={{ marginLeft: "5px", width: "200px" }}
          closeMenuOnSelect={true}
          hideSelectedOptions={true}
          name="color"
          value={cities[0]}
          options={cities}
          className="basic-single"
          placeholder="Select City"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default CitySelector;
