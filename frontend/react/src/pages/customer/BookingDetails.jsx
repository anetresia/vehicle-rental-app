import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getBooking = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/bookings/my/${id}`
      );

      setBooking(response.data);
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "Failed to load booking details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBooking();
  }, [id]);

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelLoading(true);
      setError("");
      setMessage("");

      await api.patch(
        `/bookings/my/${id}/cancel`
      );

      setMessage(
        "Your booking has been cancelled successfully."
      );

      await getBooking();
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "Failed to cancel booking."
      );
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  if (loading) {
    return (
      <div className="details-state-page">
        <div className="vehicle-loader"></div>

        <p>Loading booking details...</p>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="details-state-page">
        <h2>Booking not found</h2>

        <p>{error}</p>

        <button
          className="booking-back-button"
          onClick={() =>
            navigate("/my-bookings")
          }
        >
          Back to My Bookings
        </button>
      </div>
    );
  }

  const canCancel =
    booking.status === "pending" ||
    booking.status === "confirmed";

  return (
    <div className="booking-details-page">

      {/* NAVBAR */}

      <nav className="vehicles-navbar">

        <Link
          to="/"
          className="vehicles-logo"
        >
          <span className="home-logo-icon">
            D
          </span>

          <span>DriveEase</span>
        </Link>

        <div className="vehicles-nav-links">
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
          className="vehicles-account-btn"
        >
          Find Vehicle
        </Link>

      </nav>


      {/* PAGE */}

      <main className="booking-details-container">

        <div className="booking-details-breadcrumb">

          <Link to="/my-bookings">
            ← My Bookings
          </Link>

        </div>


        {/* HEADER */}

        <div className="booking-details-header">

          <div>

            <span className="booking-details-small">
              BOOKING DETAILS
            </span>

            <h1>
              Booking #{booking.id}
            </h1>

            <p>
              Review your rental information
              and booking status.
            </p>

          </div>


          <span
            className={`booking-status booking-details-status status-${booking.status}`}
          >
            {formatStatus(booking.status)}
          </span>

        </div>


        {error && (
          <div className="booking-error">
            {error}
          </div>
        )}


        {message && (
          <div className="booking-success">
            {message}
          </div>
        )}


        <div className="booking-details-layout">

          {/* LEFT */}

          <div className="booking-details-main">

            {/* VEHICLE */}

            <section className="booking-details-card">

              <div className="booking-details-card-title">
                <span>VEHICLE</span>

                <h2>Your rental vehicle</h2>
              </div>


              <div className="booking-vehicle-box">

                <div className="booking-vehicle-image">

                  {booking.vehicle?.image ? (
                    <img
                      src={booking.vehicle.image}
                      alt={
                        booking.vehicle.name
                      }
                    />
                  ) : (
                    <div className="booking-car-placeholder">
                      🚘
                    </div>
                  )}

                </div>


                <div className="booking-vehicle-info">

                  <span>
                    {booking.vehicle?.category ||
                      "Vehicle"}
                  </span>

                  <h3>
                    {booking.vehicle?.name ||
                      `Vehicle #${booking.vehicle_id}`}
                  </h3>

                  {booking.vehicle && (
                    <>
                      <p>
                        {booking.vehicle.brand}{" "}
                        {booking.vehicle.model}
                      </p>

                      <div className="booking-vehicle-specs">

                        <span>
                          ⚙{" "}
                          {
                            booking.vehicle
                              .transmission
                          }
                        </span>

                        <span>
                          ⛽{" "}
                          {
                            booking.vehicle
                              .fuel_type
                          }
                        </span>

                        <span>
                          👤{" "}
                          {booking.vehicle.seats}{" "}
                          Seats
                        </span>

                      </div>
                    </>
                  )}

                </div>

              </div>

            </section>


            {/* RENTAL DETAILS */}

            <section className="booking-details-card">

              <div className="booking-details-card-title">
                <span>RENTAL PERIOD</span>

                <h2>Booking information</h2>
              </div>


              <div className="booking-information-grid">

                <div>
                  <span>Start Date</span>

                  <strong>
                    {formatDate(
                      booking.start_date
                    )}
                  </strong>
                </div>


                <div>
                  <span>End Date</span>

                  <strong>
                    {formatDate(
                      booking.end_date
                    )}
                  </strong>
                </div>


                <div>
                  <span>Total Days</span>

                  <strong>
                    {booking.total_days ?? "—"}
                  </strong>
                </div>


                <div>
                  <span>Booking Status</span>

                  <strong>
                    {formatStatus(
                      booking.status
                    )}
                  </strong>
                </div>


                <div>
                  <span>Booking ID</span>

                  <strong>
                    #{booking.id}
                  </strong>
                </div>


                <div>
                  <span>Created On</span>

                  <strong>
                    {formatDate(
                      booking.created_at
                    )}
                  </strong>
                </div>

              </div>

            </section>

          </div>


          {/* RIGHT */}

          <aside className="booking-summary-card">

            <span className="summary-small-title">
              PAYMENT SUMMARY
            </span>

            <h2>Rental summary</h2>


            <div className="summary-lines">

              <div>
                <span>Price per day</span>

                <strong>
                  Rs.{" "}
                  {booking.vehicle
                    ?.price_per_day ?? "—"}
                </strong>
              </div>


              <div>
                <span>Total rental days</span>

                <strong>
                  {booking.total_days ?? "—"}
                </strong>
              </div>

            </div>


            <div className="summary-total">

              <span>Total Amount</span>

              <strong>
                Rs.{" "}
                {booking.total_amount ?? "—"}
              </strong>

            </div>


            <div className="summary-status">

              <span>Current Status</span>

              <div
                className={`booking-status status-${booking.status}`}
              >
                {formatStatus(
                  booking.status
                )}
              </div>

            </div>


            {canCancel ? (
              <button
                className="cancel-booking-button"
                onClick={handleCancel}
                disabled={cancelLoading}
              >
                {cancelLoading
                  ? "Cancelling..."
                  : "Cancel Booking"}
              </button>
            ) : (
              <div className="cancel-not-available">
                This booking can no longer be
                cancelled.
              </div>
            )}


            <Link
              to="/my-bookings"
              className="back-bookings-link"
            >
              ← Back to My Bookings
            </Link>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default BookingDetails;

