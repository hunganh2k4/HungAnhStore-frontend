import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { publicApi } from "../../../shared/api/http";

interface ProductImage {
  imageUrl: string;
}

interface Variant {
  price: string;
}

interface ProductLine {
  id: number;
  name: string;
  slug: string;
  description?: string;
  videoReviewUrl: string;
  images: ProductImage[];
  products: Variant[];
}

export default function VideoReviews() {
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await publicApi.get("/product-lines");
        // Filter for those with videoReviewUrl and take random 4
        const filtered = (response.data.data || []).filter((p: ProductLine) => p.videoReviewUrl);
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setProductLines(shuffled.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch video reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      // Handle both standard and shorts URLs
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
      const match = url.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;
      if (videoId) {
        // Return embed URL with specific parameters for better UI
        return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&controls=1`;
      }
    } catch (e) {
      console.error("Invalid YouTube URL:", url);
    }
    return "";
  };

  if (loading || productLines.length === 0) return null;

  return (
    <div className="mt-12 bg-gray-50/50 rounded-3xl p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 ">
            Review Sản Phẩm
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {productLines.map((p) => {
          const embedUrl = getYouTubeEmbedUrl(p.videoReviewUrl);
          const minPrice = p.products.length > 0
            ? Math.min(...p.products.map(v => Number(v.price)))
            : 0;

          return (
            <div key={p.id} className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100">
              {/* Video Section (Vertical Aspect Ratio 9:16) */}
              <div className="relative aspect-[9/16] bg-black overflow-hidden">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    title={p.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm italic">
                    Video không khả dụng
                  </div>
                )}

                {/* Branding Overlay (Visual Only) */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                  <div className="bg-black/40 backdrop-blur-md p-2 rounded-lg flex items-center gap-2 border border-white/10">
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">HA</div>
                    <span className="text-white text-[10px] font-bold">HA Store</span>
                  </div>
                </div>
              </div>

              {/* Product Info Section */}
              <Link
                to={`/product-lines/slug/${p.slug}`}
                className="p-4 flex gap-3 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="w-20 h-20 shrink-0 bg-gray-50 rounded-xl overflow-hidden p-2">
                  <img
                    src={p.images[0]?.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[14px] font-bold text-gray-800 line-clamp-2 leading-tight mb-1">
                    {p.name}
                  </h3>
                  <div className="text-red-600 font-black text-[16px]">
                    {minPrice.toLocaleString()}đ
                  </div>
                  {p.description && (
                    <p className="text-[12px] text-gray-500 line-clamp-2 mt-1 leading-snug">
                      {p.description}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
