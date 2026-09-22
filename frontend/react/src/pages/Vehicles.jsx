import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    transmission: "",
    fuel_type: "",
    max_price: "",
    available_only: false,
  });

  const getVehicles = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.category) {
        params.category = filters.category;
      }

      if (filters.brand) {
        params.brand = filters.brand;
      }

      if (filters.transmission) {
        params.transmission = filters.transmission;
      }

      if (filters.fuel_type) {
        params.fuel_type = filters.fuel_type;
      }

      if (filters.max_price) {
        params.max_price = filters.max_price;
      }

      if (filters.available_only) {
        params.available_only = true;
      }

      const response = await api.get("/vehicles", {
        params,
      });

      setVehicles(response.data);
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "We couldn't load the vehicles right now."
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

    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getVehicles();
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      brand: "",
      transmission: "",
      fuel_type: "",
      max_price: "",
      available_only: false,
    });
  };

  const isLoggedIn = localStorage.getItem("token");

  return (
    <div className="vehicles-page">

      {/* ================= NAVBAR ================= */}

      <nav className="vehicles-navbar">

        <Link to="/" className="vehicles-brand">
          <span className="brand-mark">D</span>

          <span className="brand-name">
            Drive<span>Ease</span>
          </span>
        </Link>

        <div className="vehicles-navigation">
          <Link to="/">
            Home
          </Link>

          <Link
            to="/vehicles"
            className="active"
          >
            Explore
          </Link>

          {isLoggedIn && (
            <Link to="/my-bookings">
              My Bookings
            </Link>
          )}
        </div>

        <div className="vehicles-nav-action">

          {isLoggedIn ? (
            <Link
              to="/profile"
              className="vehicles-account"
            >
              Account
            </Link>
          ) : (
            <Link
              to="/login"
              className="vehicles-account"
            >
              Sign in
            </Link>
          )}

        </div>

      </nav>


      {/* ================= PAGE INTRO ================= */}

      <section className="vehicles-intro">

        <div className="vehicles-intro-content">

          <span className="vehicles-eyebrow">
            EXPLORE THE COLLECTION
          </span>

          <h1>
            Choose the ride
            <br />
            for your <span>next move.</span>
          </h1>

          <p>
            Browse our vehicle collection, compare your
            options and find a ride that works for your
            plans.
          </p>

        </div>

        <div className="vehicles-intro-side">

          <span>
            {loading
              ? "CHECKING FLEET"
              : `${vehicles.length} VEHICLES`}
          </span>

          <strong>
            Find your way.
          </strong>

          <p>
            Search by vehicle, brand, category or rental
            price.
          </p>

        </div>

      </section>


      {/* ================= MAIN CONTENT ================= */}

      <main className="vehicles-content">

        {/* ================= FILTER PANEL ================= */}

        <form
          className="vehicles-filter-panel"
          onSubmit={handleSearch}
        >

          <div className="filter-heading">

            <div>
              <span>REFINE YOUR SEARCH</span>
              <h2>Find what you need</h2>
            </div>

            <button
              type="button"
              className="filter-reset"
              onClick={clearFilters}
            >
              Reset filters
            </button>

          </div>


          <div className="filter-fields">

            {/* SEARCH */}

            <div className="filter-field filter-search-field">

              <label htmlFor="vehicle-search">
                Vehicle
              </label>

              <input
                id="vehicle-search"
                type="text"
                name="search"
                placeholder="Search by name or model"
                value={filters.search}
                onChange={handleChange}
              />

            </div>


            {/* CATEGORY */}

            <div className="filter-field">

              <label htmlFor="vehicle-category">
                Category
              </label>

              <input
                id="vehicle-category"
                type="text"
                name="category"
                placeholder="SUV, Sedan..."
                value={filters.category}
                onChange={handleChange}
              />

            </div>


            {/* BRAND */}

            <div className="filter-field">

              <label htmlFor="vehicle-brand">
                Brand
              </label>

              <input
                id="vehicle-brand"
                type="text"
                name="brand"
                placeholder="Toyota, Honda..."
                value={filters.brand}
                onChange={handleChange}
              />

            </div>


            {/* TRANSMISSION */}

            <div className="filter-field">

              <label htmlFor="vehicle-transmission">
                Transmission
              </label>

              <select
                id="vehicle-transmission"
                name="transmission"
                value={filters.transmission}
                onChange={handleChange}
              >
                <option value="">
                  Any transmission
                </option>

                <option value="automatic">
                  Automatic
                </option>

                <option value="manual">
                  Manual
                </option>
              </select>

            </div>


            {/* FUEL */}

            <div className="filter-field">

              <label htmlFor="vehicle-fuel">
                Fuel type
              </label>

              <select
                id="vehicle-fuel"
                name="fuel_type"
                value={filters.fuel_type}
                onChange={handleChange}
              >
                <option value="">
                  Any fuel
                </option>

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


            {/* PRICE */}

            <div className="filter-field">

              <label htmlFor="vehicle-price">
                Maximum daily price
              </label>

              <input
                id="vehicle-price"
                type="number"
                name="max_price"
                placeholder="Rs. 10,000"
                min="0"
                value={filters.max_price}
                onChange={handleChange}
              />

            </div>

          </div>


          <div className="filter-bottom">

            <label className="available-check">

              <input
                type="checkbox"
                name="available_only"
                checked={filters.available_only}
                onChange={handleChange}
              />

              <span className="custom-checkbox"></span>

              <span>
                Show available vehicles only
              </span>

            </label>


            <button
              type="submit"
              className="vehicles-search-button"
            >
              Search vehicles
              <span>→</span>
            </button>

          </div>

        </form>


        {/* ================= RESULTS HEADER ================= */}

        <div className="vehicles-results-heading">

          <div>

            <span>OUR VEHICLES</span>

            <h2>
              Available for your journey
            </h2>

          </div>

          <p>
            {loading
              ? "Updating the collection..."
              : `${vehicles.length} ${
                  vehicles.length === 1
                    ? "vehicle"
                    : "vehicles"
                } available`}
          </p>

        </div>


        {/* ================= ERROR ================= */}

        {error && (
          <div className="vehicles-error-box">

            <strong>
              Something went wrong
            </strong>

            <p>
              {error}
            </p>

            <button
              onClick={getVehicles}
              type="button"
            >
              Try again
            </button>

          </div>
        )}


        {/* ================= LOADING ================= */}

        {loading && (
          <div className="vehicles-loading">

            <div className="loading-spinner"></div>

            <h3>
              Finding your vehicles
            </h3>

            <p>
              Please wait while we update the collection.
            </p>

          </div>
        )}


        {/* ================= EMPTY ================= */}

        {!loading &&
          !error &&
          vehicles.length === 0 && (
            <div className="vehicles-empty-state">

              <div className="empty-icon">
                —
              </div>

              <span>
                NO MATCHES
              </span>

              <h3>
                We couldn't find a matching vehicle.
              </h3>

              <p>
                Try removing a filter or searching for
                something different.
              </p>

              <button
                type="button"
                onClick={clearFilters}
              >
                Clear all filters
              </button>

            </div>
          )}


        {/* ================= VEHICLE GRID ================= */}

        {!loading &&
          !error &&
          vehicles.length > 0 && (

            <div className="vehicles-grid">

              {vehicles.map((vehicle) => {

                const available =
                  vehicle.is_available &&
                  vehicle.status === "available";

                return (
                  <article
                    className="vehicle-item-card"
                    key={vehicle.id}
                  >

                    {/* IMAGE */}

                    <div className="vehicle-card-image">

                      {vehicle.image ? (
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                        />
                      ) : (
                        <div className="vehicle-placeholder">

                          <span>
                            DRIVEEASE
                          </span>

                          <div className="placeholder-car">
                            <div className="placeholder-roof"></div>
                            <div className="placeholder-body"></div>

                            <div className="placeholder-wheel first"></div>
                            <div className="placeholder-wheel second"></div>
                          </div>

                        </div>
                      )}


                      <div
                        className={`vehicle-availability ${
                          available
                            ? "available"
                            : "unavailable"
                        }`}
                      >
                        <span></span>

                        {available
                          ? "Available"
                          : vehicle.status ||
                            "Unavailable"}
                      </div>

                    </div>


                    {/* CARD BODY */}

                    <div className="vehicle-card-content">

                      <div className="vehicle-card-heading">

                        <div>

                          <span className="vehicle-type">
                            {vehicle.category}
                          </span>

                          <h3>
                            {vehicle.name}
                          </h3>

                          <p>
                            {vehicle.brand}{" "}
                            {vehicle.model}
                          </p>

                        </div>

                        <div className="vehicle-daily-price">

                          <strong>
                            Rs. {vehicle.price_per_day}
                          </strong>

                          <span>
                            per day
                          </span>

                        </div>

                      </div>


                      {/* SPECS */}

                      <div className="vehicle-details-row">

                        <div>
                          <span>Transmission</span>
                          <strong>
                            {vehicle.transmission}
                          </strong>
                        </div>

                        <div>
                          <span>Fuel</span>
                          <strong>
                            {vehicle.fuel_type}
                          </strong>
                        </div>

                        <div>
                          <span>Capacity</span>
                          <strong>
                            {vehicle.seats} seats
                          </strong>
                        </div>

                      </div>


                      {/* FOOTER */}

                      <div className="vehicle-card-footer">

                        <span>
                          {vehicle.manufacturing_year}
                        </span>

                        <Link
                          to={`/vehicles/${vehicle.id}`}
                          className="vehicle-details-link"
                        >
                          Explore vehicle
                          <span>→</span>
                        </Link>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

      </main>

    </div>
  );
}

export default Vehicles;