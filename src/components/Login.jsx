import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import API from "../api";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/login`, {
        username: username.trim(),
        password,
      });

      const user = res.data;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "PATIENT") navigate("/patient");
      else navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      const serverMsg =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" ? err.response.data : null);

      if (serverMsg) {
        setError(serverMsg);
      } else if (err.code === "ERR_NETWORK") {
        setError("Network error: Backend is starting up on Render (~45s). Please wait and try again.");
      } else {
        setError("Invalid username or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="card">
        <h2>Swastiq eClinic</h2>
        <p>Login</p>

        {error && (
          <div style={{ color: "#dc2626", background: "#fee2e2", padding: "10px", borderRadius: "6px", marginBottom: "12px", fontSize: "14px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button onClick={login} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          New user? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}