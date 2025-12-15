// src/components/chat/ConversationPane.jsx
import React, { useState, useRef, useEffect } from "react";

function ConversationPane({ 
  refPoint, 
  chatId, 
  activeTab,
  onConversationResult,
  isVisible,
  onClose 
}) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Suggested follow-up questions based on category
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
        ? {
            query: message,
            chat_id: chatId,
          }
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

      // Extract better message from the response
      let assistantContent = "I found some updated results for you.";
      
      // Try to extract meaningful message from Yelp's response
      if (data.message) {
        assistantContent = data.message;
      } else if (data.entities) {
        const businesses = data.entities
          .find((e) => Array.isArray(e?.businesses))
          ?.businesses || [];
        
        if (businesses.length > 0) {
          assistantContent = `I found ${businesses.length} places that match your request. Check the updated results!`;
        } else {
          assistantContent = "I couldn't find any places matching that criteria. Try adjusting your search?";
        }
      }
      
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
        data: data,
        resultsCount: data.entities?.find((e) => Array.isArray(e?.businesses))?.businesses?.length || 0,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Pass results back to parent to update map/cards
      if (onConversationResult) {
        onConversationResult(data);
      }
    } catch (e) {
      console.error("Conversation error:", e);
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, I had trouble processing that. Can you try rephrasing your question?",
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
          <h3>GottaGo AI Assistant</h3>
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
              Ask me to refine your results, find specific features, or get
              recommendations
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
              <div className="message-text">{msg.content}</div>
              {msg.resultsCount > 0 && (
                <div className="message-results-badge">
                  {msg.resultsCount} places found
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
          placeholder="Ask a follow-up question..."
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