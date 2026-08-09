import { Link } from "react-router-dom";
import swastiqueHospital from "../assets/swastique_hospital.jpg";
import AnnouncementMarquee from "./AnnouncementMarquee";
import SymptomChecker from "./SymptomChecker";
import HealthCalculators from "./HealthCalculators";
import BedTrackerWidget from "./BedTrackerWidget";
import "./Home.css";

const specialties = [
  { icon: "🫀", title: "Cardiology", desc: "Heart health & blood pressure care" },
  { icon: "🩺", title: "General Medicine", desc: "Primary consultations & fever checks" },
  { icon: "👶", title: "Pediatrics", desc: "Comprehensive child care & vaccines" },
  { icon: "🧠", title: "Neurology", desc: "Brain & nervous system specialists" },
  { icon: "🧴", title: "Dermatology", desc: "Skin, hair & allergy treatments" },
  { icon: "🦴", title: "Orthopedics", desc: "Bone, joint & spine physical care" },
];

export default function Home({ user }) {
  return (
    <div className="home-container">
      {/* Hero Section with Full-Bleed Hospital Blend Effect */}
      <section
        className="hero-section-blend"
        style={{ backgroundImage: `url(${swastiqueHospital})` }}
      >
        <div className="hero-blend-overlay">
          <div className="hero-content-left">
            <span className="hero-badge">
              <span className="badge-dot-green">🟢</span> 24/7 Outpatient Care
            </span>

            <h1 className="hero-title-blend">
              Your Trusted First Stop<br />To <span className="gradient-text">Better Health</span>
            </h1>

            <p className="hero-lead-blend">
              Access 24/7 outpatient care (OPD), book instant appointment slots with board-certified doctors, and manage your digital medical records from one simple portal.
            </p>

            <div className="hero-actions-blend">
              <Link to="/BookAppointment" className="btn-hero-primary">
                📅 Book Appointment
              </Link>
              <Link to="/OurDoctors" className="btn-hero-secondary">
                👨‍⚕️ View Specialist Doctors
              </Link>
            </div>

            {/* Stat Counters Overlay Card */}
            <div className="hero-stats-blend glass-card">
              <div className="stat-card">
                <span className="stat-value">10,000+</span>
                <span className="stat-label">Happy Patients</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-card">
                <span className="stat-value">50+</span>
                <span className="stat-label">Verified Specialists</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-card">
                <span className="stat-value">4.9 ★</span>
                <span className="stat-label">Patient Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Marquee Ticker */}
      <AnnouncementMarquee />

      {/* Interactive AI Symptom Checker */}
      <SymptomChecker />

      {/* Interactive Health Calculators */}
      <HealthCalculators />

      {/* Emergency ER, ICU & Ward Bed Availability Live Tracker */}
      <BedTrackerWidget user={user} />

      {/* Specialty Browser Section */}
      <section className="specialties-section">
        <div className="section-header">
          <span className="section-subtitle">Specialized Medical Care</span>
          <h2>Explore Care By Medical Specialty</h2>
          <p>Find top-rated specialists tailored to your specific health requirements.</p>
        </div>

        <div className="specialties-grid">
          {specialties.map((item, idx) => (
            <div className="specialty-card glass-card" key={idx}>
              <div className="specialty-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <Link
                to="/OurDoctors"
                state={{ selectedSpec: item.title }}
                className="specialty-link"
              >
                Browse {item.title} Specialists →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-subtitle">Why Choose Swastiq eClinic</span>
          <h2>Comprehensive Patient Care Built For You</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-Time Doctor Roster</h3>
            <p>Check doctor availability, slot timings, and leave status in real-time before booking.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon">📑</div>
            <h3>Instant E-Approvals</h3>
            <p>Submit appointment requests and receive instant status notifications from clinic admins.</p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon">🛡️</div>
            <h3>Secure Patient Portal</h3>
            <p>Track your past visits, active appointments, and digital prescription history safely.</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="cta-banner glass-card">
        <div className="cta-content">
          <h2>Ready To Take Charge Of Your Health?</h2>
          <p>Register an account today and get your first digital medical checkup scheduled in under 2 minutes.</p>
        </div>
        <div className="cta-actions">
          {!user ? (
            <Link to="/register" className="btn-hero-primary">Create Free Account</Link>
          ) : (
            <Link to="/BookAppointment" className="btn-hero-primary">Book Appointment Now</Link>
          )}
        </div>
      </section>
    </div>
  );
}
