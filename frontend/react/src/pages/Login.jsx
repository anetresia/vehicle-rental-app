import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.access_token;

      localStorage.setItem("token", token);

      const userResponse = await api.get("/users/me");
      const user = userResponse.data;

      localStorage.setItem("role", user.role);
      localStorage.setItem("userName", user.full_name);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Unable to sign in. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">

      <div className="auth-brand-panel login-brand-panel">
        <Link to="/" className="auth-brand">
          <span className="brand-mark">D</span>

          <span className="brand-name">
            Drive<span>Ease</span>
          </span>
        </Link>

        <div className="brand-message">
          <span className="eyebrow">WELCOME BACK</span>

          <h1>
            Your next journey
            <br />
            starts <span>here.</span>
          </h1>

          <p>
            Sign in to manage your bookings, explore available
            vehicles and keep everything about your rental journey
            in one place.
          </p>

          <div className="login-highlights">
            <div>
              <strong>01</strong>
              <span>Browse vehicles</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Choose your dates</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Manage your booking</span>
            </div>
          </div>
        </div>

        <p className="auth-footer-text">
          Vehicle Rental Management System
        </p>
      </div>

      <div className="auth-form-panel">

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
            <span className="eyebrow">ACCOUNT ACCESS</span>

            <h2>Welcome back</h2>

            <p>
              Sign in to continue your rental journey.
            </p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form">

            <div className="form-field">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <div className="field-label-row">
                <label htmlFor="password">Password</label>
              </div>

              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <span>→</span>}
            </button>

          </form>

          <div className="auth-switch">
            <span>Don't have an account?</span>

            <Link to="/register">
              Create an account
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Login;