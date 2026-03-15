import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ViewedProduct {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: string | number;
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState<ViewedProduct[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse recently viewed products:", e);
      }
    }
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Sản phẩm đã xem</h2>
      
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/product-lines/slug/${p.slug}`}
            className="flex-shrink-0 w-80 bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 hover:shadow-md transition group"
          >
            <div className="w-20 h-20 shrink-0 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src={p.image}
                alt={p.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            
            <div className="flex flex-col justify-center min-w-0">
              <h3 className="font-semibold text-gray-800 truncate mb-1 text-[15px]">
                {p.name}
              </h3>
              <div className="text-red-600 font-bold text-lg">
                {Number(p.price).toLocaleString()}đ
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
