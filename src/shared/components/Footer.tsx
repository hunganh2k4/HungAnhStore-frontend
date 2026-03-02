export default function Header() {
  return (
    <header className="w-full">
      {/* ===== TOP BAR ===== */}
      <div className="bg-red-500 text-white text-[13px] py-1.5">
        <div className="w-[90%] mx-auto flex justify-between items-center">
          
          {/* Left */}
          <div className="hidden md:flex gap-5">
            <span>✔ Xuất VAT đầy đủ</span>
            <span>🚚 Giao nhanh - Miễn phí đơn 300k</span>
            <span>🔄 Thu cũ giá ngon</span>
            <span>🏬 Sản phẩm chính hãng</span>
          </div>

          {/* Right */}
          <div className="flex gap-5">
            <span className="cursor-pointer hover:opacity-80 transition">
              📍 Cửa hàng gần bạn
            </span>
            <span className="cursor-pointer hover:opacity-80 transition">
              📦 Tra cứu đơn hàng
            </span>
            <span>📞 1800 2097</span>
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <div className="bg-gradient-to-b from-red-600 to-red-700 py-3">
        <div className="max-w-6xl mx-auto px-3 flex items-center gap-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-white">
            cellphoneS
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
              className="w-full px-5 py-3 rounded-xl outline-none text-sm"
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