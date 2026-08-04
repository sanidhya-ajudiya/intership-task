import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';
import Pagination from '../components/Pagination';
import { Search, Filter, RefreshCw, SlidersHorizontal, PackageX } from 'lucide-react';

const categories = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Books', 'Sports', 'Beauty', 'Gadgets', 'Accessories', 'Other'];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { products, loading, page, pages, totalProducts } = useSelector((state) => state.products);

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const loadData = (currentPage = 1) => {
    const params = { page: currentPage, limit: 8 };
    if (search) params.search = search;
    if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    dispatch(fetchProducts(params));
  };

  useEffect(() => {
    loadData(1);
  }, [selectedCategory, searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
    dispatch(fetchProducts({ page: 1, limit: 8 }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Product Catalog</h1>
          <p className="text-xs text-gray-400 mt-1">
            Browse through {totalProducts || 0} curated items with live category filtering
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass-input px-4 py-2.5 pl-10 rounded-2xl text-xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <button
            type="submit"
            className="absolute right-2 top-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-bold"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Pills & Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Categories
          </span>
          {(selectedCategory !== 'All' || search || minPrice || maxPrice) && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Clear Filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchParams(cat !== 'All' ? { category: cat } : {});
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-gray-900/60 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-gray-800 flex flex-wrap items-center gap-4 text-xs">
        <span className="font-semibold text-gray-300 flex items-center gap-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" /> Price Filter:
        </span>
        <input
          type="number"
          placeholder="Min Price (₹)"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="glass-input px-3 py-1.5 rounded-xl w-32 text-xs"
        />
        <span className="text-gray-500">-</span>
        <input
          type="number"
          placeholder="Max Price (₹)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="glass-input px-3 py-1.5 rounded-xl w-32 text-xs"
        />
        <button
          onClick={() => loadData(1)}
          className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-bold border border-gray-700"
        >
          Apply Price Range
        </button>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-gray-800">
          <PackageX className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-gray-200">No Products Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            We couldn't find any items matching your selected filters or search terms. Try clearing your filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination page={page} pages={pages} onPageChange={(p) => loadData(p)} />
    </div>
  );
};

export default Products;
