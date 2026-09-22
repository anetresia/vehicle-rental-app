import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", formData);

      alert("Account created successfully!");

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page register-page">

      <div className="auth-form-panel register-form-panel">

        <div className="auth-form-wrapper">

          <div className="mobile-brand">
            <Link to="/" className="auth-brand">
              <span className="brand-mark">D</span>

              <span className="brand-name">
                Drive<span>Ease</span>
              </span>
            </Link>
          </div>

          <div className="auth-heading">
            <span className="eyebrow">GET STARTED</span>

            <h2>Create your account</h2>

            <p>
              Join DriveEase and make your vehicle rental
              experience simple and organized.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form
            onSubmit={handleRegister}
            className="auth-form"
          >

            <div className="form-field">
              <label htmlFor="full_name">
                Full name
              </label>

              <input
                id="full_name"
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">

              <div className="form-field">
                <label htmlFor="register-email">
                  Email address
                </label>

                <input
                  id="register-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="phone">
                  Phone number
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="07XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="form-field">
              <label htmlFor="register-password">
                Password
              </label>

              <div className="password-input">

                <input
                  id="register-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="password-toggle"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}

              {!loading && <span>→</span>}
            </button>

          </form>

          <div className="auth-switch">
            <span>Already have an account?</span>

            <Link to="/login">
              Sign in
            </Link>
          </div>

        </div>
      </div>

      <div className="auth-brand-panel register-brand-panel">

        <Link to="/" className="auth-brand">
          <span className="brand-mark">D</span>

          <span className="brand-name">
            Drive<span>Ease</span>
          </span>
        </Link>

        <div className="brand-message">

          <span className="eyebrow">
            YOUR JOURNEY, YOUR CHOICE
          </span>

          <h1>
            More than a rental.
            <br />
            It's your <span>journey.</span>
          </h1>

          <p>
            Create your DriveEase account and discover a
            convenient way to find, book and manage vehicles
            for your everyday journeys.
          </p>

          <div className="register-info-card">

            <div className="info-icon">
              ✓
            </div>

            <div>
              <strong>One simple account</strong>

              <p>
                Keep your bookings and rental details
                organized in one place.
              </p>
            </div>

          </div>

          <div className="register-info-card">

            <div className="info-icon">
              →
            </div>

            <div>
              <strong>Ready when you are</strong>

              <p>
                Explore vehicles and plan your next trip
                whenever you need.
              </p>
            </div>

          </div>

        </div>

        <p className="auth-footer-text">
          Vehicle Rental Management System
        </p>

      </div>

    </div>
  );
}

export default Register;