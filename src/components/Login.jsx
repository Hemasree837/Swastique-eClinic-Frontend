import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import API from "../api";
import "./Login.css";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your username and password");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/login`, {
        username: username.trim(),
        password,
      });

      let userObj = typeof res.data === "object" ? res.data : { username: username.trim() };
      
      if (username.trim().toLowerCase() === "admin") {
        userObj = { ...userObj, role: "ADMIN" };
      }

      setUser(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));

      if (userObj.role === "ADMIN" || username.trim().toLowerCase() === "admin") {
        navigate("/admin");
      } else if (userObj.role === "PATIENT") {
        navigate("/patient");
      } else if (userObj.role === "REPORTER") {
        navigate("/reporter");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      const serverMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null);

      if (serverMsg) {
        setError(serverMsg);
      } else if (err.code === "ERR_NETWORK") {
        setError("Connecting to live backend... If server is starting up, please wait ~30s and try again.");
      } else {
        setError("Invalid username or password. Please try again.");
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
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Log in to your Swastiq eClinic account</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label className="input-label">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? "Authenticating..." : "Log In to Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            New to Swastiq eClinic? <Link to="/register" className="auth-link">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}