import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import AnimatedSection from "@/components/AnimatedSection";
import { usePageTransition } from "@/hooks/useGSAP";
import BannerCarousel from "@/components/BannerCarousel";
import { productService } from "@/services";
import Loader from "@/components/Loader";

const categories = ["All", "Serums", "Moisturizers", "Cleansers", "Face Care"];

const Shop = () => {
  usePageTransition();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        p.shortDescription?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.shortDescription?.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => {
          const priceA = a.sizes?.[0]?.sellingPrice || a.salePrice || 0;
          const priceB = b.sizes?.[0]?.sellingPrice || b.salePrice || 0;
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => {
          const priceA = a.sizes?.[0]?.sellingPrice || a.salePrice || 0;
          const priceB = b.sizes?.[0]?.sellingPrice || b.salePrice || 0;
          return priceB - priceA;
        });
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered = [...filtered].sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [products, selectedCategory, sortBy, searchQuery]);

  if (loading) {
    return (
      <main className="pt-28 pb-20 bg-base min-h-screen flex items-center justify-center">
        <Loader />
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-28 pb-20 bg-base min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#FC6CB4] text-white rounded-full"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 bg-base">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <AnimatedSection className="text-center mb-16">
          <div className="mb-12 rounded-3xl overflow-hidden">
            <BannerCarousel />
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-5 bg-white rounded-3xl shadow-lg">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#731162]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#FC6CB4]/30
                focus:ring-2 focus:ring-[#FC6CB4]/40 focus:border-[#731162] transition"
              />
            </div>

            <div className="hidden lg:flex items-center gap-2">
              {categories.slice(0, 5).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                    selectedCategory === category
                      ? "bg-[#731162] text-white shadow"
                      : "bg-[#FC6CB4]/10 text-[#731162] hover:bg-[#FC6CB4]/20"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden inline-flex items-center justify-center gap-2
              px-6 py-3 rounded-full bg-[#731162] text-white
              hover:bg-[#5d0e4f] transition"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-5 py-3 pr-10 rounded-full
                border border-[#FC6CB4]/30 cursor-pointer
                focus:ring-2 focus:ring-[#FC6CB4]/40 focus:border-[#731162]"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#731162]" />
            </div>
          </div>

          {showFilters && (
            <div className="lg:hidden mt-4 p-5 bg-white rounded-3xl shadow-lg">
              <h4 className="font-medium text-[#731162] mb-4">Categories</h4>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowFilters(false);
                    }}
                    className={`px-4 py-2 text-sm rounded-full transition ${
                      selectedCategory === category
                        ? "bg-[#731162] text-white"
                        : "bg-[#FC6CB4]/10 text-[#731162] hover:bg-[#FC6CB4]/20"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </AnimatedSection>

        <p className="text-sm text-black/60 mb-8">
          Showing {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
        </p>

        {filteredProducts.length > 0 ? (
          <AnimatedSection
            stagger
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </AnimatedSection>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-black/60 mb-6">No products found</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setSortBy("featured");
              }}
              className="px-8 py-4 rounded-full font-semibold
              bg-[#FC6CB4] text-white
              hover:bg-[#e85aa0] transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Shop;
