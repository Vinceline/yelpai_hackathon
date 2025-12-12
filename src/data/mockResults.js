// Fake data for layout. Swap this with Yelp AI results later.

// Fake data for layout. Swap this with Yelp AI results later.

export function getMockResults(activeTab) {
  if (activeTab === "air") {
    return [
      {
        id: "air-1",
        name: "Shell Station - 5th Ave",
        categoryLabel: "Gas station · Free air",
        distance: "0.6 mi",
        score: 4.4,
        tags: ["Free air", "24/7", "Well lit"],
        address: "500 5th Ave",
        isOpen: true,
        lat: 40.7125,
        lng: -74.0059,
      },
      {
        id: "air-2",
        name: "Bike Hub Co-Op",
        categoryLabel: "Bike shop · Pump access",
        distance: "1.1 mi",
        score: 4.8,
        tags: ["Bike pump", "Friendly staff"],
        address: "22 Elm St",
        isOpen: false,
        lat: 40.715,
        lng: -74.002,
      },
    ];
  }

  if (activeTab === "food") {
    return [
      {
        id: "food-1",
        name: "Community Fridge - Maple Corner",
        categoryLabel: "Community fridge · Free food",
        distance: "0.3 mi",
        score: 4.9,
        tags: ["Free produce", "Mutual aid"],
        address: "Corner of Maple & 3rd",
        isOpen: true,
        lat: 40.7135,
        lng: -74.01,
      },
      {
        id: "food-2",
        name: "Hope Soup Kitchen",
        categoryLabel: "Soup kitchen · Hot meals",
        distance: "1.4 mi",
        score: 4.7,
        tags: ["Free dinner", "Family friendly"],
        address: "78 Hope St",
        isOpen: true,
        lat: 40.709,
        lng: -74.007,
      },
    ];
  }

  // default for restrooms / water / access
  return [
    {
      id: "1",
      name: "Downtown Community Cafe",
      categoryLabel:
        activeTab === "water"
          ? "Cafe · Bottle refill"
          : "Cafe · Restroom access",
      distance: "0.4 mi",
      score: 4.7,
      tags: ["Clean restroom", "Wheelchair accessible", "Refill friendly"],
      address: "123 Main St",
      isOpen: true,
      lat: 40.7128,
      lng: -74.006,
    },
    {
      id: "2",
      name: "City Park North",
      categoryLabel:
        activeTab === "water"
          ? "Park · Water fountain"
          : "Park · Public restroom",
      distance: "0.9 mi",
      score: 4.2,
      tags: ["Public", "Well lit"],
      address: "456 Park Ave",
      isOpen: true,
      lat: 40.716,
      lng: -74.0085,
    },
  ];
}
