import React, { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Plus, Minus, Trash2, Upload, CheckCircle, LogOut, Package, Eye, EyeOff } from 'lucide-react';

// ── API base ──────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '')
  : 'https://mf-collections.onrender.com/api/v1';

const api = axios.create({ baseURL: API_BASE, withCredentials: true });

// ── Constants ─────────────────────────────────────────────────────────────────
const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'Free Size'];

const EMPTY_FORM = {
  title: '',
  slug: '',
  sku: '',
  price: '',
  compareAtPrice: '',
  category: '',
  description: '',
  fabricDetails: '',
  careInstructions: '',
  isFeatured: false,
  isNewArrival: true,
  images: [],
  variants: [{ size: 'Free Size', stock: 10 }],
  extraFields: [],
};

// ── Login Screen ──────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.requiresOtp) {
        setMessage(data.message || 'OTP sent to your email.');
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otpCode });
      if (data.role !== 'admin' && data.role !== 'superadmin') {
        setError('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
      />
      <div className="relative w-full max-w-md px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur rounded-2xl mb-4">
            <Package className="text-white" size={30} />
          </div>
          <h1 className="text-white text-2xl font-semibold tracking-widest uppercase">MF Designs</h1>
          <p className="text-white/40 text-xs mt-1 tracking-widest uppercase">Product Upload Portal</p>
        </div>
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
          <h2 className="text-white text-lg font-medium mb-6">{step === 1 ? 'Sign In' : 'Verify OTP'}</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}
          {message && step === 2 && !error && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-lg mb-5">
              {message}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-white/50 text-xs uppercase tracking-widest mb-2">Email</label>
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="admin@mfdesigns.com"
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs uppercase tracking-widest mb-2">Password</label>
                <input
                  type="password" required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-white text-black font-semibold py-3 rounded-lg text-sm uppercase tracking-widest hover:bg-white/90 transition-colors disabled:opacity-50 mt-2">
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-white/50 text-xs uppercase tracking-widest mb-2">6-Digit OTP</label>
                <input
                  type="text" required maxLength="6" value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-lg px-4 py-3 text-center tracking-[0.5em] text-lg focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="------"
                />
              </div>
              <button type="submit" disabled={loading || otpCode.length !== 6}
                className="w-full bg-white text-black font-semibold py-3 rounded-lg text-sm uppercase tracking-widest hover:bg-white/90 transition-colors disabled:opacity-50 mt-2">
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
              <button type="button" onClick={() => setStep(1)}
                className="w-full text-white/50 hover:text-white transition-colors text-xs uppercase tracking-widest mt-4">
                Go Back
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-white/20 text-xs mt-6">Admin Panel 2 — Product Upload Only</p>
      </div>
    </div>
  );
};

// ── Success Toast ─────────────────────────────────────────────────────────────
const SuccessToast = ({ message }) => (
  <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-green-500 text-white px-5 py-4 rounded-xl shadow-2xl" style={{ animation: 'slideIn 0.3s ease-out forwards' }}>
    <CheckCircle size={20} />
    <span className="text-sm font-medium">{message}</span>
  </div>
);

// ── Product Upload Panel ──────────────────────────────────────────────────────
const ProductUploadPanel = ({ user, onLogout }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const { data: categories = [] } = useQuery({
    queryKey: ['ap2Categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // File handling
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    const total = form.images.length + files.length;
    if (total > 8) { setError(`Cannot add ${files.length} images. Max 8 total.`); return; }
    setForm(prev => ({ ...prev, images: [...prev.images, ...files] }));
    setPreviewImages(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    e.target.value = '';
  };

  const removeImage = (idx) => {
    URL.revokeObjectURL(previewImages[idx]);
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
    setPreviewImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Variant helpers
  const variants = form.variants || [];
  const totalStock = variants.reduce((s, v) => s + (Number(v.stock) || 0), 0);
  const unusedSizes = AVAILABLE_SIZES.filter(s => !variants.some(v => v.size === s));

  const addVariant = (size) => setForm(prev => ({ ...prev, variants: [...prev.variants, { size, stock: 0 }] }));
  const removeVariant = (idx) => setForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }));
  const updateVariantStock = (idx, val) => {
    const updated = [...variants];
    updated[idx] = { ...updated[idx], stock: Math.max(0, Number(val) || 0) };
    setForm(prev => ({ ...prev, variants: updated }));
  };

  // Extra fields
  const extraFields = form.extraFields || [];
  const addExtraField = () => setForm(prev => ({ ...prev, extraFields: [...prev.extraFields, { label: '', value: '' }] }));
  const removeExtraField = (idx) => setForm(prev => ({ ...prev, extraFields: prev.extraFields.filter((_, i) => i !== idx) }));
  const updateExtraField = (idx, key, val) => {
    const updated = [...extraFields];
    updated[idx] = { ...updated[idx], [key]: val };
    setForm(prev => ({ ...prev, extraFields: updated }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploadProgress(0);

    if (!form.category) { setError('Please select a category.'); return; }
    if (form.images.length < 3) { setError(`Need at least 3 images (currently ${form.images.length}).`); return; }
    if (variants.length === 0) { setError('Add at least one size variant.'); return; }
    if (totalStock <= 0) { setError('Total stock must be greater than 0.'); return; }
    if (!form.price || Number(form.price) <= 0) { setError('Please enter a valid price.'); return; }

    setIsSubmitting(true);
    try {
      setUploadProgress(10);
      const uploadData = new FormData();
      form.images.forEach(f => uploadData.append('images', f));
      const { data: uploadedImages } = await api.post('/admin/uploads', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (p) => setUploadProgress(Math.round(10 + (p.loaded / p.total) * 60)),
      });
      setUploadProgress(75);

      const slug = form.slug
        ? form.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

      const cleanedExtra = extraFields
        .filter(f => f.label?.trim() && f.value?.trim())
        .map(f => ({ label: f.label.trim(), value: f.value.trim() }));

      const careArr = form.careInstructions
        ? form.careInstructions.split('\n').map(s => s.trim()).filter(Boolean)
        : [];

      const payload = {
        title: form.title.trim(),
        slug,
        price: Number(form.price),
        category: form.category,
        description: form.description.trim(),
        images: uploadedImages,
        variants: variants.map(v => ({ size: v.size, stock: Number(v.stock) || 0 })),
        status: 'draft',
        isNewArrival: form.isNewArrival,
        isFeatured: form.isFeatured,
        ...(form.compareAtPrice && { compareAtPrice: Number(form.compareAtPrice) }),
        ...(form.fabricDetails && { fabricDetails: form.fabricDetails.trim() }),
        ...(careArr.length > 0 && { careInstructions: careArr }),
        ...(cleanedExtra.length > 0 && { extraFields: cleanedExtra }),
        ...(form.sku && { sku: form.sku.trim().toUpperCase() }),
      };

      setUploadProgress(90);
      await api.post('/admin/products', payload);
      setUploadProgress(100);

      previewImages.forEach(url => URL.revokeObjectURL(url));
      setPreviewImages([]);
      setForm({ ...EMPTY_FORM });
      setUploadProgress(0);
      showSuccess(`"${payload.title}" published successfully!`);
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add product');
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f3]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {successMsg && <SuccessToast message={successMsg} />}
      <style>{`@keyframes slideIn { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>

      {/* Header */}
      <header className="bg-[#111111] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <Package size={22} />
          <div>
            <h1 className="font-semibold tracking-widest uppercase text-sm">MF Designs</h1>
            <p className="text-white/40 text-[10px] tracking-widest uppercase">Product Upload Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/50 text-xs hidden sm:block">
            {user?.name || user?.email}
          </span>
          <button onClick={onLogout}
            className="flex items-center gap-2 text-white/60 hover:text-white text-xs uppercase tracking-widest transition-colors">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#111] tracking-tight">Add New Product</h2>
          <p className="text-[#888] text-sm mt-1">Fill in the product details and upload images to publish.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4 rounded-xl mb-6 flex items-start gap-3">
            <span className="mt-0.5 shrink-0">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#888] mb-5">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#666] mb-2">Product Title *</label>
                <input
                  type="text" required value={form.title}
                  onChange={e => {
                    const title = e.target.value;
                    const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    setForm(prev => ({ ...prev, title, slug: autoSlug }));
                  }}
                  className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#111] transition-colors"
                  placeholder="e.g. Embroidered Organza Suit"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-widest text-[#666] mb-2">SKU (auto if blank)</label>
                  <input type="text" value={form.sku}
                    onChange={e => setForm(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#111] transition-colors"
                    placeholder="e.g. MFD-050"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-widest text-[#666] mb-2">URL Slug</label>
                  <input type="text" value={form.slug}
                    onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#111] transition-colors text-[#888]"
                    placeholder="auto-generated from title"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#666] mb-2">Category *</label>
                <select required value={form.category}
                  onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#111] transition-colors bg-white">
                  <option value="" disabled>Select a category…</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-widest text-[#666] mb-2">Price (Rs.) *</label>
                  <input type="number" required min="1" value={form.price}
                    onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#111] transition-colors"
                    placeholder="e.g. 12500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-widest text-[#666] mb-2">Compare-At Price</label>
                  <input type="number" min="0" value={form.compareAtPrice}
                    onChange={e => setForm(prev => ({ ...prev, compareAtPrice: e.target.value }))}
                    className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#111] transition-colors"
                    placeholder="Strike-through price"
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={form.isNewArrival}
                    onChange={e => setForm(prev => ({ ...prev, isNewArrival: e.target.checked }))}
                    className="w-4 h-4 accent-black rounded" />
                  <span className="text-sm text-[#444]">New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={form.isFeatured}
                    onChange={e => setForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 accent-black rounded" />
                  <span className="text-sm text-[#444]">Featured</span>
                </label>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#888] mb-5">Description & Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#666] mb-2">Description *</label>
                <textarea required rows={4} value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none"
                  placeholder="Describe the product — material, occasion, style…"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#666] mb-2">Fabric Details</label>
                <input type="text" value={form.fabricDetails}
                  onChange={e => setForm(prev => ({ ...prev, fabricDetails: e.target.value }))}
                  className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#111] transition-colors"
                  placeholder="e.g. 100% Pure Organza Silk"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-[#666] mb-2">Care Instructions <span className="text-[#bbb] normal-case tracking-normal font-normal">(one per line)</span></label>
                <textarea rows={2} value={form.careInstructions}
                  onChange={e => setForm(prev => ({ ...prev, careInstructions: e.target.value }))}
                  className="w-full border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none"
                  placeholder="Dry clean only&#10;Do not bleach"
                />
              </div>
            </div>
          </section>

          {/* Sizes & Stock */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#888]">Sizes & Stock *</h3>
              <span className="text-xs bg-[#111] text-white px-3 py-1 rounded-full font-mono">Total: {totalStock} pcs</span>
            </div>
            {variants.length === 0 && (
              <p className="text-sm text-[#aaa] italic mb-4">No sizes added. Add at least one below.</p>
            )}
            <div className="space-y-3 mb-4">
              {variants.map((v, idx) => (
                <div key={v.size} className="flex items-center gap-3 bg-[#f9f9f9] border border-[#eee] rounded-xl px-4 py-3">
                  <span className="text-xs font-bold tracking-widest uppercase w-20 shrink-0 text-[#444]">{v.size}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <button type="button" onClick={() => updateVariantStock(idx, v.stock - 1)}
                      className="w-8 h-8 flex items-center justify-center border border-[#ddd] rounded-lg hover:bg-white transition-colors">
                      <Minus size={13} />
                    </button>
                    <input type="number" min="0" value={v.stock}
                      onChange={e => updateVariantStock(idx, e.target.value)}
                      className="w-16 text-center border border-[#e0e0e0] rounded-lg py-1.5 text-sm font-mono focus:outline-none focus:border-[#111]"
                    />
                    <button type="button" onClick={() => updateVariantStock(idx, v.stock + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-[#ddd] rounded-lg hover:bg-white transition-colors">
                      <Plus size={13} />
                    </button>
                  </div>
                  <button type="button" onClick={() => removeVariant(idx)}
                    className="text-red-400 hover:text-red-600 p-1.5 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
            {unusedSizes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {unusedSizes.map(size => (
                  <button key={size} type="button" onClick={() => addVariant(size)}
                    className="border-2 border-dashed border-[#ccc] text-[#888] text-[11px] uppercase tracking-widest px-4 py-2 rounded-xl hover:border-[#111] hover:text-[#111] transition-colors">
                    + {size}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Custom Attributes */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#888]">Custom Attributes</h3>
                <p className="text-[11px] text-[#bbb] mt-0.5">Fabric, model specs, wash care, fit notes, etc.</p>
              </div>
              <button type="button" onClick={addExtraField}
                className="text-xs font-medium uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors">
                <Plus size={13} /> Add Field
              </button>
            </div>
            {extraFields.length === 0 ? (
              <p className="text-sm text-[#bbb] italic">No custom fields added yet.</p>
            ) : (
              <div className="space-y-3">
                {extraFields.map((field, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input type="text" value={field.label}
                      onChange={e => updateExtraField(idx, 'label', e.target.value)}
                      placeholder="Field name (e.g. Fabric)"
                      className="w-1/3 border border-[#e5e5e5] rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none focus:border-[#111] transition-colors"
                    />
                    <input type="text" value={field.value}
                      onChange={e => updateExtraField(idx, 'value', e.target.value)}
                      placeholder="Value (e.g. 100% Pure Organza)"
                      className="flex-1 border border-[#e5e5e5] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#111] transition-colors"
                    />
                    <button type="button" onClick={() => removeExtraField(idx)}
                      className="text-red-400 hover:text-red-600 p-1.5 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Images */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#888]">Product Images *</h3>
                <p className="text-[11px] text-[#bbb] mt-0.5">Min 3, Max 8 · JPG/PNG/WEBP</p>
              </div>
              <button type="button" onClick={() => fileInputRef.current?.click()}
                disabled={form.images.length >= 8}
                className="flex items-center gap-2 bg-[#111] text-white text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-black transition-colors disabled:opacity-40">
                <Upload size={13} /> Upload
              </button>
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
            {form.images.length === 0 ? (
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-[#ddd] rounded-2xl py-12 flex flex-col items-center gap-3 text-[#bbb] hover:border-[#aaa] hover:text-[#888] transition-colors">
                <Upload size={32} />
                <span className="text-sm">Click to upload images</span>
                <span className="text-xs">JPG, PNG, WEBP — up to 8 images</span>
              </button>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {previewImages.map((src, idx) => (
                  <div key={idx} className="relative group aspect-[3/4] rounded-xl overflow-hidden border border-[#eee]">
                    <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                        Primary
                      </span>
                    )}
                    <button type="button" onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 bg-white/90 text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                {form.images.length < 8 && (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="aspect-[3/4] rounded-xl border-2 border-dashed border-[#ddd] flex flex-col items-center justify-center gap-2 text-[#bbb] hover:border-[#aaa] hover:text-[#888] transition-colors">
                    <Plus size={22} />
                    <span className="text-[10px]">Add more</span>
                  </button>
                )}
              </div>
            )}
            {form.images.length > 0 && (
              <p className="text-xs text-[#aaa] mt-3">
                {form.images.length}/8 images · {form.images.length < 3 ? `⚠ Need ${3 - form.images.length} more` : '✓ Minimum met'}
              </p>
            )}
          </section>

          {/* Progress Bar */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#666] uppercase tracking-widest">
                  {uploadProgress < 75 ? 'Uploading images…' : uploadProgress < 95 ? 'Creating product…' : 'Almost done…'}
                </span>
                <span className="text-xs font-mono text-[#444]">{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                <div className="h-full bg-[#111] rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={isSubmitting}
            className="w-full bg-[#111111] text-white py-4 rounded-2xl text-sm font-semibold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-3">
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing…
              </>
            ) : (
              <>
                <Plus size={16} />
                Publish Product
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

// ── Root Component ─────────────────────────────────────────────────────────────
const AdminPanel2 = () => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ap2_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (userData) => {
    localStorage.setItem('ap2_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('ap2_user');
    setUser(null);
  };

  if (!user) return <LoginScreen onLogin={handleLogin} />;
  return <ProductUploadPanel user={user} onLogout={handleLogout} />;
};

export default AdminPanel2;
