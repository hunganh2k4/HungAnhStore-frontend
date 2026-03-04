import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Home from "../features/home/pages/HomePage";
import AuthPage from "../features/auth/pages/AuthPage";
import Category from "../features/product/pages/CategoryPage";
import VerifyEmailNotice from "../features/auth/pages/VerifyEmailNotice";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<Category />} />
      </Route>

      {/* Trang full screen */}
      <Route path="/login" element={<AuthPage />} />

      <Route path="/verify-email" element={<VerifyEmailPage />} />

      <Route path="/verify-email-notice" element={<VerifyEmailNotice />}/>
      
    </Routes>
  );
}