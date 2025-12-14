export function mapYelpAiToPlaces(data) {
  const entities = data?.entities || [];
  const entityWithBusinesses = entities.find((e) => Array.isArray(e?.businesses));
  const businesses = entityWithBusinesses?.businesses || [];

  // Don’t filter out missing coords yet — still show them in list.
  return businesses.map((b) => ({
    id: b.id,
    name: b.name,
    categoryLabel: (b.categories || []).map((c) => c.title).join(" · ") || "Business",
    distance: "",
    score: b.rating ?? 0,
    tags: [
      b.price ? `Price: ${b.price}` : null,
      b.attributes?.WheelchairAccessible ? "Wheelchair accessible" : null,
      b.attributes?.GenderNeutralRestrooms ? "Gender-neutral restroom" : null,
    ].filter(Boolean),
    address: b.location?.formatted_address || b.location?.address1 || "",
    isOpen: true,
    lat: b.coordinates?.latitude ?? null,
    lng: b.coordinates?.longitude ?? null,
    yelpUrl: b.url,
    summaries: b.summaries,
    contextual_info: b.contextual_info,
  }));
}
