import {
  useParams,
  Link,
  useSearchParams,
} from "react-router-dom";
import {
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import axios from "axios";

type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  brand: {
    id: number;
    name: string;
    slug: string;
    logo?: string;
  };
  images: {
    id: number;
    imageUrl: string;
    isMain: boolean;
  }[];
  products: {
    id: number;
    price: string;
    stock?: number;
  }[];
};

export default function CategoryPage() {
  const { category } =
    useParams<{ category: string }>();
  const [searchParams, setSearchParams] =
    useSearchParams();

  const page = Number(
    searchParams.get("page") || 1
  );
  const brandParam =
    searchParams.get("brand") || "";
  const search =
    searchParams.get("search") || "";
  const sort =
    searchParams.get("sort") || "default";

  const [products, setProducts] =
    useState<ApiProduct[]>([]);
  const [lastPage, setLastPage] =
    useState(1);
  const [loading, setLoading] =
    useState(false);

  const [searchInput, setSearchInput] =
    useState(search);

  const debounceRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  // ================= FETCH =================
  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          "http://localhost:4000/product-lines",
          {
            params: {
              page,
              limit: 8,
              category,
              brand:
                brandParam || undefined,
              search:
                search || undefined,
              sort:
                sort !== "default"
                  ? sort
                  : undefined,
            },
          }
        );

        setProducts(res.data.data);
        setLastPage(res.data.lastPage);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    category,
    page,
    brandParam,
    search,
    sort,
  ]);

  // ================= AUTO SEARCH =================
  useEffect(() => {
    if (debounceRef.current)
      clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(
      () => {
        setSearchParams({
          page: "1",
          brand: brandParam,
          search: searchInput,
          sort,
        });
      },
      500
    );

    return () => {
      if (debounceRef.current)
        clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  // ================= BRAND LIST =================
  const brands = useMemo(() => {
    return [
      ...new Map(
        products.map((p) => [
          p.brand.id,
          p.brand,
        ])
      ).values(),
    ];
  }, [products]);

  const toggleBrand = (
    brandSlug: string
  ) => {
    setSearchParams({
      page: "1",
      brand:
        brandParam === brandSlug
          ? ""
          : brandSlug,
      search: searchInput,
      sort,
    });
  };

  const changePage = (
    newPage: number
  ) => {
    setSearchParams({
      page: String(newPage),
      brand: brandParam,
      search: searchInput,
      sort,
    });
  };

  return (
    <main className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-screen-2xl mx-auto px-6">

        {/* ===== BREADCRUMB ===== */}
        <div className="mb-6 text-[15px] text-gray-500 flex flex-wrap items-center gap-2">
          <Link
            to="/"
            className="hover:text-red-600 transition"
          >
            Trang chủ
          </Link>

          <span className="mx-2">/</span>

          <span className="text-gray-900 font-medium">
            {category
              ?.replace(/-/g, " ")
              .replace(
                /\b\w/g,
                (c) => c.toUpperCase()
              )}
          </span>
        </div>

        {/* BRAND FILTER */}
        <div className="bg-white p-4 rounded-2xl shadow mb-6">
          <h3 className="font-bold mb-4">
            Hãng
          </h3>

          <div className="flex gap-4 flex-wrap">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() =>
                  toggleBrand(brand.slug)
                }
                className={`flex items-center justify-center px-4 py-2 rounded-xl border transition ${
                  brandParam === brand.slug
                    ? "border-red-600 ring-2 ring-red-200"
                    : "border-gray-200 hover:border-red-400"
                }`}
              >
                {/* Nếu có logo thì chỉ hiển thị logo */}
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-20 h-12 object-contain"
                  />
                ) : (
                  /* Nếu không có logo thì hiển thị tên */
                  <span className="font-medium">
                    {brand.name}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* SEARCH + SORT */}
        <div className="bg-white p-4 rounded-2xl shadow mb-6 flex gap-4 items-center">
          <div className="flex-1">
            <input
              value={searchInput}
              onChange={(e) =>
                setSearchInput(
                  e.target.value
                )
              }
              placeholder="Tìm sản phẩm..."
              className="w-full border px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <select
            value={sort}
            onChange={(e) =>
              setSearchParams({
                page: "1",
                brand: brandParam,
                search:
                  searchInput,
                sort:
                  e.target.value,
              })
            }
            className="border px-4 py-3 rounded-xl"
          >
            <option value="default">
              Sắp xếp
            </option>
            <option value="price_asc">
              Giá tăng dần
            </option>
            <option value="price_desc">
              Giá giảm dần
            </option>
          </select>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="grid grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map(
              (_, i) => (
                <div
                  key={i}
                  className="h-64 bg-gray-200 animate-pulse rounded-2xl"
                />
              )
            )}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {products.map((product) => {
              const image =
                product.images?.find(
                  (img) => img.isMain
                )?.imageUrl || null;

              const hasVariant =
                product.products &&
                product.products.length >
                  0;

              const totalStock =
                product.products?.reduce(
                  (sum, p) =>
                    sum +
                    (p.stock || 0),
                  0
                ) || 0;

              const isOutOfStock =
                hasVariant &&
                totalStock === 0;

              const price =
                hasVariant &&
                !isOutOfStock
                  ? Number(
                      product
                        .products[0]
                        .price
                    )
                  : null;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl p-4 shadow hover:shadow-2xl transition"
                >
                  <div className="h-48 w-full flex items-center justify-center bg-gray-100 rounded-xl">
                    {image ? (
                      <img
                        src={image}
                        alt={
                          product.name
                        }
                        className="h-48 w-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Chưa có ảnh
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 font-semibold text-sm">
                    {product.name}
                  </h3>

                  <div className="mt-2 font-bold">
                    {!hasVariant ? (
                      <span className="text-gray-400">
                        Chưa có sản phẩm
                      </span>
                    ) : isOutOfStock ? (
                      <span className="text-gray-400">
                        Hết hàng
                      </span>
                    ) : (
                      <span className="text-red-600">
                        {price!.toLocaleString()}
                        đ
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/product/${product.slug}`}
                    className="block mt-4 w-full bg-red-600 text-white py-2 rounded-xl text-center hover:bg-red-700 transition"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {lastPage > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({
              length: lastPage,
            }).map((_, i) => (
              <button
                key={i}
                onClick={() =>
                  changePage(i + 1)
                }
                className={`px-4 py-2 rounded-lg ${
                  page === i + 1
                    ? "bg-red-600 text-white"
                    : "bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}