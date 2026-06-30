import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../features/authentication/pages/Login";
import ForgotPassword from "../features/authentication/pages/ForgotPassword";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}