// src/pages/HomePage.jsx
import React, { useState, useEffect, useRef } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SearchControls from "../components/controls/SearchControls";
import CategoryTabs from "../components/nav/CategoryTabs";
import MapPane from "../components/map/MapPane";
import ResultsPane from "../components/results/ResultsPane";
import ConversationPane from "../components/chat/ConversationPane";
import ChatBubble from "../components/chat/ChatBubble";
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
  const [urgency, setUrgency] = useState("chill");
  const [location, setLocation] = useState("");
  const [radiusKm, setRadiusKm] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showControls, setShowControls] = useState(false);
  const [refPoint, setRefPoint] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [showConversation, setShowConversation] = useState(false);

  const resultsCache = useRef({});
  const hasSearched = useRef(false);

  useEffect(() => {
    if (!hasSearched.current || !refPoint?.lat || !refPoint?.lng) {
      return;
    }

    if (resultsCache.current[activeTab]) {
      setResults(resultsCache.current[activeTab]);
    } else {
      handleSearch();
    }
  }, [activeTab]);

  const handleSearch = async () => {
    if (!refPoint?.lat || !refPoint?.lng) return;

    setResults([]);
    setIsLoading(true);
    hasSearched.current = true;

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

      resultsCache.current[activeTab] = places;
      setResults(places);
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const buildQuery = () => {
    const baseIntent =
      activeTab === "restrooms"
        ? "places where the public can use a restroom (parks, cafes, libraries, large stores)"
        : activeTab === "water"
        ? "places with water fountains or bottle refill stations (parks, gyms, cafes)"
        : activeTab === "food"
        ? "free food resources (community fridges, food pantries, soup kitchens)"
        : activeTab === "air"
        ? "places that offer free air for tires (gas stations, service centers, tire shops)"
        : "places with wheelchair accessibility and accessible restrooms";

    let urgencyModifier = "";
    if (urgency === "now") {
      urgencyModifier = " Prioritize places that are open 24/7 or currently open NOW.";
    } else if (urgency === "soon") {
      urgencyModifier = " Prioritize places within walking distance (closest first).";
    }

    return `
Find 6 nearby Yelp-listed places for: ${baseIntent}.${urgencyModifier}
Use the user's coordinates. Prefer closest + highly rated.
Return Yelp business results (not general advice).
`;
  };

  const handleToggleControls = () => {
    setShowControls((prev) => !prev);
  };

  const handleLocationChange = (newRefPoint) => {
    if (
      newRefPoint?.lat !== refPoint?.lat ||
      newRefPoint?.lng !== refPoint?.lng
    ) {
      resultsCache.current = {};
      hasSearched.current = false;
      setResults([]);
      setChatId(null);
    }
    setRefPoint(newRefPoint);
  };

  const handleRadiusChange = (newRadius) => {
    if (newRadius !== radiusKm) {
      resultsCache.current = {};
      hasSearched.current = false;
      setResults([]);
    }
    setRadiusKm(newRadius);
  };

  const handleConversationResult = (data) => {
    if (data?.chat_id) setChatId(data.chat_id);

    const places = mapYelpAiToPlaces(data);

    resultsCache.current[activeTab] = places;
    setResults(places);
  };

  const toggleConversation = () => {
    setShowConversation((prev) => !prev);
  };

  return (
    <div className="app-root">
      <Header />

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
          setRadiusKm={handleRadiusChange}
          urgency={urgency}
          setUrgency={setUrgency}
          isLoading={isLoading}
          onSearch={handleSearch}
          refPoint={refPoint}
          setRefPoint={handleLocationChange}
        />
      )}

      <CategoryTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className={`app-main ${showConversation ? "app-main--with-chat" : ""}`}>
        <div className="results-map-container">
          <MapPane results={results} refPoint={refPoint} />
          <ResultsPane
            activeTab={activeTab}
            results={results}
            isLoading={isLoading}
          />
        </div>

        {showConversation && (
          <div className="conversation-container conversation-container--slide-in">
            <ConversationPane
              refPoint={refPoint}
              chatId={chatId}
              activeTab={activeTab}
              onConversationResult={handleConversationResult}
              isVisible={showConversation}
              onClose={toggleConversation}
            />
          </div>
        )}
      </main>

      {/* Floating chat bubble */}
      <ChatBubble
  onClick={toggleConversation}
  hasSearched={hasSearched.current}
  isOpen={showConversation}
/>

      <Footer />
    </div>
  );
}

export default HomePage;