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
import CreatePO from "./pages/CreatePO"
import CreateBillEntry from "./pages/CreateBillEntry";
import Out_Entery from "./pages/Out_Entery";
import CreateInEntry from "./pages/CreateInEntry";
import CreateOutEntry from "./pages/CreateOutentery";
import ProductEntryForm from "./pages/ProductEntryForm";

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
        <Route path='out-entry' element={<Out_Entery />} />
      </Route>

      <Route
        path="/create-po"
        element={
          isAuthenticated ? <Layout /> : <Navigate to="/" replace />
        }
      >
        <Route index element={<CreatePO />} />
      </Route>

      <Route
        path="/create-purchase-bill"
        element={isAuthenticated ? <Layout /> : <Navigate to="/" replace />}
      >
        <Route index element={<CreateBillEntry />} />
      </Route>

      <Route
        path="/create-in-entry"
        element={isAuthenticated ? <Layout /> : <Navigate to="/" replace />}
      >
        <Route index element={<CreateInEntry />} />
      </Route>

       <Route
        path="/create-out-entry"
        element={isAuthenticated ? <Layout /> : <Navigate to="/" replace />}
      >
        <Route index element={<CreateOutEntry />} />
      </Route>

      <Route
        path="/create-product-entry"
        element={isAuthenticated ? <Layout /> : <Navigate to="/" replace />}
      >
        <Route index element={<ProductEntryForm />} />
      </Route>


      {/* Catch-all */}
      < Route path="*" element={< Navigate to="/" replace />} />
    </Routes >
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
