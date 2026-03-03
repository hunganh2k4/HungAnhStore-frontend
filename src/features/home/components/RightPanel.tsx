export default function RightPanel() {
  return (
    <div className="w-72 space-y-2">

      {/* Login Box */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-5 rounded-2xl shadow-lg">
        <h3 className="font-semibold text-lg mb-2">
          🎉 Chào mừng đến với CellphoneS
        </h3>
        <p className="text-sm mb-4 opacity-90">
          Đăng nhập để nhận ưu đãi độc quyền, tích điểm thành viên và theo dõi đơn hàng dễ dàng.
        </p>
        <button className="w-full bg-white text-red-600 font-semibold py-2 rounded-xl hover:bg-gray-100 transition">
          Đăng nhập / Đăng ký ngay
        </button>
      </div>

      {/* Education Offers */}
      <div className="bg-white p-5 rounded-2xl shadow-lg border">
        <h3 className="font-semibold text-lg mb-3 text-gray-800">
          🎓 Ưu đãi đặc biệt cho HSSV
        </h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="text-sm text-gray-600">
            <span className="mr-2">✅</span>
            Giảm thêm đến{" "}
            <span className="text-red-600 font-semibold whitespace-nowrap">
              15%
            </span>{" "}
            khi xác thực sinh viên
          </li>
          <li className="flex items-start gap-2">
            🔥 Deal laptop, tablet giá cực sốc mùa tựu trường
          </li>
          <li className="flex items-start gap-2">
            🎁 Quà tặng phụ kiện khi mua combo học tập
          </li>
        </ul>
        <button className="mt-4 w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition">
          Nhận ưu đãi ngay
        </button>
      </div>
    </div>
  );
}