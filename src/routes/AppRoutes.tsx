import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Home from "../features/home/pages/HomePage";
import AuthPage from "../features/auth/pages/AuthPage";
import Category from "../features/product/pages/CategoryPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<Category />} />
      </Route>

      {/* Trang full screen */}
      <Route path="/login" element={<AuthPage />} />
    </Routes>
  );
}