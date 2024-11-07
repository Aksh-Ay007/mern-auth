import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminPrivateRoute = () => {
  const currentUser = useSelector((state) => state.user.currentUser);

  // Check if the user is authenticated and is an admin
  if (!currentUser || !currentUser.token || !currentUser.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminPrivateRoute;
