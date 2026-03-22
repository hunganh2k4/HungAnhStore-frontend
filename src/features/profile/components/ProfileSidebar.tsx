import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/auth.context";
import {
  User,
  ShoppingBag,
  StickyNote,
  Repeat,
  Award,
  Briefcase,
  LogOut,
  LayoutDashboard
} from "lucide-react";

export default function ProfileSidebar() {
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: "Trang chủ", path: "/profile/overview" },
    { icon: User, label: "Hồ sơ của tôi", path: "/profile/personal-info" },
    { icon: ShoppingBag, label: "Lịch sử mua hàng", path: "/profile/order-history" },
    { icon: StickyNote, label: "Tra cứu bảo hành", path: "/profile/warranty" },
    { icon: Repeat, label: "Thu cũ đổi mới", path: "/profile/trade-in" },
    { icon: Award, label: "Hạng thành viên", path: "/profile/membership" },
    { icon: Briefcase, label: "Ưu đãi doanh nghiệp", path: "/profile/business" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="flex-1 py-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-5 px-6 py-4.5 transition-all border-l-4 ${isActive
                ? "bg-red-50 text-red-400 border-red-500"
                : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-base font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-5 py-4 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors group font-bold"
        >
          <LogOut className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="text-base">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
