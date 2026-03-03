import { useState } from "react";
import Sidebar from "../../features/home/components/Sidebar";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <header className="w-full fixed top-0 left-0 z-50">
        {/* Top bar */}
        <div className="bg-pink-500 text-white text-sm py-1 text-center">
          ● Sale 8/3 sắp trở lại - Đăng ký ngay!
        </div>

        <div className="bg-red-600 text-white py-3">
          <div className="max-w-screen-2xl mx-auto px-2 flex items-center gap-4">

            <div className="text-2xl font-bold">
              HungAnhStore
            </div>

            {/* Danh mục */}
            <button
              onClick={() => setOpenMenu(true)}
              className="bg-white/15 px-4 py-2 rounded-xl hover:bg-white/25 transition"
            >
              ☰ Danh mục
            </button>

            {/* Giữ nguyên toàn bộ phần còn lại của bạn */}
            <button className="bg-white/15 px-4 py-2 rounded-xl hover:bg-white/25 transition">
              📍 Hồ Chí Minh
            </button>

            <div className="flex-1">
              <input
                type="text"
                placeholder="Bạn muốn mua gì hôm nay?"
                className="w-full px-5 py-3 rounded-xl outline-none text-sm bg-white text-black"
              />
            </div>

            <div className="flex items-center gap-4">
              <div>🛒 Giỏ hàng</div>
              <button className="bg-white/15 px-4 py-2 rounded-xl">
                👤 Đăng nhập
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Sidebar nằm dưới header */}
      {openMenu && (
  <div
    className="fixed inset-0 z-40"
    onClick={() => setOpenMenu(false)} // click ngoài sẽ tắt
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