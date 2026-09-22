import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard/stats");

      setStats(response.data);
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "We couldn't load the dashboard information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");

    navigate("/login");
  };

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString();
  };

  const adminName =
    localStorage.getItem("userName") || "Administrator";

  return (
    <div className="admin-dashboard-page">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <Link to="/admin" className="admin-brand">

          <span className="admin-brand-mark">
            D
          </span>

          <div>
            <strong>
              Drive<span>Ease</span>
            </strong>

            <small>Management Console</small>
          </div>

        </Link>

        <div className="admin-sidebar-label">
          MAIN MENU
        </div>

        <nav className="admin-sidebar-nav">

          <Link
            to="/admin"
            className="admin-sidebar-link active"
          >
            <span className="admin-nav-number">
              01
            </span>

            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/vehicles"
            className="admin-sidebar-link"
          >
            <span className="admin-nav-number">
              02
            </span>

            <span>Vehicles</span>
          </Link>

          <Link
            to="/admin/customers"
            className="admin-sidebar-link"
          >
            <span className="admin-nav-number">
              03
            </span>

            <span>Customers</span>
          </Link>

          <Link
            to="/admin/bookings"
            className="admin-sidebar-link"
          >
            <span className="admin-nav-number">
              04
            </span>

            <span>Bookings</span>
          </Link>

        </nav>

        <div className="admin-sidebar-footer">

          <Link
            to="/"
            className="admin-sidebar-footer-link"
          >
            <span>↗</span>
            View website
          </Link>

          <button
            onClick={handleLogout}
            className="admin-sidebar-logout"
          >
            <span>→</span>
            Sign out
          </button>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="admin-dashboard-main">

        {/* TOP HEADER */}

        <header className="admin-dashboard-header">

          <div className="admin-header-title">

            <span>DRIVEEASE / ADMIN</span>

            <h1>Dashboard</h1>

          </div>

          <div className="admin-header-account">

            <div className="admin-account-details">

              <strong>
                {adminName}
              </strong>

              <span>
                System administrator
              </span>

            </div>

            <div className="admin-account-avatar">
              {adminName.charAt(0).toUpperCase()}
            </div>

          </div>

        </header>


        {/* ERROR */}

        {error && (

          <div className="admin-dashboard-error">

            <div>
              <strong>
                Dashboard unavailable
              </strong>

              <p>
                {error}
              </p>
            </div>

            <button onClick={getStats}>
              Reload
            </button>

          </div>

        )}


        {/* LOADING */}

        {loading && (

          <div className="admin-dashboard-loading">

            <div className="admin-dashboard-loader"></div>

            <span>PLEASE WAIT</span>

            <h2>
              Preparing your dashboard
            </h2>

            <p>
              We're collecting the latest rental
              system information.
            </p>

          </div>

        )}


        {/* DASHBOARD CONTENT */}

        {!loading && stats && (

          <>

            {/* WELCOME */}

            <section className="admin-dashboard-welcome">

              <div>

                <span className="admin-section-label">
                  SYSTEM OVERVIEW
                </span>

                <h2>
                  Good to see you, {adminName}.
                </h2>

                <p>
                  Keep track of your fleet, customers
                  and rental activity from one place.
                </p>

              </div>

              <Link
                to="/admin/vehicles"
                className="admin-primary-action"
              >
                Manage fleet
                <span>→</span>
              </Link>

            </section>


            {/* STAT CARDS */}

            <section className="admin-stat-grid">

              <article className="admin-stat-card">

                <div className="admin-stat-top">

                  <span className="admin-stat-index">
                    01
                  </span>

                  <span className="admin-stat-symbol">
                    FLEET
                  </span>

                </div>

                <div className="admin-stat-content">

                  <span>Total vehicles</span>

                  <strong>
                    {stats.total_vehicles}
                  </strong>

                  <p>
                    Vehicles registered in the fleet
                  </p>

                </div>

              </article>


              <article className="admin-stat-card admin-stat-highlight">

                <div className="admin-stat-top">

                  <span className="admin-stat-index">
                    02
                  </span>

                  <span className="admin-stat-symbol">
                    READY
                  </span>

                </div>

                <div className="admin-stat-content">

                  <span>Available now</span>

                  <strong>
                    {stats.available_vehicles}
                  </strong>

                  <p>
                    Vehicles currently ready to rent
                  </p>

                </div>

              </article>


              <article className="admin-stat-card">

                <div className="admin-stat-top">

                  <span className="admin-stat-index">
                    03
                  </span>

                  <span className="admin-stat-symbol">
                    USERS
                  </span>

                </div>

                <div className="admin-stat-content">

                  <span>Customers</span>

                  <strong>
                    {stats.total_customers}
                  </strong>

                  <p>
                    Registered customer accounts
                  </p>

                </div>

              </article>


              <article className="admin-stat-card">

                <div className="admin-stat-top">

                  <span className="admin-stat-index">
                    04
                  </span>

                  <span className="admin-stat-symbol">
                    RENTALS
                  </span>

                </div>

                <div className="admin-stat-content">

                  <span>Total bookings</span>

                  <strong>
                    {stats.total_bookings}
                  </strong>

                  <p>
                    Rental reservations recorded
                  </p>

                </div>

              </article>

            </section>


            {/* ANALYTICS ROW */}

            <section className="admin-analysis-grid">

              {/* BOOKING STATUS */}

              <article className="admin-booking-panel">

                <div className="admin-panel-header">

                  <div>

                    <span className="admin-section-label">
                      RENTAL ACTIVITY
                    </span>

                    <h2>
                      Booking status
                    </h2>

                  </div>

                  <Link to="/admin/bookings">
                    All bookings →
                  </Link>

                </div>


                <div className="admin-booking-list">

                  <div className="admin-booking-item">

                    <div className="admin-booking-name">

                      <span className="status-dot pending"></span>

                      <div>
                        <strong>Pending</strong>
                        <small>
                          Waiting for confirmation
                        </small>
                      </div>

                    </div>

                    <strong className="admin-booking-count">
                      {stats.pending_bookings}
                    </strong>

                  </div>


                  <div className="admin-booking-item">

                    <div className="admin-booking-name">

                      <span className="status-dot confirmed"></span>

                      <div>
                        <strong>Confirmed</strong>
                        <small>
                          Approved reservations
                        </small>
                      </div>

                    </div>

                    <strong className="admin-booking-count">
                      {stats.confirmed_bookings}
                    </strong>

                  </div>


                  <div className="admin-booking-item">

                    <div className="admin-booking-name">

                      <span className="status-dot active"></span>

                      <div>
                        <strong>Active</strong>
                        <small>
                          Vehicles currently rented
                        </small>
                      </div>

                    </div>

                    <strong className="admin-booking-count">
                      {stats.active_bookings}
                    </strong>

                  </div>


                  <div className="admin-booking-item">

                    <div className="admin-booking-name">

                      <span className="status-dot completed"></span>

                      <div>
                        <strong>Completed</strong>
                        <small>
                          Finished rental journeys
                        </small>
                      </div>

                    </div>

                    <strong className="admin-booking-count">
                      {stats.completed_bookings}
                    </strong>

                  </div>


                  <div className="admin-booking-item">

                    <div className="admin-booking-name">

                      <span className="status-dot cancelled"></span>

                      <div>
                        <strong>Cancelled</strong>
                        <small>
                          Cancelled reservations
                        </small>
                      </div>

                    </div>

                    <strong className="admin-booking-count">
                      {stats.cancelled_bookings}
                    </strong>

                  </div>

                </div>

              </article>


              {/* REVENUE */}

              <article className="admin-revenue-panel">

                <div className="admin-revenue-decoration">
                  REVENUE
                </div>

                <span className="admin-section-label">
                  COMPLETED RENTALS
                </span>

                <h2>
                  Rs. {formatMoney(stats.total_revenue)}
                </h2>

                <p>
                  Total revenue recorded from
                  completed bookings.
                </p>

                <div className="admin-revenue-divider"></div>

                <div className="admin-revenue-bottom">

                  <div>

                    <span>
                      COMPLETED BOOKINGS
                    </span>

                    <strong>
                      {stats.completed_bookings}
                    </strong>

                  </div>

                  <span className="admin-revenue-arrow">
                    ↗
                  </span>

                </div>

              </article>

            </section>


            {/* QUICK MANAGEMENT */}

            <section className="admin-management-section">

              <div className="admin-management-heading">

                <div>

                  <span className="admin-section-label">
                    MANAGEMENT TOOLS
                  </span>

                  <h2>
                    Keep things moving.
                  </h2>

                </div>

                <p>
                  Access the areas you manage most often.
                </p>

              </div>


              <div className="admin-management-grid">

                <Link
                  to="/admin/vehicles"
                  className="admin-management-card"
                >

                  <div className="admin-management-number">
                    01
                  </div>

                  <div className="admin-management-content">

                    <span>FLEET</span>

                    <strong>
                      Vehicles
                    </strong>

                    <p>
                      Add new vehicles, update details
                      and manage availability.
                    </p>

                  </div>

                  <span className="admin-management-arrow">
                    →
                  </span>

                </Link>


                <Link
                  to="/admin/customers"
                  className="admin-management-card"
                >

                  <div className="admin-management-number">
                    02
                  </div>

                  <div className="admin-management-content">

                    <span>PEOPLE</span>

                    <strong>
                      Customers
                    </strong>

                    <p>
                      Review customer accounts and
                      manage account access.
                    </p>

                  </div>

                  <span className="admin-management-arrow">
                    →
                  </span>

                </Link>


                <Link
                  to="/admin/bookings"
                  className="admin-management-card"
                >

                  <div className="admin-management-number">
                    03
                  </div>

                  <div className="admin-management-content">

                    <span>RESERVATIONS</span>

                    <strong>
                      Bookings
                    </strong>

                    <p>
                      Review reservations and update
                      their rental status.
                    </p>

                  </div>

                  <span className="admin-management-arrow">
                    →
                  </span>

                </Link>

              </div>

            </section>

          </>

        )}

      </main>

    </div>
  );
}

export default Dashboard;