import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import API from "../api";
import "./Register.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("PATIENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill out all form fields.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API}/auth/register`, {
        username: username.trim(),
        email: email.trim(),
        password,
        role,
      });

      setSuccessMsg("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      const serverMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null);

      if (serverMsg) {
        setError(serverMsg);
      } else if (err.code === "ERR_NETWORK") {
        setError("Connecting to live backend... If server is starting up, please wait ~30s and try again.");
      } else {
        setError("Registration Failed. Username or email might already be registered.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="auth-logo-frame">
            <img src={logo} alt="Swastiq eClinic" className="auth-logo" />
          </div>
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join Swastiq eClinic for 24/7 healthcare access</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-success-banner">
            <span className="success-icon">✅</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-group">
            <label className="input-label">Account Role</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-tab ${role === "PATIENT" ? "active" : ""}`}
                onClick={() => setRole("PATIENT")}
              >
                👤 Patient
              </button>
              <button
                type="button"
                className={`role-tab ${role === "REPORTER" ? "active" : ""}`}
                onClick={() => setRole("REPORTER")}
              >
                📋 Reporter / Desk
              </button>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login" className="auth-link">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}