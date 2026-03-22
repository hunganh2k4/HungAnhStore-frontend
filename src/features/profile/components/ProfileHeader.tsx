import { useAuth } from "../../auth/auth.context";
import { ShoppingBag, Wallet } from "lucide-react";

export default function ProfileHeader() {
  const { user } = useAuth();

  const maskPhone = (phone?: string) => {
    if (!phone) return "Chưa cập nhật";
    if (phone.length < 6) return phone;
    return phone.slice(0, 3) + "******" + phone.slice(-2);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col lg:flex-row gap-6 items-center lg:items-stretch">
      {/* User Info Section */}
      <div className="flex items-center gap-6 flex-1 w-full pl-2">
        <div className="relative group">
          <div className="w-28 h-28 bg-gradient-to-tr from-red-500 to-pink-500 rounded-full p-1 shadow-lg transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-white">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-red-600 to-pink-600">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <button className="absolute bottom-1 right-1 bg-white shadow-md border border-gray-100 rounded-full p-2 hover:bg-gray-50 transition text-lg">
            📷
          </button>
        </div>

        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">{user?.name}</h2>
          <div className="flex items-center gap-2 text-gray-600 text-base font-medium">
            <span>{maskPhone(user?.phone)}</span>
            {user?.isPhoneVerified && (
              <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-bold">
                ✓
              </span>
            )}
          </div>
          <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-1.5 rounded-full text-sm font-bold text-gray-700">
            <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse"></span>
            Hạng SMEMBER: <span className="text-red-600 uppercase">S-NULL</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1 cursor-help group">
            🕒 Cập nhật lại sau 01/01/2027
            <span className="opacity-0 group-hover:opacity-100 transition">ℹ️</span>
          </p>
        </div>
      </div>

      {/* Vertical Dividers for Desktop */}
      <div className="hidden lg:block w-px bg-gray-100 self-stretch my-2"></div>

      {/* Stats Section */}
      <div className="flex flex-wrap justify-center lg:justify-start gap-10 py-2 items-center">
        <div className="flex items-center gap-4 group cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-red-100">
            <ShoppingBag className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900">0</div>
            <div className="text-sm font-semibold text-gray-500">Đơn hàng đã mua</div>
          </div>
        </div>

        <div className="flex items-center gap-4 group cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-amber-100">
            <Wallet className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900">0đ</div>
            <div className="text-sm font-semibold text-gray-500">Tiền tích lũy (2025)</div>
            <div className="text-xs text-red-500 font-bold mt-1">
              + 3.000.000đ để lên hạng
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
