export function mapYelpAiToPlaces(data) {
  const businesses = data?.entities?.[0]?.businesses || [];

  return businesses
    .map((b) => ({
      id: b.id,
      name: b.name,
      categoryLabel: (b.categories || []).map((c) => c.title).join(" · ") || "Business",
      distance: "", // not always provided; optional later
      score: b.rating ?? 0,
      tags: [
        b.price ? `Price: ${b.price}` : null,
        b.attributes?.WheelchairAccessible ? "Wheelchair accessible" : null,
        b.attributes?.GenderNeutralRestrooms ? "Gender-neutral restroom" : null,
      ].filter(Boolean),
      address: b.location?.formatted_address || b.location?.address1 || "",
      isOpen: true, // you can ask follow-up “open now?” via chat_id
      lat: b.coordinates?.latitude,
      lng: b.coordinates?.longitude,
      yelpUrl: b.url,
      summaries: b.summaries, // short/medium/long
      contextual_info: b.contextual_info,
    }))
    .filter((p) => p.lat && p.lng); // keep only mappable results
}
