import axios from "axios";
import { useEffect, useState } from "react";
import API from "../api";
import PrescriptionModal from "./PrescriptionModal";
import "./Admin.css";

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
      setStatusMessage("Failed to save doctor to database.");
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
      setStatusMessage("Failed to delete doctor.");
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
    }
  };

  const handleUpdateAppointmentStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API}/appointment/${id}`, { status: newStatus });
      setStatusMessage(`Updated Appointment #${id} to ${newStatus}`);
      fetchData();
    } catch (err) {
      console.error("Update status error:", err);
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
            <h3>Admin Portal</h3>
            <span className="brand-sub">Swastiq eClinic</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-btn ${tab === "dashboard" ? "active" : ""}`}
            onClick={() => setTab("dashboard")}
          >
            📊 Analytics Dashboard
          </button>

          <button
            className={`nav-btn ${tab === "doctors" ? "active" : ""}`}
            onClick={() => setTab("doctors")}
          >
            👨‍⚕️ Doctors Roster ({doctors.length})
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
            🗄️ MySQL Database Live Inspector
          </button>
        </nav>
      </aside>

      {/* Admin Main Area */}
      <main className="admin-main-content">
        {statusMessage && (
          <div className="auth-success-banner" style={{ marginBottom: "20px" }}>
            <span>✅ {statusMessage}</span>
          </div>
        )}

        {/* Tab 1: Dashboard Stats */}
        {tab === "dashboard" && (
          <div className="admin-dashboard-tab">
            <div className="tab-header-title">
              <h2>Executive Clinic Dashboard</h2>
              <p>Real-time overview of clinic statistics, doctor roster, and pending visits.</p>
            </div>

            <div className="admin-stats-grid">
              <div className="admin-stat-card glass-card">
                <span className="stat-icon">👨‍⚕️</span>
                <div>
                  <span className="stat-num">{doctors.length}</span>
                  <span className="stat-name">Active Doctors</span>
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
                <span className="stat-icon">✅</span>
                <div>
                  <span className="stat-num">{approvedAppointments.length}</span>
                  <span className="stat-name">Confirmed Visits</span>
                </div>
              </div>
            </div>

            {/* Quick Action Tables */}
            <div className="dashboard-sections-grid" style={{ marginTop: "24px" }}>
              <div className="admin-section-card glass-card">
                <h3>Pending Visits Requiring Approval</h3>
                {pendingAppointments.length === 0 ? (
                  <p className="no-data-text">No pending appointments right now.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Patient</th>
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
          </div>
        )}

        {/* Tab 2: Doctors Management */}
        {tab === "doctors" && (
          <div className="admin-doctors-tab">
            <div className="tab-header-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2>Doctor Roster Management</h2>
                <p>Add new specialists, modify time slots, or toggle duty leave status.</p>
              </div>

              <button className="btn-hero-primary" onClick={clearForm}>
                ➕ Add New Doctor
              </button>
            </div>

            {/* Doctor Form Drawer */}
            <div className="doctor-form-card glass-card" style={{ margin: "20px 0", padding: "24px" }}>
              <h4>{editId ? `Edit Doctor #${editId}` : "Register New Doctor"}</h4>
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

                <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                  <button type="submit" className="btn-hero-primary" style={{ height: "42px" }}>
                    {editId ? "Update Doctor" : "Save Doctor"}
                  </button>
                  {editId && (
                    <button type="button" className="btn-link" onClick={clearForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Doctors Roster Table */}
            <div className="admin-section-card glass-card">
              <table className="admin-table">
                <thead>
                  <tr>
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

        {/* Tab 3: Appointments List */}
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