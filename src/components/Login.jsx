import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import API from "../api";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    try {
     const res = await axios.post(`${API}/auth/login`, {
  username,
  password
  });

      const user = res.data;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "PATIENT") navigate("/patient");
      else navigate("/");

    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div className="login">

      <div className="card">

        <h2>Swastiq eClinic</h2>
        <p>Login</p>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>

        <p>
          New user? <Link to="/register">Register</Link>
        </p>

      </div>

    </div>
  );
}