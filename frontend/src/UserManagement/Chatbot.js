import React, { useState } from "react";
import { Box, TextField, IconButton, Typography, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

// Expanded FAQ Responses with Keyword Variations
const faqResponses = [
  { keywords: ["store hours", "opening time", "working hours", "time"], response: "Our stores are open from 9 AM to 9 PM daily." },
  { keywords: ["return policy", "refund policy", "exchange policy"], response: "You can return or exchange items within 30 days with a receipt." },
  { keywords: ["refund process", "how long for refund"], response: "Refunds take 5-7 business days after approval." },
  { keywords: ["payment methods", "accepted payments", "how to pay"], response: "We accept credit/debit cards, PayPal, and cash." },
  { keywords: ["delivery time", "shipping time", "how long for delivery", "when will I get my order"], response: "Delivery takes 3-5 business days." },
  { keywords: ["track order", "order status", "where is my order"], response: "You can track your order under the 'My Orders' section." },
  { keywords: ["customer support", "contact help", "how to contact support", "support team"], response: "Contact our support team via email at support@clothingstore.com." },
  { keywords: ["order cancellation", "cancel order", "how to cancel"], response: "Orders can be canceled within 24 hours of placement." },
  { keywords: ["discounts", "promo codes", "discount codes", "offers"], response: "Use discount codes at checkout. Some exclusions may apply." },
  { keywords: ["store locations", "where is your store", "physical store"], response: "Find our store locations on the 'Store Locator' page." },
  { keywords: ["international shipping", "do you ship worldwide", "shipping outside country"], response: "Yes, we ship internationally! Additional charges may apply." },
  { keywords: ["fabric details", "material info", "what is the material"], response: "Fabric details are listed in the product description section." },
  { keywords: ["how to register", "create account", "sign up"], response: "Click on 'Register' and fill in your details to create an account." },
  { keywords: ["forgot password", "reset password", "password help"], response: "Click 'Forgot Password' on the login page to reset your password." },
  { keywords: ["membership benefits", "why join", "VIP membership"], response: "Members get 10% off, priority support, and early access to sales." },
  { keywords: ["gift cards", "buy gift card", "gift voucher"], response: "We offer gift cards ranging from $10 to $200." },
  { keywords: ["shipping cost", "how much for shipping", "shipping charges"], response: "Standard shipping is $5.99, free for orders above $50." },
  { keywords: ["lost package", "my order is missing", "package not received"], response: "If your package is lost, contact customer support for assistance." },
  { keywords: ["exchange policy", "can I exchange", "change item"], response: "Exchanges are allowed within 14 days for unused products." },
  { keywords: ["loyalty points", "rewards program", "earn points"], response: "Earn points with each purchase. Redeem them for discounts." },
  { keywords: ["store credit", "how to use store credit", "credit balance"], response: "Store credit can be used for purchases but cannot be redeemed for cash." },
  { keywords: ["restock", "when will this be available", "out of stock"], response: "Restock dates vary. Sign up for notifications on the product page." },
  { keywords: ["order processing", "how long does processing take", "before shipping"], response: "Order processing usually takes 1-2 business days before shipping." },
  { keywords: ["damaged item", "received broken item", "what to do for damage"], response: "If you received a damaged item, contact support with pictures for a replacement or refund." },
  { keywords: ["how to contact", "contact options", "customer service"], response: "You can contact us via email, phone, or live chat." },
  { keywords: ["default"], response: "I'm sorry, I don't have an answer for that. Try asking something else!" },
];

// Function to find the best match using keyword detection
const getFAQResponse = (userInput) => {
  userInput = userInput.toLowerCase().trim();

  // Try to match input with existing keywords
  for (let faq of faqResponses) {
    if (faq.keywords.some((keyword) => userInput.includes(keyword))) {
      return faq.response;
    }
  }

  return faqResponses.find(faq => faq.keywords.includes("default")).response;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! Ask me anything about our store!", sender: "bot" }]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    const botResponse = getFAQResponse(input);
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    }, 1000);

    setInput("");
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#1B1F3B",
          color: "white",
          "&:hover": { backgroundColor: "#162038" },
          zIndex: 9999,
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </IconButton>

      {/* Chatbot Box */}
      {isOpen && (
        <Paper
          elevation={5}
          sx={{
            position: "fixed",
            bottom: 80,
            right: 20,
            width: 320,
            height: 400,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            backgroundColor: "white",
            overflow: "hidden",
            zIndex: 9999,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          <Box sx={{ backgroundColor: "#1B1F3B", color: "white", padding: 1, textAlign: "center" }}>
            <Typography variant="h6">Chatbot</Typography>
          </Box>

          {/* Messages Area */}
          <Box sx={{ flex: 1, overflowY: "auto", padding: 1 }}>
            {messages.map((msg, index) => (
              <Typography
                key={index}
                sx={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  backgroundColor: msg.sender === "user" ? "#1B1F3B" : "#ddd",
                  color: msg.sender === "user" ? "white" : "black",
                  padding: "8px",
                  borderRadius: "8px",
                  marginBottom: "5px",
                  maxWidth: "80%",
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.text}
              </Typography>
            ))}
          </Box>

          {/* Input Field */}
          <Box sx={{ display: "flex", padding: 1, borderTop: "1px solid #ccc" }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <IconButton color="primary" onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default Chatbot;
