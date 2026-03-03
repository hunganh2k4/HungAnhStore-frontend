import { Link } from "react-router-dom";

export default function Sidebar() {
  const categories = [
    { icon: "📱", name: "Điện thoại, Tablet", slug: "dien-thoai" },
    { icon: "💻", name: "Laptop", slug: "laptop" },
    { icon: "🎧", name: "Âm thanh, Mic thu âm", slug: "" },
    { icon: "⌚", name: "Đồng hồ, Camera", slug: "" },
    { icon: "🏠", name: "Đồ gia dụng, Làm đẹp", slug: "" },
    { icon: "🔌", name: "Phụ kiện", slug: "" },
    { icon: "🖥️", name: "PC, Màn hình, Máy in", slug: "" },
    { icon: "📺", name: "Tivi, Điện máy", slug: "" },
    { icon: "♻️", name: "Thu cũ đổi mới", slug: "" },
    { icon: "🏪", name: "Hàng cũ", slug: "" },
    { icon: "🎉", name: "Khuyến mãi", slug: "" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 w-64">
      <ul className="space-y-2">
        {categories.map((item) => (
          <li key={item.name}>
            {item.slug ? (
              <Link
                to={`/category/${item.slug}`}
                className="cursor-pointer hover:text-red-600 font-semibold transition flex items-center gap-2 text-sm py-1"
              >
                <span className="text-red-600 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-sm py-1 opacity-60 cursor-not-allowed">
                <span className="text-gray-400 text-lg">{item.icon}</span>
                {item.name}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}