import { lazy, Suspense, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { privateApi } from "../../../shared/api/http"

const MapPickerModal = lazy(
  () => import("../components/MapPickerModal")
)

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
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [form, setForm] = useState<CheckoutForm>({
    fullName: "",
    phone: "",
    address: "",
    note: "",
  })

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await privateApi.get("/cart")
        setCartItems(data?.items || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [])

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
      // TODO: gọi API tạo đơn hàng thật sự khi backend sẵn sàng
      console.log("Checkout info:", form, cartItems)
      alert("Đặt hàng thành công (demo).")
      navigate("/")
    } catch (error) {
      console.error(error)
      alert("Đặt hàng thất bại.")
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
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-2 space-y-4"
            >
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm sm:text-base font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {submitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
              </button>
            </form>

            {/* Tóm tắt đơn hàng */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-3">
              <div className="font-semibold text-gray-900">
                Tóm tắt đơn hàng
              </div>

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
                      <div className="text-gray-500">
                        SL: {item.quantity}
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {(item.priceSnapshot * item.quantity).toLocaleString()}đ
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Tổng thanh toán
                </span>
                <span className="text-lg font-bold text-red-600">
                  {total.toLocaleString()}đ
                </span>
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


