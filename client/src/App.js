import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/user/Dashboard';
import Profile from './pages/user/Profile';
import MyOrders from './pages/user/MyOrders';
import MyWishlist from './pages/user/MyWishlist';
import MyChat from './pages/user/MyChat';
import MyComplaints from './pages/user/MyComplaints';
import SellProduct from './pages/user/SellProduct';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminProducts from './pages/admin/Products';
import AdminComplaints from './pages/admin/Complaints';
import AdminRatings from './pages/admin/Ratings';
import SellerDashboard from './pages/seller/Dashboard';
import SellerProducts from './pages/seller/Products';
import SellerOrders from './pages/seller/Orders';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            
            {/* User Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <PrivateRoute>
                  <MyOrders />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-wishlist"
              element={
                <PrivateRoute>
                  <MyWishlist />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-chat"
              element={
                <PrivateRoute>
                  <MyChat />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-complaints"
              element={
                <PrivateRoute>
                  <MyComplaints />
                </PrivateRoute>
              }
            />
            <Route
              path="/sell-product"
              element={
                <PrivateRoute>
                  <SellProduct />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-products"
              element={
                <PrivateRoute>
                  <SellerProducts />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute role="admin">
                  <AdminUsers />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <PrivateRoute role="admin">
                  <AdminProducts />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/complaints"
              element={
                <PrivateRoute role="admin">
                  <AdminComplaints />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/ratings"
              element={
                <PrivateRoute role="admin">
                  <AdminRatings />
                </PrivateRoute>
              }
            />

            {/* Seller Routes */}
            <Route
              path="/seller/dashboard"
              element={
                <PrivateRoute role={['seller', 'admin']}>
                  <SellerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/seller/products"
              element={
                <PrivateRoute role={['seller', 'admin']}>
                  <SellerProducts />
                </PrivateRoute>
              }
            />
            <Route
              path="/seller/orders"
              element={
                <PrivateRoute role={['seller', 'admin']}>
                  <SellerOrders />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

