import axiosInstance from "./Axios";

// Dummy chatbot API - Replace with actual backend calls later
const dummyResponses = [
  "That's a great question! I'm here to help you manage your expenses.",
  "I can assist you with tracking expenses, managing budgets, and analyzing your spending patterns.",
  "You can use this app to add, edit, and categorize your expenses. I'll provide insights when you ask.",
  "Would you like help with adding a new expense or reviewing your spending?",
  "I can help you understand your monthly spending trends. What would you like to know?",
  "You're doing a great job managing your finances! Keep tracking those expenses.",
  "Feel free to ask me any questions about your expenses or budget management.",
  "I'm here to make your expense tracking easier. What can I help with today?",
];

// Function to get a dummy response based on user message
const getDummyResponse = (userMessage) => {
  // Simulate different responses based on keywords
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("expense") || lowerMessage.includes("add")) {
    return "Great! You can add a new expense by clicking the 'Expenses' section in the sidebar. Fill in the amount, category, and date.";
  }
  if (lowerMessage.includes("budget") || lowerMessage.includes("spending")) {
    return "I can help you track your spending! Head to the Dashboard to see your expense summary and top categories.";
  }
  if (lowerMessage.includes("category") || lowerMessage.includes("categories")) {
    return "Categories help organize your expenses. You can manage them in the 'Categories' section to keep your spending organized.";
  }
  if (lowerMessage.includes("save") || lowerMessage.includes("saving")) {
    return "Start saving today! Check out the 'Savings' section to track your savings goals and progress.";
  }
  if (lowerMessage.includes("month") || lowerMessage.includes("monthly")) {
    return "You can view and manage months to organize your expenses by time period. Visit the 'Month' section for more details.";
  }
  if (lowerMessage.includes("help")) {
    return "I'm here to help! You can ask me about expenses, budgets, categories, savings, or any other features in the app.";
  }

  // Return a random dummy response
  return dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
};

export const sendChatbotMessage = async (message) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return dummy response
    return {
      data: {
        reply: getDummyResponse(message),
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      data: {
        reply: "Sorry, I encountered an error. Please try again.",
        error: true,
      },
    };
  }
};


export const getChatbotResponse = async (chatRequest) => await axiosInstance.post("/ai/chat", chatRequest);

// Optional: Get chatbot conversation history (dummy)
export const getChatbotHistory = async (userId) => {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      data: {
        messages: [],
      },
    };
  } catch (error) {
    return {
      data: {
        messages: [],
        error: true,
      },
    };
  }
};
