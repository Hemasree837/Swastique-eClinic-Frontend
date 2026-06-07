import { useState } from "react";
import "./AnnouncementMarquee.css";

const announcements = [
  { icon: "🎉", title: "Free First Consultation", desc: "First visit is FREE!", badge: "Offer" },
  { icon: "💊", title: "Digital Prescription", desc: "Get online prescription", badge: "New" },
  { icon: "🏥", title: "Lab Tests", desc: "Book tests at home", badge: "Save" },
  { icon: "👨‍⚕️", title: "Doctors", desc: "Expert specialists available", badge: "Active" },
];

export default function AnnouncementMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="marquee">

      <h3 className="title">Announcements</h3>

      <div
        className="track"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className={paused ? "row pause" : "row"}>
          {announcements.map((item, i) => (
            <div className="card" key={i}>
              <div className="icon">{item.icon}</div>
              <div className="card-content">
                <h4>{item.title}</h4>
                <div className="meta">{item.desc}</div>
              </div>
              <span className="badge">{item.badge}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}