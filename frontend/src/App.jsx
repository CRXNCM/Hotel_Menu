import { Navigate, Route, Routes } from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import MenuPage from "./pages/MenuPage";
import HotelPage from "./pages/HotelPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminImageManagerPage from "./pages/AdminImageManagerPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => (
  <Routes>
    <Route path="/" element={<SplashPage />} />
    <Route path="/menu" element={<MenuPage />} />
    <Route path="/hotel" element={<HotelPage />} />
    <Route path="/admin" element={<AdminLoginPage />} />
    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    <Route path="/admin/image-manager" element={<AdminImageManagerPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;