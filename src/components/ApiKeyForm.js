import React, { useState } from "react";
import {
  API_KEY_INVALID,
  clearApiKey,
  hasStoredApiKey,
  saveApiKey,
  validateApiKey,
} from "../api/weather";

const ApiKeyForm = ({ message, onSaved }) => {
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);
  const [canForce, setCanForce] = useState(false);
  const stored = hasStoredApiKey();

  const store = () => {
    if (!saveApiKey(value)) {
      setError("Your browser blocked saving the key (private mode?).");
      return;
    }
    onSaved();
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    setChecking(true);
    setError(null);
    setCanForce(false);
    try {
      await validateApiKey(value);
      store();
    } catch (err) {
      setError(
        err.code === API_KEY_INVALID
          ? err.message
          : "Couldn't reach OpenWeather to check the key."
      );
      setCanForce(true);
    } finally {
      setChecking(false);
    }
  };

  const remove = () => {
    clearApiKey();
    onSaved();
  };

  return (
    <form className="card key-form" onSubmit={submit}>
      <h2>OpenWeather API key</h2>
      <p className="key-form__lead">
        {message ||
          "Weather and city search need a free OpenWeather API key."}{" "}
        Get one at{" "}
        <a
          href="https://home.openweathermap.org/api_keys"
          target="_blank"
          rel="noreferrer"
        >
          openweathermap.org
        </a>
        . It's saved only in this browser.
      </p>

      <label htmlFor="api-key" className="key-form__label">
        API key
      </label>
      <div className="key-form__row">
        <input
          id="api-key"
          className="key-form__input"
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
            setCanForce(false);
          }}
          placeholder="Paste your key"
          autoComplete="off"
          spellCheck="false"
          autoFocus
        />
        <button
          type="button"
          className="key-form__toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide key" : "Show key"}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>

      {error && (
        <p className="key-form__error" role="alert">
          {error}
        </p>
      )}

      <div className="key-form__actions">
        <button
          type="submit"
          className="button"
          disabled={checking || !value.trim()}
        >
          {checking ? "Checking…" : "Save key"}
        </button>
        {canForce && (
          <button type="button" className="button button--ghost" onClick={store}>
            Save anyway
          </button>
        )}
        {stored && (
          <button type="button" className="link-button" onClick={remove}>
            Remove saved key
          </button>
        )}
      </div>
    </form>
  );
};

export default ApiKeyForm;
