import { useAuth } from "../../auth/auth.context";

export default function RightPanel() {
  const { user, isAuthenticated } = useAuth();

  const maskPhone = (phone?: string) => {
    if (!phone) return "";
    if (phone.length < 6) return phone;
    return phone.slice(0, 3) + "****" + phone.slice(-3);
  };

  return (
    <div className="w-72 space-y-2">
      {/* Login Box or User Info */}
      {!isAuthenticated ? (
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-5 rounded-2xl shadow-lg">
          <h3 className="font-semibold text-lg mb-2">
            🎉 Chào mừng đến với CellphoneS
          </h3>
          <p className="text-sm mb-4 opacity-90">
            Đăng nhập để nhận ưu đãi độc quyền, tích điểm thành viên và theo dõi
            đơn hàng dễ dàng.
          </p>
          <button className="w-full bg-white text-red-600 font-semibold py-2 rounded-xl hover:bg-gray-100 transition">
            Đăng nhập / Đăng ký ngay
          </button>
        </div>
      ) : (
        <div className="bg-white p-5 rounded-2xl shadow-lg border border-red-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="font-semibold text-gray-800 truncate">
              Chào, {user?.name}
            </h3>
            {user?.isPhoneVerified && user?.phone && (
              <p className="text-sm text-gray-500">{maskPhone(user.phone)}</p>
            )}
            {!user?.isPhoneVerified && (
              <p className="text-xs text-amber-600 italic">Chưa xác thực số ĐT</p>
            )}
          </div>
        </div>
      )}

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