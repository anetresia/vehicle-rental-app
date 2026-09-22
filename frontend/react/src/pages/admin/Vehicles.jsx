import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const emptyForm = {
  name: "",
  brand: "",
  model: "",
  manufacturing_year: "",
  registration_number: "",
  category: "",
  transmission: "automatic",
  fuel_type: "petrol",
  seats: "",
  price_per_day: "",
  image: "",
  mileage: "",
  color: "",
  is_available: true,
  status: "available",
};

function Vehicles() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/vehicles");

      setVehicles(response.data);
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "We could not load the fleet information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openEditForm = (vehicle) => {
    setEditingId(vehicle.id);

    setFormData({
      name: vehicle.name || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      manufacturing_year:
        vehicle.manufacturing_year || "",
      registration_number:
        vehicle.registration_number || "",
      category: vehicle.category || "",
      transmission:
        vehicle.transmission || "automatic",
      fuel_type:
        vehicle.fuel_type || "petrol",
      seats: vehicle.seats || "",
      price_per_day:
        vehicle.price_per_day || "",
      image: vehicle.image || "",
      mileage: vehicle.mileage || "",
      color: vehicle.color || "",
      is_available:
        vehicle.is_available ?? true,
      status:
        vehicle.status || "available",
    });

    setError("");
    setSuccess("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: formData.name,
        brand: formData.brand,
        model: formData.model,
        manufacturing_year: Number(
          formData.manufacturing_year
        ),
        registration_number:
          formData.registration_number,
        category: formData.category,
        transmission: formData.transmission,
        fuel_type: formData.fuel_type,
        seats: Number(formData.seats),
        price_per_day: Number(
          formData.price_per_day
        ),
        image: formData.image || null,
        mileage:
          formData.mileage === ""
            ? null
            : Number(formData.mileage),
        color: formData.color || null,
        is_available:
          formData.is_available,
        status: formData.status,
      };

      if (editingId) {
        await api.patch(
          `/vehicles/${editingId}`,
          payload
        );

        setSuccess(
          "Fleet vehicle details updated successfully."
        );
      } else {
        await api.post(
          "/vehicles",
          payload
        );

        setSuccess(
          "New vehicle has been added to the fleet."
        );
      }

      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);

      await getVehicles();
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "We could not save the vehicle."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (vehicle) => {
    const confirmed = window.confirm(
      `Mark ${vehicle.name} as inactive?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.patch(
        `/vehicles/${vehicle.id}/deactivate`
      );

      setSuccess(
        `${vehicle.name} has been removed from active rentals.`
      );

      await getVehicles();
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "We could not deactivate this vehicle."
      );
    }
  };

  const handleDelete = async (vehicle) => {
    const confirmed = window.confirm(
      `Delete ${vehicle.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/vehicles/${vehicle.id}`
      );

      setSuccess(
        "Vehicle has been permanently deleted."
      );

      await getVehicles();
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "We could not delete this vehicle."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");

    navigate("/login");
  };

  const adminName =
    localStorage.getItem("userName") ||
    "Administrator";

  return (
    <div className="fleet-admin-page">

      {/* SIDEBAR */}

      <aside className="fleet-sidebar">

        <Link
          to="/admin"
          className="fleet-brand"
        >
          <span className="fleet-brand-mark">
            D
          </span>

          <div>
            <strong>
              Drive<span>Ease</span>
            </strong>

            <small>
              Operations
            </small>
          </div>
        </Link>

        <div className="fleet-sidebar-heading">
          WORKSPACE
        </div>

        <nav className="fleet-sidebar-nav">

          <Link to="/admin">
            <span>01</span>
            Overview
          </Link>

          <Link
            to="/admin/vehicles"
            className="fleet-sidebar-active"
          >
            <span>02</span>
            Fleet
          </Link>

          <Link to="/admin/customers">
            <span>03</span>
            Customers
          </Link>

          <Link to="/admin/bookings">
            <span>04</span>
            Reservations
          </Link>

        </nav>

        <div className="fleet-sidebar-bottom">

          <Link to="/">
            <span>↗</span>
            Open website
          </Link>

          <button onClick={handleLogout}>
            <span>→</span>
            Sign out
          </button>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="fleet-main">

        <header className="fleet-topbar">

          <div>

            <span className="fleet-top-label">
              DRIVE EASE / FLEET
            </span>

            <h1>
              Fleet Control
            </h1>

          </div>

          <div className="fleet-user">

            <div>
              <strong>
                {adminName}
              </strong>

              <span>
                Fleet administrator
              </span>
            </div>

            <div className="fleet-user-avatar">
              {adminName
                .charAt(0)
                .toUpperCase()}
            </div>

          </div>

        </header>


        {/* INTRO */}

        <section className="fleet-intro">

          <div>

            <span>
              VEHICLE OPERATIONS
            </span>

            <h2>
              Your fleet, under control.
            </h2>

            <p>
              Keep vehicle information accurate,
              control availability and maintain
              a rental-ready fleet.
            </p>

          </div>

          <button
            className="fleet-add-button"
            onClick={openAddForm}
          >
            <span>+</span>
            Add vehicle
          </button>

        </section>


        {/* ALERTS */}

        {error && (
          <div className="fleet-alert fleet-alert-error">
            <div>
              <strong>
                Action could not be completed
              </strong>

              <p>{error}</p>
            </div>

            <button
              onClick={() => setError("")}
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="fleet-alert fleet-alert-success">
            <div>
              <strong>
                Changes saved
              </strong>

              <p>{success}</p>
            </div>

            <button
              onClick={() => setSuccess("")}
            >
              ×
            </button>
          </div>
        )}


        {/* ADD / EDIT */}

        {showForm && (

          <section className="fleet-editor">

            <div className="fleet-editor-heading">

              <div>

                <span>
                  {editingId
                    ? "EDITING FLEET RECORD"
                    : "NEW FLEET RECORD"}
                </span>

                <h2>
                  {editingId
                    ? "Update vehicle"
                    : "Add a vehicle"}
                </h2>

                <p>
                  Enter the vehicle information
                  used throughout the rental system.
                </p>

              </div>

              <button
                type="button"
                className="fleet-close-button"
                onClick={closeForm}
              >
                ×
              </button>

            </div>


            <form
              className="fleet-form"
              onSubmit={handleSubmit}
            >

              <div className="fleet-form-section">

                <div className="fleet-form-section-title">
                  <span>01</span>
                  Basic information
                </div>

                <div className="fleet-form-grid">

                  <div className="fleet-field">
                    <label>Vehicle name</label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Toyota Prius"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="fleet-field">
                    <label>Brand</label>

                    <input
                      type="text"
                      name="brand"
                      placeholder="Toyota"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="fleet-field">
                    <label>Model</label>

                    <input
                      type="text"
                      name="model"
                      placeholder="Prius"
                      value={formData.model}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="fleet-field">
                    <label>Manufacturing year</label>

                    <input
                      type="number"
                      name="manufacturing_year"
                      placeholder="2025"
                      min="1900"
                      value={
                        formData.manufacturing_year
                      }
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="fleet-field">
                    <label>Registration number</label>

                    <input
                      type="text"
                      name="registration_number"
                      placeholder="CAA-1234"
                      value={
                        formData.registration_number
                      }
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="fleet-field">
                    <label>Category</label>

                    <input
                      type="text"
                      name="category"
                      placeholder="SUV / Sedan / Van"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    />
                  </div>

                </div>

              </div>


              <div className="fleet-form-section">

                <div className="fleet-form-section-title">
                  <span>02</span>
                  Vehicle specifications
                </div>

                <div className="fleet-form-grid">

                  <div className="fleet-field">
                    <label>Transmission</label>

                    <select
                      name="transmission"
                      value={
                        formData.transmission
                      }
                      onChange={handleChange}
                    >
                      <option value="automatic">
                        Automatic
                      </option>

                      <option value="manual">
                        Manual
                      </option>
                    </select>
                  </div>

                  <div className="fleet-field">
                    <label>Fuel type</label>

                    <select
                      name="fuel_type"
                      value={formData.fuel_type}
                      onChange={handleChange}
                    >
                      <option value="petrol">
                        Petrol
                      </option>

                      <option value="diesel">
                        Diesel
                      </option>

                      <option value="hybrid">
                        Hybrid
                      </option>

                      <option value="electric">
                        Electric
                      </option>
                    </select>
                  </div>

                  <div className="fleet-field">
                    <label>Number of seats</label>

                    <input
                      type="number"
                      name="seats"
                      placeholder="5"
                      min="1"
                      value={formData.seats}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="fleet-field">
                    <label>Daily rental rate</label>

                    <input
                      type="number"
                      name="price_per_day"
                      placeholder="8000"
                      min="0"
                      step="0.01"
                      value={
                        formData.price_per_day
                      }
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="fleet-field">
                    <label>Mileage</label>

                    <input
                      type="number"
                      name="mileage"
                      placeholder="45000"
                      min="0"
                      value={formData.mileage}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="fleet-field">
                    <label>Exterior colour</label>

                    <input
                      type="text"
                      name="color"
                      placeholder="Pearl White"
                      value={formData.color}
                      onChange={handleChange}
                    />
                  </div>

                </div>

              </div>


              <div className="fleet-form-section">

                <div className="fleet-form-section-title">
                  <span>03</span>
                  Listing & availability
                </div>

                <div className="fleet-form-grid">

                  <div className="fleet-field fleet-field-wide">
                    <label>Vehicle image URL</label>

                    <input
                      type="text"
                      name="image"
                      placeholder="https://example.com/vehicle.jpg"
                      value={formData.image}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="fleet-field">
                    <label>Fleet status</label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="available">
                        Available
                      </option>

                      <option value="rented">
                        Rented
                      </option>

                      <option value="maintenance">
                        Maintenance
                      </option>

                      <option value="inactive">
                        Inactive
                      </option>
                    </select>
                  </div>

                </div>


                <label className="fleet-availability">

                  <input
                    type="checkbox"
                    name="is_available"
                    checked={
                      formData.is_available
                    }
                    onChange={handleChange}
                  />

                  <span className="fleet-checkbox">
                    ✓
                  </span>

                  <span>
                    <strong>
                      Available for bookings
                    </strong>

                    <small>
                      Customers can select this
                      vehicle when making a reservation.
                    </small>
                  </span>

                </label>

              </div>


              <div className="fleet-form-actions">

                <button
                  type="button"
                  className="fleet-cancel-button"
                  onClick={closeForm}
                >
                  Discard
                </button>

                <button
                  type="submit"
                  className="fleet-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving changes..."
                    : editingId
                    ? "Save vehicle"
                    : "Add to fleet"}
                </button>

              </div>

            </form>

          </section>
        )}


        {/* VEHICLE LIST */}

        <section className="fleet-list-section">

          <div className="fleet-list-header">

            <div>

              <span>
                CURRENT FLEET
              </span>

              <h2>
                Vehicles
              </h2>

              <p>
                {loading
                  ? "Updating fleet records..."
                  : `${vehicles.length} vehicle${
                      vehicles.length !== 1
                        ? "s"
                        : ""
                    } in your fleet`}
              </p>

            </div>

            <button
              className="fleet-refresh-button"
              onClick={getVehicles}
              disabled={loading}
            >
              ↻
              {loading
                ? " Updating"
                : " Refresh"}
            </button>

          </div>


          {loading ? (

            <div className="fleet-loading">

              <div className="fleet-loader"></div>

              <span>
                SYNCING FLEET
              </span>

              <h3>
                Loading vehicle records
              </h3>

              <p>
                Getting the latest information
                from the rental system.
              </p>

            </div>

          ) : vehicles.length === 0 ? (

            <div className="fleet-empty">

              <div className="fleet-empty-mark">
                D
              </div>

              <span>
                EMPTY FLEET
              </span>

              <h3>
                No vehicles have been added yet.
              </h3>

              <p>
                Start building your rental fleet
                by adding your first vehicle.
              </p>

              <button
                onClick={openAddForm}
              >
                + Add first vehicle
              </button>

            </div>

          ) : (

            <div className="fleet-table-container">

              <table className="fleet-table">

                <thead>

                  <tr>
                    <th>Vehicle</th>
                    <th>Class</th>
                    <th>Registration</th>
                    <th>Rate</th>
                    <th>Status</th>
                    <th>Booking</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {vehicles.map((vehicle) => (

                    <tr key={vehicle.id}>

                      <td>

                        <div className="fleet-vehicle-cell">

                          <div className="fleet-vehicle-image">

                            {vehicle.image ? (
                              <img
                                src={vehicle.image}
                                alt={vehicle.name}
                              />
                            ) : (
                              <span>
                                D
                              </span>
                            )}

                          </div>

                          <div>

                            <strong>
                              {vehicle.name}
                            </strong>

                            <small>
                              {vehicle.brand}{" "}
                              {vehicle.model}
                            </small>

                          </div>

                        </div>

                      </td>


                      <td>
                        <span className="fleet-category">
                          {vehicle.category}
                        </span>
                      </td>


                      <td>
                        <span className="fleet-registration">
                          {vehicle.registration_number}
                        </span>
                      </td>


                      <td>
                        <strong className="fleet-price">
                          Rs. {vehicle.price_per_day}
                        </strong>

                        <small className="fleet-price-label">
                          / day
                        </small>
                      </td>


                      <td>

                        <span
                          className={`fleet-status status-${vehicle.status}`}
                        >
                          <span></span>
                          {vehicle.status}
                        </span>

                      </td>


                      <td>

                        <span
                          className={
                            vehicle.is_available
                              ? "fleet-availability-status available"
                              : "fleet-availability-status unavailable"
                          }
                        >
                          {vehicle.is_available
                            ? "Open"
                            : "Closed"}
                        </span>

                      </td>


                      <td>

                        <div className="fleet-actions">

                          <button
                            className="fleet-action-edit"
                            onClick={() =>
                              openEditForm(vehicle)
                            }
                          >
                            Edit
                          </button>

                          {vehicle.status !==
                            "inactive" && (

                            <button
                              className="fleet-action-deactivate"
                              onClick={() =>
                                handleDeactivate(
                                  vehicle
                                )
                              }
                            >
                              Deactivate
                            </button>

                          )}

                          <button
                            className="fleet-action-delete"
                            onClick={() =>
                              handleDelete(vehicle)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>


        <footer className="fleet-footer">

          <span>
            DriveEase Fleet Operations
          </span>

          <span>
            © 2026 DriveEase
          </span>

        </footer>

      </main>

    </div>
  );
}

export default Vehicles;