import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [success, setSuccess] = useState("");

  const [bookingData, setBookingData] = useState({
    start_date: "",
    end_date: "",
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const getVehicle = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/vehicles/${id}`);

      setVehicle(response.data);
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "We could not load this vehicle right now."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVehicle();
  }, [id]);

  const handleDateChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    setBookingError("");
    setSuccess("");

    if (!token) {
      navigate("/login");
      return;
    }

    if (role === "admin") {
      setBookingError(
        "Admin accounts are not allowed to create customer bookings."
      );
      return;
    }

    if (!bookingData.start_date || !bookingData.end_date) {
      setBookingError(
        "Please choose both your start and end dates."
      );
      return;
    }

    if (bookingData.end_date < bookingData.start_date) {
      setBookingError(
        "Your end date must be on or after the start date."
      );
      return;
    }

    try {
      setBookingLoading(true);

      await api.post("/bookings", {
        vehicle_id: Number(id),
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
      });

      setSuccess(
        "Your booking has been created successfully and is now pending confirmation."
      );

      setBookingData({
        start_date: "",
        end_date: "",
      });
    } catch (error) {
      console.log(error);

      setBookingError(
        error.response?.data?.detail ||
          "We could not create your booking. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="vehicle-details-state">
        <div className="details-loader"></div>

        <span>PLEASE WAIT</span>

        <h2>Loading vehicle details</h2>

        <p>
          We're preparing the vehicle information for you.
        </p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="vehicle-details-state">
        <div className="details-state-mark">!</div>

        <span>VEHICLE NOT FOUND</span>

        <h2>This vehicle is unavailable</h2>

        <p>
          {error ||
            "The vehicle you are looking for could not be found."}
        </p>

        <Link
          to="/vehicles"
          className="details-back-button"
        >
          ← Return to vehicles
        </Link>
      </div>
    );
  }

  const isAvailable =
    vehicle.is_available &&
    vehicle.status === "available";

  return (
    <div className="vehicle-details-page">

      {/* NAVBAR */}

      <nav className="details-navbar">

        <Link to="/" className="details-brand">
          <span className="details-brand-mark">D</span>

          <span className="details-brand-name">
            Drive<span>Ease</span>
          </span>
        </Link>

        <div className="details-nav-links">
          <Link to="/">Home</Link>

          <Link
            to="/vehicles"
            className="active"
          >
            Vehicles
          </Link>

          {token && role === "customer" && (
            <Link to="/my-bookings">
              My Bookings
            </Link>
          )}
        </div>

        <div className="details-nav-action">

          {token ? (
            <Link
              to={
                role === "admin"
                  ? "/admin"
                  : "/profile"
              }
              className="details-account-button"
            >
              {role === "admin"
                ? "Dashboard"
                : "My Account"}
            </Link>
          ) : (
            <Link
              to="/login"
              className="details-account-button"
            >
              Sign in
            </Link>
          )}

        </div>

      </nav>


      {/* PAGE */}

      <main className="details-main">

        {/* BREADCRUMB */}

        <div className="details-breadcrumb">

          <Link to="/">
            Home
          </Link>

          <span>/</span>

          <Link to="/vehicles">
            Vehicles
          </Link>

          <span>/</span>

          <strong>
            {vehicle.name}
          </strong>

        </div>


        {/* VEHICLE HERO */}

        <section className="vehicle-detail-hero">

          {/* IMAGE SIDE */}

          <div className="detail-visual">

            <div className="detail-image-frame">

              {vehicle.image ? (
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                />
              ) : (
                <div className="detail-image-placeholder">

                  <span>DRIVEEASE</span>

                  <div className="detail-placeholder-car">
                    <div className="detail-car-roof"></div>
                    <div className="detail-car-body"></div>

                    <div className="detail-car-wheel wheel-one"></div>
                    <div className="detail-car-wheel wheel-two"></div>
                  </div>

                  <p>
                    {vehicle.name}
                  </p>

                </div>
              )}

              <div
                className={`detail-availability ${
                  isAvailable
                    ? "available"
                    : "unavailable"
                }`}
              >
                <span></span>

                {isAvailable
                  ? "Available now"
                  : vehicle.status || "Unavailable"}
              </div>

            </div>

            <div className="visual-caption">
              <span>VEHICLE ID</span>

              <strong>
                #{String(vehicle.id).padStart(4, "0")}
              </strong>
            </div>

          </div>


          {/* INFORMATION SIDE */}

          <div className="detail-information">

            <span className="detail-eyebrow">
              {vehicle.category || "VEHICLE"}
            </span>

            <h1>
              {vehicle.name}
            </h1>

            <p className="detail-subtitle">
              {vehicle.brand} {vehicle.model}
            </p>

            <p className="detail-description">
              A practical choice for your next journey.
              Check the vehicle specifications, select your
              dates and send your booking request when you're
              ready.
            </p>

            <div className="detail-price">

              <span>DAILY RENTAL</span>

              <div>
                <strong>
                  Rs. {vehicle.price_per_day}
                </strong>

                <small>
                  / day
                </small>
              </div>

            </div>

            <div className="quick-specs">

              <div>
                <span>YEAR</span>

                <strong>
                  {vehicle.manufacturing_year}
                </strong>
              </div>

              <div>
                <span>SEATS</span>

                <strong>
                  {vehicle.seats}
                </strong>
              </div>

              <div>
                <span>FUEL</span>

                <strong>
                  {vehicle.fuel_type}
                </strong>
              </div>

              <div>
                <span>GEAR</span>

                <strong>
                  {vehicle.transmission}
                </strong>
              </div>

            </div>

          </div>

        </section>


        {/* LOWER CONTENT */}

        <section className="details-lower">

          {/* SPECIFICATIONS */}

          <div className="vehicle-specifications">

            <div className="section-intro">

              <span>AT A GLANCE</span>

              <h2>
                Everything you need
                <br />
                to know.
              </h2>

              <p>
                Review the main vehicle information before
                making your booking.
              </p>

            </div>

            <div className="full-spec-grid">

              <div className="full-spec-item">
                <span>Brand</span>
                <strong>{vehicle.brand}</strong>
              </div>

              <div className="full-spec-item">
                <span>Model</span>
                <strong>{vehicle.model}</strong>
              </div>

              <div className="full-spec-item">
                <span>Manufacturing Year</span>
                <strong>
                  {vehicle.manufacturing_year}
                </strong>
              </div>

              <div className="full-spec-item">
                <span>Category</span>
                <strong>{vehicle.category}</strong>
              </div>

              <div className="full-spec-item">
                <span>Transmission</span>
                <strong>
                  {vehicle.transmission}
                </strong>
              </div>

              <div className="full-spec-item">
                <span>Fuel Type</span>
                <strong>
                  {vehicle.fuel_type}
                </strong>
              </div>

              <div className="full-spec-item">
                <span>Passenger Capacity</span>
                <strong>
                  {vehicle.seats} seats
                </strong>
              </div>

              <div className="full-spec-item">
                <span>Exterior Colour</span>
                <strong>
                  {vehicle.color || "Not specified"}
                </strong>
              </div>

              <div className="full-spec-item">
                <span>Mileage</span>
                <strong>
                  {vehicle.mileage ?? "Not specified"}
                </strong>
              </div>

              <div className="full-spec-item">
                <span>Registration</span>
                <strong>
                  {vehicle.registration_number}
                </strong>
              </div>

              <div className="full-spec-item">
                <span>Availability</span>
                <strong>
                  {isAvailable
                    ? "Available"
                    : "Not available"}
                </strong>
              </div>

              <div className="full-spec-item">
                <span>Current Status</span>
                <strong>
                  {vehicle.status}
                </strong>
              </div>

            </div>

          </div>


          {/* BOOKING PANEL */}

          <aside className="detail-booking-card">

            <div className="booking-card-heading">

              <span>READY TO BOOK?</span>

              <h2>
                Plan your
                <br />
                rental.
              </h2>

              <p>
                Choose your dates below and send your
                booking request.
              </p>

            </div>


            <div className="booking-rate">

              <span>Current daily rate</span>

              <strong>
                Rs. {vehicle.price_per_day}
              </strong>

            </div>


            {!isAvailable && (
              <div className="booking-warning">
                <strong>
                  Vehicle unavailable
                </strong>

                <p>
                  This vehicle cannot currently be booked.
                </p>
              </div>
            )}


            {bookingError && (
              <div className="booking-message booking-message-error">
                <strong>
                  Booking not completed
                </strong>

                <p>
                  {bookingError}
                </p>
              </div>
            )}


            {success && (
              <div className="booking-message booking-message-success">
                <strong>
                  Booking request sent
                </strong>

                <p>
                  {success}
                </p>
              </div>
            )}


            <form
              className="detail-booking-form"
              onSubmit={handleBooking}
            >

              <div className="detail-date-field">

                <label htmlFor="start_date">
                  Pick-up date
                </label>

                <input
                  id="start_date"
                  type="date"
                  name="start_date"
                  min={today}
                  value={bookingData.start_date}
                  onChange={handleDateChange}
                  required
                />

              </div>


              <div className="detail-date-field">

                <label htmlFor="end_date">
                  Return date
                </label>

                <input
                  id="end_date"
                  type="date"
                  name="end_date"
                  min={
                    bookingData.start_date ||
                    today
                  }
                  value={bookingData.end_date}
                  onChange={handleDateChange}
                  required
                />

              </div>


              {!token ? (

                <button
                  type="button"
                  className="detail-book-button"
                  onClick={() => navigate("/login")}
                >
                  Sign in to continue
                  <span>→</span>
                </button>

              ) : role === "admin" ? (

                <button
                  type="button"
                  className="detail-book-button booking-admin-disabled"
                  disabled
                >
                  Customer booking only
                </button>

              ) : (

                <button
                  type="submit"
                  className="detail-book-button"
                  disabled={
                    bookingLoading ||
                    !isAvailable
                  }
                >
                  {bookingLoading
                    ? "Sending request..."
                    : isAvailable
                    ? "Request this vehicle"
                    : "Currently unavailable"}

                  {!bookingLoading &&
                    isAvailable && (
                      <span>→</span>
                    )}
                </button>

              )}

            </form>


            <div className="booking-security-note">

              <span>✓</span>

              <p>
                Your rental dates are sent securely to the
                booking system. The final rental calculation
                is handled by the backend.
              </p>

            </div>


            {success && (
              <Link
                to="/my-bookings"
                className="booking-view-link"
              >
                Go to My Bookings
                <span>→</span>
              </Link>
            )}

          </aside>

        </section>

      </main>

    </div>
  );
}

export default VehicleDetails;