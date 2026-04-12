import React from "react";
import Chatbot from "../components/Chatbot";
import "./../styles/chatbotpage.css";

const ChatbotPage = () => {
  return (
    <div className="chatbot-page">
      <div className="chatbot-page-container">
        <Chatbot />
      </div>
    </div>
  );
};

export default ChatbotPage;
