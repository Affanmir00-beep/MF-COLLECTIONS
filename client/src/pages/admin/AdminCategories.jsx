import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import apiClient from '../../api/apiClient';
import { Trash2, Plus, Loader } from 'lucide-react';

const AdminCategories = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', coverImage: null });
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch Categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/categories');
      return data;
    }
  });

  // Fetch Products in selected category
  const { data: categoryProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['adminProductsByCategory', selectedCategory?.name],
    queryFn: async () => {
      if (!selectedCategory) return null;
      const { data } = await apiClient.get(`/products?category=${selectedCategory._id}&pageSize=100`);
      return data;
    },
    enabled: !!selectedCategory
  });

  // Create Category
  const createMutation = useMutation({
    mutationFn: async (newCategory) => {
      const { data } = await apiClient.post('/categories', newCategory);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategories']);
      setIsModalOpen(false);
      setFormData({ name: '', description: '', coverImage: null });
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Error creating category');
    }
  });

  // Delete Category
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCategories']);
      if (selectedCategory && selectedCategory._id === deleteMutation.variables) {
        setSelectedCategory(null);
      }
      setError('');
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Error deleting category');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    let payload = { name: formData.name, description: formData.description };
    
    if (formData.coverImage) {
      const uploadData = new FormData();
      uploadData.append('images', formData.coverImage);
      try {
        const { data: uploadRes } = await apiClient.post('/admin/uploads', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        payload.coverImage = { url: uploadRes[0].url, publicId: uploadRes[0].publicId };
      } catch (err) {
        setError(err.response?.data?.message || 'Image upload failed');
        return;
      }
    } else {
      setError('Cover image is required');
      return;
    }

    createMutation.mutate(payload);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="p-8 font-sans tracking-widest uppercase">Loading categories...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl uppercase tracking-widest text-[#111111]">Categories</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#111111] text-white px-6 py-3 font-sans text-xs uppercase tracking-widest hover:bg-[#C5A880] transition-colors"
        >
          <Plus size={16} /> New Category
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-4 mb-6 text-sm font-sans tracking-wider border border-red-100">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories List */}
        <div className="lg:col-span-1 border border-[#EAEAEA] bg-white">
          <div className="p-4 border-b border-[#EAEAEA] bg-gray-50 font-sans text-xs uppercase tracking-widest font-medium">
            All Categories
          </div>
          <ul className="divide-y divide-[#EAEAEA] max-h-[600px] overflow-y-auto">
            {categories?.length === 0 && <li className="p-6 text-center text-sm text-gray-500">No categories found.</li>}
            {categories?.map((category) => (
              <li 
                key={category._id} 
                onClick={() => setSelectedCategory(category)}
                className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${selectedCategory?._id === category._id ? 'bg-[#F9F9F9] border-l-4 border-[#111111]' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
              >
                <div>
                  <h3 className="font-sans font-medium uppercase tracking-wider text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">Slug: {category.slug}</p>
                </div>
                <button 
                  onClick={(e) => handleDelete(category._id, e)}
                  disabled={deleteMutation.isLoading}
                  className="text-gray-400 hover:text-red-500 p-2"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Products in Category */}
        <div className="lg:col-span-2 border border-[#EAEAEA] bg-white p-6">
          {selectedCategory ? (
            <>
              <h2 className="font-serif text-2xl uppercase tracking-widest mb-6 border-b border-[#EAEAEA] pb-4">
                Products in <span className="text-[#C5A880]">{selectedCategory.name}</span>
              </h2>
              {isLoadingProducts ? (
                <div className="flex items-center justify-center py-12 text-gray-400"><Loader className="animate-spin" /></div>
              ) : categoryProducts?.products?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categoryProducts.products.map(product => (
                    <div key={product._id} className="border border-[#EAEAEA] p-3 text-center">
                      <img src={product.images[0]?.url || product.images[0]} alt={product.title} className="w-full h-40 object-cover mb-3" />
                      <h4 className="font-sans text-xs uppercase tracking-widest truncate">{product.title}</h4>
                      <p className="text-[#C5A880] text-sm mt-1">Rs. {product.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 font-sans text-sm tracking-widest text-gray-500">
                  No products in this category.
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
              <p className="font-sans text-sm uppercase tracking-widest mb-2">Select a category</p>
              <p className="text-xs">View products associated with it here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 max-w-md w-full relative">
            <h2 className="font-serif text-2xl uppercase tracking-widest mb-6 border-b border-[#EAEAEA] pb-4">Create Category</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Category Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-[#EAEAEA] p-3 font-sans text-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="e.g. SOLANA"
                />
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Description (Optional)</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-[#EAEAEA] p-3 font-sans text-sm focus:outline-none focus:border-black transition-colors"
                  rows="3"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Cover Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setFormData({...formData, coverImage: e.target.files[0]});
                    }
                  }}
                  className="w-full border border-[#EAEAEA] p-2 font-sans text-sm"
                />
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-[#EAEAEA]">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="font-sans text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="bg-[#111111] text-white px-6 py-3 font-sans text-xs uppercase tracking-widest hover:bg-[#C5A880] transition-colors disabled:opacity-50"
                >
                  {createMutation.isLoading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
