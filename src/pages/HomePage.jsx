// src/pages/HomePage.jsx
import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchControls from "../components/controls/SearchControls";
import CategoryTabs from "../components/nav/CategoryTabs";
import MapPane from "../components/map/MapPane";
import ResultsPane from "../components/results/ResultsPane";
import { getMockResults } from "../data/mockResults";
import { mapYelpAiToPlaces } from "../utils/yelpMapper";

const TABS = [
  { id: "restrooms", label: "Restrooms" },
  { id: "water", label: "Water" },
  { id: "food", label: "Free Food" },
  { id: "air", label: "Free Air" },
  { id: "access", label: "Accessibility" },
];

function HomePage() {
  const [activeTab, setActiveTab] = useState("restrooms");
  const [urgency, setUrgency] = useState("chill"); // chill | soon | now
  const [location, setLocation] = useState("");
  const [radiusKm, setRadiusKm] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showControls, setShowControls] = useState(false); 
  const [refPoint, setRefPoint] = useState(null);
  const [chatId, setChatId] = useState(null);

  const handleSearch = async () => {
  if (!refPoint?.lat || !refPoint?.lng) return;

  setIsLoading(true);
  try {
    const query = buildQuery();

    const resp = await fetch("http://localhost:5174/api/yelp-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        user_context: {
          locale: "en_US",
          latitude: refPoint.lat,
          longitude: refPoint.lng,
        },
      }),
    });

    const data = await resp.json();

    if (data?.chat_id) setChatId(data.chat_id);

    const places = mapYelpAiToPlaces(data);
    setResults(places);
  } catch (e) {
    console.error(e);
  } finally {
    setIsLoading(false);
  }
};

const buildQuery = () => {
  const intent =
    activeTab === "restrooms" ? "places where the public can use a restroom (parks, cafes, libraries, large stores)" :
    activeTab === "water" ? "places with water fountains or bottle refill stations (parks, gyms, cafes)" :
    activeTab === "food" ? "free food resources (community fridges, food pantries, soup kitchens)" :
    activeTab === "air" ? "places that offer free air for tires (gas stations, service centers, tire shops)" :
    "places with wheelchair accessibility and accessible restrooms";

  return `
Find 6 nearby Yelp-listed places for: ${intent}.
Use the user's coordinates. Prefer closest + highly rated.
Return Yelp business results (not general advice).
`;
};



  const handleToggleControls = () => {
    setShowControls((prev) => !prev);
  };

  return (
    <div className="app-root">
      <Header />

      {/* Toggle row */}
      <section className="controls-toggle-row">
        <button
          type="button"
          className="controls-toggle-btn"
          onClick={handleToggleControls}
        >
          {showControls ? "Hide filters" : "Show filters"}
        </button>
      </section>

      {showControls && (
        <SearchControls
  location={location}
  setLocation={setLocation}
  radiusKm={radiusKm}
  setRadiusKm={setRadiusKm}
  urgency={urgency}
  setUrgency={setUrgency}
  isLoading={isLoading}
  onSearch={handleSearch}
  refPoint={refPoint}
  setRefPoint={setRefPoint}
/>
      )}

      <CategoryTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="app-main">
         <MapPane results={results} refPoint={refPoint} />
        <ResultsPane
          activeTab={activeTab}
          results={results}
          isLoading={isLoading}
        />
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
