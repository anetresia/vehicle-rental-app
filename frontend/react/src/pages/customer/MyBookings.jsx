import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/my");

      setBookings(response.data);
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "We could not load your bookings right now."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  return (
    <div className="my-bookings-page">

      {/* NAVBAR */}

      <nav className="bookings-navbar">

        <Link to="/" className="bookings-brand">

          <span className="bookings-brand-mark">
            D
          </span>

          <span className="bookings-brand-name">
            Drive<span>Ease</span>
          </span>

        </Link>


        <div className="bookings-nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/vehicles">
            Vehicles
          </Link>

          <Link
            to="/my-bookings"
            className="active"
          >
            My Bookings
          </Link>

          <Link to="/profile">
            Profile
          </Link>

        </div>


        <Link
          to="/vehicles"
          className="bookings-nav-button"
        >
          Find a vehicle
          <span>→</span>
        </Link>

      </nav>


      {/* PAGE HEADER */}

      <header className="bookings-page-header">

        <div className="bookings-header-inner">

          <div className="bookings-header-copy">

            <span className="bookings-eyebrow">
              YOUR RENTAL SPACE
            </span>

            <h1>
              Keep track of
              <br />
              your <span>journeys.</span>
            </h1>

            <p>
              Your bookings, rental dates and payment
              details are all kept together here.
            </p>

          </div>


          <div className="bookings-header-side">

            <span>
              {loading
                ? "UPDATING"
                : "YOUR BOOKINGS"}
            </span>

            <strong>
              {loading
                ? "—"
                : String(bookings.length).padStart(
                    2,
                    "0"
                  )}
            </strong>

            <p>
              {bookings.length === 1
                ? "Rental in your account"
                : "Rentals in your account"}
            </p>

          </div>

        </div>

      </header>


      {/* MAIN CONTENT */}

      <main className="bookings-main">

        {/* TOP BAR */}

        <div className="bookings-content-heading">

          <div>

            <span>
              BOOKING HISTORY
            </span>

            <h2>
              Your reservations
            </h2>

            <p>
              Review your current and previous
              vehicle bookings.
            </p>

          </div>


          <Link
            to="/vehicles"
            className="bookings-new-button"
          >
            <span>+</span>
            New booking
          </Link>

        </div>


        {/* ERROR */}

        {error && (
          <div className="bookings-error">

            <div className="bookings-error-icon">
              !
            </div>

            <div>
              <strong>
                We couldn't load your bookings
              </strong>

              <p>
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={getBookings}
            >
              Try again
            </button>

          </div>
        )}


        {/* LOADING */}

        {loading && (
          <div className="bookings-loading-state">

            <div className="bookings-spinner"></div>

            <span>
              PLEASE WAIT
            </span>

            <h3>
              Loading your rental history
            </h3>

            <p>
              We're getting your latest booking
              information.
            </p>

          </div>
        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          bookings.length === 0 && (

            <div className="bookings-empty-state">

              <div className="bookings-empty-number">
                00
              </div>

              <span>
                NO BOOKINGS YET
              </span>

              <h3>
                Your next journey starts
                with a vehicle.
              </h3>

              <p>
                You haven't made a booking yet.
                Explore the available vehicles and
                choose the one that fits your plans.
              </p>

              <Link
                to="/vehicles"
                className="bookings-empty-button"
              >
                Explore vehicles
                <span>→</span>
              </Link>

            </div>
          )}


        {/* BOOKING LIST */}

        {!loading &&
          !error &&
          bookings.length > 0 && (

            <div className="bookings-list">

              {bookings.map((booking, index) => {

                const status =
                  booking.status || "unknown";

                return (
                  <article
                    className="booking-record"
                    key={booking.id}
                  >

                    {/* BOOKING NUMBER */}

                    <div className="booking-record-number">

                      <span>
                        #{String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>

                      <small>
                        BOOKING
                      </small>

                    </div>


                    {/* MAIN BOOKING */}

                    <div className="booking-record-content">

                      {/* TOP */}

                      <div className="booking-record-top">

                        <div className="booking-vehicle-info">

                          <span>
                            {booking.vehicle?.category ||
                              "VEHICLE RENTAL"}
                          </span>

                          <h3>
                            {booking.vehicle?.name ||
                              `Vehicle #${booking.vehicle_id}`}
                          </h3>

                          {booking.vehicle && (
                            <p>
                              {booking.vehicle.brand}{" "}
                              {booking.vehicle.model}
                            </p>
                          )}

                        </div>


                        <div
                          className={`booking-status-badge status-${status}`}
                        >
                          <span></span>

                          {formatStatus(status)}
                        </div>

                      </div>


                      {/* BOOKING DETAILS */}

                      <div className="booking-record-details">

                        <div className="booking-detail-cell">

                          <span>
                            PICK-UP
                          </span>

                          <strong>
                            {formatDate(
                              booking.start_date
                            )}
                          </strong>

                        </div>


                        <div className="booking-detail-cell">

                          <span>
                            RETURN
                          </span>

                          <strong>
                            {formatDate(
                              booking.end_date
                            )}
                          </strong>

                        </div>


                        <div className="booking-detail-cell">

                          <span>
                            DURATION
                          </span>

                          <strong>
                            {booking.total_days ??
                              "—"}{" "}
                            {booking.total_days === 1
                              ? "day"
                              : "days"}
                          </strong>

                        </div>


                        <div className="booking-detail-cell booking-amount-cell">

                          <span>
                            TOTAL AMOUNT
                          </span>

                          <strong>
                            Rs.{" "}
                            {booking.total_amount ??
                              "—"}
                          </strong>

                        </div>

                      </div>


                      {/* FOOTER */}

                      <div className="booking-record-footer">

                        <span>
                          Booking #{booking.id}
                          {" • "}
                          Created{" "}
                          {formatDate(
                            booking.created_at
                          )}
                        </span>


                        <Link
                          to={`/my-bookings/${booking.id}`}
                          className="booking-details-button"
                        >
                          View booking
                          <span>→</span>
                        </Link>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}


        {/* BOTTOM CTA */}

        {!loading &&
          !error &&
          bookings.length > 0 && (

            <section className="bookings-bottom-cta">

              <div>

                <span>
                  LOOKING FOR YOUR NEXT RIDE?
                </span>

                <h2>
                  Find another vehicle.
                </h2>

              </div>

              <Link
                to="/vehicles"
                className="bookings-bottom-button"
              >
                Browse vehicles
                <span>→</span>
              </Link>

            </section>
          )}

      </main>


      {/* FOOTER */}

      <footer className="bookings-footer">

        <div className="bookings-footer-brand">

          <Link
            to="/"
            className="bookings-brand"
          >

            <span className="bookings-brand-mark">
              D
            </span>

            <span className="bookings-brand-name">
              Drive<span>Ease</span>
            </span>

          </Link>

          <p>
            Simple vehicle rental,
            made for your journey.
          </p>

        </div>


        <p>
          © 2026 DriveEase
        </p>

      </footer>

    </div>
  );
}

export default MyBookings;