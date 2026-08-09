import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "./Patient.css";

export default function Patient({ user }) {
  const name = user?.username;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/appointment`);
      const mine = (res.data || []).filter((a) => a.patientName === name);
      setAppointments(mine);
    } catch (err) {
      console.error("Error loading patient appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = appointments.filter((a) => {
    if (statusFilter === "pending") return a.status === "PENDING";
    if (statusFilter === "approved") return a.status === "APPROVED" || a.status === "COMPLETED";
    return true;
  });

  const pendingCount = appointments.filter((a) => a.status === "PENDING").length;
  const approvedCount = appointments.filter((a) => a.status === "APPROVED" || a.status === "COMPLETED").length;

  return (
    <div className="patient-dashboard-container">
      {/* Patient Header Banner */}
      <div className="patient-welcome-banner glass-card">
        <div className="welcome-info">
          <div className="patient-avatar-badge">
            {name ? name[0].toUpperCase() : "P"}
          </div>
          <div>
            <h2>Welcome Back, {name}!</h2>
            <p>Track your scheduled visits, appointment requests, and health record status.</p>
          </div>
        </div>

        <Link to="/BookAppointment" className="btn-hero-primary">
          ➕ Book New Consultation
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="patient-stats-grid">
        <div className="patient-stat-card glass-card">
          <div className="stat-icon">📅</div>
          <div>
            <span className="stat-num">{appointments.length}</span>
            <span className="stat-title">Total Bookings</span>
          </div>
        </div>

        <div className="patient-stat-card glass-card">
          <div className="stat-icon">⏳</div>
          <div>
            <span className="stat-num">{pendingCount}</span>
            <span className="stat-title">Pending Approvals</span>
          </div>
        </div>

        <div className="patient-stat-card glass-card">
          <div className="stat-icon">✅</div>
          <div>
            <span className="stat-num">{approvedCount}</span>
            <span className="stat-title">Confirmed Visits</span>
          </div>
        </div>
      </div>

      {/* Appointments List Section */}
      <div className="appointments-section glass-card">
        <div className="section-title-bar">
          <h3>My Scheduled Appointments</h3>

          <div className="filter-tabs-row">
            <button
              className={`filter-btn ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              All ({appointments.length})
            </button>
            <button
              className={`filter-btn ${statusFilter === "pending" ? "active" : ""}`}
              onClick={() => setStatusFilter("pending")}
            >
              Pending ({pendingCount})
            </button>
            <button
              className={`filter-btn ${statusFilter === "approved" ? "active" : ""}`}
              onClick={() => setStatusFilter("approved")}
            >
              Approved ({approvedCount})
            </button>
          </div>
        </div>

        {loading && (
          <div className="loading-state">
            <span className="spinner">🩺</span>
            <p>Loading your appointments...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="empty-appointments-state">
            <span className="empty-icon">🗓️</span>
            <h4>No Appointments Found</h4>
            <p>You haven't scheduled any appointments matching this status filter yet.</p>
            <Link to="/BookAppointment" className="btn-hero-secondary" style={{ marginTop: "16px", display: "inline-block" }}>
              Schedule First Visit
            </Link>
          </div>
        )}

        <div className="appointments-grid">
          {filtered.map((a) => (
            <div className="appointment-card glass-card" key={a.id}>
              <div className="app-card-header">
                <div className="doc-icon-chip">👨‍⚕️</div>
                <div>
                  <h4>{a.doctorName}</h4>
                  <span className="app-date-text">📅 {a.date} at {a.time}</span>
                </div>
              </div>

              <div className="app-card-footer">
                <span className={`status-pill ${a.status === "PENDING" ? "status-pending" : "status-approved"}`}>
                  {a.status === "PENDING" ? "⏳ PENDING APPROVAL" : "✅ CONFIRMED"}
                </span>
                <span className="app-id">ID: #{a.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}