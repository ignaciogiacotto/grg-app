import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../store/auth";

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Made optional
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const { user } = useAuthContext();

  // First, check if the user is authenticated.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles are provided, check for role authorization.
  // If not provided, any authenticated user is allowed.
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  // If all checks pass, render the nested routes.
  return <Outlet />;
};