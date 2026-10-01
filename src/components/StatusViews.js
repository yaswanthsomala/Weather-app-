import React from "react";

export const LoadingSkeleton = () => (
  <div className="layout" aria-busy="true" aria-label="Loading weather">
    <div className="card skeleton skeleton--hero" />
    <div className="card skeleton skeleton--block" />
    <div className="card skeleton skeleton--block" />
    <div className="card skeleton skeleton--tall" />
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="card status" role="alert">
    <h2>Weather unavailable</h2>
    <p>{message}</p>
    <button type="button" className="button" onClick={onRetry}>
      Try again
    </button>
  </div>
);
