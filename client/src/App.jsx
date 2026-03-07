import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './modules/common/Home';
import Login from './modules/common/Login';
import Register from './modules/common/Register';
import ForgotPassword from './modules/common/ForgotPassword';
import Layout from './modules/common/Layout';

// Renter
import RenterHome from './modules/user/renter/RenterHome';

// Owner
import OwnerHome from './modules/user/owner/OwnerHome';

// Admin
import AdminHome from './modules/admin/AdminHome';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Common Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Renter - single tabbed dashboard */}
          <Route path="/renter" element={<RenterHome />} />

          {/* Owner - single tabbed dashboard */}
          <Route path="/owner" element={<OwnerHome />} />

          {/* Admin - single tabbed dashboard */}
          <Route path="/admin" element={<AdminHome />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
