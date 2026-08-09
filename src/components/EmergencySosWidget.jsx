import { useState } from "react";
import "./EmergencySosWidget.css";

export default function EmergencySosWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sos-container">
      {/* Floating SOS Trigger Button */}
      <button
        className={`sos-floating-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="24/7 Emergency Support Hotline"
        aria-label="Emergency SOS"
      >
        <span className="sos-pulse-ring"></span>
        <span className="sos-icon">🚨</span>
        <span className="sos-text">SOS Support</span>
      </button>

      {/* SOS Modal Drawer */}
      {isOpen && (
        <div className="sos-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="sos-modal-card glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="sos-modal-header">
              <div className="header-title-group">
                <span className="emergency-badge">🚨 24/7 Emergency Response</span>
                <h3>Medical Assistance Desk</h3>
              </div>
              <button className="btn-close-sos" onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <p className="sos-intro-text">
              If you or a family member are experiencing a life-threatening medical emergency, call our direct triage team immediately.
            </p>

            <div className="sos-action-cards">
              <a href="tel:+919876543210" className="sos-hotline-card hotline-primary">
                <div className="hotline-icon">📞</div>
                <div>
                  <span className="hotline-title">Primary Clinic Triage Hotline</span>
                  <span className="hotline-number">+91 98765 43210</span>
                </div>
                <span className="call-now-badge">Call Now →</span>
              </a>

              <a href="tel:108" className="sos-hotline-card hotline-ambulance">
                <div className="hotline-icon">🚑</div>
                <div>
                  <span className="hotline-title">National Ambulance Dispatch</span>
                  <span className="hotline-number">Dial 108 Emergency</span>
                </div>
                <span className="call-now-badge">Dial 108 →</span>
              </a>
            </div>

            <div className="sos-info-box">
              <h4>📍 Clinic Emergency Location</h4>
              <p>123 Wellness Avenue, Health City, India</p>
              <span className="hours-tag">Emergency ER Open 24 Hours / 7 Days</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
