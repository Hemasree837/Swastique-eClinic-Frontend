import { useState } from "react";
import "./BedTrackerWidget.css";

const initialBedStatus = [
  {
    type: "Emergency ER Trauma Bay",
    icon: "🚨",
    available: 6,
    total: 15,
    status: "Active 24/7",
    color: "#ef4444",
    desc: "Equipped with defibrillators, cardiac monitors & trauma resuscitation staff.",
  },
  {
    type: "ICU & Ventilator Beds",
    icon: "🫀",
    available: 4,
    total: 12,
    status: "High Priority",
    color: "#f59e0b",
    desc: "Full invasive ventilation, continuous hemodynamic monitoring & critical care team.",
  },
  {
    type: "Oxygen-Supported Beds",
    icon: "🫁",
    available: 12,
    total: 25,
    status: "Available",
    color: "#06b6d4",
    desc: "Centralized high-flow oxygen supply for respiratory & acute pneumonia care.",
  },
  {
    type: "General OPD Ward Beds",
    icon: "🏥",
    available: 18,
    total: 40,
    status: "Available",
    color: "#10b981",
    desc: "Comfortable semi-private & general ward beds for post-op recovery.",
  },
];

export default function BedTrackerWidget({ user }) {
  const [beds] = useState(initialBedStatus);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedBedType, setSelectedBedType] = useState(beds[0].type);
  const [patientName, setPatientName] = useState(user?.username || "");
  const [patientPhone, setPatientPhone] = useState("");
  const [priorityTier, setPriorityTier] = useState("URGENT");
  const [etaMinutes, setEtaMinutes] = useState("15");
  const [reservedPass, setReservedPass] = useState(null);

  const handleReserveSubmit = (e) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) return;

    const pass = {
      passId: "SW-ER-" + Math.floor(100000 + Math.random() * 900000),
      bedType: selectedBedType,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      priorityTier,
      etaMinutes,
      issueTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setReservedPass(pass);
  };

  return (
    <section className="bed-tracker-section glass-card">
      <div className="bed-tracker-header">
        <div>
          <span className="section-subtitle">🚨 Real-Time Emergency Monitoring</span>
          <h2>Live ICU & Emergency Bed Availability</h2>
          <p>Track live bed capacities and reserve emergency ER admission for critical patients.</p>
        </div>

        <button
          className="btn-hero-primary btn-er-reserve"
          onClick={() => {
            setReservedPass(null);
            setShowReserveModal(true);
          }}
        >
          🚑 Reserve Emergency ER Bed
        </button>
      </div>

      {/* Bed Cards Grid */}
      <div className="bed-cards-grid">
        {beds.map((bed, idx) => {
          const percentAvailable = Math.round((bed.available / bed.total) * 100);

          return (
            <div className="bed-card glass-card" key={idx}>
              <div className="bed-card-top">
                <span className="bed-icon">{bed.icon}</span>
                <span
                  className="bed-status-badge"
                  style={{
                    backgroundColor: `${bed.color}15`,
                    color: bed.color,
                    borderColor: `${bed.color}30`,
                  }}
                >
                  ● {bed.status}
                </span>
              </div>

              <h3>{bed.type}</h3>
              <p className="bed-desc">{bed.desc}</p>

              <div className="bed-stats-row">
                <span className="bed-count-text">
                  <strong style={{ color: bed.color }}>{bed.available}</strong> / {bed.total} Beds Open
                </span>
                <span className="bed-percent">{percentAvailable}%</span>
              </div>

              <div className="bed-progress-bar">
                <div
                  className="bed-progress-fill"
                  style={{
                    width: `${percentAvailable}%`,
                    backgroundColor: bed.color,
                  }}
                ></div>
              </div>

              <button
                className="btn-quick-reserve"
                onClick={() => {
                  setSelectedBedType(bed.type);
                  setReservedPass(null);
                  setShowReserveModal(true);
                }}
              >
                Fast Admission Pass →
              </button>
            </div>
          );
        })}
      </div>

      {/* Emergency Admission Reservation Modal */}
      {showReserveModal && (
        <div className="rx-modal-overlay" onClick={() => setShowReserveModal(false)}>
          <div className="rx-modal-card glass-card er-modal" onClick={(e) => e.stopPropagation()}>
            <div className="er-modal-header">
              <h3>🚑 Reserve Emergency ER Bed Pass</h3>
              <button className="btn-close-chat" onClick={() => setShowReserveModal(false)}>
                ✕
              </button>
            </div>

            {!reservedPass ? (
              <form onSubmit={handleReserveSubmit} className="er-form">
                <div className="input-group">
                  <label className="input-label">Select Required Bed Type</label>
                  <select
                    value={selectedBedType}
                    onChange={(e) => setSelectedBedType(e.target.value)}
                  >
                    {beds.map((b) => (
                      <option key={b.type} value={b.type}>
                        {b.icon} {b.type} ({b.available} Available)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter patient name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                  />
                </div>

                <div className="er-form-row">
                  <div className="input-group">
                    <label className="input-label">Triage Priority</label>
                    <select
                      value={priorityTier}
                      onChange={(e) => setPriorityTier(e.target.value)}
                    >
                      <option value="CRITICAL">🔴 CRITICAL (Cardiac / Trauma / Stroke)</option>
                      <option value="URGENT">🟡 URGENT (High Fever / Acute Pain)</option>
                      <option value="ROUTINE">🟢 ROUTINE (Observation)</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Estimated Arrival Time</label>
                    <select
                      value={etaMinutes}
                      onChange={(e) => setEtaMinutes(e.target.value)}
                    >
                      <option value="10">⚡ 10 Minutes</option>
                      <option value="20">🚗 20 Minutes</option>
                      <option value="30">🚑 30 Minutes</option>
                      <option value="60">⏱️ 1 Hour</option>
                    </select>
                  </div>
                </div>

                <div className="er-actions">
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => setShowReserveModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-hero-primary">
                    Issue Immediate ER Pass
                  </button>
                </div>
              </form>
            ) : (
              <div className="er-pass-ticket">
                <div className="pass-header-badge">
                  <span>🚨 Priority Admission Pass Issued</span>
                </div>

                <div className="pass-code">{reservedPass.passId}</div>

                <div className="pass-details-grid">
                  <div className="pass-detail-item">
                    <span>Patient:</span>
                    <strong>{reservedPass.patientName}</strong>
                  </div>
                  <div className="pass-detail-item">
                    <span>Bed Reserved:</span>
                    <strong>{reservedPass.bedType}</strong>
                  </div>
                  <div className="pass-detail-item">
                    <span>Priority Level:</span>
                    <span className={`priority-tag ${reservedPass.priorityTier.toLowerCase()}`}>
                      {reservedPass.priorityTier}
                    </span>
                  </div>
                  <div className="pass-detail-item">
                    <span>Expected Arrival:</span>
                    <strong>In ~{reservedPass.etaMinutes} Mins ({reservedPass.issueTime})</strong>
                  </div>
                </div>

                <p className="pass-instructions">
                   Show this digital pass to the Swastique Hospital ER Duty Desk upon arrival for zero-wait triage admission.
                </p>

                <div className="pass-footer">
                  <button className="btn-hero-primary" onClick={() => window.print()}>
                    🖨️ Print ER Pass
                  </button>
                  <button className="btn-hero-secondary" onClick={() => setShowReserveModal(false)}>
                    Close Ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
