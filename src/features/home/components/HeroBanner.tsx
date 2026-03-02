type HeroBannerProps = {
  product: {
    title: string;
    subtitle: string;
    image: string;
  };
};

export default function HeroBanner({ product }: HeroBannerProps) {
  return (
    <div className="flex-1 bg-white rounded-xl shadow p-8 relative overflow-hidden">
      <div className="flex items-center justify-between">
        
        <div>
          <div className="text-sm font-semibold mb-2 text-gray-500">
            {product.subtitle}
          </div>

          <h2 className="text-4xl font-bold mb-4">
            {product.title}
          </h2>

          <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold">
            MUA NGAY
          </button>
        </div>

        <img
          src={product.image}
          alt={product.title}
          className="w-80 object-contain"
        />
      </div>
    </div>
  );
}