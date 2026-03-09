import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { tokenStore } from "../../../shared/api/token.store"

/* ================= TYPES ================= */

interface Brand {
  id: number
  name: string
  slug: string
  logo?: string
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
  brand: Brand
  images?: string[]
  products?: Variant[],
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

    const productLineImages = product.images || []
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
    
  
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ================= LEFT - GALLERY ================= */}
        <div>
          <div className="bg-white rounded-2xl shadow p-6">
            {selectedImage ? (
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
          <div className="flex gap-3 mt-4 flex-wrap">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`border rounded-xl p-1 transition ${
                  selectedImage === img
                    ? "border-red-600"
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

              <div className="flex flex-wrap gap-3">
                {product.products.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant)
                      setSelectedImage(variant.imageUrl)
                    }}
                    className={`px-4 py-2 rounded-xl border transition ${
                      selectedVariant?.id === variant.id
                        ? "border-red-600 bg-red-50"
                        : "border-gray-200 hover:border-red-400"
                    }`}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl text-lg font-semibold transition">
              Mua ngay
            </button>

            <button 
              onClick={handleAddToCart}
              className="flex-1 border border-red-600 text-red-600 py-4 rounded-2xl font-semibold hover:bg-red-50 transition"
            >
              Thêm vào giỏ
            </button>
          </div>

          {/* DESCRIPTION */}
          {product.description && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-3">
                Mô tả sản phẩm
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* ================= TECHNICAL SPECIFICATIONS ================= */}
    {product.attributes && product.attributes.length > 0 && (
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <h3 className="text-2xl font-bold mb-6">
          Thông số kỹ thuật
        </h3>

        <div className="rounded-2xl shadow overflow-hidden border">
          {product.attributes.map((attr) => (
            <div
              key={attr.id}
              className="grid grid-cols-3"
            >
              {/* Tên thông số - nền xám */}
              <div className="col-span-1 bg-gray-100 px-6 py-4 text-gray-700 font-medium border-b border-r">
                {attr.name}
              </div>

              {/* Giá trị - nền trắng */}
              <div className="col-span-2 bg-white px-6 py-4 text-gray-900 border-b">
                {attr.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
    </>
  )
}