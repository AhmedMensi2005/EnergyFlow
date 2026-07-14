import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../features/authentication/pages/Login";
import ForgotPassword from "../features/authentication/pages/ForgotPassword";
import ResetPassword from "../features/authentication/pages/ResetPassword";

import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/dashboard";


export default function AppRoutes() {

    return (

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
                        <Dashboard />
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

    );
}