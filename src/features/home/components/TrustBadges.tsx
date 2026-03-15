

const BADGES = [
  {
    icon: "https://cdn-icons-png.flaticon.com/512/10008/10008107.png", // Alternative red check/shield
    title: "Thương hiệu đảm bảo",
    desc: "Nhập khẩu, bảo hành chính hãng",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/3503/3503527.png", // Exchange icon
    title: "Đổi trả dễ dàng",
    desc: "Theo chính sách đổi trả tại HA Store",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/2830/2830305.png", // Delivery truck
    title: "Giao hàng tận nơi",
    desc: "Trên toàn quốc",
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/9351/9351740.png", // Quality star
    title: "Sản phẩm chất lượng",
    desc: "Đảm bảo tương thích và độ bền cao",
  },
];

export default function TrustBadges() {
  return (
    <div className="mt-12 mb-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      {BADGES.map((b, idx) => (
        <div key={idx} className="flex flex-col items-center text-center px-4 group">
          <div className="w-16 h-16 mb-4 flex items-center justify-center bg-red-50 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm border border-red-100">
            <img src={b.icon} alt={b.title} className="w-10 h-10 object-contain" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">{b.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
        </div>
      ))}
    </div>
  );
}
