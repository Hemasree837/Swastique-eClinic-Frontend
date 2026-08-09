import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import PrescriptionModal from "./PrescriptionModal";
import "./Patient.css";

export default function Patient({ user }) {
  const name = user?.username;

  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("appointments");
  const [statusFilter, setStatusFilter] = useState("all");

  const [activePrescriptionModal, setActivePrescriptionModal] = useState(null);

  // Health Profile State
  const [bloodGroup, setBloodGroup] = useState(localStorage.getItem(`profile_blood_${name}`) || "O+");
  const [age, setAge] = useState(localStorage.getItem(`profile_age_${name}`) || "28");
  const [allergies, setAllergies] = useState(localStorage.getItem(`profile_allergies_${name}`) || "Dust Allergy, Penicillin");
  const [emergencyPhone, setEmergencyPhone] = useState(localStorage.getItem(`profile_phone_${name}`) || "+91 98765 00000");
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    loadAppointments();
    loadPrescriptions();
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

  const loadPrescriptions = () => {
    try {
      const stored = localStorage.getItem(`prescriptions_${name}`);
      if (stored) {
        setPrescriptions(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Error reading prescriptions:", err);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment request?")) return;
    try {
      await axios.delete(`${API}/appointment/${id}`);
      loadAppointments();
    } catch (err) {
      console.error("Error cancelling appointment:", err);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem(`profile_blood_${name}`, bloodGroup);
    localStorage.setItem(`profile_age_${name}`, age);
    localStorage.setItem(`profile_allergies_${name}`, allergies);
    localStorage.setItem(`profile_phone_${name}`, emergencyPhone);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const filteredAppointments = appointments.filter((a) => {
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
            <p>Manage your health records, e-prescriptions, and appointment visits.</p>
          </div>
        </div>

        <Link to="/BookAppointment" className="btn-hero-primary">
          ➕ Book New Consultation
        </Link>
      </div>

      {/* Main Tab Navigation */}
      <div className="patient-tabs-row glass-card">
        <button
          className={`tab-item-btn ${tab === "appointments" ? "active" : ""}`}
          onClick={() => setTab("appointments")}
        >
          📅 Scheduled Visits ({appointments.length})
        </button>

        <button
          className={`tab-item-btn ${tab === "prescriptions" ? "active" : ""}`}
          onClick={() => setTab("prescriptions")}
        >
          💊 My E-Prescriptions ({prescriptions.length})
        </button>

        <button
          className={`tab-item-btn ${tab === "profile" ? "active" : ""}`}
          onClick={() => setTab("profile")}
        >
          👤 Medical Health Profile
        </button>
      </div>

      {/* TAB 1: Appointments List */}
      {tab === "appointments" && (
        <div className="appointments-section glass-card">
          <div className="section-title-bar">
            <h3>My Appointments</h3>

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

          {!loading && filteredAppointments.length === 0 && (
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
            {filteredAppointments.map((a) => (
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
                  
                  {a.status === "PENDING" && (
                    <button className="btn-cancel-app" onClick={() => handleCancelAppointment(a.id)}>
                      Cancel Visit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: E-Prescriptions */}
      {tab === "prescriptions" && (
        <div className="prescriptions-section glass-card">
          <h3>My Digital Prescriptions & Medical History</h3>
          <p className="tab-subtitle">View and print prescriptions issued by your attending doctors.</p>

          {prescriptions.length === 0 ? (
            <div className="empty-appointments-state">
              <span className="empty-icon">💊</span>
              <h4>No Prescriptions Issued Yet</h4>
              <p>When an admin or doctor completes your consultation and issues an e-prescription, it will appear here.</p>
            </div>
          ) : (
            <div className="prescriptions-grid">
              {prescriptions.map((rx, idx) => (
                <div className="prescription-card glass-card" key={idx}>
                  <div className="rx-card-top">
                    <span className="rx-badge">Rx Verified</span>
                    <span className="rx-date">{rx.date}</span>
                  </div>
                  <h4>Consultation with {rx.doctorName}</h4>
                  <p className="rx-diagnosis"><strong>Diagnosis:</strong> {rx.diagnosis}</p>
                  <p className="rx-meds-count">💊 {rx.medicines?.length || 0} Medications Prescribed</p>

                  <button
                    className="btn-hero-secondary"
                    style={{ width: "100%", marginTop: "12px" }}
                    onClick={() => setActivePrescriptionModal(rx)}
                  >
                    🖨️ View & Print E-Prescription
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Emergency Health Profile Editor */}
      {tab === "profile" && (
        <div className="profile-section glass-card">
          <h3>Emergency Medical Health Profile</h3>
          <p className="tab-subtitle">Keep your medical details up to date for emergency triage.</p>

          {profileSaved && (
            <div className="auth-success-banner" style={{ marginBottom: "16px" }}>
              <span>✅ Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="profile-form">
            <div className="form-grid-2">
              <div className="input-group">
                <label className="input-label">Blood Group</label>
                <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Patient Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 28"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Known Allergies / Pre-existing Conditions</label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Penicillin allergy, Asthma"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Emergency Contact Phone</label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+91 98765 00000"
              />
            </div>

            <button type="submit" className="btn-hero-primary" style={{ marginTop: "12px", width: "fit-content" }}>
              💾 Save Profile Details
            </button>
          </form>
        </div>
      )}

      {/* Prescription View Modal */}
      {activePrescriptionModal && (
        <PrescriptionModal
          appointment={{
            patientName: name,
            doctorName: activePrescriptionModal.doctorName,
            date: activePrescriptionModal.date,
            id: activePrescriptionModal.appointmentId || "101",
          }}
          isViewOnly={true}
          initialPrescription={activePrescriptionModal}
          onClose={() => setActivePrescriptionModal(null)}
        />
      )}
    </div>
  );
}