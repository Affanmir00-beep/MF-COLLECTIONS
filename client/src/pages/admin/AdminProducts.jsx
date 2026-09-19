import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import ProductModal from '../../components/admin/ProductModal';

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    sku: '',
    price: '',
    compareAtPrice: '',
    category: '', // Category ID
    stock: '',
    description: '',
    existingImages: [],
    newImages: [],
    variants: [{ size: 'Free Size', stock: 10 }]
  });

  // Fetch products
  const { data, isLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/products?limit=100');
      return response.data;
    },
    retry: false
  });

  const { data: categories } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: async () => {
      const response = await apiClient.get('/categories');
      return response.data;
    }
  });

  const products = data?.products || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (newProduct) => {
      const { data } = await apiClient.post('/admin/products', newProduct);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      closeModal();
    },
    onError: (err) => {
      setError(err.response?.data?.message || err.message || 'Error creating product');
    },
    onSettled: () => setIsUploading(false)
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedProduct) => {
      const { _id, ...body } = updatedProduct;
      const { data } = await apiClient.put(`/admin/products/${_id}`, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      closeModal();
    },
    onError: (err) => {
      setError(err.response?.data?.message || err.message || 'Error updating product');
    },
    onSettled: () => setIsUploading(false)
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
    onError: (err) => {
      alert(err.response?.data?.message || err.message || 'Error deleting product');
    }
  });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        category: product.category?._id || product.category,
        price: product.price,
        description: product.description || '',
        existingImages: product.images || [],
        newImages: [],
        slug: product.slug || '',
        sku: product.sku || '',
        variants: product.variants?.length > 0 
          ? product.variants.map(v => ({ size: v.size, stock: v.stock }))
          : [{ size: 'Free Size', stock: 0 }],
        extraFields: product.extraFields || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        slug: '',
        sku: '',
        price: '',
        compareAtPrice: '',
        category: '',
        description: '',
        existingImages: [],
        newImages: [],
        variants: [{ size: 'Free Size', stock: 0 }],
        extraFields: []
      });
    }
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.existingImages.length + formData.newImages.length < 3) {
      setError('A product must have at least 3 images.');
      return;
    }
    if (formData.existingImages.length + formData.newImages.length > 8) {
      setError('A product cannot have more than 8 images.');
      return;
    }

    const variants = formData.variants || [];
    if (variants.length === 0) {
      setError('You must add at least one size with stock.');
      return;
    }
    const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
    if (totalStock <= 0) {
      setError('Total stock across all sizes must be at least 1.');
      return;
    }

    setIsUploading(true);
    let uploadedImages = [];

    // Upload new images to Cloudinary via backend
    if (formData.newImages.length > 0) {
      const uploadData = new FormData();
      formData.newImages.forEach(file => uploadData.append('images', file));
      
      try {
        const { data: uploadRes } = await apiClient.post('/admin/uploads', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedImages = uploadRes;
      } catch (err) {
        setError(err.response?.data?.message || 'Image upload failed');
        setIsUploading(false);
        return;
      }
    }

    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    const sku = formData.sku;

    const cleanedExtraFields = (formData.extraFields || [])
      .filter(f => f && f.label && f.label.trim() && f.value && f.value.trim())
      .map(f => ({ label: f.label.trim(), value: f.value.trim() }));

    const payload = {
      title: formData.title,
      slug,
      price: Number(formData.price),
      category: formData.category,
      description: formData.description,
      images: [...formData.existingImages, ...uploadedImages],
      variants: variants.map(v => ({ size: v.size, stock: Number(v.stock) || 0 })),
      status: 'published',
      isNewArrival: true
    };
    
    if (cleanedExtraFields.length > 0) {
      payload.extraFields = cleanedExtraFields;
    }
    if (sku) payload.sku = sku;

    if (editingProduct) {
      updateMutation.mutate({ ...payload, _id: editingProduct._id });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl uppercase">Product Manager</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#111111] text-white px-6 py-3 font-sans text-xs uppercase tracking-widest hover:bg-[#C5A880] transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white border border-[#EAEAEA] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-gray-50 border-b border-[#EAEAEA]">
              <tr>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Image</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Product</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Category</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Price</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Stock</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500 uppercase tracking-widest text-xs">Loading...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500 uppercase tracking-widest text-xs">No products found. Add one above.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0].url || product.images[0]} alt={product.title} className="w-12 h-16 object-cover" />
                      ) : (
                        <div className="w-12 h-16 bg-gray-100 flex items-center justify-center text-gray-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{product.title}</p>
                      <p className="text-xs text-gray-500">{product.sku}</p>
                    </td>
                    <td className="px-6 py-4">{product.category?.name || product.category}</td>
                    <td className="px-6 py-4">Rs. {product.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {product.variants?.reduce((acc, v) => acc + v.stock, 0) || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 text-gray-400">
                        <button onClick={() => handleOpenModal(product)} className="hover:text-blue-600 transition-colors"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(product._id)} className="hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        error={error}
        onSubmit={handleSubmit}
        isPending={isUploading || createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default AdminProducts;
