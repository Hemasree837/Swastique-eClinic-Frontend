import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-modern">
      <div className="helpline-banner">
        <div className="helpline-inner">
          <div className="helpline-info">
            <span className="pulse-icon">🚨</span>
            <div>
              <span className="helpline-label">Need Immediate Support or Emergency Care?</span>
              <span className="helpline-sub">Our medical desk is active 24/7 to assist you.</span>
            </div>
          </div>
          <a href="tel:+919876543210" className="helpline-phone-btn">
            📞 Helpline: +91 98765 43210
          </a>
        </div>
      </div>

      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="footer-brand-logo">
              <img src={logo} alt="Swastiq eClinic" className="footer-logo-img" />
              <span className="footer-brand-name">Swastiq <span>eClinic</span></span>
            </div>
            <p className="footer-desc">
              Your trusted digital healthcare portal providing 24x7 doctor consultations, instant appointment booking, and patient records management.
            </p>
            <div className="social-pills">
              <span className="social-pill">🌐 SwastiqClinic.com</span>
              <span className="social-pill">✉️ care@swastiqclinic.com</span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Navigation</h4>
            <Link to="/">Home Overview</Link>
            <Link to="/OurDoctors">Specialist Doctors</Link>
            <Link to="/BookAppointment">Book Appointment</Link>
          </div>

          <div className="footer-col">
            <h4>Account Portals</h4>
            <Link to="/login">Patient Login</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/patient">Patient Dashboard</Link>
            <Link to="/admin">Admin Panel</Link>
          </div>

          <div className="footer-col">
            <h4>Clinic Hours</h4>
            <p className="hours-text"><strong>Mon - Sat:</strong> 8:00 AM - 8:00 PM</p>
            <p className="hours-text"><strong>Sunday:</strong> 9:00 AM - 4:00 PM</p>
            <p className="hours-text"><strong>Emergency:</strong> 24/7 Service</p>
            <div className="location-badge">
              📍 123 Wellness Avenue, Health City, India
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Swastiq eClinic — Healthcare Management System. All rights reserved.</p>
          <div className="footer-meta-links">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Care</span>
            <span>•</span>
            <span>HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
