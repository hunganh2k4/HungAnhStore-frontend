import { useState } from "react";
import bgImage from "../../../assets/background-login.jpg";
import { useAuth } from "../auth.context";
import { authService } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        await login(email, password);
        navigate("/");
      } else {
        await authService.register({
          email,
          password,
        });

        // 👉 Chuyển sang trang thông báo xác thực
        navigate("/verify-email-notice");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Có lỗi xảy ra",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative bg-white/95 w-full max-w-md rounded-3xl shadow-2xl p-8">

        <div className="flex justify-between mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 pb-3 font-semibold transition rounded-t-xl pt-4 ${
              isLogin
                ? "border-b-2 border-red-600 text-red-600 bg-gray-200"
                : "text-gray-400"
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

        {error && (
          <div className="mb-4 text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        <form
          className="space-y-4"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value,
                )
              }
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-400 outline-none"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading
              ? "Đang xử lý..."
              : isLogin
              ? "Đăng nhập"
              : "Tạo tài khoản"}
          </button>
        </form>
      </div>
    </div>
  );
}