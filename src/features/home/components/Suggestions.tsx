

const SUGGESTED_PRODUCTS = [
  {
    id: 1,
    name: "Laptop ASUS Vivobook S14 S3407VA-LY053W",
    specs: ["i7-13620H", "Intel UHD", "16GB 512GB", '14" WUXGA'],
    price: 22690000,
    originalPrice: 25990000,
    discount: "13%",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/a/laptop-asus-vivobook-s-14-s3407va-ly053w-thumbnails.png",
    promo: "S-Student giảm thêm 500.000đ",
  },
  {
    id: 2,
    name: "Laptop ASUS Vivobook 14 X1405VA-LY623W",
    specs: ["i5-13420H", "Intel UHD", "16GB 512GB", '14" WUXGA'],
    price: 15390000,
    originalPrice: 16490000,
    discount: "7%",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/a/laptop-asus-vivobook-14-x1405va-ly623w-thumbnails.png",
    promo: "S-Student giảm thêm 500.000đ",
  },
  {
    id: 3,
    name: "iPhone 17 Pro Max 512GB | Chính hãng",
    specs: [],
    price: 42990000,
    originalPrice: 44490000,
    discount: "3%",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_pro_max-2_1_1.jpg",
    promo: "",
  },
  {
    id: 4,
    name: "iPhone 14 256GB | Chính hãng VN/A",
    specs: [],
    price: 16390000,
    originalPrice: 18990000,
    discount: "14%",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_14-3_11.jpg",
    promo: "S-Student giảm thêm 491.700đ",
  },
  {
    id: 5,
    name: "iPhone 17 512GB | Chính hãng",
    specs: [],
    price: 30990000,
    originalPrice: 31490000,
    discount: "2%",
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_17_256gb-3_2.jpg",
    promo: "",
  },
];

export default function Suggestions() {
  return (
    <div className="mt-8 rounded-3xl overflow-hidden border-2 border-blue-400 p-1 bg-gradient-to-r from-pink-100 via-blue-100 to-pink-100 shadow-xl">
      {/* Title Banner */}
      <div className="flex justify-center -mt-1 scale-105">
         <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-10 py-1.5 rounded-b-2xl shadow-lg flex items-center gap-2 font-bold text-lg uppercase tracking-wider">
           <span className="text-xl">✨</span> GỢI Ý CHO BẠN
         </div>
      </div>

      <div className="p-6 relative">
        {/* Navigation Arrows (Visual only) */}
        <button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full shadow-md flex items-center justify-center z-10 hover:bg-white transition text-gray-800">
           ❮
        </button>
        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full shadow-md flex items-center justify-center z-10 hover:bg-white transition text-gray-800">
           ❯
        </button>

        <div className="grid grid-cols-5 gap-4">
          {SUGGESTED_PRODUCTS.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition relative group overflow-hidden">
              {/* Badges */}
              <div className="flex justify-between items-start mb-2">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-r-lg -ml-4 flex items-center">
                  Giảm {p.discount}
                </span>
                <span className="text-blue-500 text-[10px] bg-blue-50 px-2 py-0.5 rounded-lg font-medium border border-blue-100 scale-90 origin-right">
                  Trả góp 0%
                </span>
              </div>

              {/* Image */}
              <div className="h-40 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-300">
                <img src={p.image} alt={p.name} className="max-h-full object-contain" />
              </div>

              {/* Specs */}
              {p.specs.length > 0 && (
                <div className="grid grid-cols-2 gap-1 mb-2">
                  {p.specs.map((s, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-100 rounded text-[9px] py-0.5 px-1 text-gray-500 truncate text-center font-medium">
                      {s}
                    </div>
                  ))}
                </div>
              )}

              {/* Title */}
              <h3 className="text-[13px] font-bold text-gray-800 line-clamp-2 leading-snug h-8">
                {p.name}
              </h3>

              {/* Prices */}
              <div className="mt-auto">
                <div className="text-red-600 font-extrabold text-[15px]">
                  {p.price.toLocaleString()}đ
                </div>
                <div className="text-gray-400 text-[11px] line-through">
                  {p.originalPrice.toLocaleString()}đ
                </div>
              </div>

              {/* Promo */}
              <div className="mt-2 min-h-[1.5rem]">
                {p.promo && (
                   <div className="bg-blue-50 text-blue-600 text-[9px] px-2 py-1 rounded inline-block font-medium truncate w-full">
                     {p.promo}
                   </div>
                )}
              </div>

              {/* Like Button */}
              <div className="mt-2 pt-2 border-t border-gray-50 flex justify-end">
                 <button className="flex items-center gap-1 text-blue-500 text-[10px] font-medium hover:text-blue-600 transition">
                    <span className="text-xs">♡</span> Yêu thích
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
