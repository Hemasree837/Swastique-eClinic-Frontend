import { Link } from "react-router-dom";
import drHemasree from "../assets/dr_hemasree.jpg";
import swastiqueHospital from "../assets/swastique_hospital.jpg";
import AnnouncementMarquee from "./AnnouncementMarquee";
import SymptomChecker from "./SymptomChecker";
import HealthCalculators from "./HealthCalculators";
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
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <span className="hero-badge">
              <span className="badge-sparkle">✨</span> Modern Healthcare & OPD Platform
            </span>

            <h1 className="hero-title">
              Your Trusted First Stop To <span className="gradient-text">Better Health</span>
            </h1>

            <p className="hero-lead">
              Access 24/7 OPD consultations with board-certified doctors like <strong>Dr. K Hemasree</strong>, book instant appointment slots, and manage digital health records from one simple dashboard.
            </p>

            <div className="hero-actions">
              <Link to="/BookAppointment" className="btn-hero-primary">
                📅 Book Appointment
              </Link>
              <Link to="/OurDoctors" className="btn-hero-secondary">
                👨‍⚕️ View Doctors Roster
              </Link>
            </div>

            {/* Stat Counters */}
            <div className="hero-stats">
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

          <div className="hero-visual">
            <div className="hero-image-frame glass-card">
              <img src={drHemasree} alt="Dr. K Hemasree - Swastique eClinic" className="hero-img" />
              <div className="floating-badge badge-top">
                <span className="icon">🟢</span> OPD Active Now
              </div>
              <div className="floating-badge badge-bottom">
                <span className="icon">🩺</span> Dr. K Hemasree (OPD Lead)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Marquee Ticker */}
      <AnnouncementMarquee />

      {/* Hospital Facility Showcase Banner */}
      <section className="hospital-showcase-section glass-card">
        <div className="showcase-grid">
          <div className="showcase-img-frame">
            <img src={swastiqueHospital} alt="Swastique Hospital State-of-the-Art Facility" className="showcase-img" />
          </div>
          <div className="showcase-content">
            <span className="showcase-tag">🏥 World-Class Infrastructure</span>
            <h2>Welcome To Swastique Hospital</h2>
            <p>
              Experience compassionate, state-of-the-art care at our modern outpatient department (OPD), pharmacy, laboratory, radiology, and 24/7 emergency response center.
            </p>
            <div className="showcase-badges-grid">
              <span className="sc-badge">✔️ Outpatient OPD</span>
              <span className="sc-badge">✔️ Digital Pharmacy</span>
              <span className="sc-badge">✔️ 24/7 Emergency</span>
              <span className="sc-badge">✔️ Modern Lab & X-Ray</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Symptom Checker */}
      <SymptomChecker />

      {/* Interactive Health Calculators */}
      <HealthCalculators />

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
              <Link to="/OurDoctors" className="specialty-link">Browse Specialists →</Link>
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
