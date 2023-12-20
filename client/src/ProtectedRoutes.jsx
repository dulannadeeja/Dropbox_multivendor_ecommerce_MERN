import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    // return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
