import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";

// Leaflet marker icon fix for bundlers
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapPane({ results = [], refPoint = null, radiusKm = 3 }) {
  const center = useMemo(() => {
    if (refPoint?.lat && refPoint?.lng) return [refPoint.lat, refPoint.lng];
    if (results?.[0]?.lat && results?.[0]?.lng) return [results[0].lat, results[0].lng];
    return [40.7128, -74.006]; // fallback
  }, [refPoint, results]);

  return (
    <section className="map-pane">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom
        className="map-container"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Show search radius circle when we have a reference point */}
        {refPoint?.lat && refPoint?.lng && (
          <Circle
            center={[refPoint.lat, refPoint.lng]}
            radius={radiusKm * 1000}
            pathOptions={{}}
          />
        )}

        {results.map((place) =>
          place?.lat && place?.lng ? (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={markerIcon}
            >
              <Popup>
                <strong>{place.name}</strong>
                <br />
                {place.categoryLabel}
                <br />
                <span style={{ fontSize: "0.8rem" }}>{place.address}</span>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </section>
  );
}

export default MapPane;
