import { lazy, Suspense, useEffect, useMemo, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { privateApi } from "../../../shared/api/http"
import { useCart } from "../../cart/cart.context" 

const MapPickerModal = lazy(
  () => import("../components/MapPickerModal")
)

type PaymentMethod = "ONLINE" | "COD"

interface CartItem {
  id: number
  productId: number
  quantity: number
  priceSnapshot: number
  productNameSnapshot: string
  imageSnapshot: string
}

interface CheckoutForm {
  fullName: string
  phone: string
  address: string
  note: string
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { refreshCart } = useCart()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD")
  const [form, setForm] = useState<CheckoutForm>({
    fullName: "",
    phone: "",
    address: "",
    note: "",
  })

  const { search } = useLocation()
  const selectedIds = useMemo(() => {
    const query = new URLSearchParams(search)
    return query.get("ids")?.split(",").map(Number) || []
  }, [search])

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await privateApi.get("/cart")
        const allItems = data?.items || []
        const filtered = selectedIds.length > 0
          ? allItems.filter((item: CartItem) => selectedIds.includes(item.id))
          : allItems
        setCartItems(filtered)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [selectedIds])

  const total = cartItems.reduce(
    (sum, item) => sum + item.priceSnapshot * item.quantity,
    0
  )

  const handleChange =
    (field: keyof CheckoutForm) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
      }

  const handleMapConfirm = (address: string) => {
    setForm((prev) => ({ ...prev, address }))
    setShowMap(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName || !form.phone || !form.address) {
      alert("Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ.")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.productNameSnapshot,
          productImage: item.imageSnapshot,
          quantity: item.quantity,
          price: item.priceSnapshot,
        })),
      }

      const { data: orderResponse } = await privateApi.post("/orders", payload)

      if (paymentMethod === "ONLINE") {
        try {
          const { data: paymentResponse } = await privateApi.get(`/payment/${orderResponse.id}/url`)
          alert(paymentResponse);
          if (paymentResponse.success && paymentResponse.url) {
            window.location.href = paymentResponse.url
            return
          } else {
            alert("Lỗi khi tạo link thanh toán.")
            navigate("/")
          }
        } catch (paymentError) {
          console.error("Lỗi thanh toán:", paymentError)
          alert("Lỗi khi tạo link thanh toán. Vui lòng thử lại sau.")
        }
      } else {
        alert("Đặt hàng thành công!")
        await refreshCart()
        navigate("/")
      }
    } catch (error) {
      console.error(error)
      alert("Đặt hàng thất bại. Vui lòng thử lại.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-10 text-center">Đang tải giỏ hàng...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        Giỏ hàng trống, không thể thanh toán.
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-red-600 text-base sm:text-lg font-medium"
            >
              ❮ Quay lại giỏ hàng
            </button>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">
              Xác nhận thông tin đặt hàng
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form thông tin */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  placeholder="Nhập họ và tên người nhận"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại người nhận
                </label>
                <input
                  type="tel"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="Ví dụ: 09xxxxxxxx"
                />
              </div>

              {/* Địa chỉ + nút bản đồ */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Địa chỉ nhận hàng
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowMap(true)}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg px-2 py-1 transition"
                  >
                    <span>📍</span>
                    Chọn trên bản đồ
                  </button>
                </div>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={form.address}
                  onChange={handleChange("address")}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú (không bắt buộc)
                </label>
                <textarea
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows={3}
                  value={form.note}
                  onChange={handleChange("note")}
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                />
              </div>

              {/* Phương thức thanh toán */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("COD")}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 transition-all ${paymentMethod === "COD"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                  >
                    <span className="text-2xl">💵</span>
                    <div className="text-center">
                      <div className="font-semibold text-sm">Tiền mặt</div>
                      <div className="text-xs opacity-70">
                        Thanh toán khi nhận hàng (COD)
                      </div>
                    </div>
                    {paymentMethod === "COD" && (
                      <span className="text-xs font-bold text-red-600 bg-red-100 rounded-full px-2 py-0.5">
                        Đã chọn ✓
                      </span>
                    )}
                  </button>

                  {/* ONLINE */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("ONLINE")}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 transition-all ${paymentMethod === "ONLINE"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                  >
                    <span className="text-2xl">💳</span>
                    <div className="text-center">
                      <div className="font-semibold text-sm">Thanh toán Online</div>
                      <div className="text-xs opacity-70">
                        Chuyển khoản / Ví điện tử
                      </div>
                    </div>
                    {paymentMethod === "ONLINE" && (
                      <span className="text-xs font-bold text-red-600 bg-red-100 rounded-full px-2 py-0.5">
                        Đã chọn ✓
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm sm:text-base font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Xác nhận đặt hàng
                    <span className="text-xs font-normal opacity-80">
                      ({paymentMethod === "COD" ? "Tiền mặt" : "Online"})
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Tóm tắt đơn hàng */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-3">
              <div className="font-semibold text-gray-900">Tóm tắt đơn hàng</div>

              <div className="max-h-64 overflow-y-auto space-y-2 text-sm">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="line-clamp-2 text-gray-800">
                        {item.productNameSnapshot}
                      </div>
                      <div className="text-gray-500">SL: {item.quantity}</div>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {(item.priceSnapshot * item.quantity).toLocaleString()}đ
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-500">
                  <span>Phương thức</span>
                  <span className="font-medium text-gray-700">
                    {paymentMethod === "COD" ? "💵 Tiền mặt" : "💳 Online"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tổng thanh toán</span>
                  <span className="text-lg font-bold text-red-600">
                    {total.toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Picker Modal */}
      {showMap && (
        <Suspense fallback={null}>
          <MapPickerModal
            initialAddress={form.address}
            onConfirm={handleMapConfirm}
            onClose={() => setShowMap(false)}
          />
        </Suspense>
      )}
    </div>
  )
}
