import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { publicApi } from "../../../shared/api/http";

interface ProductImage {
  imageUrl: string;
}

interface Variant {
  price: string;
  stock: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductLine {
  id: number;
  name: string;
  slug: string;
  images: ProductImage[];
  products: Variant[];
  category: Category;
}

interface CategoryProductsProps {
  categorySlug: string;
  title: string;
}

export default function CategoryProducts({ categorySlug, title }: CategoryProductsProps) {
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await publicApi.get("/product-lines");
        const allProducts = response.data.data || [];
        // Filter by category slug
        const filtered = allProducts.filter((p: ProductLine) => p.category.slug === categorySlug);
        setProductLines(filtered.slice(0, 15)); // Increased limit for scrolling
      } catch (error) {
        console.error(`Failed to fetch products for category ${categorySlug}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categorySlug]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 600;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading || productLines.length === 0) return null;

  return (
    <div className="mt-12 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative group/section">
      <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {title}
        </h2>
        <Link
          to={`/category/${categorySlug}`}
          className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1 group"
        >
          Xem tất cả <span className="text-lg group-hover:translate-x-1 transition-transform">›</span>
        </Link>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm border border-gray-200 p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all opacity-0 group-hover/section:opacity-100 hidden md:block"
      >
        <span className="text-xl">‹</span>
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm border border-gray-200 p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all opacity-0 group-hover/section:opacity-100 hidden md:block"
      >
        <span className="text-xl">›</span>
      </button>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-4 scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {productLines.map((p) => {
          const minPrice = p.products.length > 0
            ? Math.min(...p.products.map(v => Number(v.price)))
            : 0;
          const totalStock = p.products.reduce((acc, v) => acc + (v.stock || 0), 0);

          return (
            <Link
              key={p.id}
              to={`/product/${p.slug}`}
              className="flex flex-col bg-white rounded-2xl p-6 hover:shadow-2xl transition-all group border border-gray-100 hover:border-blue-200 relative min-w-[300px] max-w-[300px]"
            >
              {totalStock === 0 && (
                <div className="absolute top-4 left-4 z-10 bg-gray-500/80 backdrop-blur-md text-white text-[11px] font-bold px-4 py-1.5 rounded-full">
                  Hết hàng
                </div>
              )}

              <div className="aspect-square bg-white rounded-xl overflow-hidden mb-6 p-4 relative">
                <img
                  src={p.images[0]?.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-800 line-clamp-2 leading-snug min-h-[48px]">
                  {p.name}
                </h3>

                <div className="flex flex-col gap-1">
                  <span className="text-red-600 font-extrabold text-xl">
                    {minPrice > 0 ? `${minPrice.toLocaleString()}đ` : "Liên hệ"}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-md font-bold">
                      -{Math.floor(Math.random() * 20) + 5}%
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {(minPrice * 1.2).toLocaleString()}đ
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex items-center gap-2 text-xs text-gray-500 border-t border-gray-50">
                  <div className="flex text-yellow-400 text-sm">
                    {"★".repeat(5)}
                  </div>
                  <span className="font-medium">(10+ đánh giá)</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
