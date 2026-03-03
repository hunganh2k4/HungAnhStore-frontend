import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      
      {/* TOP SECTION */}
      <div className="max-w-screen-2xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            HungAnhStore
          </h2>
          <p className="text-sm leading-relaxed">
            Chuyên cung cấp sản phẩm công nghệ chính hãng với giá tốt nhất.
            Cam kết bảo hành uy tín - Giao hàng toàn quốc.
          </p>

          <div className="flex gap-4 mt-6">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 transition cursor-pointer">
              f
            </div>
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 transition cursor-pointer">
              t
            </div>
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 transition cursor-pointer">
              in
            </div>
          </div>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Hỗ trợ khách hàng
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="#" className="hover:text-white">Trung tâm trợ giúp</Link></li>
            <li><Link to="#" className="hover:text-white">Chính sách bảo hành</Link></li>
            <li><Link to="#" className="hover:text-white">Chính sách đổi trả</Link></li>
            <li><Link to="#" className="hover:text-white">Hướng dẫn mua hàng</Link></li>
          </ul>
        </div>

        {/* ABOUT */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Về chúng tôi
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="#" className="hover:text-white">Giới thiệu</Link></li>
            <li><Link to="#" className="hover:text-white">Tuyển dụng</Link></li>
            <li><Link to="#" className="hover:text-white">Điều khoản sử dụng</Link></li>
            <li><Link to="#" className="hover:text-white">Chính sách bảo mật</Link></li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Đăng ký nhận tin
          </h3>
          <p className="text-sm mb-4">
            Nhận ưu đãi và thông tin sản phẩm mới nhất.
          </p>

          <div className="flex">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-l-xl outline-none text-black text-sm"
            />
            <button className="bg-red-600 px-5 py-3 rounded-r-xl hover:bg-red-700 transition text-white text-sm font-semibold">
              Đăng ký
            </button>
          </div>
        </div>

      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-800" />

      {/* BOTTOM SECTION */}
      <div className="max-w-screen-2xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">

        <p>
          © {new Date().getFullYear()} HungAnhStore. All rights reserved.
        </p>

        <div className="flex gap-6 mt-4 md:mt-0">
          <span className="hover:text-white cursor-pointer">Điều khoản</span>
          <span className="hover:text-white cursor-pointer">Bảo mật</span>
          <span className="hover:text-white cursor-pointer">Liên hệ</span>
        </div>

      </div>
    </footer>
  );
}