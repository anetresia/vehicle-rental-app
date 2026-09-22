import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function Profile() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/me");

      setFormData({
        full_name: response.data.full_name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
      });
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "We couldn't load your account information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.patch("/users/me", {
        full_name: formData.full_name,
        phone: formData.phone,
      });

      setFormData({
        full_name: response.data.full_name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
      });

      localStorage.setItem(
        "userName",
        response.data.full_name
      );

      setSuccess("Your account information has been updated.");
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.detail ||
          "We couldn't update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-page">
        <div className="profile-loading-box">
          <div className="profile-loader"></div>
          <span>ACCOUNT</span>
          <h2>Loading your profile</h2>
          <p>Please wait while we get your account information.</p>
        </div>
      </div>
    );
  }

  const firstLetter = formData.full_name
    ? formData.full_name.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="profile-page">

      {/* NAVBAR */}

      <nav className="profile-navbar">

        <Link to="/" className="profile-brand">
          <span className="profile-brand-mark">D</span>

          <span className="profile-brand-name">
            Drive<span>Ease</span>
          </span>
        </Link>

        <div className="profile-navigation">
          <Link to="/">Home</Link>

          <Link to="/vehicles">
            Vehicles
          </Link>

          <Link to="/my-bookings">
            My Bookings
          </Link>

          <Link
            to="/profile"
            className="active"
          >
            Account
          </Link>
        </div>

        <Link
          to="/vehicles"
          className="profile-nav-button"
        >
          Explore vehicles
          <span>→</span>
        </Link>

      </nav>


      {/* PAGE INTRO */}

      <section className="profile-intro">

        <div className="profile-intro-inner">

          <div className="profile-intro-text">

            <span className="profile-eyebrow">
              ACCOUNT CENTRE
            </span>

            <h1>
              Your account,
              <br />
              <span>your journey.</span>
            </h1>

            <p>
              Manage your personal information and keep
              your DriveEase account ready for your next rental.
            </p>

          </div>

          <div className="profile-intro-side">

            <span>ACCOUNT STATUS</span>

            <strong>Active customer</strong>

            <p>
              Your profile information is used to manage
              your rental experience.
            </p>

          </div>

        </div>

      </section>


      {/* PROFILE CONTENT */}

      <main className="profile-main">

        <div className="profile-breadcrumb">
          <Link to="/">Home</Link>
          <span>→</span>
          <strong>Account</strong>
        </div>


        <div className="profile-grid">

          {/* PROFILE OVERVIEW */}

          <aside className="profile-overview-card">

            <div className="profile-overview-top">

              <span className="profile-card-label">
                YOUR ACCOUNT
              </span>

              <div className="profile-avatar">
                {firstLetter}
              </div>

              <h2>
                {formData.full_name || "DriveEase Customer"}
              </h2>

              <p>
                {formData.email || "No email available"}
              </p>

              <span className="profile-customer-badge">
                CUSTOMER
              </span>

            </div>


            <div className="profile-overview-divider"></div>


            <div className="profile-overview-info">

              <div>
                <span>ACCOUNT TYPE</span>
                <strong>Customer</strong>
              </div>

              <div>
                <span>RENTAL ACCESS</span>
                <strong>Available</strong>
              </div>

            </div>


            <div className="profile-overview-links">

              <Link to="/my-bookings">
                <div>
                  <span>01</span>
                  <strong>My bookings</strong>
                </div>

                <span>↗</span>
              </Link>

              <Link to="/vehicles">
                <div>
                  <span>02</span>
                  <strong>Find a vehicle</strong>
                </div>

                <span>↗</span>
              </Link>

            </div>

          </aside>


          {/* EDIT ACCOUNT */}

          <section className="profile-form-card">

            <div className="profile-form-header">

              <div>

                <span className="profile-card-label">
                  PERSONAL DETAILS
                </span>

                <h2>
                  Account information
                </h2>

                <p>
                  Update your details below so your
                  rental account stays accurate.
                </p>

              </div>

              <div className="profile-edit-number">
                01
              </div>

            </div>


            {error && (
              <div className="profile-message profile-message-error">
                <span>!</span>

                <div>
                  <strong>Update unavailable</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}


            {success && (
              <div className="profile-message profile-message-success">
                <span>✓</span>

                <div>
                  <strong>Changes saved</strong>
                  <p>{success}</p>
                </div>
              </div>
            )}


            <form
              onSubmit={handleUpdate}
              className="profile-form"
            >

              <div className="profile-form-row">

                <div className="profile-input-group">

                  <label htmlFor="full_name">
                    FULL NAME
                  </label>

                  <input
                    id="full_name"
                    type="text"
                    name="full_name"
                    placeholder="Your full name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="profile-input-group">

                  <label htmlFor="phone">
                    PHONE NUMBER
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                </div>

              </div>


              <div className="profile-input-group profile-email-group">

                <label htmlFor="email">
                  EMAIL ADDRESS
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                />

                <div className="profile-input-note">
                  <span>i</span>
                  <p>
                    Your email is connected to your account
                    and cannot be changed here.
                  </p>
                </div>

              </div>


              <div className="profile-form-footer">

                <div className="profile-save-note">
                  <span>✓</span>

                  <p>
                    Your changes are saved securely to
                    your DriveEase account.
                  </p>
                </div>

                <div className="profile-form-buttons">

                  <button
                    type="button"
                    className="profile-reset-button"
                    onClick={getProfile}
                    disabled={saving}
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    className="profile-save-button"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving changes..."
                      : "Save changes"}
                    {!saving && <span>→</span>}
                  </button>

                </div>

              </div>

            </form>

          </section>

        </div>


        {/* BOTTOM INFORMATION */}

        <section className="profile-bottom-card">

          <div>

            <span className="profile-card-label">
              READY TO GO?
            </span>

            <h2>
              Find your next vehicle.
            </h2>

            <p>
              Explore the available fleet and choose
              a vehicle that fits your plans.
            </p>

          </div>

          <Link
            to="/vehicles"
            className="profile-bottom-button"
          >
            Browse vehicles
            <span>→</span>
          </Link>

        </section>

      </main>


      {/* FOOTER */}

      <footer className="profile-footer">

        <div className="profile-footer-brand">

          <Link to="/" className="profile-brand">
            <span className="profile-brand-mark">D</span>

            <span className="profile-brand-name">
              Drive<span>Ease</span>
            </span>
          </Link>

          <p>
            Simple vehicle rental,
            made for your journey.
          </p>

        </div>

        <span>
          © 2026 DriveEase
        </span>

      </footer>

    </div>
  );
}

export default Profile;