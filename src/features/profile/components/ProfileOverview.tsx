import { ShoppingBag, Ticket, Heart, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfileOverview() {
  const sections = [
    { 
      icon: ShoppingBag, 
      title: "Đơn hàng của bạn", 
      emptyMessage: "Bạn chưa có đơn hàng nào",
      actionText: "Xem tất cả đơn hàng",
      actionLink: "/profile/order-history"
    },
    { 
      icon: Ticket, 
      title: "Ưu đãi của bạn", 
      emptyMessage: "Bạn chưa có mã giảm giá nào",
      actionText: "Xem kho voucher",
      actionLink: "/profile/vouchers"
    },
  ];

  const favorites = [
    {
      id: 1,
      name: "iPhone 15 Pro Max 256GB | Chính hãng VN/A",
      price: 29590000,
      oldPrice: 34990000,
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra 12GB 256GB",
      price: 26990000,
      oldPrice: 33990000,
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/s/ss-s24-ultra-xam-2.png",
    },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 self-start mb-2">
              <section.icon className="w-6 h-6 text-red-600" />
              <h3 className="font-black text-lg text-gray-800 uppercase tracking-tight">{section.title}</h3>
            </div>
            
            <div className="py-2">
              <img 
                src="https://cellphones.com.vn/smember/_nuxt/img/NoOrder.8066f91.png" 
                alt="Empty"
                className="w-36 mx-auto opacity-80" 
              />
              <p className="text-gray-500 text-base font-medium mt-4 max-w-[240px] mx-auto">
                {section.emptyMessage}
              </p>
            </div>

            <Link 
              to={section.actionLink}
              className="mt-2 text-red-600 font-bold text-base hover:underline flex items-center gap-1"
            >
              {section.actionText} <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-red-600 fill-red-600" />
            <h3 className="font-black text-xl text-gray-800 uppercase tracking-tight">Sản phẩm yêu thích</h3>
          </div>
          <Link to="#" className="text-base font-bold text-red-600 hover:underline">Xem tất cả</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <div key={product.id} className="flex gap-5 p-4 border border-gray-50 rounded-2xl hover:bg-gray-50 transition cursor-pointer group hover:border-red-100">
              <div className="w-24 h-24 shrink-0 bg-white rounded-xl p-1.5 border shadow-sm">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col justify-between py-1">
                <h4 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-red-600 transition leading-snug">
                  {product.name}
                </h4>
                <div>
                  <div className="text-red-600 font-black text-base">
                    {product.price.toLocaleString()}đ
                  </div>
                  <div className="text-gray-400 text-xs font-medium line-through">
                    {product.oldPrice.toLocaleString()}đ
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
