import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { privateApi } from "../../../shared/api/http";

const tabs = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ xác nhận" },
  { id: "confirmed", label: "Đã xác nhận" },
  { id: "shipping", label: "Đang vận chuyển" },
  { id: "delivered", label: "Đã giao hàng" },
  { id: "cancelled", label: "Đã huỷ" },
];

const tabStatusMap: Record<string, string[]> = {
  all: [],
  pending: ["CREATED", "RESERVED"],
  confirmed: ["CONFIRMED"],
  shipping: ["SHIPPING"],
  delivered: ["DELIVERED"],
  cancelled: ["CANCELLED"],
};

// 🇻🇳 Label tiếng Việt
const statusViMap: Record<string, string> = {
  CREATED: "Chờ tạo",
  RESERVED: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang vận chuyển",
  DELIVERED: "Đã giao hàng",
  CANCELLED: "Đã huỷ",
};

// 🎨 Màu status
const statusColorMap: Record<string, string> = {
  CREATED: "text-yellow-500",
  RESERVED: "text-orange-500",
  CONFIRMED: "text-blue-500",
  SHIPPING: "text-indigo-500",
  DELIVERED: "text-green-600",
  CANCELLED: "text-red-500",
};

export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // RESET PAGE WHEN CHANGE TAB
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  // FETCH ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await privateApi.get("/orders/my-orders", {
          params: {
            page,
            limit: 4,
          },
        });

        setOrders(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Fetch orders error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, activeTab]);

  // FILTER (frontend filter nếu backend chưa hỗ trợ status)
  const filteredOrders = useMemo(() => {
    const statusList = tabStatusMap[activeTab];

    if (!statusList.length) return orders;

    return orders.filter((order) =>
      statusList.includes(order.status)
    );
  }, [orders, activeTab]);

  return (
    <div className="bg-white min-h-[600px] flex flex-col">
      {/* TABS */}
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-medium transition ${activeTab === tab.id
              ? "text-red-600 font-bold border-b-2 border-red-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-6">
        <h2 className="text-xl font-bold">Lịch sử mua hàng</h2>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-500">Đang tải đơn hàng...</p>
        )}

        {/* EMPTY */}
        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            Không có đơn hàng
          </div>
        )}

        {/* ORDER LIST */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-4 hover:shadow transition"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">
                  Mã đơn: {order.id.slice(0, 8)}...
                </p>

                <span
                  className={`text-sm font-semibold ${statusColorMap[order.status]
                    }`}
                >
                  {statusViMap[order.status] || order.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Tổng tiền:{" "}
                <span className="font-medium text-gray-700">
                  {order.totalPrice.toLocaleString()} đ
                </span>
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {order.items?.length || 0} sản phẩm
              </p>

              <Link
                to={`/profile/order-history/${order.id}`}
                className="text-red-600 text-sm mt-3 inline-block hover:underline"
              >
                Xem chi tiết →
              </Link>
            </div>
          ))}
        </div>

        {/* PAGINATION CENTER */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm font-medium">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}