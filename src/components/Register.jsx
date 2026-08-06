import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
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

      alert("Registered Successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      const serverMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null);

      if (serverMsg) {
        setError(serverMsg);
      } else if (err.code === "ERR_NETWORK") {
        setError("Network error: Backend is starting up on Render (takes ~45s). Please wait a moment and try again.");
      } else {
        setError("Registration Failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>

        {error && <div style={{ color: "#dc2626", background: "#fee2e2", padding: "10px", borderRadius: "6px", marginBottom: "12px", fontSize: "14px", textAlign: "center" }}>{error}</div>}

        <select value={role} onChange={(e) => setRole(e.target.value)} disabled={loading}>
          <option value="PATIENT">Patient</option>
          <option value="REPORTER">Reporter</option>
        </select>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />

        <button onClick={handleRegister} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? "Registering (connecting to backend)..." : "Register"}
        </button>

        <p>
          Already have account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}