import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminCustomers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  // =========================
  // GET ALL CUSTOMERS
  // =========================

  const getCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/users/customers"
      );

      setCustomers(response.data);
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "Failed to load customers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  // =========================
  // GET ONE CUSTOMER
  // =========================

  const viewCustomer = async (customerId) => {
    try {
      setDetailsLoading(true);
      setError("");

      const response = await api.get(
        `/users/customers/${customerId}`
      );

      setSelectedCustomer(response.data);
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "Failed to load customer details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // =========================
  // DEACTIVATE CUSTOMER
  // =========================

  const deactivateCustomer = async (customer) => {
    const confirmed = window.confirm(
      `Deactivate ${customer.full_name}'s account?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.patch(
        `/users/customers/${customer.id}/deactivate`
      );

      setSuccess(
        "Customer account deactivated successfully."
      );

      if (
        selectedCustomer?.id === customer.id
      ) {
        setSelectedCustomer(null);
      }

      await getCustomers();
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "Failed to deactivate customer."
      );
    }
  };

  // =========================
  // ACTIVATE CUSTOMER
  // =========================

  const activateCustomer = async (customer) => {
    const confirmed = window.confirm(
      `Activate ${customer.full_name}'s account?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.patch(
        `/users/customers/${customer.id}/activate`
      );

      setSuccess(
        "Customer account activated successfully."
      );

      if (
        selectedCustomer?.id === customer.id
      ) {
        setSelectedCustomer(null);
      }

      await getCustomers();
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "Failed to activate customer."
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");

    navigate("/login");
  };

  // =========================
  // SEARCH
  // =========================

  const filteredCustomers = customers.filter(
    (customer) => {
      const searchText =
        search.toLowerCase().trim();

      if (!searchText) {
        return true;
      }

      return (
        customer.full_name
          ?.toLowerCase()
          .includes(searchText) ||
        customer.email
          ?.toLowerCase()
          .includes(searchText) ||
        customer.phone
          ?.toLowerCase()
          .includes(searchText)
      );
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

          <Link
            to="/admin/customers"
            className="admin-menu-active"
          >
            <span>♙</span>
            Customers
          </Link>

          <Link to="/admin/bookings">
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
            <h1>Customers</h1>
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

        <section className="admin-customer-heading">
          <div>
            <span>CUSTOMER MANAGEMENT</span>

            <h2>Manage Customers</h2>

            <p>
              View registered customers and
              manage their account status.
            </p>
          </div>

          <div className="customer-count-box">
            <span>Total Customers</span>

            <strong>
              {customers.length}
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


        {/* CUSTOMER DETAILS */}

        {selectedCustomer && (
          <section className="customer-details-card">

            <div className="customer-details-header">
              <div>
                <span>CUSTOMER DETAILS</span>
                <h2>Account Information</h2>
              </div>

              <button
                onClick={() =>
                  setSelectedCustomer(null)
                }
              >
                ✕
              </button>
            </div>


            <div className="customer-details-content">

              <div className="customer-large-avatar">
                {selectedCustomer.full_name
                  ?.charAt(0)
                  .toUpperCase() || "C"}
              </div>


              <div className="customer-details-info">

                <div>
                  <span>Full Name</span>

                  <strong>
                    {
                      selectedCustomer.full_name
                    }
                  </strong>
                </div>

                <div>
                  <span>Email Address</span>

                  <strong>
                    {selectedCustomer.email}
                  </strong>
                </div>

                <div>
                  <span>Phone Number</span>

                  <strong>
                    {selectedCustomer.phone ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>Role</span>

                  <strong>
                    {selectedCustomer.role}
                  </strong>
                </div>

                <div>
                  <span>Account Status</span>

                  <strong
                    className={
                      selectedCustomer.active
                        ? "customer-active-text"
                        : "customer-inactive-text"
                    }
                  >
                    {selectedCustomer.active
                      ? "Active"
                      : "Inactive"}
                  </strong>
                </div>

              </div>

            </div>

          </section>
        )}


        {/* CUSTOMER LIST */}

        <section className="admin-customer-list">

          <div className="customer-list-top">

            <div>
              <span>REGISTERED USERS</span>

              <h2>All Customers</h2>

              <p>
                {filteredCustomers.length}{" "}
                customer
                {filteredCustomers.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>


            <div className="customer-search-box">
              <input
                type="text"
                placeholder="Search name, email or phone..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

          </div>


          {loading ? (
            <div className="admin-table-loading">
              <div className="vehicle-loader"></div>

              <p>Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="admin-table-empty">
              <span>♙</span>

              <h3>No customers found</h3>

              <p>
                No customer accounts match your
                search.
              </p>
            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-customer-table">

                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>


                <tbody>

                  {filteredCustomers.map(
                    (customer) => (
                      <tr key={customer.id}>

                        <td>
                          <div className="customer-table-name">

                            <div className="customer-table-avatar">
                              {customer.full_name
                                ?.charAt(0)
                                .toUpperCase() ||
                                "C"}
                            </div>

                            <div>
                              <strong>
                                {
                                  customer.full_name
                                }
                              </strong>

                              <span>
                                Customer #
                                {customer.id}
                              </span>
                            </div>

                          </div>
                        </td>


                        <td>
                          {customer.email}
                        </td>


                        <td>
                          {customer.phone || "—"}
                        </td>


                        <td>
                          <span className="customer-role-badge">
                            {customer.role}
                          </span>
                        </td>


                        <td>
                          <span
                            className={
                              customer.active
                                ? "customer-status customer-status-active"
                                : "customer-status customer-status-inactive"
                            }
                          >
                            {customer.active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>


                        <td>
                          <div className="customer-actions">

                            <button
                              className="customer-view-btn"
                              onClick={() =>
                                viewCustomer(
                                  customer.id
                                )
                              }
                              disabled={
                                detailsLoading
                              }
                            >
                              View
                            </button>


                            {customer.active ? (
                              <button
                                className="customer-deactivate-btn"
                                onClick={() =>
                                  deactivateCustomer(
                                    customer
                                  )
                                }
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                className="customer-activate-btn"
                                onClick={() =>
                                  activateCustomer(
                                    customer
                                  )
                                }
                              >
                                Activate
                              </button>
                            )}

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

export default AdminCustomers;