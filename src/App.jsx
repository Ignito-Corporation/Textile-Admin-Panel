import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import AllPOs from './pages/TotalPos';
import BillEntry from './pages/BillEnteryPurchase'; // ✅ Create this file

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect "/" to "/dashboard" */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Main layout with fixed sidebar and topbar */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />

          {/* ✅ Inner routing for dashboard card clicks */}
          <Route path="dashboard/all-pos" element={<AllPOs />} />
          <Route path="dashboard/bill-entry" element={<BillEntry />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
