import bgImage from "../../../assets/background-login.jpg";

export default function VerifyEmailNotice() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative bg-white/95 w-full max-w-md rounded-3xl shadow-2xl p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          📩 Hãy xác thực email
        </h2>

        <p className="text-gray-600 mb-6">
          Chúng tôi đã gửi email xác thực.
          <br />
          Vui lòng kiểm tra hộp thư của bạn.
        </p>

        <p className="text-sm text-gray-400">
          Sau khi xác thực, bạn có thể đăng nhập.
        </p>
      </div>
    </div>
  );
}