import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "../features/main/mainPage"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/main" element={<Main />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}