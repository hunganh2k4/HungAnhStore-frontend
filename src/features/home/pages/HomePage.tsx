import Sidebar from "../components/Sidebar";
import HeroBanner from "../components/HeroBanner";
import RightPanel from "../components/RightPanel";
import Suggestions from "../components/Suggestions";
import PromoBanners from "../components/PromoBanners";
import VideoReviews from "../components/VideoReviews";
import CategoryProducts from "../components/CategoryProducts";
import RecentlyViewed from "../components/RecentlyViewed";
import TrustBadges from "../components/TrustBadges";

export default function Home() {
  const topProducts = [
    {
      id: 1,
      title: "GALAXY S26 ULTRA",
      subtitle: "Đặt trước ưu đãi khủng",
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:100/plain/https://dashboard.cellphones.com.vn/storage/home-s26-3.png",
    },
    {
      id: 2,
      title: "IPHONE 17 PRO MAX",
      subtitle: "Trọn Tết, Vẹn Tính Hoa",
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:100/plain/https://dashboard.cellphones.com.vn/storage/690x300_ROI_MacBookNeo.png",
    },

    {
      id: 3,
      title: "XIAOMI 15 PRO",
      subtitle: "Hiệu năng đỉnh cao, giá tốt",
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:100/plain/https://dashboard.cellphones.com.vn/storage/OppoN6_Pre_home.png",
    },

    {
      id: 4,
      title: "MACBOOK AIR M4",
      subtitle: "Siêu mỏng nhẹ, pin cả ngày",
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:100/plain/https://dashboard.cellphones.com.vn/storage/690x300_open_iPhone%2017e.png",
    },

    {
      id: 5,
      title: "IPAD PRO 2026",
      subtitle: "Sáng tạo không giới hạn",
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:100/plain/https://dashboard.cellphones.com.vn/storage/690x300_PRE_AiPodsMax2.png",
    },

    {
      id: 6,
      title: "AIRPODS PRO 3",
      subtitle: "Chống ồn chủ động thế hệ mới",
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:100/plain/https://dashboard.cellphones.com.vn/storage/A5737_web.jpg",
    },

    {
      id: 7,
      title: "ASUS ROG STRIX G18",
      subtitle: "Laptop gaming hiệu năng khủng",
      image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:100/plain/https://dashboard.cellphones.com.vn/storage/Home_WF-1000XM6-final.jpg",
    },
  ];

  return (
    <main className="bg-gray-100 py-6">
      <div className="max-w-screen-2xl mx-auto px-4 border border-gray-300 rounded-2xl">

        <div className="flex gap-4 py-4">

          <div className="w-60 shrink-0">
            <Sidebar />
          </div>

          <div className="flex-1 flex flex-col gap-4 pl-5">
            {/* Chỉ còn 1 dòng */}
            <HeroBanner products={topProducts} />
          </div>

          <div className="w-72 shrink-0">
            <RightPanel />
          </div>

        </div>

        {/* Suggestions Section */}
        <div className="mt-4 pb-8 flex flex-col gap-10">
          <Suggestions />
          <PromoBanners />
          <CategoryProducts title="Laptop đời mới" categorySlug="laptop" />
          <CategoryProducts title="Điện thoại nổi bật" categorySlug="dien-thoai" />
          <CategoryProducts title="Linh kiện máy tính" categorySlug="linh-kien" />
          <VideoReviews />
          <RecentlyViewed />
          <TrustBadges />
        </div>

      </div>
    </main>
  );
}