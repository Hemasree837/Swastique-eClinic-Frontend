import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

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
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="app">

        <Header user={user} setUser={setUser} />

        <div className="content">
          <Routes>

            <Route path="/" element={<Home />} />

            <Route
              path="/login"
              element={<Login setUser={setUser} />}
            />

            <Route path="/register" element={<Register />} />

            <Route
              path="/admin"
              element={
                user?.role === "ADMIN"
                  ? <Admin />
                  : <h2>Access Denied</h2>
              }
            />

            <Route
              path="/patient"
              element={
                user?.role === "PATIENT"
                  ? <Patient user={user} />
                  : <h2>Please Login as Patient</h2>
              }
            />

            <Route path="/reporter" element={<Reporter />} />
            <Route path="/OurDoctors" element={<OurDoctors />} />

            <Route
              path="/BookAppointment"
              element={
                user?.role === "PATIENT"
                  ? <BookAppointment />
                  : <h2>Please login as patient</h2>
              }
            />

          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}