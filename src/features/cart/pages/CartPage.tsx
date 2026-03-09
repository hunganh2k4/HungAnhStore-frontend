import { useEffect, useState } from "react"
import { tokenStore } from "../../../shared/api/token.store"

interface CartItem {
  id: number
  productId: number
  quantity: number
  priceSnapshot: number
  productNameSnapshot: string
  imageSnapshot: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCart = async () => {
    try {
      const token = tokenStore.get()

      const res = await fetch("http://localhost:4000/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      setCartItems(data.items || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const total = cartItems.reduce(
    (sum, item) => sum + item.priceSnapshot * item.quantity,
    0
  )

  if (loading) {
    return <div className="p-10 text-center">Loading cart...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        Giỏ hàng trống
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Giỏ hàng</h1>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-6 border rounded-xl p-4 bg-white shadow-sm"
          >
            <img
              src={item.imageSnapshot}
              className="w-24 h-24 object-contain"
            />

            <div className="flex-1">
              <h3 className="font-semibold">
                {item.productNameSnapshot}
              </h3>

              <div className="text-red-600 font-bold mt-1">
                {item.priceSnapshot.toLocaleString()}đ
              </div>

              <div className="text-gray-500 mt-1">
                Số lượng: {item.quantity}
              </div>
            </div>

            <div className="text-red-600 font-bold">
              {(item.priceSnapshot * item.quantity).toLocaleString()}đ
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="mt-10 flex justify-between items-center border-t pt-6">
        <div className="text-xl font-semibold">
          Tổng tiền:
        </div>

        <div className="text-2xl text-red-600 font-bold">
          {total.toLocaleString()}đ
        </div>
      </div>

      <button className="mt-6 w-full bg-red-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-red-700 transition">
        Thanh toán
      </button>
    </div>
  )
}