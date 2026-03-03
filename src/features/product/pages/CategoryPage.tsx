import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  oldPrice: number;
  image: string;
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("default");

  // ================== DATA DEMO ==================
  const products: Product[] = [
    {
      id: 1,
      name: "iPhone 16 Pro Max",
      category: "dien-thoai",
      brand: "Apple",
      price: 32990000,
      oldPrice: 35990000,
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 2,
      name: "Samsung Galaxy S25 Ultra",
      category: "dien-thoai",
      brand: "Samsung",
      price: 28990000,
      oldPrice: 31990000,
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 3,
      name: "MacBook Air M4",
      category: "laptop",
      brand: "Apple",
      price: 29990000,
      oldPrice: 32990000,
      image: "https://via.placeholder.com/300x300",
    },
    {
      id: 4,
      name: "ASUS ROG Strix G18",
      category: "laptop",
      brand: "Asus",
      price: 45990000,
      oldPrice: 48990000,
      image: "https://via.placeholder.com/300x300",
    },
  ];

  // ================== FILTER THEO CATEGORY ==================
  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category === category);
  }, [category]);

  // ================== DANH SÁCH BRAND ==================
  const brands = useMemo(() => {
    return [...new Set(categoryProducts.map((p) => p.brand))];
  }, [categoryProducts]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  // ================== FILTER LOGIC ==================
  const filteredProducts = useMemo(() => {
    let result = [...categoryProducts];

    // Filter brand
    if (selectedBrands.length > 0) {
      result = result.filter((p) =>
        selectedBrands.includes(p.brand)
      );
    }

    // Filter price
    if (priceRange === "under20") {
      result = result.filter((p) => p.price < 20000000);
    }
    if (priceRange === "20to30") {
      result = result.filter(
        (p) => p.price >= 20000000 && p.price <= 30000000
      );
    }
    if (priceRange === "over30") {
      result = result.filter((p) => p.price > 30000000);
    }

    // Sort
    if (sort === "priceAsc") {
      result.sort((a, b) => a.price - b.price);
    }
    if (sort === "priceDesc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [categoryProducts, selectedBrands, priceRange, sort]);

  const formatTitle = (slug?: string) =>
    slug?.replaceAll("-", " ") || "";

  if (!categoryProducts.length) {
    return (
      <div className="p-10 text-center text-gray-500">
        Không có sản phẩm cho danh mục này.
      </div>
    );
  }

  return (
    <main className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-screen-2xl mx-auto px-6">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:underline">
            Trang chủ
          </Link>{" "}
          /{" "}
          <span className="capitalize font-semibold">
            {formatTitle(category)}
          </span>
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-r from-red-600 to-pink-500 text-white rounded-3xl p-10 mb-8 shadow-xl">
          <h1 className="text-4xl font-bold capitalize">
            {formatTitle(category)}
          </h1>
          <p className="mt-2 opacity-90">
            Sản phẩm chính hãng - Giá tốt nhất hôm nay
          </p>
        </div>

        <div className="flex gap-8">

          {/* FILTER SIDEBAR */}
          <div className="w-72 bg-white rounded-3xl shadow-lg p-6 space-y-8 h-fit">

            {/* Brand */}
            <div>
              <h3 className="font-bold mb-4">Hãng</h3>
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 mb-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                  />
                  {brand}
                </label>
              ))}
            </div>

            {/* Price */}
            <div>
              <h3 className="font-bold mb-4">Khoảng giá</h3>
              <div className="space-y-2 text-sm">
                <button onClick={() => setPriceRange("all")} className="block">
                  Tất cả
                </button>
                <button onClick={() => setPriceRange("under20")} className="block">
                  Dưới 20 triệu
                </button>
                <button onClick={() => setPriceRange("20to30")} className="block">
                  20 - 30 triệu
                </button>
                <button onClick={() => setPriceRange("over30")} className="block">
                  Trên 30 triệu
                </button>
              </div>
            </div>

          </div>

          {/* PRODUCT AREA */}
          <div className="flex-1">

            {/* Sort bar */}
            <div className="bg-white p-4 rounded-2xl shadow mb-6 flex justify-between">
              <span>{filteredProducts.length} sản phẩm</span>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border px-3 py-2 rounded-lg"
              >
                <option value="default">Sắp xếp</option>
                <option value="priceAsc">Giá tăng dần</option>
                <option value="priceDesc">Giá giảm dần</option>
              </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl p-4 shadow hover:shadow-2xl transition group"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-48 w-full object-contain group-hover:scale-105 transition"
                    />
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-lg">
                      -
                      {Math.round(
                        ((product.oldPrice - product.price) /
                          product.oldPrice) *
                          100
                      )}
                      %
                    </span>
                  </div>

                  <h3 className="mt-4 font-semibold text-sm">
                    {product.name}
                  </h3>

                  <div className="mt-2">
                    <span className="text-red-600 font-bold">
                      {product.price.toLocaleString()}đ
                    </span>
                    <span className="ml-2 text-gray-400 line-through text-sm">
                      {product.oldPrice.toLocaleString()}đ
                    </span>
                  </div>

                  <Link
                    to={`/product/${product.id}`}
                    className="block mt-4 w-full bg-red-600 text-white py-2 rounded-xl text-center hover:bg-red-700 transition"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}