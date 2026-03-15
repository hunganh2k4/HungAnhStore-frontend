import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { tokenStore } from "../../../shared/api/token.store"
import { useCart } from "../../cart/cart.context"

/* ================= TYPES ================= */

interface Brand {
  id: number
  name: string
  slug: string
  logo?: string
}

interface ProductImage {
  id: number
  imageUrl: string
  isMain: boolean
}


interface Variant {
  id: number
  sku: string
  color: string
  price: string
  imageUrl: string
  stock: number
}


interface ProductAttribute {
  id: number
  name: string
  value: string
}

interface ProductLine {
  id: number
  name: string
  slug: string
  description?: string
  contentHtml?: string
  videoReviewUrl?: string
  brand: Brand
  images?: ProductImage[]
  products?: Variant[]
  category: {
    id: number
    name: string
    slug: string
  }
  attributes?: ProductAttribute[]
}

/* ================= COMPONENT ================= */

export default function ProductDetail() {
  const { slug } = useParams()

  const [product, setProduct] = useState<ProductLine | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const { refreshCart } = useCart()

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/
      const match = url.match(regExp)
      const videoId = match && match[2].length === 11 ? match[2] : null
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&controls=1`
      }
    } catch (e) {
      console.error("Invalid YouTube URL:", url)
    }
    return ""
  }

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    if (!slug) return

    setLoading(true)

    fetch(`http://localhost:4000/product-lines/slug/${slug}`)
      .then(res => res.json())
      .then((data: ProductLine) => {
        setProduct(data)

        // Nếu có variant -> chọn variant đầu tiên
        if (data.products && data.products.length > 0) {
          setSelectedVariant(data.products[0])
        } else {
          setSelectedVariant(null)
        }

        setLoading(false)
      })
  }, [slug])

  /* ================= GỘP ẢNH ================= */

  const allImages = useMemo(() => {
    if (!product) return []

    const productLineImages = product.images?.map(img => img.imageUrl) || []
    const variantImages =
      product.products?.map(v => v.imageUrl) || []

    // Ưu tiên productLineImages trước
    const merged = [...productLineImages, ...variantImages]

    // Loại trùng
    return Array.from(new Set(merged))
  }, [product])

  /* ================= AUTO CHỌN ẢNH ĐẦU ================= */

  useEffect(() => {
    if (allImages.length > 0) {
      setSelectedImage(allImages[0])
    } else {
      setSelectedImage("")
    }
  }, [allImages])

  /* ================= LƯU SẢN PHẨM ĐÃ XEM ================= */
  useEffect(() => {
    if (!product || allImages.length === 0) return

    try {
      const stored = localStorage.getItem("recentlyViewed")
      const recentlyViewed = stored ? JSON.parse(stored) : []

      const newItem = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        image: allImages[0],
        price: product.products?.[0]?.price || "0"
      }

      // Loại trùng (theo id) và giới hạn 10 sản phẩm mới nhất
      const updated = [
        newItem,
        ...recentlyViewed.filter((item: any) => item.id !== product.id)
      ].slice(0, 10)

      localStorage.setItem("recentlyViewed", JSON.stringify(updated))
    } catch (error) {
      console.error("Error saving recently viewed product:", error)
    }
  }, [product, allImages])

  /* ================= LOADING ================= */

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>
  }

  if (!product) {
    return (
      <div className="p-10 text-center">
        Không tìm thấy sản phẩm
      </div>
    )
  }


  const handleAddToCart = async () => {
    if (!selectedVariant || !product) return

    try {
      const token = tokenStore.get()

      const body = {
        productId: selectedVariant.id,
        quantity: 1,
        priceSnapshot: Number(selectedVariant.price),
        productNameSnapshot: `${product.name} - ${selectedVariant.color}`,
        imageSnapshot: selectedVariant.imageUrl || selectedImage,
      }

      const res = await fetch("http://localhost:4000/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Add cart failed")

      await refreshCart()
      alert("Đã thêm vào giỏ hàng")
    } catch (error) {
      console.error(error)
      alert("Thêm giỏ hàng thất bại")
    }
  }

  /* ================= RENDER ================= */

  return (
    <>
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        {/* ================= BREADCRUMB ================= */}
        <div className="mb-6 text-[15px] text-gray-500 flex flex-wrap items-center gap-2">
          <Link to="/" className="hover:text-red-600">
            Trang chủ
          </Link>

          <span>/</span>

          <Link
            to={`/category/${product.category.slug}`}
            className="hover:text-red-600"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <Link
            to={`/category/${product.category.slug}?brand=${product.brand.slug}`}
            className="hover:text-red-600"
          >
            {product.brand.name}
          </Link>

          <span>/</span>

          <span className="font-semibold hover:text-red-600 cursor-pointer">
            {product.name}
          </span>

        </div>

      </div>


      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ================= LEFT - GALLERY ================= */}
          <div>
            <div className="bg-white rounded-2xl shadow p-6">
              {selectedImage === "video" && product.videoReviewUrl ? (
                <div className="w-full h-[450px] bg-black rounded-xl overflow-hidden">
                  <iframe
                    src={getYouTubeEmbedUrl(product.videoReviewUrl)}
                    className="w-full h-full"
                    title={product.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-[450px] object-contain"
                />
              ) : (
                <div className="h-[450px] flex items-center justify-center text-gray-400">
                  Không có hình ảnh
                </div>
              )}
            </div>

            {/* Thumbnail */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 custom-scrollbar">
              {/* Video Thumbnail */}
              {product.videoReviewUrl && (
                <button
                  onClick={() => setSelectedImage("video")}
                  className={`flex-shrink-0 border rounded-xl p-1 transition flex flex-col items-center justify-center bg-gray-50 min-w-[72px] ${selectedImage === "video"
                    ? "border-red-600 ring-1 ring-red-600"
                    : "border-gray-200"
                    }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-gray-600 border-b-[5px] border-b-transparent ml-1"></div>
                    </div>
                    <span className="text-[12px] font-bold text-black-600">Video</span>
                  </div>
                </button>
              )}

              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 border rounded-xl p-1 transition ${selectedImage === img
                    ? "border-red-600 ring-1 ring-red-600"
                    : "border-gray-200"
                    }`}
                >
                  <img
                    src={img}
                    className="w-16 h-16 object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ================= RIGHT - INFO ================= */}
          <div>
            {/* NAME */}
            <h1 className="text-3xl font-bold mb-3">
              {product.name}
            </h1>

            {/* PRICE */}
            <div className="text-3xl font-bold text-red-600 mb-4">
              {selectedVariant
                ? Number(selectedVariant.price).toLocaleString() + "đ"
                : "Liên hệ"}
            </div>

            {/* STOCK */}
            {selectedVariant && (
              <div className="mb-6">
                <span className="text-gray-600">
                  Tồn kho:
                </span>{" "}
                <span className="font-semibold">
                  {selectedVariant.stock}
                </span>
              </div>
            )}

            {/* VARIANTS */}
            {product.products && product.products.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">
                  Màu sắc
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.products.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => {
                          setSelectedVariant(variant)
                          setSelectedImage(variant.imageUrl)
                        }}
                        className={`relative flex items-center gap-4 p-4 rounded-xl border transition text-left h-full ${isSelected
                          ? "border-red-600 bg-white"
                          : "border-gray-200 hover:border-red-400 bg-white"
                          }`}
                      >
                        <img
                          src={variant.imageUrl}
                          alt={variant.color}
                          className="w-14 h-14 object-contain"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[15px] truncate">{variant.color}</div>
                          <div className="text-[14px] text-gray-700">
                            {Number(variant.price).toLocaleString()}đ
                          </div>
                        </div>

                        {/* Checkmark icon at top right */}
                        {isSelected && (
                          <div className="absolute top-0 right-0 bg-red-600 text-white rounded-bl-lg rounded-tr-xl p-0.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {/* ACTION BUTTONS */}
            <div className="flex gap-4 mt-8">
              {selectedVariant && selectedVariant.stock > 0 ? (
                <>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl text-lg font-semibold transition">
                    Mua ngay
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 border border-red-600 text-red-600 py-4 rounded-2xl font-semibold hover:bg-red-50 transition"
                  >
                    Thêm vào giỏ
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-gray-200 text-gray-500 py-4 rounded-2xl text-lg font-semibold cursor-not-allowed"
                >
                  Sản phẩm chưa có hàng
                </button>
              )}
            </div>

            {/* SHORT DESCRIPTION - RESTORED */}
            {product && product.description && (
              <div className="mt-8 pt-8 border-t border-gray-100 text-left">
                <h3 className="text-lg font-bold mb-3 text-gray-800">
                  Mô tả ngắn
                </h3>
                <p className="text-gray-600 leading-relaxed italic">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM SECTION: SPECS & CONTENT ================= */}
      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start text-left">

          {/* LEFT: TECHNICAL SPECIFICATIONS */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-24">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Thông số kỹ thuật
            </h3>
            {product.attributes && product.attributes.length > 0 ? (
              <div className="rounded-2xl overflow-hidden border border-gray-50">
                {product.attributes.map((attr) => (
                  <div key={attr.id} className="grid grid-cols-2 border-b border-gray-50 last:border-0">
                    <div className="bg-gray-50/50 px-4 py-3 text-gray-600 font-medium text-sm">
                      {attr.name}
                    </div>
                    <div className="bg-white px-4 py-3 text-gray-900 text-sm">
                      {attr.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">Đang cập nhật thông số...</p>
            )}
          </div>

          {/* RIGHT: DETAILED CONTENT (HTML) */}
          <div className="lg:col-span-2 text-left">
            {(product.contentHtml || product.description) && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div
                  className={`p-10 transition-all duration-500 ease-in-out ${!isExpanded ? "max-h-[650px] overflow-hidden" : "max-h-full pb-32"
                    }`}
                >
                  <h3 className="text-2xl font-bold mb-8 text-gray-800 border-b border-gray-50 pb-4">
                    {product.contentHtml ? "Đặc điểm nổi bật" : "Mô tả sản phẩm"}
                  </h3>

                  {product.contentHtml ? (
                    <div
                      className="prose prose-lg max-w-none text-gray-700
                        prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mb-4
                        prose-img:rounded-3xl prose-img:shadow-xl prose-img:mx-auto prose-img:my-8
                        prose-p:leading-relaxed prose-p:mb-6"
                      dangerouslySetInnerHTML={{ __html: product.contentHtml }}
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Gradient & Toggle Button */}
                <div className={`absolute bottom-0 left-0 right-0 flex justify-center items-end pb-8 transition-all ${!isExpanded ? "pt-40 bg-gradient-to-t from-white via-white/95 to-transparent" : "pt-10"
                  }`}>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="bg-white border-2 border-blue-600 text-black-600 px-10 py-3 rounded-full font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-blue-100 flex items-center gap-2 group"
                  >
                    {isExpanded ? (
                      <>
                        Thu gọn <span className="text-xl group-hover:-translate-y-1 transition-transform">↑</span>
                      </>
                    ) : (
                      <>
                        Xem thêm nội dung <span className="text-xl group-hover:translate-y-1 transition-transform">↓</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}