import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../features/dashboard/Dashboard"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}