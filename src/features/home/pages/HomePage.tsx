import Sidebar from "../components/Sidebar";
import HeroBanner from "../components/HeroBanner";
import RightPanel from "../components/RightPanel";
import { useState } from "react";

export default function Home() {
  const topProducts = [
    { 
      id: 1, 
      title: "GALAXY S26 ULTRA", 
      subtitle: "Đặt trước ưu đãi khủng", 
      image: "https://via.placeholder.com/500x350?text=Samsung",
      color: "from-blue-300 to-blue-200" 
    },
    { 
      id: 2, 
      title: "IPHONE 17 PRO MAX", 
      subtitle: "Trọn Tết, Vẹn Tính Hoa", 
      image: "https://via.placeholder.com/500x350?text=iPhone",
      color: "from-gray-300 to-gray-200" 
    },
  ];

  const bottomProducts = [
    { id: 1, name: "Galaxy A17 5G", price: "5.89", badge: "Học sinh - Sinh viên Giảm thêm 7% tối đa 700K" },
    { id: 2, name: "Apple Watch SE3 | SE2", price: "4.99 Triệu", badge: "Giá chỉ từ" },
    { id: 3, name: "Mua Laptop Online", price: "Giảm 5 đến thêm 5 Triệu + FREE SHIP", badge: "" },
  ];

  const [activeProduct, setActiveProduct] = useState(topProducts[0]);

  return (
    <main className="bg-gray-100 py-6">
      <div className="max-w-screen-2xl mx-auto px-4 border border-gray-300 rounded-2xl">

        <div className="flex gap-4 py-4">

          {/* ===== Sidebar ===== */}
          <div className="w-60 shrink-0">
            <Sidebar />
          </div>

          {/* ===== CENTER CONTENT ===== */}
          <div className="flex-1 flex flex-col gap-4 pl-5">

            {/* Top Products Tabs */}
            <div className="grid grid-cols-2 gap-4">
              {topProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setActiveProduct(product)}
                  className={`cursor-pointer rounded-lg p-4 text-center transition
                    ${activeProduct.id === product.id
                      ? "bg-red-100 border border-red-500"
                      : "bg-white hover:bg-gray-100"}
                  `}
                >
                  <div className="text-sm font-semibold">
                    {product.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {product.subtitle}
                  </div>
                </div>
              ))}
            </div>

            {/* Hero Banner */}
            <HeroBanner product={activeProduct} />

          </div>

          {/* ===== Right Panel ===== */}
          <div className="w-72 shrink-0">
            <RightPanel />
          </div>

        </div>

        {/* ===== Bottom Products ===== */}
        <div className="grid grid-cols-3 gap-4 pb-4">
          {bottomProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg p-4 shadow">
              <div className="font-semibold mb-2">{product.name}</div>
              <div className="text-red-600 font-bold mb-2">
                {product.price}
              </div>
              {product.badge && (
                <div className="text-xs text-gray-600">
                  {product.badge}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}