import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom";

import Login from "../features/authentication/pages/Login";
import ForgotPassword from "../features/authentication/pages/ForgotPassword";
import ResetPassword from "../features/authentication/pages/ResetPassword";

import ProtectedRoute from "./ProtectedRoute";

import Main from "../features/main/mainPage"


export default function AppRoutes() {
  return (
    <BrowserRouter>
        <Routes>


            {/* Login */}
            <Route
                path="/login"
                element={<Login />}
            />


            {/* Forgot password */}
            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />


            {/* Reset password */}
            <Route
                path="/reset-password/:user_id/:token"
                element={<ResetPassword />}
            />


            {/* Dashboard protected */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Main />
                    </ProtectedRoute>
                }
            />


            {/* Default */}
            <Route
                path="/"
                element={
                    <Navigate 
                        to="/login"
                        replace
                    />
                }
            />


            {/* Unknown routes */}
            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />


        </Routes>
        <Route path="*" element={<h1>404 Not Found</h1>} />

    </BrowserRouter>
    );
}