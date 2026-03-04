import { useEffect, useState } from "react";
import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { authService } from "../services/auth.service";
import bgImage from "../../../assets/background-login.jpg";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] =
    useState<"loading" | "success" | "error">(
      "loading",
    );

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    authService
      .verifyEmail(token)
      .then(() => {
        setStatus("success");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative bg-white/95 w-full max-w-md rounded-3xl shadow-2xl p-8 text-center">
        {status === "loading" && (
          <p>⏳ Đang xác thực...</p>
        )}

        {status === "success" && (
          <p className="text-green-600 font-semibold">
            ✅ Xác thực thành công!
            <br />
            Đang chuyển về đăng nhập...
          </p>
        )}

        {status === "error" && (
          <p className="text-red-600 font-semibold">
            ❌ Token không hợp lệ hoặc đã
            hết hạn.
          </p>
        )}
      </div>
    </div>
  );
}