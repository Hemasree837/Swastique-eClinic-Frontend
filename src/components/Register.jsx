import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("PATIENT");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("Fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords not matching");
      return;
    }

    try {
      await axios.post("http://localhost:8080/auth/register", {
        username,
        email,
        password,
        role,
      });

      alert("Registered Successfully");
      navigate("/login");
    } catch (err) {
      alert("Registration Failed");
      console.log(err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="PATIENT">Patient</option>
          <option value="REPORTER">Reporter</option>
        </select>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleRegister}>Register</button>

        <p>
          Already have account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}