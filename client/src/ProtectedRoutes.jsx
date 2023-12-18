import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const location = useLocation();
  const { loading } = useSelector((state) => state.user);
  const { isAuthenticated } = useSelector((state) => state.user);

  const content = isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );

  return <>{loading ? <h1>Loading...</h1> : content}</>;
};

export default ProtectedRoutes;
