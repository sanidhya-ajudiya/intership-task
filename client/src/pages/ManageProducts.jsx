import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../redux/slices/productSlice';
import { ShoppingBag, Trash2, ExternalLink, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageProducts = () => {
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Admin Action: Delete this product permanently from the platform?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <ShoppingBag className="w-7 h-7 text-indigo-400" /> Admin Product Control
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Inspect, audit, or delete any product listed on the e-commerce platform
        </p>
      </div>

      {loading ? (
        <div className="h-64 bg-gray-800 animate-pulse rounded-3xl"></div>
      ) : (
        <div className="glass-panel rounded-3xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-900/80 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-800">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Seller Partner</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
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
                        className="w-10 h-10 rounded-xl object-cover bg-gray-900"
                      />
                      <div>
                        <span className="font-bold text-white block line-clamp-1">{product.title}</span>
                        <span className="text-[10px] text-gray-500">Stock: {product.stock} units</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-gray-300 font-semibold">
                        <Store className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{product.seller?.name || 'Verified Merchant'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 font-semibold">{product.category}</td>
                    <td className="p-4 font-black text-indigo-400">₹{product.price.toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
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

export default ManageProducts;
