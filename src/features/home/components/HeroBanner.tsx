import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Product = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
};

type HeroBannerProps = {
  products: Product[];
};

export default function HeroBanner({ products }: HeroBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSliderArrows, setShowSliderArrows] = useState(false);
  const [showPillArrows, setShowPillArrows] = useState(false);
  const [visibleStart, setVisibleStart] = useState(0);
  const touchStartX = useRef(0);

  const visibleCount = 4;

  // ===== AUTO SLIDE 5s =====
  useEffect(() => {
    if (showSliderArrows) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) =>
        prev === products.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length, showSliderArrows]);

  // ===== Auto scroll pills theo activeIndex =====
  useEffect(() => {
    if (activeIndex < visibleStart) {
      setVisibleStart(activeIndex);
    } else if (activeIndex >= visibleStart + visibleCount) {
      setVisibleStart(activeIndex - visibleCount + 1);
    }
  }, [activeIndex]);

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? products.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setActiveIndex((prev) =>
      prev === products.length - 1 ? 0 : prev + 1
    );
  };

  const prevPill = () => {
    setVisibleStart((prev) => Math.max(prev - 1, 0));
  };

  const nextPill = () => {
    setVisibleStart((prev) =>
      Math.min(prev + 1, products.length - visibleCount)
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) prevSlide();
    if (diff < -50) nextSlide();
  };

  const visibleProducts = products.slice(
    visibleStart,
    visibleStart + visibleCount
  );

  return (
    <div className="bg-white rounded-xl shadow flex flex-col gap-6 p-5">

      {/* ================= TOP PRODUCT ================= */}
      <div
        className="relative"
        onMouseEnter={() => setShowPillArrows(true)}
        onMouseLeave={() => setShowPillArrows(false)}
      >
        <div className="relative bg-gray-100 rounded-full p-1 overflow-hidden">

          {/* Active Background */}
          <div
            className="absolute top-1 bottom-1 bg-white rounded-full shadow transition-all duration-300"
            style={{
              width: `${100 / visibleCount}%`,
              transform: `translateX(${(activeIndex - visibleStart) * 100}%)`,
            }}
          />

          <div className="relative flex">
            {visibleProducts.map((product, index) => {
              const realIndex = visibleStart + index;

              return (
                <button
                  key={product.id}
                  onClick={() => setActiveIndex(realIndex)}
                  className={`flex-1 py-2 text-center transition-colors duration-300 z-10
                    ${
                      activeIndex === realIndex
                        ? "text-red-600 font-semibold"
                        : "text-gray-600 hover:text-black"
                    }
                  `}
                >
                  <div className="text-sm">{product.title}</div>
                  <div className="text-xs font-normal">
                    {product.subtitle}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Left Arrow */}
        {visibleStart > 0 && (
          <button
            onClick={prevPill}
            className={`
              absolute left-0 top-1/2 -translate-y-1/2
              h-12 w-8
              backdrop-blur-md bg-white/70
              shadow-md
              flex items-center justify-center
              rounded-r-full
              transition-all duration-300
              ${
                showPillArrows
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0"
              }
            `}
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {/* Right Arrow */}
        {visibleStart < products.length - visibleCount && (
          <button
            onClick={nextPill}
            className={`
              absolute right-0 top-1/2 -translate-y-1/2
              h-12 w-8
              backdrop-blur-md bg-white/70
              shadow-md
              flex items-center justify-center
              rounded-l-full
              transition-all duration-300
              ${
                showPillArrows
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }
            `}
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* ================= SLIDER ================= */}
      <div
        className="relative overflow-hidden rounded-xl"
        onMouseEnter={() => setShowSliderArrows(true)}
        onMouseLeave={() => setShowSliderArrows(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
          }}
        >
          {products.map((product) => (
            <img
              key={product.id}
              src={product.image}
              alt={product.title}
              className="w-full flex-shrink-0 object-cover rounded-xl"
            />
          ))}
        </div>

        {/* Slider Left */}
        <button
          onClick={prevSlide}
          className={`
            absolute left-0 top-1/2 -translate-y-1/2
            h-20 w-12
            backdrop-blur-md bg-white/70
            shadow-md
            flex items-center justify-center
            rounded-r-full
            transition-all duration-300
            ${
              showSliderArrows
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }
          `}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Slider Right */}
        <button
          onClick={nextSlide}
          className={`
            absolute right-0 top-1/2 -translate-y-1/2
            h-20 w-12
            backdrop-blur-md bg-white/70
            shadow-md
            flex items-center justify-center
            rounded-l-full
            transition-all duration-300
            ${
              showSliderArrows
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }
          `}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}