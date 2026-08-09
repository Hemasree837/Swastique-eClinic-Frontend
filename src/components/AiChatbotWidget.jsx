import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import "./AiChatbotWidget.css";

const quickPrompts = [
  "🩺 I have fever and body ache",
  "📅 How do I book an OPD visit?",
  "👨‍⚕️ Find General Medicine or Cardiology",
  "💊 Where are my e-prescriptions?",
  "⏰ What are the hospital OPD hours?",
];

const knowledgeBase = [
  {
    keywords: ["fever", "body ache", "flu", "cold", "symptom"],
    reply: "For fever and body ache, we recommend consulting **Dr. K Hemasree** (General Medicine / OPD Lead). You can book an instant OPD slot today!",
    actionText: "📅 Book Dr. K Hemasree Slot",
    actionLink: "/BookAppointment",
  },
  {
    keywords: ["book", "appointment", "opd", "visit", "schedule"],
    reply: "To book an OPD consultation: Click **Book Appointment**, select your doctor (e.g., Dr. K Hemasree), pick a date and time slot, and confirm!",
    actionText: "📅 Go to Booking Wizard",
    actionLink: "/BookAppointment",
  },
  {
    keywords: ["doctor", "specialist", "hemasree", "roster", "cardiology", "dermatology"],
    reply: "Swastique Hospital features board-certified specialists across General Medicine, Cardiology, Pediatrics, Neurology, and Dermatology. View our doctor roster now!",
    actionText: "👨‍⚕️ Explore Doctors Roster",
    actionLink: "/OurDoctors",
  },
  {
    keywords: ["prescription", "rx", "medicine", "records", "history"],
    reply: "After your OPD visit, your doctor issues a digital E-Prescription. You can view, download, or print it anytime under your Patient Dashboard -> My E-Prescriptions!",
    actionText: "💊 Open Patient Dashboard",
    actionLink: "/patient",
  },
  {
    keywords: ["hour", "time", "timing", "address", "location", "open"],
    reply: "Swastique Hospital OPD is open **Monday to Saturday (8:00 AM - 8:00 PM)** and **Sunday (9:00 AM - 4:00 PM)**. Emergency ER is active 24/7!",
    actionText: "🚨 View 24/7 Helpline",
    actionLink: null,
  },
];

export default function AiChatbotWidget() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your **Swastiq AI Health Assistant**. How can I help you today?",
      actionText: "📅 Book Consultation",
      actionLink: "/BookAppointment",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const matchedKB = knowledgeBase.find((item) =>
        item.keywords.some((kw) => query.toLowerCase().includes(kw))
      );

      const botReply = matchedKB
        ? matchedKB.reply
        : "I can help you schedule OPD consultations, find specialist doctors like Dr. K Hemasree, or guide you through your e-prescriptions. What would you like to explore?";

      const botMsg = {
        sender: "bot",
        text: botReply,
        actionText: matchedKB ? matchedKB.actionText : "👨‍⚕️ View Doctors",
        actionLink: matchedKB ? matchedKB.actionLink : "/OurDoctors",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="ai-chatbot-container">
      {/* Floating Trigger Button */}
      <button
        className={`chatbot-trigger-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Swastiq AI Assistant"
      >
        <span className="chatbot-bot-icon">🤖</span>
        <span className="chatbot-btn-text">AI Help Desk</span>
        <span className="chat-badge-dot"></span>
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window glass-card">
          {/* Header */}
          <div className="chatbot-header">
            <div className="bot-info-group">
              <div className="bot-avatar-frame">
                <img src={logo} alt="Swastiq eClinic" />
              </div>
              <div>
                <span className="bot-name">Swastiq AI Health Assistant</span>
                <span className="bot-status">🟢 Active • Instant Answers</span>
              </div>
            </div>
            <button className="btn-close-chat" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages Body */}
          <div className="chatbot-messages-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message-row ${msg.sender}`}>
                <div className="message-bubble">
                  <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                  
                  {msg.actionText && (
                    <button
                      className="chat-action-btn"
                      onClick={() => {
                        if (msg.actionLink) navigate(msg.actionLink);
                      }}
                    >
                      {msg.actionText}
                    </button>
                  )}
                  <span className="msg-time">{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message-row bot">
                <div className="message-bubble typing-bubble">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="quick-prompts-bar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                className="quick-prompt-chip"
                onClick={() => handleSendMessage(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            className="chatbot-input-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              placeholder="Ask about symptoms, doctors, or booking..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn-send-chat" disabled={!input.trim()}>
              ➔
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
