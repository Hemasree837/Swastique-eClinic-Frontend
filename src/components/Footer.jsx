import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h2>Swastiq eClinic</h2>
          <p>Modern healthcare scheduling and patient support in one trusted clinic platform.</p>
        </div>

        <div className="footer-links">
          <div className="link-group">
            <h3>Explore</h3>
            <a href="/">Home</a>
            <a href="/OurDoctors">Doctors</a>
            <a href="/BookAppointment">Book</a>
          </div>
          <div className="link-group">
            <h3>Support</h3>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </div>

      <div className="footer-note">
        <span>© 2026 Online Clinic System — Swastiq eClinic</span>
        <span>Designed for trusted healthcare access.</span>
      </div>
    </footer>
  );
}
