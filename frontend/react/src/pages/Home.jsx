import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");

    navigate("/login");
  };

  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className="main-navbar">

        <Link to="/" className="home-brand">
          <span className="brand-mark">D</span>

          <span className="brand-name">
            Drive<span>Ease</span>
          </span>
        </Link>

        <div className="main-nav-links">
          <Link to="/" className="active">
            Home
          </Link>

          <Link to="/vehicles">
            Vehicles
          </Link>

          {token && role === "customer" && (
            <>
              <Link to="/my-bookings">
                My Bookings
              </Link>

              <Link to="/profile">
                Profile
              </Link>
            </>
          )}

          {token && role === "admin" && (
            <Link to="/admin">
              Dashboard
            </Link>
          )}
        </div>

        <div className="navbar-actions">

          {!token ? (
            <>
              <Link
                to="/login"
                className="navbar-signin"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="navbar-create"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <span className="navbar-user">
                Hi, {userName || "User"}
              </span>

              <button
                className="navbar-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

        </div>

      </nav>

      {/* HERO */}
      <section className="home-hero">

        <div className="hero-text">

          <span className="hero-label">
            VEHICLE RENTAL MADE SIMPLE
          </span>

          <h1>
            Find a vehicle
            <br />
            that fits your <span>journey.</span>
          </h1>

          <p>
            From everyday travel to weekend adventures,
            discover vehicles that match your plans and
            book your next ride with ease.
          </p>

          <div className="hero-actions">

            <Link
              to="/vehicles"
              className="hero-main-button"
            >
              Explore vehicles
              <span>→</span>
            </Link>

            {!token && (
              <Link
                to="/register"
                className="hero-outline-button"
              >
                Create an account
              </Link>
            )}

          </div>

          <div className="hero-trust">

            <div>
              <strong>Easy</strong>
              <span>Vehicle search</span>
            </div>

            <div>
              <strong>Flexible</strong>
              <span>Booking dates</span>
            </div>

            <div>
              <strong>Simple</strong>
              <span>Rental management</span>
            </div>

          </div>

        </div>

        <div className="hero-showcase">

          <div className="showcase-background">
            <div className="showcase-circle"></div>
            <div className="showcase-line"></div>
          </div>

          <div className="showcase-card">

            <div className="showcase-top">
              <span>DRIVEEASE</span>
              <span>01</span>
            </div>

            <div className="showcase-car">
              <div className="car-roof"></div>
              <div className="car-body"></div>
              <div className="car-window"></div>

              <div className="car-wheel left"></div>
              <div className="car-wheel right"></div>
            </div>

            <div className="showcase-bottom">
              <div>
                <span>READY FOR THE ROAD?</span>
                <strong>Choose your ride.</strong>
              </div>

              <Link to="/vehicles">
                View →
              </Link>
            </div>

          </div>

        </div>

      </section>

      {/* INTRO */}
      <section className="home-intro">

        <div className="intro-title">
          <span>HOW IT WORKS</span>

          <h2>
            A simpler way to plan
            <br />
            your next ride.
          </h2>
        </div>

        <p className="intro-description">
          DriveEase brings vehicle discovery, booking and
          rental management together in one straightforward
          experience.
        </p>

      </section>

      {/* STEPS */}
      <section className="home-steps">

        <div className="step-card">

          <span className="step-number">
            01
          </span>

          <h3>Explore</h3>

          <p>
            Browse the available vehicles and find an option
            that suits your journey.
          </p>

          <Link to="/vehicles">
            Browse vehicles →
          </Link>

        </div>

        <div className="step-card">

          <span className="step-number">
            02
          </span>

          <h3>Choose</h3>

          <p>
            Select your preferred vehicle and provide the
            dates you need it.
          </p>

          <span className="step-link">
            Select your dates →
          </span>

        </div>

        <div className="step-card">

          <span className="step-number">
            03
          </span>

          <h3>Book</h3>

          <p>
            Confirm your booking and keep track of your
            rental through your account.
          </p>

          <span className="step-link">
            Manage your rental →
          </span>

        </div>

      </section>

      {/* CTA */}
      <section className="home-cta">

        <div>
          <span>READY TO GO?</span>

          <h2>
            Your next journey
            <br />
            is waiting.
          </h2>
        </div>

        <Link
          to="/vehicles"
          className="cta-button"
        >
          Find a vehicle →
        </Link>

      </section>

      {/* FOOTER */}
      <footer className="home-footer">

        <div className="footer-brand">

          <Link to="/" className="home-brand">
            <span className="brand-mark">D</span>

            <span className="brand-name">
              Drive<span>Ease</span>
            </span>
          </Link>

          <p>
            Vehicle Rental Management System
          </p>

        </div>

        <p>
          © 2026 DriveEase. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Home;