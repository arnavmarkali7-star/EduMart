import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, role, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role authorization
  // Handle role as array (for multiple allowed roles)
  if (role && Array.isArray(role)) {
    if (!role.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  } else if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  if (roles && Array.isArray(roles) && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;

