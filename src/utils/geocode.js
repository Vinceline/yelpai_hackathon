export async function geocodeAddress(query) {
  if (!query || !query.trim()) return null;

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    headers: {
      "Accept": "application/json",
    },
  });

  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();
  if (!data || data.length === 0) return null;

  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
    displayName: data[0].display_name,
  };
}
