import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  User,
  CreditCard
} from "lucide-react";
import { privateApi } from "../../../shared/api/http";

const statusViMap: Record<string, string> = {
  CREATED: "Chờ tạo",
  RESERVED: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang vận chuyển",
  DELIVERED: "Đã giao hàng",
  CANCELLED: "Đã huỷ",
};

const statusSteps = ["CREATED", "RESERVED", "CONFIRMED", "SHIPPING", "DELIVERED"];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const res = await privateApi.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Fetch order detail error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrderDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-gray-500 gap-4">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <p className="font-medium">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-gray-500 gap-6">
        <div className="bg-gray-50 p-6 rounded-full">
          <Package size={64} className="text-gray-300" />
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">Không tìm thấy đơn hàng</p>
          <p className="text-sm">Đơn hàng không tồn tại hoặc bạn không có quyền xem.</p>
        </div>
        <button
          onClick={() => navigate("/profile/order-history")}
          className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="bg-white min-h-[600px] flex flex-col animate-in fade-in duration-500 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/profile/order-history")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 uppercase">Chi tiết đơn hàng</h2>
            <p className="text-xs text-gray-400 font-bold tracking-widest mt-0.5">#{order.id.slice(0, 12).toUpperCase()}</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-full font-black text-xs uppercase tracking-wider ${isCancelled ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600 shadow-sm"
          }`}>
          {statusViMap[order.status] || order.status}
        </div>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto">
        {/* Progress Timeline (Hidden for Cancelled) */}
        {!isCancelled && (
          <div className="py-6 px-4">
            <div className="relative flex justify-between">
              {/* Line background */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2" />
              {/* Active line */}
              <div
                className="absolute top-1/2 left-0 h-1 bg-red-600 -translate-y-1/2 transition-all duration-1000"
                style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
              />

              {statusSteps.map((step, idx) => {
                const isActive = idx <= currentStatusIndex;
                const isCompleted = idx < currentStatusIndex;

                return (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${isActive
                      ? "bg-white border-red-600 text-red-600 scale-110 shadow-lg shadow-red-100"
                      : "bg-gray-100 border-white text-gray-400"
                      }`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : (
                        idx === 0 ? <Clock className="w-5 h-5" /> :
                          idx === 3 ? <Truck className="w-5 h-5" /> :
                            <Package className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-tighter text-center transition-colors ${isActive ? "text-red-600" : "text-gray-400"
                      }`}>
                      {statusViMap[step]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Shipping & Payment Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4 shadow-inner">
            <div className="flex items-center gap-3 text-red-600 font-bold">
              <MapPin size={22} />
              <h3 className="text-lg font-semibold uppercase tracking-tight text-gray-800">Thông tin giao hàng</h3>
            </div>
            <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-400" />
                <span className="font-semibold text-gray-700">{order.userName || "Người nhận"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400" />
                <span className="font-semibold text-gray-700">{order.phone || "Chưa có số điện thoại"}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 shrink-0 mt-1" />
                <span className="text-sm font-semibold text-gray-600 leading-relaxed">
                  {order.shippingAddress || "Chưa cập nhật địa chỉ"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4 shadow-inner">
            <div className="flex items-center gap-3 text-red-600 font-bold">
              <CreditCard size={22} />
              <h3 className="text-lg font-semibold uppercase tracking-tight text-gray-800">Thanh toán</h3>
            </div>
            <div className="space-y-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-full max-h-[140px]">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Phương thức:</span>
                <span className="font-bold text-gray-700 uppercase tracking-tighter">Thanh toán khi nhận hàng (COD)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Trạng thái:</span>
                <span className="text-orange-500 font-semibold uppercase tracking-tighter">Chưa thanh toán</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Items */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-600 font-bold mb-2">
            <Package size={22} />
            <h3 className="text-lg font-semibold uppercase tracking-tight text-gray-800">Sản phẩm đã chọn</h3>
          </div>
          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {order.items?.map((item: any, idx: number) => (
              <div
                key={item.id || idx}
                className={`p-5 flex gap-5 bg-white transition hover:bg-gray-50 border-b last:border-0 border-gray-50`}
              >
                <div className="w-24 h-24 bg-white rounded-xl border border-gray-100 p-2 shadow-sm shrink-0 group">
                  <img
                    src={item.productImage || "https://cellphones.com.vn/smember/_nuxt/img/NoOrder.8066f91.png"}
                    alt={item.productName}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h4 className="font-bold text-gray-800 text-base leading-tight hover:text-red-600 transition tracking-tight">
                      {item.productName || "Sản phẩm không tên"}
                    </h4>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-black text-gray-400">x{item.quantity}</span>
                    <div className="text-red-600 font-black text-lg tracking-tight">
                      {item.price.toLocaleString()} đ
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-800 rounded-3xl p-8 text-white space-y-5 shadow-2xl shadow-black/40">
          <div className="space-y-3 opacity-80">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Tổng tiền hàng:</span>
              <span className="font-bold">{(order.totalPrice || 0).toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Phí vận chuyển:</span>
              <span className="font-bold">0 đ</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium font-black text-red-400">Giảm giá:</span>
              <span className="font-bold text-red-400">-0 đ</span>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-semibold uppercase tracking-tighter italic">Tổng thanh toán:</span>
            <div className="text-3xl font-semibold text-red-500 tracking-tighter drop-shadow-sm">
              {(order.totalPrice || 0).toLocaleString()} <span className="text-xl">đ</span>
            </div>
          </div>
        </div>

        {/* Final Actions */}
        <div className="flex gap-4 pt-4 pb-8">
          <button className="flex-1 bg-gray-100 text-gray-600 font-semibold py-4 rounded-2xl hover:bg-gray-200 transition active:scale-[0.98] uppercase tracking-wider text-sm">
            Cần hỗ trợ?
          </button>
          {(order.status === 'CREATED' || order.status === 'RESERVED') && (
            <button className="flex-1 bg-red-600 text-white font-semibold py-4 rounded-2xl hover:bg-red-700 shadow-lg shadow-red-100 transition active:scale-[0.98] uppercase tracking-wider text-sm">
              Huỷ đơn hàng
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
