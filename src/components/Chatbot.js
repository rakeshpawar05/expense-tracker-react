import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../Auth/AuthContext";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { sendChatbotMessage, getChatbotResponse } from "../api/chatbotApi";
import "./chatbot.css";

const Chatbot = () => {
  const { userDetails } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 I'm your expense tracker assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const escapeHtml = (unsafe) =>
    unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const formatMessageText = (text) => {
    const escapedText = escapeHtml(text || "");
    const withHeadings = escapedText.replace(/^#{1,6}\s*(.+)$/gm, (match) => {
      const level = Math.min(match.match(/^#+/)[0].length, 6);
      const content = match.replace(/^#{1,6}\s*/, "");
      return `<h${level}>${content}</h${level}>`;
    });
    return withHeadings.replace(/\n/g, "<br/>");
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the chatbot API
      const currentRequest = { userId: userDetails?.userId || "guest", message: inputValue };
      console.log("Sending message to chatbot API:", currentRequest);
      const response = await getChatbotResponse(currentRequest);
      console.log("Chatbot API response:", response);

      const botMessage = {
        id: messages.length + 2,
        text: response.data || "Sorry, I couldn't understand that. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setInputValue("");
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3 className="chatbot-title">Assistant</h3>
        <span className="chatbot-status">Always here to help</span>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === "user" ? "user-message" : "bot-message"}`}
          >
            <div className="message-content">
              <div
                className="message-text"
                dangerouslySetInnerHTML={{ __html: formatMessageText(message.text) }}
              />
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message bot-message">
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

      <form className="chatbot-input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chatbot-input"
          placeholder="Ask me anything..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="chatbot-send-btn"
          disabled={isLoading || !inputValue.trim()}
          title="Send message"
        >
          {isLoading ? (
            <FaSpinner className="spinner-icon" />
          ) : (
            <FaPaperPlane />
          )}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
