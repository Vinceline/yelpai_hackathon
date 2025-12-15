// src/components/chat/ConversationPane.jsx
import React, { useState, useRef, useEffect } from "react";
import { mapYelpAiToPlaces } from "../../utils/yelpMapper";

function ConversationPane({ 
  refPoint, 
  chatId, 
  activeTab,
  onConversationResult,
  isVisible,
  onClose,
  currentResults // Pass current results to analyze
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastResults, setLastResults] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSuggestedQuestions = () => {
    const suggestions = {
      restrooms: [
        "Which ones are open 24/7?",
        "Show me the cleanest options",
        "Which has wheelchair accessible facilities?",
        "Are any of these gender-neutral?",
      ],
      water: [
        "Which places let me refill for free?",
        "Show me fountains in parks",
        "Which ones are filtered water?",
        "Any open right now?",
      ],
      food: [
        "Which are open today?",
        "Tell me about hot meals",
        "Which serves vegetarian options?",
        "Any that don't require ID?",
      ],
      air: [
        "Which are free vs paid?",
        "Show me 24-hour options",
        "Which has the best reviews?",
        "Any near gas stations?",
      ],
      access: [
        "Which has ramps and elevators?",
        "Show me places with accessible parking",
        "Which has braille signage?",
        "Any with accessible restrooms?",
      ],
    };
    return suggestions[activeTab] || [];
  };

  // Analyze user question and generate contextual response
  const generateContextualResponse = (userQuestion, businesses) => {
    const question = userQuestion.toLowerCase();
    
    // Top choice / recommendation
    if (question.includes("top") || question.includes("best") || question.includes("recommend")) {
      const topRated = [...businesses].sort((a, b) => b.score - a.score)[0];
      if (topRated) {
        return `Based on ratings, I'd recommend **${topRated.name}** with a ${topRated.score.toFixed(1)} star rating. ${topRated.address}`;
      }
    }
    
    // Closest option
    if (question.includes("closest") || question.includes("nearest") || question.includes("close by")) {
      // Assuming first result is closest if API sorts by distance
      const closest = businesses[0];
      if (closest) {
        return `The closest option is **${closest.name}**${closest.distance ? ` at ${closest.distance}` : ''}. Located at ${closest.address}.`;
      }
    }
    
    // 24/7 / Always open
    if (question.includes("24/7") || question.includes("24 7") || question.includes("always open") || question.includes("late night")) {
      const alwaysOpen = businesses.filter(b => 
        b.tags.some(t => t.toLowerCase().includes("24/7")) || 
        b.tags.some(t => t.toLowerCase().includes("24 hours"))
      );
      if (alwaysOpen.length > 0) {
        return `I found ${alwaysOpen.length} place${alwaysOpen.length > 1 ? 's' : ''} open 24/7:\n\n${alwaysOpen.map(b => `• **${b.name}**`).join('\n')}`;
      } else {
        return `None of these locations are specifically marked as 24/7. The results have been updated with the best available options. Check individual hours for each place.`;
      }
    }
    
    // Wheelchair accessible
    if (question.includes("wheelchair") || question.includes("accessible") || question.includes("ada")) {
      const accessible = businesses.filter(b => 
        b.tags.some(t => t.toLowerCase().includes("wheelchair")) ||
        b.tags.some(t => t.toLowerCase().includes("accessible"))
      );
      if (accessible.length > 0) {
        return `${accessible.length} wheelchair accessible option${accessible.length > 1 ? 's' : ''}:\n\n${accessible.map(b => `• **${b.name}** - ${b.address}`).join('\n')}`;
      } else {
        return `None are specifically marked as wheelchair accessible in the data. I recommend calling ahead to confirm accessibility features.`;
      }
    }
    
    // Clean / cleanliness
    if (question.includes("clean") || question.includes("nice") || question.includes("well maintained")) {
      const highRated = businesses.filter(b => b.score >= 4.5);
      if (highRated.length > 0) {
        return `Based on ratings, these ${highRated.length} have high reviews (4.5+ stars):\n\n${highRated.map(b => `• **${b.name}** (${b.score.toFixed(1)} ⭐)`).join('\n')}`;
      }
    }
    
    // Gender neutral
    if (question.includes("gender") || question.includes("neutral") || question.includes("all-gender")) {
      const genderNeutral = businesses.filter(b => 
        b.tags.some(t => t.toLowerCase().includes("gender-neutral"))
      );
      if (genderNeutral.length > 0) {
        return `Found ${genderNeutral.length} with gender-neutral facilities:\n\n${genderNeutral.map(b => `• **${b.name}**`).join('\n')}`;
      } else {
        return `No places are specifically marked as having gender-neutral restrooms. You might want to call ahead to inquire.`;
      }
    }
    
    // Compare options
    if (question.includes("compare") || question.includes("difference") || question.includes("which is better")) {
      const top3 = businesses.slice(0, 3);
      return `Here's a quick comparison of the top 3:\n\n${top3.map((b, i) => 
        `${i + 1}. **${b.name}** - ${b.score.toFixed(1)} ⭐${b.distance ? ` - ${b.distance}` : ''}`
      ).join('\n')}`;
    }
    
    // How many / count
    if (question.includes("how many") || question.includes("count")) {
      return `I found **${businesses.length} places** in total. The map and list have been updated with all results.`;
    }
    
    // Default: list all with key info
    if (businesses.length > 0) {
      return `I found **${businesses.length} places**. Here's a quick overview:\n\n${businesses.slice(0, 5).map(b => 
        `• **${b.name}** (${b.score.toFixed(1)} ⭐)${b.distance ? ` - ${b.distance}` : ''}`
      ).join('\n')}${businesses.length > 5 ? `\n\n...and ${businesses.length - 5} more on the map.` : ''}`;
    }
    
    return `I've updated the results based on your question. Check the map and list for details!`;
  };

  const handleSendMessage = async (message = inputValue.trim()) => {
    if (!message || !refPoint?.lat || !refPoint?.lng) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const payload = chatId
        ? { query: message, chat_id: chatId }
        : {
            query: message,
            user_context: {
              locale: "en_US",
              latitude: refPoint.lat,
              longitude: refPoint.lng,
            },
          };

      const resp = await fetch("http://localhost:5174/api/yelp-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      // Map to places
      const places = mapYelpAiToPlaces(data);
      setLastResults(places);

      // Generate contextual response
      const assistantContent = generateContextualResponse(message, places);
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
        data: data,
        resultsCount: places.length,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update results
      if (onConversationResult) {
        onConversationResult(data);
      }
    } catch (e) {
      console.error("Conversation error:", e);
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, I had trouble processing that. Can you try rephrasing?",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="conversation-pane">
      <div className="conversation-header">
        <div className="header-content">
          <h3>GottaGo AI Guide</h3>
        </div>
        <button
          className="conversation-close"
          onClick={onClose}
          aria-label="Close chat"
        >
          ×
        </button>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">💬</div>
            <h4>How can I help?</h4>
            <p>
              Ask me about ratings, locations, accessibility, hours, or anything else!
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message message--${msg.role} ${
              msg.isError ? "message--error" : ""
            }`}
          >
            <div className="message-avatar">
              {msg.role === "user" ? "👤" : "🤖"}
            </div>
            <div className="message-content">
              <div 
                className="message-text"
                dangerouslySetInnerHTML={{
                  __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
                }}
              />
              {msg.resultsCount > 0 && (
                <div className="message-results-badge">
                  {msg.resultsCount} places
                </div>
              )}
              <div className="message-time">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message message--assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length === 0 && (
        <div className="suggestions-container">
          <p className="suggestions-label">Try asking:</p>
          <div className="suggestions-grid">
            {getSuggestedQuestions().map((q, idx) => (
              <button
                key={idx}
                className="suggestion-chip"
                onClick={() => handleSuggestionClick(q)}
                disabled={isLoading}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="input-container">
        <textarea
          className="conversation-input"
          placeholder="Ask me anything..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          rows={1}
        />
        <button
          className="send-button"
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputValue.trim()}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 10L18 2L10 18L8 11L2 10Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ConversationPane;