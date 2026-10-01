import React from "react";

const UnitToggle = ({ unit, onChange }) => (
  <div className="unit-toggle" role="group" aria-label="Temperature unit">
    {["C", "F"].map((u) => (
      <button
        key={u}
        type="button"
        className={unit === u ? "is-active" : ""}
        aria-pressed={unit === u}
        onClick={() => onChange(u)}
      >
        °{u}
      </button>
    ))}
  </div>
);

export default UnitToggle;
