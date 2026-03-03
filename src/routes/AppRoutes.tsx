import { Routes, Route } from "react-router-dom";
import CategoryPage from "../features/product/pages/CategoryPage";
import HomePage from "../features/home/pages/HomePage";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Home */}
      <Route path="/" element={<HomePage/>} />

      {/* Category */}
      <Route path="/category/:category" element={<CategoryPage />} />

      {/* 404 */}
      {/* <Route path="*" element={<div>404 - Not Found</div>} /> */}

    </Routes>
  );
}