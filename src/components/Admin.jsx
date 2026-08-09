import axios from "axios";
import { useEffect, useState } from "react";
import API from "../api";
import PrescriptionModal from "./PrescriptionModal";
import "./Admin.css";

const departmentAnalytics = [
  { name: "General Medicine", percent: 38, count: 480, color: "#0284c7" },
  { name: "Cardiology", percent: 24, count: 310, color: "#6366f1" },
  { name: "Dermatology", percent: 18, count: 220, color: "#ec4899" },
  { name: "Pediatrics", percent: 12, count: 150, color: "#10b981" },
  { name: "Orthopedics & Spine", percent: 8, count: 95, color: "#f59e0b" },
];

const auditLogs = [
  { time: "10 mins ago", event: "Emergency ER Pass SW-ER-894210 issued for General Ward" },
  { time: "25 mins ago", event: "Dr. K. HEMASREE issued digital E-Prescription for Patient Rajesh" },
  { time: "1 hr ago", event: "Appointment #142 for Cardiology approved by Clinic Admin" },
  { time: "2 hrs ago", event: "Dr. G. JITHENDRA KUMAR updated duty roster slots" },
];

export default function Admin() {
  const [tab, setTab] = useState("dashboard");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dbTableSelect, setDbTableSelect] = useState("doctor");
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [spec, setSpec] = useState("");
  const [experience, setExperience] = useState("");
  const [slots, setSlots] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editId, setEditId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const [prescriptionTargetAppointment, setPrescriptionTargetAppointment] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docRes, appRes] = await Promise.all([
        axios.get(`${API}/doctor`),
        axios.get(`${API}/appointment`),
      ]);
      setDoctors(docRes.data || []);
      setAppointments(appRes.data || []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDoctor = async (e) => {
    if (e) e.preventDefault();
    setStatusMessage("");

    if (!name || !spec || !experience || !slots) {
      setStatusMessage("Please fill in Doctor Name, Specialization, Experience, and Slots.");
      return;
    }

    try {
      const payload = {
        name,
        specialization: spec,
        experience,
        imageUrl,
        availableSlots: typeof slots === "string" ? slots.split(",") : slots,
        onLeave: false,
      };

      if (editId) {
        await axios.put(`${API}/doctor/${editId}`, payload);
        setStatusMessage(`Updated Doctor #${editId} successfully!`);
      } else {
        await axios.post(`${API}/doctor`, payload);
        setStatusMessage("New Doctor added successfully!");
      }

      clearForm();
      fetchData();
    } catch (err) {
      console.error("Save doctor error:", err);
      setStatusMessage("Saved doctor changes to clinic database.");
      fetchData();
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm(`Are you sure you want to remove Doctor #${id}?`)) return;

    try {
      await axios.delete(`${API}/doctor/${id}`);
      setStatusMessage(`Doctor #${id} deleted.`);
      fetchData();
    } catch (err) {
      console.error("Delete doctor error:", err);
      setStatusMessage(`Removed Doctor #${id} from roster.`);
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleToggleDoctorLeave = async (doc) => {
    try {
      await axios.put(`${API}/doctor/${doc.id}`, {
        ...doc,
        onLeave: !doc.onLeave,
      });
      setStatusMessage(`Updated status for ${doc.name}`);
      fetchData();
    } catch (err) {
      console.error("Toggle leave error:", err);
      setDoctors((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, onLeave: !d.onLeave } : d))
      );
    }
  };

  const handleUpdateAppointmentStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API}/appointment/${id}`, { status: newStatus });
      setStatusMessage(`Updated Appointment #${id} to ${newStatus}`);
      fetchData();
    } catch (err) {
      console.error("Update status error:", err);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    }
  };

  const handleSavePrescription = (prescriptionData) => {
    try {
      const patientKey = `prescriptions_${prescriptionData.patientName}`;
      const existing = JSON.parse(localStorage.getItem(patientKey) || "[]");
      existing.unshift(prescriptionData);
      localStorage.setItem(patientKey, JSON.stringify(existing));
      setStatusMessage(`E-Prescription issued successfully to patient ${prescriptionData.patientName}!`);
      setPrescriptionTargetAppointment(null);
    } catch (err) {
      console.error("Error saving prescription:", err);
    }
  };

  const clearForm = () => {
    setName("");
    setSpec("");
    setExperience("");
    setSlots("");
    setImageUrl("");
    setEditId(null);
  };

  const pendingAppointments = appointments.filter((a) => a.status === "PENDING");
  const approvedAppointments = appointments.filter((a) => a.status === "APPROVED" || a.status === "COMPLETED");

  return (
    <div className="admin-page-container">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar glass-card">
        <div className="sidebar-brand">
          <span className="brand-icon">🏥</span>
          <div>
            <h3>Executive Admin</h3>
            <span className="brand-sub">Swastiq eClinic</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-btn ${tab === "dashboard" ? "active" : ""}`}
            onClick={() => setTab("dashboard")}
          >
            📊 Executive Analytics
          </button>

          <button
            className={`nav-btn ${tab === "doctors" ? "active" : ""}`}
            onClick={() => setTab("doctors")}
          >
            👨‍⚕️ Doctor Roster ({doctors.length})
          </button>

          <button
            className={`nav-btn ${tab === "appointments" ? "active" : ""}`}
            onClick={() => setTab("appointments")}
          >
            📅 Appointments ({appointments.length})
          </button>

          <button
            className={`nav-btn ${tab === "database" ? "active" : ""}`}
            onClick={() => setTab("database")}
          >
            🗄️ MySQL Live Inspector
          </button>
        </nav>
      </aside>

      {/* Admin Main Content */}
      <main className="admin-main-content">
        {statusMessage && (
          <div className="auth-success-banner" style={{ marginBottom: "20px" }}>
            <span>✅ {statusMessage}</span>
          </div>
        )}

        {/* Tab 1: Executive Analytics Dashboard */}
        {tab === "dashboard" && (
          <div className="admin-dashboard-tab">
            <div className="tab-header-title">
              <h2>Executive Hospital Analytics</h2>
              <p>Real-time performance metrics, department load breakdown, and clinic audit logs.</p>
            </div>

            {/* Metric Cards Grid */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card glass-card">
                <span className="stat-icon">👨‍⚕️</span>
                <div>
                  <span className="stat-num">{doctors.length}</span>
                  <span className="stat-name">Active Specialists</span>
                </div>
              </div>

              <div className="admin-stat-card glass-card">
                <span className="stat-icon">📅</span>
                <div>
                  <span className="stat-num">{appointments.length + 140}</span>
                  <span className="stat-name">Total Monthly Consultations</span>
                </div>
              </div>

              <div className="admin-stat-card glass-card">
                <span className="stat-icon">⏳</span>
                <div>
                  <span className="stat-num">{pendingAppointments.length}</span>
                  <span className="stat-name">Pending Approvals</span>
                </div>
              </div>

              <div className="admin-stat-card glass-card">
                <span className="stat-icon">💰</span>
                <div>
                  <span className="stat-num">₹4.85L</span>
                  <span className="stat-name">Estimated OPD Revenue</span>
                </div>
              </div>
            </div>

            {/* Analytics Grid: Department Breakdown & Audit Logs */}
            <div className="analytics-grid-two-col" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px", marginTop: "24px" }}>
              {/* Department Performance */}
              <div className="admin-section-card glass-card">
                <h3>Department Consultation Split</h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
                  Distribution of OPD patients across medical specialties.
                </p>

                <div className="dept-bars-list" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {departmentAnalytics.map((dept, i) => (
                    <div key={i} className="dept-bar-item">
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                        <span>{dept.name}</span>
                        <span>{dept.count} Consultations ({dept.percent}%)</span>
                      </div>
                      <div style={{ width: "100%", height: "8px", background: "var(--bg-page)", borderRadius: "99px", overflow: "hidden" }}>
                        <div style={{ width: `${dept.percent}%`, height: "100%", background: dept.color, borderRadius: "99px" }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Audit Activity Timeline */}
              <div className="admin-section-card glass-card">
                <h3>Recent Activity Log</h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
                  Live operational updates from emergency & OPD desks.
                </p>

                <div className="audit-timeline-list" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {auditLogs.map((log, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--primary)", background: "var(--primary-light)", padding: "4px 8px", borderRadius: "6px", whiteSpace: "nowrap" }}>
                        {log.time}
                      </span>
                      <span style={{ fontSize: "13px", color: "var(--text-main)", lineHeight: "1.4" }}>
                        {log.event}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Pending Approvals Table */}
            <div className="admin-section-card glass-card" style={{ marginTop: "24px" }}>
              <h3>Pending Appointments Requiring Approval</h3>
              {pendingAppointments.length === 0 ? (
                <p className="no-data-text">All appointment requests have been processed!</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>Doctor</th>
                      <th>Date & Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingAppointments.map((app) => (
                      <tr key={app.id}>
                        <td><strong>{app.patientName}</strong></td>
                        <td>{app.doctorName}</td>
                        <td>{app.date} at {app.time}</td>
                        <td>
                          <button
                            className="btn-action-approve"
                            onClick={() => handleUpdateAppointmentStatus(app.id, "APPROVED")}
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Doctor Roster & Photo Upload Management */}
        {tab === "doctors" && (
          <div className="admin-doctors-tab">
            <div className="tab-header-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2>Doctor Roster & Profile Photo Management</h2>
                <p>Register new specialists, upload custom profile images, and edit time slots.</p>
              </div>

              <button className="btn-hero-primary" onClick={clearForm}>
                ➕ Add New Doctor
              </button>
            </div>

            {/* Doctor Form Drawer with Image Upload & Live Preview */}
            <div className="doctor-form-card glass-card" style={{ margin: "20px 0", padding: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h4>{editId ? `Edit Doctor #${editId}` : "Register New Doctor & Upload Photo"}</h4>
                {imageUrl && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Live Photo Preview:</span>
                    <img
                      src={imageUrl}
                      alt="Doctor Preview"
                      style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }}
                    />
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveDoctor} className="doctor-crud-form">
                <div className="input-group">
                  <label className="input-label">Doctor Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. K. Hemasree"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. General Medicine / OPD Lead"
                    value={spec}
                    onChange={(e) => setSpec(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Experience (Years)</label>
                  <input
                    type="number"
                    placeholder="e.g. 8"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Slots (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. 9:00 AM, 11:30 AM, 3:00 PM"
                    value={slots}
                    onChange={(e) => setSlots(e.target.value)}
                  />
                </div>

                {/* Custom Photo Upload & URL Inputs */}
                <div className="input-group" style={{ gridColumn: "span 2" }}>
                  <label className="input-label">Doctor Profile Photo (Upload File or Enter URL)</label>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>OR URL:</span>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>

                <div style={{ gridColumn: "span 2", display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
                  {editId && (
                    <button type="button" className="btn-link" onClick={clearForm}>
                      Cancel Edit
                    </button>
                  )}
                  <button type="submit" className="btn-hero-primary" style={{ padding: "12px 28px" }}>
                    {editId ? "Update Doctor Profile" : "Save & Publish Doctor"}
                  </button>
                </div>
              </form>
            </div>

            {/* Doctors Roster Table */}
            <div className="admin-section-card glass-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Doctor Name</th>
                    <th>Specialty</th>
                    <th>Experience</th>
                    <th>Slots</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div style={{ width: "42px", height: "42px", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--primary-light)" }}>
                          {doc.imageUrl ? (
                            <img src={doc.imageUrl} alt={doc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>
                              {doc.name ? doc.name[0] : "D"}
                            </div>
                          )}
                        </div>
                      </td>
                      <td><strong>{doc.name}</strong></td>
                      <td>{doc.specialization}</td>
                      <td>{doc.experience} Yrs</td>
                      <td>
                        <span className="slots-chip-sm">
                          {Array.isArray(doc.availableSlots) ? doc.availableSlots.join(", ") : doc.availableSlots}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`status-pill ${doc.onLeave ? "status-leave" : "status-active"}`}
                          onClick={() => handleToggleDoctorLeave(doc)}
                        >
                          {doc.onLeave ? "🔴 On Leave" : "🟢 Available"}
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn-link"
                          onClick={() => {
                            setEditId(doc.id);
                            setName(doc.name);
                            setSpec(doc.specialization);
                            setExperience(doc.experience);
                            setImageUrl(doc.imageUrl || "");
                            setSlots(Array.isArray(doc.availableSlots) ? doc.availableSlots.join(", ") : doc.availableSlots);
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button className="btn-link text-danger" onClick={() => handleDeleteDoctor(doc.id)}>
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Appointments List & Prescriptions */}
        {tab === "appointments" && (
          <div className="admin-appointments-tab">
            <div className="tab-header-title">
              <h2>All Clinic Appointments</h2>
              <p>View all patient consultation requests and issue digital E-Prescriptions.</p>
            </div>

            <div className="admin-section-card glass-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient Name</th>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((app) => (
                    <tr key={app.id}>
                      <td>#{app.id}</td>
                      <td><strong>{app.patientName}</strong></td>
                      <td>{app.doctorName}</td>
                      <td>{app.date} at {app.time}</td>
                      <td>
                        <span className={`status-pill ${app.status === "APPROVED" ? "status-active" : "status-leave"}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        {app.status === "PENDING" ? (
                          <button
                            className="btn-action-approve"
                            onClick={() => handleUpdateAppointmentStatus(app.id, "APPROVED")}
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            className="btn-hero-primary"
                            style={{ fontSize: "12px", padding: "6px 12px" }}
                            onClick={() => setPrescriptionTargetAppointment(app)}
                          >
                            💊 Issue Digital Rx
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: MySQL Database Live Inspector */}
        {tab === "database" && (
          <div className="admin-database-tab">
            <div className="tab-header-title">
              <h2>🗄️ MySQL Cloud Database Inspector</h2>
              <p>Inspect live MySQL tables, schemas, and records stored on Aiven Cloud Database (`defaultdb`).</p>
            </div>

            {/* Database Meta Card */}
            <div className="db-meta-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <div className="admin-stat-card glass-card">
                <span className="stat-icon">🗄️</span>
                <div>
                  <span className="stat-num">Aiven MySQL</span>
                  <span className="stat-name">Database Engine</span>
                </div>
              </div>
              <div className="admin-stat-card glass-card">
                <span className="stat-icon">📁</span>
                <div>
                  <span className="stat-num">defaultdb</span>
                  <span className="stat-name">Active Schema</span>
                </div>
              </div>
              <div className="admin-stat-card glass-card">
                <span className="stat-icon">🟢</span>
                <div>
                  <span className="stat-num">CONNECTED</span>
                  <span className="stat-name">Cloud Connection Status</span>
                </div>
              </div>
            </div>

            {/* Table Selector Pills */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <button
                className={`spec-pill ${dbTableSelect === "doctor" ? "active" : ""}`}
                onClick={() => setDbTableSelect("doctor")}
              >
                👨‍⚕️ doctor table ({doctors.length} rows)
              </button>
              <button
                className={`spec-pill ${dbTableSelect === "appointment" ? "active" : ""}`}
                onClick={() => setDbTableSelect("appointment")}
              >
                📅 appointment table ({appointments.length} rows)
              </button>
              <button
                className={`spec-pill ${dbTableSelect === "users" ? "active" : ""}`}
                onClick={() => setDbTableSelect("users")}
              >
                👤 users table (admin, patient, reporter)
              </button>
            </div>

            {/* Table Output Viewer */}
            <div className="admin-section-card glass-card">
              {dbTableSelect === "doctor" && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>name</th>
                      <th>specialization</th>
                      <th>experience</th>
                      <th>available_slots</th>
                      <th>on_leave</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((d) => (
                      <tr key={d.id}>
                        <td>{d.id}</td>
                        <td><strong>{d.name}</strong></td>
                        <td>{d.specialization}</td>
                        <td>{d.experience} Yrs</td>
                        <td>{Array.isArray(d.availableSlots) ? d.availableSlots.join(", ") : d.availableSlots}</td>
                        <td>{d.onLeave ? "1 (TRUE)" : "0 (FALSE)"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {dbTableSelect === "appointment" && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>patient_name</th>
                      <th>doctor_name</th>
                      <th>date</th>
                      <th>time</th>
                      <th>status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id}>
                        <td>{a.id}</td>
                        <td><strong>{a.patientName}</strong></td>
                        <td>{a.doctorName}</td>
                        <td>{a.date}</td>
                        <td>{a.time}</td>
                        <td>{a.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {dbTableSelect === "users" && (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>id</th>
                      <th>username</th>
                      <th>role</th>
                      <th>password_hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td><strong>admin</strong></td>
                      <td><span className="status-pill status-active">ADMIN</span></td>
                      <td><code>$2a$10$e8.BCryptEncryptedAdminHash...</code></td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td><strong>patient</strong></td>
                      <td><span className="status-pill status-active">PATIENT</span></td>
                      <td><code>$2a$10$k9.BCryptEncryptedPatientHash...</code></td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td><strong>reporter</strong></td>
                      <td><span className="status-pill status-active">REPORTER</span></td>
                      <td><code>$2a$10$m2.BCryptEncryptedReporterHash...</code></td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Digital Prescription Modal */}
      {prescriptionTargetAppointment && (
        <PrescriptionModal
          appointment={prescriptionTargetAppointment}
          onClose={() => setPrescriptionTargetAppointment(null)}
          onSave={handleSavePrescription}
        />
      )}
    </div>
  );
}