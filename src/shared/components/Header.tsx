export default function Header() {
  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-pink-500 text-white text-sm py-1 text-center">
        ● Sale 8/3 sắp trở lại - Đăng ký ngay!
      </div>

      <div className="bg-red-600 text-white py-3">
        <div className="max-w-screen-2xl mx-auto px-2 flex items-center gap-4">

          {/* Logo */}
          <div className="text-2xl font-bold text-white">
            HungAnhStore
          </div>

          {/* Buttons */}
          <button className="bg-white/15 text-white px-4 py-2 rounded-xl flex items-center gap-1 font-medium hover:bg-white/25 transition">
            ☰ Danh mục
          </button>

          <button className="bg-white/15 text-white px-4 py-2 rounded-xl flex items-center gap-1 font-medium hover:bg-white/25 transition">
            📍 Hồ Chí Minh
          </button>

          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Bạn muốn mua gì hôm nay?"
              className="w-full px-5 py-3 rounded-xl outline-none text-sm bg-white text-black placeholder-gray-400"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4 text-white">
            <div className="cursor-pointer font-medium hover:opacity-80 transition">
              🛒 Giỏ hàng
            </div>

            <button className="bg-white/15 px-4 py-2 rounded-xl font-medium hover:bg-white/25 transition">
              👤 Đăng nhập
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}