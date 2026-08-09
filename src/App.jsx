import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";

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
    } catch {
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

            <Route
              path="/admin"
              element={
                user?.role === "ADMIN" ? (
                  <Admin />
                ) : (
                  <div className="access-denied-card glass-card">
                    <div className="icon-badge">🔒</div>
                    <h2>Admin Access Required</h2>
                    <p>You must be logged in as an Administrator to access the admin portal.</p>
                    <Link to="/login" className="btn-primary">Log In as Admin</Link>
                  </div>
                )
              }
            />

            <Route
              path="/patient"
              element={
                user?.role === "PATIENT" ? (
                  <Patient user={user} />
                ) : (
                  <div className="access-denied-card glass-card">
                    <div className="icon-badge">👤</div>
                    <h2>Patient Login Required</h2>
                    <p>Please log in to your patient account to view your medical dashboard.</p>
                    <Link to="/login" className="btn-primary">Log In</Link>
                  </div>
                )
              }
            />

            <Route path="/reporter" element={<Reporter />} />

            <Route
              path="/BookAppointment"
              element={
                user ? (
                  <BookAppointment user={user} />
                ) : (
                  <div className="access-denied-card glass-card">
                    <div className="icon-badge">📅</div>
                    <h2>Login Required to Book</h2>
                    <p>Please log in or create an account to schedule an appointment with our specialist doctors.</p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
                      <Link to="/login" className="btn-primary">Log In</Link>
                      <Link to="/register" className="btn-secondary">Register Account</Link>
                    </div>
                  </div>
                )
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}