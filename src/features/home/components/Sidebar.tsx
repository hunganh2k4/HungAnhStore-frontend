export default function Sidebar() {
  const categories = [
    { icon: "📱", name: "Điện thoại, Tablet" },
    { icon: "💻", name: "Laptop" },
    { icon: "🎧", name: "Âm thanh, Mic thu âm" },
    { icon: "⌚", name: "Đồng hồ, Camera" },
    { icon: "🏠", name: "Đồ gia dụng, Làm đẹp" },
    { icon: "🔌", name: "Phụ kiện" },
    { icon: "🖥️", name: "PC, Màn hình, Máy in" },
    { icon: "📺", name: "Tivi, Điện máy" },
    { icon: "♻️", name: "Thu cũ đổi mới" },
    { icon: "🏪", name: "Hàng cũ" },
    { icon: "🎉", name: "Khuyến mãi" },
    { icon: "💡", name: "Tin công nghệ" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 w-64">
      <ul className="space-y-2">
        {categories.map((item) => (
          <li
            key={item.name}
            className="cursor-pointer hover:text-red-600 font-semibold transition flex items-center gap-2 text-sm py-1"
          >
            <span className="text-red-600 text-lg">{item.icon}</span>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}