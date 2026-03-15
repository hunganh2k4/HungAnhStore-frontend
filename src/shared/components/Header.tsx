import { useState } from "react";
import Sidebar from "../../features/home/components/Sidebar";
import { useAuth } from "../../features/auth/auth.context";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCart } from "../../features/cart/cart.context";


export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <header className="w-full fixed top-0 left-0 z-50">
        {/* Top bar */}
        <div className="bg-pink-500 text-white text-sm py-1 text-center">
          ● Sale 8/3 sắp trở lại - Đăng ký ngay!
        </div>

        <div className="bg-red-600 text-white py-3">
          <div className="max-w-screen-2xl mx-auto px-2 flex items-center gap-4">

            <Link to="/" className="text-2xl font-bold hover:opacity-80 transition">
              HungAnhStore
            </Link>

            {/* Danh mục */}
            <button
              onClick={() => setOpenMenu(true)}
              className="bg-white/15 px-4 py-2 rounded-xl hover:bg-white/25 transition"
            >
              ☰ Danh mục
            </button>

            {/* Vị trí */}
            <button className="bg-white/15 px-4 py-2 rounded-xl hover:bg-white/25 transition">
              📍 Hồ Chí Minh
            </button>

            {/* Search bar */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Bạn muốn mua gì hôm nay?"
                className="w-full px-5 py-3 rounded-xl outline-none text-sm bg-white text-black"
              />
            </div>

            {/* Giỏ hàng + User */}
            <div className="flex items-center gap-4">
              <Link
                to="/cart"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-black/20 transition relative"
              >
                <div className="relative">
                  🛒
                  {cartCount > 0 && (
                    <span className="absolute -top-3 -right-3 bg-orange-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-red-600">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Giỏ hàng</span>
              </Link>

              {isAuthenticated && user ? (
                // Hiển thị tên user + nút logout
                <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-xl">
                  👤 {user.name}
                  <button
                    onClick={logout}
                    className="ml-2 px-2 py-1 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                // Nếu chưa login
                <button onClick={() => navigate("/login")} className="bg-white/15 px-4 py-2 rounded-xl hover:bg-white/25 transition">
                  👤 Đăng nhập
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Sidebar */}
      {openMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenMenu(false)}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Sidebar */}
          <div className="absolute top-[96px] left-0 w-full z-50">
            <div className="max-w-screen-2xl mx-auto px-4 py-4">
              <div
                className="w-60"
                onClick={(e) => e.stopPropagation()}
              >
                <Sidebar />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}