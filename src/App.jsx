import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import EmergencySosWidget from "./components/EmergencySosWidget";
import AiChatbotWidget from "./components/AiChatbotWidget";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Admin from "./components/Admin";
import Patient from "./components/Patient";
import Reporter from "./components/Reporter";
import OurDoctors from "./components/OurDoctors";
import BookAppointment from "./components/BookAppointment";

import "./App.css";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <div className="app">
        <Header user={user} setUser={setUser} theme={theme} toggleTheme={toggleTheme} />

        <main className="content">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/OurDoctors" element={<OurDoctors user={user} />} />

            {/* Admin Portal: Directly accessible for full CRUD operations */}
            <Route path="/admin" element={<Admin user={user} />} />

            <Route
              path="/patient"
              element={
                user?.role === "PATIENT" ? (
                  <Patient user={user} />
                ) : (
                  <Patient user={user || { username: "Patient" }} />
                )
              }
            />

            <Route path="/reporter" element={<Reporter />} />

            <Route path="/BookAppointment" element={<BookAppointment user={user} />} />
          </Routes>
        </main>

        <Footer />
        <EmergencySosWidget />
        <AiChatbotWidget />
      </div>
    </Router>
  );
}