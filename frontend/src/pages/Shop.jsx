import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import AnimatedSection from '@/components/AnimatedSection';
import { products, categories } from '@/data/products';
import { usePageTransition } from '@/hooks/useGSAP';

const Shop = () => {
  usePageTransition();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (p) => p.category === selectedCategory
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((tag) =>
            tag.toLowerCase().includes(query)
          )
      );
    }

    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered = filtered.filter((p) => p.tags.includes('new'));
        break;
      default:
        break;
    }

    return filtered;
  }, [selectedCategory, sortBy, searchQuery]);

  return (
    <main className="pt-28 pb-20 bg-[#FFFFFF]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">

        {/* ================= HEADER ================= */}
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#731162] mb-4">
            Shop All Products
          </h1>
          <p className="text-black/70 max-w-2xl mx-auto">
            Discover our complete collection of premium skincare,
            crafted with the finest natural ingredients.
          </p>
        </AnimatedSection>

        {/* ================= FILTER BAR ================= */}
        <AnimatedSection className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-5 bg-white rounded-3xl shadow-lg">

            {/* SEARCH */}
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

            {/* CATEGORY FILTER – DESKTOP */}
            <div className="hidden lg:flex items-center gap-2">
              {categories.slice(0, 5).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                    selectedCategory === category
                      ? 'bg-[#731162] text-white shadow'
                      : 'bg-[#FC6CB4]/10 text-[#731162] hover:bg-[#FC6CB4]/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* MOBILE FILTER BUTTON */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden inline-flex items-center justify-center gap-2
              px-6 py-3 rounded-full bg-[#731162] text-white
              hover:bg-[#5d0e4f] transition"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* SORT */}
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

          {/* ================= MOBILE FILTERS ================= */}
          {showFilters && (
            <div className="lg:hidden mt-4 p-5 bg-white rounded-3xl shadow-lg">
              <h4 className="font-medium text-[#731162] mb-4">
                Categories
              </h4>
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
                        ? 'bg-[#731162] text-white'
                        : 'bg-[#FC6CB4]/10 text-[#731162] hover:bg-[#FC6CB4]/20'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </AnimatedSection>

        {/* ================= RESULTS COUNT ================= */}
        <p className="text-sm text-black/60 mb-8">
          Showing {filteredProducts.length}{' '}
          {filteredProducts.length === 1 ? 'product' : 'products'}
          {selectedCategory !== 'All' &&
            ` in ${selectedCategory}`}
        </p>

        {/* ================= PRODUCTS GRID ================= */}
        {filteredProducts.length > 0 ? (
          <AnimatedSection
            stagger
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatedSection>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-black/60 mb-6">
              No products found
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSortBy('featured');
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
