import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] =
    useState(false);
  const [updatingId, setUpdatingId] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  // =========================
  // GET ALL BOOKINGS
  // =========================

  const getBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/bookings/admin/all"
      );

      setBookings(response.data);
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "Failed to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  // =========================
  // GET ONE BOOKING
  // =========================

  const viewBooking = async (bookingId) => {
    try {
      setDetailsLoading(true);
      setError("");

      const response = await api.get(
        `/bookings/admin/${bookingId}`
      );

      setSelectedBooking(response.data);
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "Failed to load booking details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================

  const updateBookingStatus = async (
    bookingId,
    newStatus
  ) => {
    if (!newStatus) {
      return;
    }

    const confirmed = window.confirm(
      `Change this booking status to ${newStatus}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(bookingId);
      setError("");
      setSuccess("");

      await api.patch(
        `/bookings/admin/${bookingId}/status`,
        null,
        {
          params: {
            booking_status: newStatus,
          },
        }
      );

      setSuccess(
        `Booking #${bookingId} updated to ${newStatus}.`
      );

      await getBookings();

      if (selectedBooking?.id === bookingId) {
        const response = await api.get(
          `/bookings/admin/${bookingId}`
        );

        setSelectedBooking(response.data);
      }
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "Failed to update booking status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // HELPERS
  // =========================

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");

    navigate("/login");
  };

  // =========================
  // FILTER
  // =========================

  const filteredBookings = bookings.filter(
    (booking) => {
      const text = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !text ||
        String(booking.id).includes(text) ||
        String(booking.vehicle_id).includes(
          text
        ) ||
        String(booking.user_id || "").includes(
          text
        ) ||
        booking.status
          ?.toLowerCase()
          .includes(text) ||
        booking.vehicle?.name
          ?.toLowerCase()
          .includes(text) ||
        booking.user?.full_name
          ?.toLowerCase()
          .includes(text) ||
        booking.user?.email
          ?.toLowerCase()
          .includes(text);

      const matchesStatus =
        statusFilter === "all" ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  return (
    <div className="admin-page">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <Link
          to="/admin"
          className="admin-brand"
        >
          <span className="admin-brand-icon">
            D
          </span>

          <div>
            <strong>DriveEase</strong>
            <small>Admin Panel</small>
          </div>
        </Link>


        <div className="admin-menu-title">
          MANAGEMENT
        </div>


        <nav className="admin-menu">

          <Link to="/admin">
            <span>▦</span>
            Dashboard
          </Link>

          <Link to="/admin/vehicles">
            <span>🚘</span>
            Vehicles
          </Link>

          <Link to="/admin/customers">
            <span>♙</span>
            Customers
          </Link>

          <Link
            to="/admin/bookings"
            className="admin-menu-active"
          >
            <span>▣</span>
            Bookings
          </Link>

        </nav>


        <div className="admin-sidebar-bottom">

          <Link to="/">
            <span>←</span>
            View Website
          </Link>

          <button onClick={handleLogout}>
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="admin-main">

        {/* TOPBAR */}

        <header className="admin-topbar">

          <div>
            <p>MANAGEMENT</p>
            <h1>Bookings</h1>
          </div>

          <div className="admin-profile">

            <div className="admin-profile-text">
              <strong>
                {localStorage.getItem(
                  "userName"
                ) || "Administrator"}
              </strong>

              <span>Admin</span>
            </div>

            <div className="admin-avatar">
              A
            </div>

          </div>

        </header>


        {/* PAGE HEADING */}

        <section className="admin-bookings-heading">

          <div>
            <span>BOOKING MANAGEMENT</span>

            <h2>Manage Bookings</h2>

            <p>
              Review rental requests and manage
              booking statuses.
            </p>
          </div>

          <div className="admin-bookings-count">
            <span>Total Bookings</span>

            <strong>
              {bookings.length}
            </strong>
          </div>

        </section>


        {/* MESSAGES */}

        {error && (
          <div className="admin-vehicle-error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-vehicle-success">
            {success}
          </div>
        )}


        {/* SELECTED BOOKING */}

        {selectedBooking && (
          <section className="admin-booking-details">

            <div className="admin-booking-details-header">

              <div>
                <span>BOOKING DETAILS</span>

                <h2>
                  Booking #{selectedBooking.id}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
              >
                ✕
              </button>

            </div>


            <div className="admin-booking-detail-grid">

              <div>
                <span>Customer</span>

                <strong>
                  {selectedBooking.user
                    ?.full_name ||
                    selectedBooking.customer
                      ?.full_name ||
                    `Customer #${
                      selectedBooking.user_id ||
                      selectedBooking.customer_id ||
                      "—"
                    }`}
                </strong>
              </div>


              <div>
                <span>Vehicle</span>

                <strong>
                  {selectedBooking.vehicle?.name ||
                    `Vehicle #${selectedBooking.vehicle_id}`}
                </strong>
              </div>


              <div>
                <span>Start Date</span>

                <strong>
                  {formatDate(
                    selectedBooking.start_date
                  )}
                </strong>
              </div>


              <div>
                <span>End Date</span>

                <strong>
                  {formatDate(
                    selectedBooking.end_date
                  )}
                </strong>
              </div>


              <div>
                <span>Total Days</span>

                <strong>
                  {selectedBooking.total_days ??
                    "—"}
                </strong>
              </div>


              <div>
                <span>Total Amount</span>

                <strong>
                  Rs.{" "}
                  {selectedBooking.total_amount ??
                    "—"}
                </strong>
              </div>


              <div>
                <span>Status</span>

                <span
                  className={`booking-status status-${selectedBooking.status}`}
                >
                  {formatStatus(
                    selectedBooking.status
                  )}
                </span>
              </div>


              <div>
                <span>Created</span>

                <strong>
                  {formatDate(
                    selectedBooking.created_at
                  )}
                </strong>
              </div>

            </div>


            <div className="admin-booking-detail-actions">

              <label>
                Change Booking Status
              </label>

              <select
                value={selectedBooking.status}
                disabled={
                  updatingId ===
                  selectedBooking.id
                }
                onChange={(e) =>
                  updateBookingStatus(
                    selectedBooking.id,
                    e.target.value
                  )
                }
              >
                <option value="pending">
                  Pending
                </option>

                <option value="confirmed">
                  Confirmed
                </option>

                <option value="active">
                  Active
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>

            </div>

          </section>
        )}


        {/* FILTER BAR */}

        <section className="admin-booking-list-card">

          <div className="admin-booking-list-top">

            <div>
              <span>RENTAL BOOKINGS</span>

              <h2>All Bookings</h2>

              <p>
                {filteredBookings.length} booking
                {filteredBookings.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>


            <div className="admin-booking-filters">

              <input
                type="text"
                placeholder="Search booking..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >
                <option value="all">
                  All Status
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="confirmed">
                  Confirmed
                </option>

                <option value="active">
                  Active
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>

              <button onClick={getBookings}>
                Refresh
              </button>

            </div>

          </div>


          {/* LOADING */}

          {loading ? (
            <div className="admin-table-loading">

              <div className="vehicle-loader"></div>

              <p>Loading bookings...</p>

            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="admin-table-empty">

              <span>▣</span>

              <h3>No bookings found</h3>

              <p>
                There are no bookings matching
                your current filter.
              </p>

            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-booking-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Rental Period</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>


                <tbody>

                  {filteredBookings.map(
                    (booking) => (
                      <tr key={booking.id}>

                        <td>
                          <strong>
                            #{booking.id}
                          </strong>
                        </td>


                        <td>
                          <div className="admin-booking-customer">

                            <div className="admin-booking-avatar">
                              {(
                                booking.user
                                  ?.full_name ||
                                booking.customer
                                  ?.full_name ||
                                "C"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {booking.user
                                  ?.full_name ||
                                  booking.customer
                                    ?.full_name ||
                                  `Customer #${
                                    booking.user_id ||
                                    booking.customer_id ||
                                    "—"
                                  }`}
                              </strong>

                              <span>
                                {booking.user
                                  ?.email ||
                                  booking.customer
                                    ?.email ||
                                  ""}
                              </span>
                            </div>

                          </div>
                        </td>


                        <td>
                          <div className="admin-booking-vehicle">
                            <strong>
                              {booking.vehicle
                                ?.name ||
                                `Vehicle #${booking.vehicle_id}`}
                            </strong>

                            <span>
                              {booking.vehicle
                                ? `${booking.vehicle.brand} ${booking.vehicle.model}`
                                : ""}
                            </span>
                          </div>
                        </td>


                        <td>
                          <div className="admin-rental-dates">

                            <strong>
                              {formatDate(
                                booking.start_date
                              )}
                            </strong>

                            <span>to</span>

                            <strong>
                              {formatDate(
                                booking.end_date
                              )}
                            </strong>

                          </div>
                        </td>


                        <td>
                          <strong>
                            Rs.{" "}
                            {booking.total_amount ??
                              "—"}
                          </strong>
                        </td>


                        <td>
                          <span
                            className={`booking-status status-${booking.status}`}
                          >
                            {formatStatus(
                              booking.status
                            )}
                          </span>
                        </td>


                        <td>
                          <div className="admin-booking-actions">

                            <button
                              className="admin-booking-view"
                              onClick={() =>
                                viewBooking(
                                  booking.id
                                )
                              }
                              disabled={
                                detailsLoading
                              }
                            >
                              View
                            </button>


                            <select
                              value={
                                booking.status
                              }
                              disabled={
                                updatingId ===
                                booking.id
                              }
                              onChange={(e) =>
                                updateBookingStatus(
                                  booking.id,
                                  e.target.value
                                )
                              }
                            >
                              <option value="pending">
                                Pending
                              </option>

                              <option value="confirmed">
                                Confirmed
                              </option>

                              <option value="active">
                                Active
                              </option>

                              <option value="completed">
                                Completed
                              </option>

                              <option value="cancelled">
                                Cancelled
                              </option>
                            </select>

                          </div>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default AdminBookings;