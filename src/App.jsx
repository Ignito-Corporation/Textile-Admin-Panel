import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Layout from "./layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AllPOs from "./pages/TotalPos";
import BillEntry from "./pages/BillEnteryPurchase";

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const location = useLocation();

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("isLoggedIn") === "true");
  }, [location]);

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/"
        element={<Login setIsAuthenticated={setIsAuthenticated} />}
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Layout /> : <Navigate to="/" replace />}
      >
        <Route index element={<Dashboard />} />
        <Route path="all-pos" element={<AllPOs />} />
        <Route path="bill-entry" element={<BillEntry />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
