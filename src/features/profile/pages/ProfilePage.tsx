import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileOverview from "../components/ProfileOverview";
import PersonalInfo from "../components/PersonalInfo";
import OrderHistory from "../components/OrderHistory";
import OrderDetail from "../components/OrderDetail";
import {
  Award,
  Ticket,
  History,
  MapPin,
  GraduationCap,
  Link2
} from "lucide-react";

export default function ProfilePage() {
  const subMenuItems = [
    { icon: Award, label: "Hạng thành viên", path: "/profile/membership" },
    { icon: Ticket, label: "Mã giảm giá", path: "/profile/vouchers" },
    { icon: History, label: "Lịch sử mua hàng", path: "/profile/order-history" },
    { icon: MapPin, label: "Sổ địa chỉ", path: "/profile/addresses" },
    { icon: GraduationCap, label: "S-Student & S-Teacher", path: "/profile/education" },
    { icon: Link2, label: "Liên kết tài khoản", path: "/profile/linked-accounts" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="max-w-screen-2xl mx-auto px-4 pt-4 space-y-4">
        {/* Top Header Section */}
        <ProfileHeader />

        {/* Sub Menu Navbar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex overflow-x-auto no-scrollbar gap-2">
          {subMenuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-8 py-4 rounded-2xl transition-all whitespace-nowrap group ${isActive
                  ? "bg-red-50 text-red-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"
                }`
              }
            >
              <div className={`p-2 rounded-xl transition-colors ${"bg-gray-50 group-hover:bg-red-100 group-hover:text-red-600 shadow-inner"
                }`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-base tracking-tight">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-64 shrink-0">
            <ProfileSidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px] overflow-hidden">
              <Routes>
                <Route index element={<ProfileOverview />} />
                <Route path="overview" element={<ProfileOverview />} />
                <Route path="personal-info" element={<PersonalInfo />} />
                <Route path="order-history" element={<OrderHistory />} />
                <Route path="order-history/:id" element={<OrderDetail />} />
                {/* Fallback - Fixed to absolute path to prevent infinite nesting */}
                <Route path="*" element={<Navigate to="/profile/overview" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
