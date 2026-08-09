import axios from "axios";
import { useEffect, useState } from "react";
import API from "../api";
import "./Admin.css";

export default function Admin() {
  const [tab, setTab] = useState("dashboard");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [spec, setSpec] = useState("");
  const [experience, setExperience] = useState("");
  const [slots, setSlots] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editId, setEditId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

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
        setStatusMessage("Doctor profile updated successfully!");
      } else {
        await axios.post(`${API}/doctor`, payload);
        setStatusMessage("New Doctor added successfully!");
      }

      clearForm();
      fetchData();
    } catch (err) {
      console.error("Error saving doctor:", err);
      setStatusMessage("Failed to save doctor details.");
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to remove this doctor from the clinic roster?")) return;

    try {
      await axios.delete(`${API}/doctor/${id}`);
      setStatusMessage("Doctor removed successfully.");
      fetchData();
    } catch (err) {
      console.error("Error deleting doctor:", err);
      setStatusMessage("Failed to delete doctor.");
    }
  };

  const updateAppointmentStatus = async (appointment, newStatus) => {
    try {
      await axios.put(`${API}/appointment/${appointment.id}`, {
        ...appointment,
        status: newStatus,
      });
      fetchData();
    } catch (err) {
      console.error("Error updating appointment status:", err);
      alert("Failed to update status");
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
            <div className="tab-title-header">
              <h2>Overview & Metrics</h2>
              <p>Real-time clinic activity counters and system metrics.</p>
            </div>

            <div className="admin-stats-grid">
              <div className="admin-stat-card glass-card">
                <div className="stat-icon-wrapper">👨‍⚕️</div>
                <div>
                  <span className="stat-big-val">{doctors.length}</span>
                  <span className="stat-sub-text">Total Active Doctors</span>
                </div>
              </div>

              <div className="admin-stat-card glass-card">
                <div className="stat-icon-wrapper">⏳</div>
                <div>
                  <span className="stat-big-val">{pendingAppointments.length}</span>
                  <span className="stat-sub-text">Pending Approval Requests</span>
                </div>
              </div>

              <div className="admin-stat-card glass-card">
                <div className="stat-icon-wrapper">✅</div>
                <div>
                  <span className="stat-big-val">{approvedAppointments.length}</span>
                  <span className="stat-sub-text">Confirmed Consultations</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manage Doctors */}
        {tab === "doctors" && (
          <div className="admin-doctors-tab">
            <div className="tab-title-header">
              <h2>Doctor Roster Management</h2>
              <p>Add, edit, or remove clinic specialist profiles.</p>
            </div>

            {/* Doctor Form Drawer */}
            <div className="doctor-form-card glass-card">
              <h3>{editId ? "✏️ Edit Doctor Details" : "➕ Add New Specialist Doctor"}</h3>
              <form onSubmit={handleSaveDoctor} className="admin-doc-form">
                <div className="form-grid-3">
                  <div className="input-group">
                    <label className="input-label">Doctor Name</label>
                    <input
                      type="text"
                      placeholder="Dr. Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Specialization</label>
                    <input
                      type="text"
                      placeholder="e.g. Cardiology"
                      value={spec}
                      onChange={(e) => setSpec(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Years of Experience</label>
                    <input
                      type="number"
                      placeholder="e.g. 8"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="input-group">
                    <label className="input-label">Available Slots (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="9:00 AM, 11:30 AM, 3:00 PM"
                      value={slots}
                      onChange={(e) => setSlots(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Photo Image URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-actions-row">
                  <button type="submit" className="btn-hero-primary">
                    {editId ? "Save Changes" : "Create Doctor Profile"}
                  </button>
                  {editId && (
                    <button type="button" className="btn-hero-secondary" onClick={clearForm}>
                      Cancel Editing
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Doctors Grid */}
            <div className="admin-doctors-grid">
              {doctors.map((d) => (
                <div className="admin-doctor-card glass-card" key={d.id}>
                  <div className="admin-doc-info">
                    <h4>{d.name}</h4>
                    <span className="doc-spec">{d.specialization}</span>
                    <p className="doc-exp">🏅 {d.experience} Years Experience</p>
                    <span className={`status-pill ${d.onLeave ? "status-leave" : "status-active"}`}>
                      {d.onLeave ? "🔴 On Leave" : "🟢 Available"}
                    </span>
                  </div>

                  <div className="admin-doc-actions">
                    <button
                      className="btn-action-edit"
                      onClick={() => {
                        setName(d.name);
                        setSpec(d.specialization);
                        setExperience(d.experience);
                        setSlots(Array.isArray(d.availableSlots) ? d.availableSlots.join(",") : d.availableSlots);
                        setImageUrl(d.imageUrl || "");
                        setEditId(d.id);
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button className="btn-action-delete" onClick={() => deleteDoctor(d.id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Manage Appointments */}
        {tab === "appointments" && (
          <div className="admin-appointments-tab">
            <div className="tab-title-header">
              <h2>Appointment Request Approvals</h2>
              <p>Review patient booking requests and change status.</p>
            </div>

            <div className="admin-table-container glass-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Assigned Doctor</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Quick Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <strong>{a.patientName}</strong>
                      </td>
                      <td>{a.doctorName}</td>
                      <td>
                        {a.date} at {a.time}
                      </td>
                      <td>
                        <span className={`status-pill ${a.status === "PENDING" ? "status-pending" : "status-approved"}`}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        {a.status === "PENDING" && (
                          <button
                            className="btn-status-approve"
                            onClick={() => updateAppointmentStatus(a, "APPROVED")}
                          >
                            ✅ Approve
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
      </main>
    </div>
  );
}