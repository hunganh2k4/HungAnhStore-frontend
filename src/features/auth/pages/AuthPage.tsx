import { useState } from "react";
import bgImage from "../../../assets/background-login.jpg"; 

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative bg-white/95 w-full max-w-md rounded-3xl shadow-2xl p-8 transition-all duration-300">

        {/* Header */}
        <div className="flex justify-between mb-8 ">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 pb-3 font-semibold transition rounded-t-xl pt-4 ${
              isLogin
                ? "border-b-2 border-red-600 text-red-600 bg-gray-200"
                : "text-gray-400 hover:bg-gray-50"
            }`}
          >
            Đăng nhập
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 pb-3 font-semibold transition rounded-t-xl pt-4 ${
              !isLogin
                ? "border-b-2 border-red-600 text-red-600 bg-gray-200"
                : "text-gray-400"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4">

          {!isLogin && (
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
            />
          )}

          {isLogin && (
            <div className="text-right text-sm text-red-500 hover:underline cursor-pointer">
              Quên mật khẩu?
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
          >
            {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-gray-400 text-sm">Hoặc</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Social login */}
        <div className="space-y-3">
          <button className="w-full border py-2 rounded-xl hover:bg-gray-50 transition">
            Đăng nhập với Google
          </button>

          <button className="w-full border py-2 rounded-xl hover:bg-gray-50 transition">
            Đăng nhập với Facebook
          </button>
        </div>

        {/* Switch bottom */}
        <div className="text-center text-sm mt-6">
          {isLogin ? (
            <>
              Chưa có tài khoản?{" "}
              <span
                onClick={() => setIsLogin(false)}
                className="text-red-600 font-semibold cursor-pointer hover:underline"
              >
                Đăng ký ngay
              </span>
            </>
          ) : (
            <>
              Đã có tài khoản?{" "}
              <span
                onClick={() => setIsLogin(true)}
                className="text-red-600 font-semibold cursor-pointer hover:underline"
              >
                Đăng nhập
              </span>
            </>
          )}
        </div>

      </div>
    </div>
  );
}