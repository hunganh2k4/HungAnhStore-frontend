export default function RightPanel() {
  return (
    <div className="w-72 space-y-4">

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">
          Chào mừng bạn đến với CellphoneS
        </h3>
        <button className="text-red-600">
          Đăng nhập / Đăng ký
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">
          Ưu đãi cho giáo dục
        </h3>
        <ul className="space-y-2 text-sm">
          <li>Đăng ký nhận ưu đãi</li>
          <li>Deal hot học sinh</li>
          <li>Laptop ưu đãi khủng</li>
        </ul>
      </div>

    </div>
  );
}