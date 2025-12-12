import React, { useState } from "react";
import { geocodeAddress } from "../../utils/geocode";

function SearchControls({
  location,
  setLocation,
  radiusKm,
  setRadiusKm,
  urgency,
  setUrgency,
  isLoading,
  onSearch,
  refPoint,
  setRefPoint,
}) {
  const [geoStatus, setGeoStatus] = useState("");

  const urgencyLabel = (value) => {
    if (value === "chill") return "Just browsing";
    if (value === "soon") return "Need it soon";
    return "Emergency";
  };

  const handleGeoClick = () => {
    if (!navigator.geolocation) {
      setGeoStatus("Geolocation not supported on this device.");
      return;
    }

    setGeoStatus("Getting your location…");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setRefPoint({
          lat: latitude,
          lng: longitude,
          label: "Your location",
        });

        setGeoStatus("Location set ✅");
      },
      () => {
        setGeoStatus("Couldn’t access location. Check browser permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleUseTypedLocation = async () => {
    const q = (location || "").trim();
    if (!q) return;

    try {
      setGeoStatus("Finding that place…");
      const found = await geocodeAddress(q);

      if (!found) {
        setGeoStatus("Couldn’t find that location.");
        return;
      }

      setRefPoint({
        lat: found.lat,
        lng: found.lng,
        label: found.displayName || q,
      });

      setGeoStatus("Location set ✅");
    } catch (e) {
      setGeoStatus("Geocoding failed. Try a more specific address.");
    }
  };

  return (
    <section className="app-controls">
      <div className="location-input-group">
        <label htmlFor="location">Location</label>

        <div className="location-row">
          <input
            id="location"
            type="text"
            placeholder="Enter a city or address…"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button type="button" className="ghost-btn" onClick={handleGeoClick}>
            Use my location
          </button>

          <button
            type="button"
            className="ghost-btn"
            onClick={handleUseTypedLocation}
            disabled={!location.trim()}
            title="Use the typed location as the search center"
          >
            Use typed
          </button>
        </div>

        {(geoStatus || refPoint?.label) && (
          <p className="geo-status">
            {refPoint?.label ? `Using: ${refPoint.label}` : ""}
            {geoStatus ? (refPoint?.label ? ` · ${geoStatus}` : geoStatus) : ""}
          </p>
        )}
      </div>

      <div className="radius-group">
        <label htmlFor="radius">Radius: {radiusKm} km</label>
        <input
          id="radius"
          type="range"
          min={1}
          max={15}
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value))}
        />
      </div>

      <div className="urgency-group">
        <span>Urgency</span>
        <div className="urgency-buttons">
          {["chill", "soon", "now"].map((level) => (
            <button
              key={level}
              type="button"
              className={`urgency-btn ${
                urgency === level ? `urgency-btn--active-${level}` : ""
              }`}
              onClick={() => setUrgency(level)}
            >
              {urgencyLabel(level)}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="primary-btn"
        onClick={onSearch}
        disabled={isLoading}
      >
        {isLoading ? "Finding spots…" : "Search"}
      </button>
    </section>
  );
}

export default SearchControls;
