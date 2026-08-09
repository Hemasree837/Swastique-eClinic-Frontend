import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import "./Header.css";

export default function Header({ user, setUser, theme, toggleTheme }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="header-glass">
      <div className="header-inner">
        <Link to="/" className="header-brand">
          <div className="logo-wrapper">
            <img src={logo} alt="Swastiq eClinic" className="logo-img" />
          </div>
          <div className="brand-text">
            <span className="brand-title">Swastiq <span className="brand-highlight">eClinic</span></span>
            <span className="brand-subtitle">Health & Care</span>
          </div>
        </Link>

        <nav className="header-nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Home
          </NavLink>
          <NavLink to="/OurDoctors" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Doctors
          </NavLink>
          <NavLink to="/BookAppointment" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            Book Appointment
          </NavLink>

          {user?.role === "ADMIN" && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? "nav-item active badge-admin" : "nav-item badge-admin")}>
              Admin Panel
            </NavLink>
          )}
          {user?.role === "PATIENT" && (
            <NavLink to="/patient" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
              My Dashboard
            </NavLink>
          )}
          {user?.role === "REPORTER" && (
            <NavLink to="/reporter" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
              Reporter Duty
            </NavLink>
          )}

          <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Light/Dark Theme" aria-label="Toggle Theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {!user ? (
            <div className="auth-buttons">
              <Link to="/login" className="btn-link">Login</Link>
              <Link to="/register" className="btn-primary-gradient">Register</Link>
            </div>
          ) : (
            <div className="user-profile-menu">
              <div className="avatar-chip">
                <span className="avatar-char">{user.username ? user.username[0].toUpperCase() : "U"}</span>
                <span className="user-name">{user.username}</span>
                {user.role && <span className="role-pill">{user.role}</span>}
              </div>
              <button className="btn-logout" onClick={logout} title="Log Out">
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}