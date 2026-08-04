import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../redux/slices/productSlice';
import { Store, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

const MyProducts = () => {
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchProducts({ seller: user._id, limit: 50 }));
    }
  }, [dispatch, user]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Store className="w-7 h-7 text-purple-400" /> My Products Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Sales Person Inventory Control - Add, edit, or remove your items
          </p>
        </div>

        <Link
          to="/seller/products/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="h-64 bg-gray-800 animate-pulse rounded-3xl"></div>
      ) : products.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-gray-800">
          <Store className="w-16 h-16 text-gray-600 mx-auto" />
          <h2 className="text-xl font-bold text-gray-200">No Products Listed Yet</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            You haven't uploaded any products to your seller catalog. Click below to add your first item.
          </p>
          <Link
            to="/seller/products/add"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg"
          >
            Add Product Now
          </Link>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/80 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-900"
                      />
                      <div>
                        <span className="font-bold text-white block line-clamp-1">{product.title}</span>
                        <span className="text-[10px] text-gray-500">ID: {product._id}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 font-semibold">{product.category}</td>
                    <td className="p-4 font-black text-indigo-400">₹{product.price.toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          product.stock > 0
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                          title="View Live"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/seller/products/edit/${product._id}`}
                          className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
