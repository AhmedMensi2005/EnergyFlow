import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom";

import Login from "../features/authentication/pages/Login";
import ForgotPassword from "../features/authentication/pages/ForgotPassword";
import ResetPassword from "../features/authentication/pages/ResetPassword";
import CreateAccount from "../features/authentication/pages/CreateAccount";
import ProtectedRoute from "./ProtectedRoute";

import Main from "../features/main/mainPage"


export default function AppRoutes() {
  return (
        <Routes>


            {/* Login */}
            <Route
                path="/login"
                element={<Login />}
            />


            {/* Dashboard protected */}
            <Route
                path="/main"
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

            <Route
            path="/forgot-password"
            element={<ForgotPassword/>}
            />


            <Route
            path="/reset-password/:uid/:token"
            element={<ResetPassword/>}
            />

            <Route
                path="/create-account/:invitation_id/:token"
                element={<CreateAccount />}
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