import React, { useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// blue dot-ish marker for your ref point
const refIcon = new L.DivIcon({
  className: "ref-dot",
  html: `<div class="ref-dot__inner"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (!center) return;
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

function MapPane({ results = [], refPoint = null, radiusKm = 3 }) {
  const center = useMemo(() => {
    if (refPoint?.lat && refPoint?.lng) return [refPoint.lat, refPoint.lng];
    if (results?.[0]?.lat && results?.[0]?.lng) return [results[0].lat, results[0].lng];
    return [40.7128, -74.006];
  }, [refPoint, results]);

  return (
    <section className="map-pane">
      <MapContainer center={center} zoom={14} scrollWheelZoom className="map-container">
        <MapRecenter center={center} />

        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Ref point marker + radius */}
        {refPoint?.lat && refPoint?.lng && (
          <>
            <Marker position={[refPoint.lat, refPoint.lng]} icon={refIcon}>
              <Popup>
                <strong>{refPoint.label || "Search center"}</strong>
              </Popup>
            </Marker>

            <Circle center={[refPoint.lat, refPoint.lng]} radius={radiusKm * 1000} pathOptions={{}} />
          </>
        )}

        {/* Business markers */}
        {results.map((place) =>
          place?.lat && place?.lng ? (
            <Marker key={place.id} position={[place.lat, place.lng]} icon={markerIcon}>
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
