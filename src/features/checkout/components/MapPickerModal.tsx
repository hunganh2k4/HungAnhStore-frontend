import { useEffect, useRef, useState } from "react"
import L from "leaflet"

// Fix default Leaflet icon paths bị lỗi với Vite bundler
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

interface Props {
  initialAddress?: string
  onConfirm: (address: string, lat: number, lng: number) => void
  onClose: () => void
}

const DEFAULT_CENTER: [number, number] = [10.7769, 106.7009] // TP. Hồ Chí Minh
const DEFAULT_ZOOM = 13

export default function MapPickerModal({ onConfirm, onClose }: Props) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const [selectedLatLng, setSelectedLatLng] = useState<[number, number]>(DEFAULT_CENTER)
  const [resolvedAddress, setResolvedAddress] = useState<string>("")
  const [geocoding, setGeocoding] = useState(false)
  const [locating, setLocating] = useState(false)

  // Reverse geocode với Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    setGeocoding(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=vi`,
        { headers: { "Accept-Language": "vi" } }
      )
      const data = await res.json()
      setResolvedAddress(data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    } catch {
      setResolvedAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    } finally {
      setGeocoding(false)
    }
  }

  // Khởi tạo bản đồ
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current).setView(DEFAULT_CENTER, DEFAULT_ZOOM)
    mapRef.current = map

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Marker có thể kéo thả
    const marker = L.marker(DEFAULT_CENTER, { draggable: true }).addTo(map)
    markerRef.current = marker

    marker.on("dragend", () => {
      const pos = marker.getLatLng()
      setSelectedLatLng([pos.lat, pos.lng])
      reverseGeocode(pos.lat, pos.lng)
    })

    // Click bản đồ → dịch chuyển marker
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      marker.setLatLng([lat, lng])
      setSelectedLatLng([lat, lng])
      reverseGeocode(lat, lng)
    })

    // Lấy địa chỉ ban đầu
    reverseGeocode(DEFAULT_CENTER[0], DEFAULT_CENTER[1])

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Định vị người dùng
  const handleLocateMe = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([lat, lng], 16)
          markerRef.current.setLatLng([lat, lng])
        }
        setSelectedLatLng([lat, lng])
        reverseGeocode(lat, lng)
        setLocating(false)
      },
      () => {
        alert("Không thể lấy vị trí. Vui lòng cho phép quyền truy cập vị trí.")
        setLocating(false)
      }
    )
  }

  const handleConfirm = () => {
    if (!resolvedAddress) return
    onConfirm(resolvedAddress, selectedLatLng[0], selectedLatLng[1])
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <h2 className="font-bold text-gray-900 text-lg">Chọn địa điểm trên bản đồ</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition text-2xl leading-none"
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        {/* Bản đồ */}
        <div className="relative" style={{ height: "400px" }}>
          <div ref={mapContainerRef} style={{ width: "100%", height: "400px" }} />

          {/* Nút định vị */}
          <button
            onClick={handleLocateMe}
            disabled={locating}
            className="absolute top-3 right-3 z-[1000] bg-white shadow-md rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition flex items-center gap-1.5 border border-gray-200 disabled:opacity-60"
          >
            {locating ? (
              <span className="inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              "🎯"
            )}
            Định vị tôi
          </button>
        </div>

        {/* Info & Actions */}
        <div className="px-5 py-4 border-t border-gray-100 space-y-3">
          <div className="flex items-start gap-2">
            <span className="text-red-500 mt-0.5 shrink-0">📌</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">Địa chỉ đã chọn:</p>
              {geocoding ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Đang tìm địa chỉ...
                </div>
              ) : (
                <p className="text-sm text-gray-800 font-medium line-clamp-2">
                  {resolvedAddress || "Chưa chọn vị trí"}
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-400">
            💡 Click lên bản đồ hoặc kéo marker để chọn vị trí chính xác hơn.
          </p>

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={!resolvedAddress || geocoding}
              className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
            >
              ✓ Xác nhận vị trí
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
