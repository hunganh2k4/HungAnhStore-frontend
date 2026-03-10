import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { privateApi } from "../../../shared/api/http"

interface CartItem {
  id: number
  productId: number
  quantity: number
  priceSnapshot: number
  productNameSnapshot: string
  imageSnapshot: string
}

export default function CartPage() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [mutatingItemIds, setMutatingItemIds] = useState<
    Record<number, boolean>
  >({})
  const [selectedItemIds, setSelectedItemIds] = useState<
    Record<number, boolean>
  >({})

  const fetchCart = async () => {
    try {
      const { data } = await privateApi.get("/cart")
      const items = data?.items || []
      setCartItems(items)
      setSelectedItemIds((prev) => {
        const next: Record<number, boolean> = {}
        for (const item of items) {
          next[item.id] = prev[item.id] ?? true
        }
        return next
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const total = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.priceSnapshot * item.quantity,
      0
    )
  }, [cartItems])

  const selectedItems = useMemo(() => {
    return cartItems.filter((i) => selectedItemIds[i.id])
  }, [cartItems, selectedItemIds])

  const selectedTotal = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + item.priceSnapshot * item.quantity,
      0
    )
  }, [selectedItems])

  const allSelected = useMemo(() => {
    return cartItems.length > 0 && selectedItems.length === cartItems.length
  }, [cartItems.length, selectedItems.length])

  const setMutating = (itemId: number, value: boolean) => {
    setMutatingItemIds((prev) => ({ ...prev, [itemId]: value }))
  }

  const removeItem = async (itemId: number) => {
    setMutating(itemId, true)
    try {
      await privateApi.delete(`/cart/items/${itemId}`)
      await fetchCart()
    } catch (error) {
      console.error(error)
      alert("Xóa sản phẩm khỏi giỏ hàng thất bại")
    } finally {
      setMutating(itemId, false)
    }
  }

  const removeSelected = async () => {
    const ids = selectedItems.map((i) => i.id)
    if (ids.length === 0) return

    setMutatingItemIds((prev) => {
      const next = { ...prev }
      ids.forEach((id) => {
        next[id] = true
      })
      return next
    })

    try {
      await Promise.all(ids.map((id) => privateApi.delete(`/cart/items/${id}`)))
      await fetchCart()
    } catch (error) {
      console.error(error)
      alert("Xóa sản phẩm đã chọn thất bại")
    } finally {
      setMutatingItemIds((prev) => {
        const next = { ...prev }
        ids.forEach((id) => {
          delete next[id]
        })
        return next
      })
    }
  }

  const changeQuantity = async (item: CartItem, delta: number) => {
    if (delta === 0) return
    if (item.quantity + delta <= 0) {
      return removeItem(item.id)
    }

    setMutating(item.id, true)
    try {
      await privateApi.post("/cart/items", {
        productId: item.productId,
        quantity: delta,
        priceSnapshot: item.priceSnapshot,
        productNameSnapshot: item.productNameSnapshot,
        imageSnapshot: item.imageSnapshot,
      })
      await fetchCart()
    } catch (error) {
      console.error(error)
      alert("Cập nhật số lượng thất bại")
    } finally {
      setMutating(item.id, false)
    }
  }

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
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pt-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-5">
            {/* HEADER */}
            <div className="flex items-center justify-center relative mb-5">
            <button
              type="button"
              className="absolute left-0 w-14 h-14 rounded-2xl hover:bg-gray-100 text-3xl flex items-center justify-center"
              onClick={() => navigate(-1)}
              aria-label="Quay lại"
            >
              ❮
            </button>
              <div className="font-bold text-gray-900 text-xl sm:text-2xl">
                <span className="inline-block pb-1 border-b-2 border-red-600">
                  Giỏ hàng của bạn
                </span>
              </div>
            </div>

            {/* ACTION BAR */}
            <div className="px-1 py-1 flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-base text-gray-700 select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => {
                    const checked = e.target.checked
                    setSelectedItemIds(() => {
                      const next: Record<number, boolean> = {}
                      cartItems.forEach((i) => {
                        next[i.id] = checked
                      })
                      return next
                    })
                  }}
                  className="h-4 w-4 accent-red-600 bg-transparent"
                />
                Bỏ chọn tất cả
              </label>

              <button
                type="button"
                className="text-base text-gray-400 hover:text-red-600 disabled:opacity-50"
                disabled={selectedItems.length === 0}
                onClick={removeSelected}
              >
                Xóa sản phẩm đã chọn
              </button>
            </div>

            {/* LIST */}
            <div className="space-y-3 pb-24">
              {cartItems.map((item) => {
                const isMutating = !!mutatingItemIds[item.id]
                const isSelected = !!selectedItemIds[item.id]

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          const checked = e.target.checked
                          setSelectedItemIds((prev) => ({
                            ...prev,
                            [item.id]: checked,
                          }))
                        }}
                        className="mt-2 h-4 w-4 accent-red-600"
                        disabled={isMutating}
                      />

                      <img
                        src={item.imageSnapshot}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg bg-gray-50"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 line-clamp-2 text-base sm:text-lg">
                              {item.productNameSnapshot}
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <div className="text-red-600 font-bold text-base sm:text-lg">
                                {item.priceSnapshot.toLocaleString()}đ
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <button
                              type="button"
                              className="p-2 rounded-lg hover:bg-gray-50 text-gray-500 hover:text-red-600 disabled:opacity-50"
                              disabled={isMutating}
                              onClick={() => removeItem(item.id)}
                              aria-label="Xóa sản phẩm"
                              title="Xóa"
                            >
                              🗑️
                            </button>

                            <div className="inline-flex items-center rounded-lg overflow-hidden">
                              <button
                                type="button"
                                className="w-9 h-9 grid place-items-center bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                disabled={isMutating}
                                onClick={() => changeQuantity(item, -1)}
                                aria-label="Giảm số lượng"
                              >
                                -
                              </button>

                              <div className="w-10 h-9 grid place-items-center bg-white text-base font-semibold">
                                {item.quantity}
                              </div>

                              <button
                                type="button"
                                className="w-9 h-9 grid place-items-center bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                disabled={isMutating}
                                onClick={() => changeQuantity(item, +1)}
                                aria-label="Tăng số lượng"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* SUMMARY (inside wrapper) */}
          <div className="sticky bottom-0 border-t bg-white/95 backdrop-blur">
            <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-base text-gray-600">
                  Tạm tính:
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {(selectedItems.length > 0 ? selectedTotal : total).toLocaleString()}
                  đ
                </div>
              </div>

              <button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold text-base sm:text-lg transition disabled:opacity-50"
                disabled={selectedItems.length === 0}
                onClick={() => navigate("/checkout")}
              >
                Mua ngay ({selectedItems.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}