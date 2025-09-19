import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token) {
    // hiç login olmamış
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // rol yetkisi yok
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
