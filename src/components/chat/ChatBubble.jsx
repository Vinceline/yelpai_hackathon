// src/components/chat/ChatBubble.jsx
import React from "react";

function ChatBubble({ onClick, hasSearched, unreadCount = 0 }) {
  if (!hasSearched) return null;

  return (
    <button
      className="chat-bubble"
      onClick={onClick}
      aria-label="Open AI chat assistant"
    >
      <div className="chat-bubble-icon">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <div className="chat-bubble-text">
        <div className="chat-bubble-title">AI Assistant</div>
        <div className="chat-bubble-subtitle">Ask me anything</div>
      </div>
      {unreadCount > 0 && (
        <div className="chat-bubble-badge">{unreadCount}</div>
      )}
      <div className="chat-bubble-pulse"></div>
    </button>
  );
}

export default ChatBubble;