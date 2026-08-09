import { useState } from "react";
import "./AnnouncementMarquee.css";

const announcements = [
  { icon: "🎉", title: "Free Health Checkup", desc: "Complimentary first consultation for new registrations", badge: "Special Offer" },
  { icon: "⚡", title: "Instant Tele-Consultation", desc: "Connect with available specialists within 15 minutes", badge: "24/7 Live" },
  { icon: "💊", title: "Digital Prescription Records", desc: "Access your e-prescriptions and history anytime", badge: "New Feature" },
  { icon: "🏥", title: "Home Diagnostics & Lab Tests", desc: "Schedule sample collection directly from your home", badge: "Convenient" },
  { icon: "⭐", title: "Top-Rated Specialists", desc: "Over 50+ board-certified medical experts available", badge: "Verified" },
];

export default function AnnouncementMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="marquee-wrapper glass-card">
      <div className="marquee-badge">
        <span className="live-dot"></span>
        <span className="marquee-label">Live Updates</span>
      </div>

      <div
        className="marquee-track"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className={`marquee-content ${paused ? "pause" : ""}`}>
          {[...announcements, ...announcements].map((item, i) => (
            <div className="marquee-item" key={i}>
              <span className="item-icon">{item.icon}</span>
              <div className="item-details">
                <span className="item-title">{item.title}</span>
                <span className="item-desc">{item.desc}</span>
              </div>
              <span className="item-tag">{item.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}