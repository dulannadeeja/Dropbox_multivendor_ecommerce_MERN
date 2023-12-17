import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user);
  if (loading) return <h1>Loading...</h1>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoutes;
