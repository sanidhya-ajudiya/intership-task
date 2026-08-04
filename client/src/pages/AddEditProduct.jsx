import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, updateProduct, fetchProductById } from '../redux/slices/productSlice';
import { Package, Upload, Image as ImageIcon, ArrowLeft, Save } from 'lucide-react';

const categories = ['Electronics', 'Fashion', 'Home & Living', 'Books', 'Sports', 'Beauty', 'Gadgets', 'Accessories', 'Other'];

const AddEditProduct = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { product, loading } = useSelector((state) => state.products);

  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && product && product._id === id) {
      setValue('title', product.title);
      setValue('description', product.description);
      setValue('price', product.price);
      setValue('category', product.category);
      setValue('stock', product.stock);
      setValue('imageUrl', product.image);
      setImagePreview(product.image);
    }
  }, [isEdit, product, id, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('category', data.category);
    formData.append('stock', data.stock);

    if (selectedFile) {
      formData.append('image', selectedFile);
    } else if (data.imageUrl) {
      formData.append('image', data.imageUrl);
    }

    try {
      if (isEdit) {
        const res = await dispatch(updateProduct({ id, formData }));
        if (updateProduct.fulfilled.match(res)) navigate('/seller/products');
      } else {
        const res = await dispatch(createProduct(formData));
        if (createProduct.fulfilled.match(res)) navigate('/seller/products');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Package className="w-7 h-7 text-purple-400" /> {isEdit ? 'Edit Product Details' : 'Add New Product'}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Fill in inventory details & upload Cloudinary product media
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-300 mb-1">Product Title</label>
          <input
            type="text"
            placeholder="e.g. Noise-Canceling Wireless Headphones"
            {...register('title', { required: 'Title is required' })}
            className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
          />
          {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Price (₹)</label>
            <input
              type="number"
              step="0.01"
              placeholder="199.99"
              {...register('price', { required: 'Price is required', min: 0 })}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
            />
            {errors.price && <p className="text-[11px] text-rose-400 mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Stock Quantity</label>
            <input
              type="number"
              placeholder="25"
              {...register('stock', { required: 'Stock is required', min: 0 })}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
            />
            {errors.stock && <p className="text-[11px] text-rose-400 mt-1">{errors.stock.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">Category</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-xs bg-gray-900 text-gray-200"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-300 mb-1">Description</label>
          <textarea
            rows="4"
            placeholder="Detailed description of features, materials, warranty, etc."
            {...register('description', { required: 'Description is required' })}
            className="w-full glass-input p-4 rounded-xl text-xs"
          ></textarea>
          {errors.description && <p className="text-[11px] text-rose-400 mt-1">{errors.description.message}</p>}
        </div>

        {/* Media / Image Upload Section */}
        <div className="space-y-3 pt-2 border-t border-gray-800">
          <label className="block text-xs font-bold text-gray-300">Product Image (Cloudinary Media Upload)</label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* File Upload Input */}
            <div className="border-2 border-dashed border-gray-700 hover:border-purple-500/50 rounded-2xl p-4 text-center cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
                <Upload className="w-8 h-8 text-purple-400 mx-auto" />
                <span className="block text-xs font-semibold text-gray-200">
                  {selectedFile ? selectedFile.name : 'Click to Upload Image File'}
                </span>
                <span className="block text-[10px] text-gray-500">Supports PNG, JPG, WEBP (Max 5MB)</span>
              </label>
            </div>

            {/* URL Fallback Input & Preview */}
            <div className="space-y-2">
              <span className="block text-[11px] text-gray-400">Or enter Direct Image URL:</span>
              <input
                type="text"
                placeholder="https://images.unsplash.com/photo-..."
                {...register('imageUrl')}
                onChange={(e) => setImagePreview(e.target.value)}
                className="w-full glass-input px-3 py-2 rounded-xl text-xs"
              />

              {imagePreview && (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-700 mt-2">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Saving to Database...' : <><Save className="w-4 h-4" /> {isEdit ? 'Update Product' : 'Publish Product'}</>}
        </button>
      </form>
    </div>
  );
};

export default AddEditProduct;
