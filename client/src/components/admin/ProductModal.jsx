import React, { useRef } from 'react';
import { X, Trash2, Upload, Plus, Minus } from 'lucide-react';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'Free Size'];

const ProductModal = ({ 
  isOpen, 
  onClose, 
  editingProduct, 
  formData, 
  setFormData, 
  categories, 
  error, 
  onSubmit, 
  isPending 
}) => {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        newImages: [...prev.newImages, ...files]
      }));
    }
  };

  const removeExistingImage = (idx) => {
    const updated = formData.existingImages.filter((_, i) => i !== idx);
    setFormData({ ...formData, existingImages: updated });
  };

  const removeNewImage = (idx) => {
    const updated = formData.newImages.filter((_, i) => i !== idx);
    setFormData({ ...formData, newImages: updated });
  };

  // --- Variant helpers ---
  const variants = formData.variants || [];
  const totalStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

  const addVariant = (size) => {
    if (variants.some(v => v.size === size)) return;
    setFormData({ ...formData, variants: [...variants, { size, stock: 0 }] });
  };

  const removeVariant = (idx) => {
    setFormData({ ...formData, variants: variants.filter((_, i) => i !== idx) });
  };

  const updateVariantStock = (idx, val) => {
    const updated = [...variants];
    updated[idx] = { ...updated[idx], stock: Math.max(0, Number(val) || 0) };
    setFormData({ ...formData, variants: updated });
  };

  const unusedSizes = AVAILABLE_SIZES.filter(s => !variants.some(v => v.size === s));

  // --- Extra Fields helpers ---
  const extraFields = formData.extraFields || [];

  const addExtraField = () => {
    setFormData({
      ...formData,
      extraFields: [...extraFields, { label: '', value: '' }]
    });
  };

  const removeExtraField = (idx) => {
    setFormData({
      ...formData,
      extraFields: extraFields.filter((_, i) => i !== idx)
    });
  };

  const updateExtraField = (idx, field, val) => {
    const updated = [...extraFields];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData({
      ...formData,
      extraFields: updated
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto font-sans p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 mb-4 text-sm font-sans tracking-wider border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Title</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border border-[#EAEAEA] p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full border border-[#EAEAEA] p-3 font-sans text-sm focus:outline-none focus:border-black transition-colors bg-white"
              >
                <option value="" disabled>Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Price (Rs.)</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full border border-[#EAEAEA] p-3 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* ---- SIZE / STOCK VARIANT BUILDER ---- */}
          <div className="border border-[#EAEAEA] p-4 bg-gray-50/50">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-medium">Sizes & Stock per Size</label>
              <span className="text-xs font-mono bg-black text-white px-2 py-0.5 rounded">
                Total: {totalStock}
              </span>
            </div>

            {variants.length === 0 && (
              <p className="text-xs text-gray-400 italic mb-3">No sizes added yet. Add at least one size below.</p>
            )}

            <div className="space-y-2 mb-3">
              {variants.map((v, idx) => (
                <div key={v.size} className="flex items-center gap-3 bg-white border border-gray-200 p-2.5 rounded">
                  <span className="font-sans text-xs font-semibold tracking-widest uppercase w-20 shrink-0">{v.size}</span>
                  <div className="flex items-center gap-1.5 flex-1">
                    <button
                      type="button"
                      onClick={() => updateVariantStock(idx, v.stock - 1)}
                      className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-100"
                    >
                      <Minus size={12} />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={v.stock}
                      onChange={(e) => updateVariantStock(idx, e.target.value)}
                      className="w-16 text-center border border-gray-200 p-1.5 text-sm font-mono focus:outline-none focus:border-black rounded"
                    />
                    <button
                      type="button"
                      onClick={() => updateVariantStock(idx, v.stock + 1)}
                      className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-100"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(idx)}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick-add size buttons */}
            {unusedSizes.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {unusedSizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => addVariant(size)}
                    className="border border-dashed border-gray-300 text-gray-500 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded hover:border-black hover:text-black transition-colors"
                  >
                    + {size}
                  </button>
                ))}
              </div>
            )}

            <p className="text-[10px] text-gray-400 mt-2">
              Total items across all sizes: <strong className="text-black">{totalStock}</strong>. Users cannot order more than the stock per size.
            </p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Description</label>
            <textarea 
              rows="3"
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-[#EAEAEA] p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>

          {/* ---- EXTRA CUSTOM FIELDS ---- */}
          <div className="border border-[#EAEAEA] p-4 bg-gray-50/50">
            <div className="flex justify-between items-center mb-3">
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 font-medium block">Custom Fields & Details</label>
                <span className="text-[10px] text-gray-400">Add any extra specifications (e.g. Fabric, Model Specs, Care, Fit...)</span>
              </div>
              <button
                type="button"
                onClick={addExtraField}
                className="text-xs uppercase tracking-widest text-blue-600 hover:underline flex items-center gap-1 font-medium"
              >
                <Plus size={13} /> Add Field
              </button>
            </div>

            {extraFields.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No custom fields added. Click "+ Add Field" to create custom text attributes.</p>
            ) : (
              <div className="space-y-2">
                {extraFields.map((field, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white border border-gray-200 p-2 rounded">
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateExtraField(idx, 'label', e.target.value)}
                      placeholder="Field Name (e.g. Fabric)"
                      className="w-1/3 border border-gray-200 p-2 text-xs font-medium focus:outline-none focus:border-black rounded"
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => updateExtraField(idx, 'value', e.target.value)}
                      placeholder="Value (e.g. 100% Pure Organza Silk)"
                      className="flex-1 border border-gray-200 p-2 text-xs focus:outline-none focus:border-black rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeExtraField(idx)}
                      className="text-red-400 hover:text-red-600 p-1.5"
                      title="Remove field"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs uppercase tracking-widest text-gray-500">Images (Min 3, Max 8)</label>
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                className="text-xs font-medium uppercase tracking-widest text-blue-600 hover:underline flex items-center gap-1"
                disabled={formData.existingImages.length + formData.newImages.length >= 8}
              >
                <Upload size={14} /> Upload Images
              </button>
            </div>
            
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <div className="grid grid-cols-4 gap-2">
              {/* Existing Images */}
              {formData.existingImages.map((img, idx) => (
                <div key={`exist-${idx}`} className="relative group border border-[#EAEAEA] aspect-[3/4]">
                  <img src={img.url || img} alt={`Existing ${idx}`} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeExistingImage(idx)}
                    className="absolute top-1 right-1 bg-white p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              
              {/* New Images */}
              {formData.newImages.map((file, idx) => (
                <div key={`new-${idx}`} className="relative group border border-blue-200 aspect-[3/4]">
                  <img src={URL.createObjectURL(file)} alt={`New ${idx}`} className="w-full h-full object-cover opacity-80" />
                  <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[10px] px-1 rounded">NEW</span>
                  <button 
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-1 right-1 bg-white p-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              {formData.existingImages.length + formData.newImages.length} of 8 images selected.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-[#111111] text-white py-4 text-xs uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 mt-4"
          >
            {isPending ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;

