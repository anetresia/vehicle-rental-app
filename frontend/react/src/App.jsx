import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// =========================
// PUBLIC PAGES
// =========================
import Login from "./pages/Login";
import Register from "./pages/Register";

// =========================
// CUSTOMER PAGES
// =========================
import Home from "./pages/Home";
import Vehicles from "./pages/Vehicles";
import VehicleDetails from "./pages/VehicleDetails";

import Profile from "./pages/customer/Profile";
import MyBookings from "./pages/customer/MyBookings";
import BookingDetails from "./pages/customer/BookingDetails";
import BookingForm from "./pages/customer/BookingForm";

// =========================
// ADMIN PAGES
// =========================
import AdminDashboard from "./pages/admin/Dashboard";
import AdminVehicles from "./pages/admin/Vehicles";
import AddVehicle from "./pages/admin/AddVehicle";
import EditVehicle from "./pages/admin/EditVehicle";
import AdminCustomers from "./pages/admin/Customers";
import AdminBookings from "./pages/admin/Bookings";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        {/* App open pannumbothu Login page */}
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />


        {/* =========================
            CUSTOMER PROTECTED ROUTES
        ========================= */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <Vehicles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vehicles/:id"
          element={
            <ProtectedRoute>
              <VehicleDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings/:id"
          element={
            <ProtectedRoute>
              <BookingDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/:vehicleId"
          element={
            <ProtectedRoute>
              <BookingForm />
            </ProtectedRoute>
          }
        />


        {/* =========================
            ADMIN PROTECTED ROUTES
        ========================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/vehicles"
          element={
            <ProtectedRoute adminOnly>
              <AdminVehicles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/vehicles/add"
          element={
            <ProtectedRoute adminOnly>
              <AddVehicle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/vehicles/edit/:id"
          element={
            <ProtectedRoute adminOnly>
              <EditVehicle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute adminOnly>
              <AdminCustomers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute adminOnly>
              <AdminBookings />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;