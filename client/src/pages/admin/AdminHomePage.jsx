import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import apiClient from '../../api/apiClient';
import { Plus, Trash2, Upload, Save, ChevronDown, ChevronUp } from 'lucide-react';

const Accordion = ({ title, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-[#EAEAEA] shadow-sm overflow-hidden mb-6">
      <div 
        className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="font-serif text-xl uppercase tracking-widest">{title}</h2>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      {isOpen && (
        <div className="p-6 border-t border-[#EAEAEA] bg-gray-50/50">
          {children}
        </div>
      )}
    </div>
  );
};

const AdminHomePage = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [targetUpload, setTargetUpload] = useState(null); // { section, idx, field }

  const [formData, setFormData] = useState({
    heroSlider: [],
    collectionsGrid: [],
    promoGrid: [],
    watchAndBuy: [],
    formalsSplit: { image: '', title: '', description: '', buttonText: '', link: '' },
    newInBanner: { image: '', title: '', subtitle: '', link: '/collections/new-arrivals' },
    coOrdsBanner: { image: '', title: '', subtitle: '', link: '/collections/co-ords' },
    storeLocatorBanner: { image: '', title: '', subtitle: '', link: '/store-locator' },
    spottedGallery: []
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['adminCategoriesList'],
    queryFn: async () => {
      const response = await apiClient.get('/categories');
      return response.data;
    }
  });

  const { data: productsRes } = useQuery({
    queryKey: ['adminProductsList'],
    queryFn: async () => {
      const response = await apiClient.get('/products?limit=100');
      return response.data;
    }
  });
  const productsList = productsRes?.products || [];

  const { data: config, isLoading } = useQuery({
    queryKey: ['adminHomePageConfig'],
    queryFn: async () => {
      const response = await apiClient.get('/content/homepage');
      return response.data;
    }
  });

  useEffect(() => {
    if (config) {
      setFormData({
        heroSlider: config.heroSlider || [],
        collectionsGrid: config.collectionsGrid || [],
        promoGrid: config.promoGrid || [],
        watchAndBuy: config.watchAndBuy || [],
        formalsSplit: config.formalsSplit || { image: '', title: '', description: '', buttonText: '', link: '' },
        newInBanner: config.newInBanner || { image: '', title: '', subtitle: '', link: '/collections/new-arrivals' },
        coOrdsBanner: config.coOrdsBanner || { image: '', title: '', subtitle: '', link: '/collections/co-ords' },
        storeLocatorBanner: config.storeLocatorBanner || { image: '', title: '', subtitle: '', link: '/store-locator' },
        spottedGallery: config.spottedGallery || []
      });
    }
  }, [config]);

  const renderCategorySelect = (currentLink, onSelect) => {
    const selectedCat = categories.find(c => `/collections/${c.slug}` === currentLink);
    return (
      <div className="space-y-1">
        <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium">Link Destination (Choose Category or Enter Custom URL)</label>
        <div className="flex gap-2">
          <select 
            value={selectedCat?._id || ''}
            onChange={(e) => {
              const cat = categories.find(c => c._id === e.target.value);
              if (cat) onSelect(`/collections/${cat.slug}`);
            }}
            className="border border-[#EAEAEA] p-2 text-xs bg-white focus:outline-none focus:border-black max-w-[200px]"
          >
            <option value="">-- Choose Category --</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name} (/collections/{cat.slug})</option>
            ))}
          </select>
          <input 
            type="text" 
            value={currentLink} 
            onChange={e => onSelect(e.target.value)} 
            className="flex-1 border p-2 text-sm" 
            placeholder="Link (e.g. /collections/luxury-pret)" 
          />
        </div>
      </div>
    );
  };

  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await apiClient.put('/admin/content/homepage', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminHomePageConfig']);
      setSuccess('Homepage configuration saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || err.message || 'Error updating config');
    }
  });

  const handleArrayChange = (section, idx, field, value) => {
    const updated = [...formData[section]];
    updated[idx][field] = value;
    setFormData({ ...formData, [section]: updated });
  };

  const handleObjectChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: { ...formData[section], [field]: value }
    });
  };

  const handleAddToArray = (section, defaultItem) => {
    setFormData({ ...formData, [section]: [...formData[section], defaultItem] });
  };

  const handleRemoveFromArray = (section, idx) => {
    const updated = [...formData[section]];
    updated.splice(idx, 1);
    setFormData({ ...formData, [section]: updated });
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file || !targetUpload) return;

    setIsUploading(true);
    setError('');
    
    const uploadData = new FormData();
    uploadData.append('images', file);

    try {
      const { data: uploadRes } = await apiClient.post('/admin/uploads', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const { section, idx, field } = targetUpload;
      const imageUrl = uploadRes[0].url;
      const publicId = uploadRes[0].publicId;

      if (idx !== undefined) {
        const updated = [...formData[section]];
        updated[idx][field] = imageUrl;
        updated[idx].publicId = publicId;
        setFormData({ ...formData, [section]: updated });
      } else {
        setFormData({
          ...formData,
          [section]: { ...formData[section], [field]: imageUrl, publicId: publicId }
        });
      }
      setSuccess('Media uploaded successfully! Click "Save Changes" at the top to publish.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Your session has expired or you are not logged in as admin. Please log in again.');
      } else {
        setError(err.response?.data?.message || err.message || 'Image upload failed');
      }
    } finally {
      setIsUploading(false);
      setTargetUpload(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const renderImageUpload = (section, idx, field, currentValue, title = "Change Image") => (
    <div className="aspect-square w-full max-w-[200px] bg-gray-100 border border-[#EAEAEA] relative overflow-hidden group/img cursor-pointer">
      {currentValue ? (
        <img src={currentValue} alt="Preview" className="w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest text-center px-2">No Image</div>
      )}
      <div 
        onClick={() => { setTargetUpload({ section, idx, field }); fileInputRef.current.click(); }}
        className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
      >
        <Upload size={24} className="mb-2" />
        <span className="text-[10px] uppercase tracking-widest text-center">{title}</span>
      </div>
    </div>
  );

  if (isLoading) return <div>Loading config...</div>;

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-gray-50/90 backdrop-blur-md z-50 py-4">
        <h1 className="font-serif text-3xl uppercase">Storefront Manager</h1>
        <button 
          onClick={handleSave}
          disabled={updateMutation.isPending || isUploading}
          className="bg-[#111111] text-white px-6 py-3 font-sans text-xs uppercase tracking-widest hover:bg-[#C5A880] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={16} /> Save Changes
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-4 mb-4 text-sm font-sans sticky top-20 z-40">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-4 mb-4 text-sm font-sans sticky top-20 z-40">{success}</div>}

      <Accordion title="Hero Slider (Sequenced Infinite Video Loop)" defaultOpen={true}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
          <p className="text-xs text-gray-500 font-sans">
            Add multiple videos below. They will automatically play in sequence (Video 1 → Video 2 → ...) and loop infinitely on the homepage.
          </p>
          <button 
            type="button"
            onClick={() => handleAddToArray('heroSlider', { image: '', videoUrl: '', title: '', subtitle: '', link: '/' })} 
            className="text-xs uppercase tracking-widest flex items-center gap-1 text-blue-600 hover:underline font-medium shrink-0"
          >
            <Plus size={14} /> Add Slide / Video
          </button>
        </div>
        <div className="space-y-6">
          {formData.heroSlider.map((slide, idx) => (
            <div key={idx} className="border border-[#EAEAEA] p-4 flex flex-col md:flex-row gap-6 relative bg-white">
              <div className="flex items-center gap-2 absolute top-4 right-4">
                <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase">
                  #{idx + 1} In Sequence
                </span>
                <button 
                  type="button"
                  onClick={() => handleRemoveFromArray('heroSlider', idx)} 
                  className="text-red-500 hover:text-red-700 opacity-60 hover:opacity-100"
                  title="Remove Slide"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {renderImageUpload('heroSlider', idx, 'image', slide.image, "Poster / Cover")}
                {slide.videoUrl && (
                  <div className="aspect-video w-full max-w-[200px] bg-black rounded overflow-hidden relative">
                    <video 
                      src={slide.videoUrl} 
                      muted 
                      playsInline 
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] px-1 py-0.5 rounded uppercase font-mono">
                      Preview
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs uppercase tracking-widest text-gray-500">Video Source (MP4 / Cloudinary)</label>
                    <button 
                      type="button" 
                      onClick={() => { setTargetUpload({ section: 'heroSlider', idx, field: 'videoUrl' }); fileInputRef.current.click(); }}
                      className="text-xs uppercase tracking-widest text-blue-600 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Upload size={13} /> Upload MP4 Video
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={slide.videoUrl || ''} 
                    onChange={e => handleArrayChange('heroSlider', idx, 'videoUrl', e.target.value)} 
                    className="w-full border p-2 text-sm" 
                    placeholder="Video URL (e.g. https://res.cloudinary.com/... or /videos/...)" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    value={slide.title} 
                    onChange={e => handleArrayChange('heroSlider', idx, 'title', e.target.value)} 
                    className="w-full border p-2 text-sm" 
                    placeholder="Title (Optional)" 
                  />
                  <input 
                    type="text" 
                    value={slide.subtitle} 
                    onChange={e => handleArrayChange('heroSlider', idx, 'subtitle', e.target.value)} 
                    className="w-full border p-2 text-sm" 
                    placeholder="Subtitle (Optional)" 
                  />
                </div>
                {renderCategorySelect(slide.link, val => handleArrayChange('heroSlider', idx, 'link', val))}
              </div>
            </div>
          ))}
        </div>
      </Accordion>

      <Accordion title="New In Banner (Left Editorial Tile)">
        <div className="border border-[#EAEAEA] p-4 flex flex-col md:flex-row gap-6 bg-white">
          {renderImageUpload('newInBanner', undefined, 'image', formData.newInBanner?.image, "Banner Image")}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Image URL (Cloudinary or /images/...)</label>
              <input 
                type="text" 
                value={formData.newInBanner?.image || ''} 
                onChange={e => handleObjectChange('newInBanner', 'image', e.target.value)} 
                className="w-full border p-2 text-sm" 
                placeholder="Image URL (e.g. https://res.cloudinary.com/... or /images/prod5.jpg)" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Title</label>
              <input 
                type="text" 
                value={formData.newInBanner?.title || ''} 
                onChange={e => handleObjectChange('newInBanner', 'title', e.target.value)} 
                className="w-full border p-2 text-sm" 
                placeholder="Title (e.g. NEW IN)" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Editorial Subtitle / Quote</label>
              <textarea 
                value={formData.newInBanner?.subtitle || ''} 
                onChange={e => handleObjectChange('newInBanner', 'subtitle', e.target.value)} 
                className="w-full border p-2 text-sm h-20" 
                placeholder="Editorial Quote Text" 
              />
            </div>
            {renderCategorySelect(formData.newInBanner?.link || '/collections/new-arrivals', val => handleObjectChange('newInBanner', 'link', val))}
          </div>
        </div>
      </Accordion>

      <Accordion title="Collections Grid">
        <div className="mb-4 flex justify-end">
          <button onClick={() => handleAddToArray('collectionsGrid', { image: '', title: '', link: '/' })} className="text-xs uppercase tracking-widest flex items-center gap-1 text-blue-600 hover:underline">
            <Plus size={14} /> Add Collection
          </button>
        </div>
        <div className="space-y-6">
          {formData.collectionsGrid.map((col, idx) => (
            <div key={idx} className="border border-[#EAEAEA] p-4 flex gap-6 relative bg-white">
              <button onClick={() => handleRemoveFromArray('collectionsGrid', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 opacity-50 hover:opacity-100"><Trash2 size={18} /></button>
              {renderImageUpload('collectionsGrid', idx, 'image', col.image)}
              <div className="flex-1 space-y-4">
                <input type="text" value={col.title} onChange={e => handleArrayChange('collectionsGrid', idx, 'title', e.target.value)} className="w-full border p-2 text-sm" placeholder="Title" />
                <input type="text" value={col.image || ''} onChange={e => handleArrayChange('collectionsGrid', idx, 'image', e.target.value)} className="w-full border p-2 text-sm" placeholder="Image URL" />
                {renderCategorySelect(col.link, val => handleArrayChange('collectionsGrid', idx, 'link', val))}
              </div>
            </div>
          ))}
        </div>
      </Accordion>

      <Accordion title="Promo Grid">
        <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest">Max 3 items (Large Left, Top Right, Bottom Right)</p>
        <div className="mb-4 flex justify-end">
          <button onClick={() => handleAddToArray('promoGrid', { image: '', title: '', subtitle: '', linkText: '', link: '/' })} disabled={formData.promoGrid.length >= 3} className="text-xs uppercase tracking-widest flex items-center gap-1 text-blue-600 hover:underline disabled:opacity-50">
            <Plus size={14} /> Add Promo
          </button>
        </div>
        <div className="space-y-6">
          {formData.promoGrid.map((promo, idx) => (
            <div key={idx} className="border border-[#EAEAEA] p-4 flex gap-6 relative bg-white">
              <button onClick={() => handleRemoveFromArray('promoGrid', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 opacity-50 hover:opacity-100"><Trash2 size={18} /></button>
              {renderImageUpload('promoGrid', idx, 'image', promo.image)}
              <div className="flex-1 space-y-4">
                <input type="text" value={promo.title} onChange={e => handleArrayChange('promoGrid', idx, 'title', e.target.value)} className="w-full border p-2 text-sm" placeholder="Title" />
                <input type="text" value={promo.subtitle} onChange={e => handleArrayChange('promoGrid', idx, 'subtitle', e.target.value)} className="w-full border p-2 text-sm" placeholder="Subtitle" />
                <input type="text" value={promo.image || ''} onChange={e => handleArrayChange('promoGrid', idx, 'image', e.target.value)} className="w-full border p-2 text-sm" placeholder="Image URL" />
                <input type="text" value={promo.linkText} onChange={e => handleArrayChange('promoGrid', idx, 'linkText', e.target.value)} className="w-full border p-2 text-sm" placeholder="Link Text (e.g. Shop Now)" />
                {renderCategorySelect(promo.link, val => handleArrayChange('promoGrid', idx, 'link', val))}
              </div>
            </div>
          ))}
        </div>
      </Accordion>

      <Accordion title="Watch & Buy">
        <div className="mb-4 flex justify-end">
          <button 
            onClick={() => {
              const nextNum = 48 + formData.watchAndBuy.length + 1;
              const autoSku = `MFD-${nextNum.toString().padStart(3, '0')}`;
              handleAddToArray('watchAndBuy', { videoUrl: '', coverImage: '', productSku: autoSku, views: '1.2K' });
            }} 
            className="text-xs uppercase tracking-widest flex items-center gap-1 text-blue-600 hover:underline"
          >
            <Plus size={14} /> Add Video
          </button>
        </div>
        <div className="space-y-6">
          {formData.watchAndBuy.map((vid, idx) => (
            <div key={idx} className="border border-[#EAEAEA] p-4 flex gap-6 relative bg-white">
              <button onClick={() => handleRemoveFromArray('watchAndBuy', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 opacity-50 hover:opacity-100"><Trash2 size={18} /></button>
              {renderImageUpload('watchAndBuy', idx, 'coverImage', vid.coverImage, "Upload Cover")}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs uppercase tracking-widest text-gray-500">Video Source (Upload or URL)</label>
                    <button 
                      type="button" 
                      onClick={() => { setTargetUpload({ section: 'watchAndBuy', idx, field: 'videoUrl' }); fileInputRef.current.click(); }}
                      className="text-xs uppercase tracking-widest text-blue-600 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Upload size={13} /> Upload MP4 Video
                    </button>
                  </div>
                  <input type="text" value={vid.videoUrl} onChange={e => handleArrayChange('watchAndBuy', idx, 'videoUrl', e.target.value)} className="w-full border p-2 text-sm" placeholder="Cloudinary Video URL or Instagram Reel URL" />
                  {vid.videoUrl && (
                    <p className="text-[10px] text-green-600 mt-1 truncate">Current Video: {vid.videoUrl}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-1">Link Product (Auto-fills SKU & Cover Image)</label>
                  <select 
                    value={productsList.find(p => p.sku === vid.productSku)?._id || ''}
                    onChange={(e) => {
                      const p = productsList.find(item => item._id === e.target.value);
                      if (p) {
                        const updated = [...formData.watchAndBuy];
                        updated[idx].productSku = p.sku;
                        const mainImg = typeof p.images?.[0] === 'object' ? p.images[0].url : p.images?.[0];
                        if (mainImg) updated[idx].coverImage = mainImg;
                        setFormData({ ...formData, watchAndBuy: updated });
                      }
                    }}
                    className="w-full border p-2 text-xs bg-white mb-2 focus:outline-none focus:border-black"
                  >
                    <option value="">-- Choose Product (Auto-fills SKU & Image) --</option>
                    {productsList.map(p => (
                      <option key={p._id} value={p._id}>{p.title} (SKU: {p.sku})</option>
                    ))}
                  </select>
                  <input 
                    type="text" 
                    value={vid.productSku} 
                    onChange={e => handleArrayChange('watchAndBuy', idx, 'productSku', e.target.value)} 
                    className="w-full border p-2 text-sm" 
                    placeholder="Linked Product SKU (e.g. MFD-048)" 
                  />
                </div>

                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1">Views Counter (Auto-increments on site)</label>
                    <input type="text" value={vid.views || '1.2K'} onChange={e => handleArrayChange('watchAndBuy', idx, 'views', e.target.value)} className="w-full border p-2 text-sm" placeholder="Views (e.g. 1.2K)" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Accordion>

      <Accordion title="Formals Split Banner">
        <div className="border border-[#EAEAEA] p-4 flex flex-col md:flex-row gap-6 bg-white">
          {renderImageUpload('formalsSplit', undefined, 'image', formData.formalsSplit.image)}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Image URL</label>
              <input type="text" value={formData.formalsSplit.image || ''} onChange={e => handleObjectChange('formalsSplit', 'image', e.target.value)} className="w-full border p-2 text-sm" placeholder="Image URL" />
            </div>
            <input type="text" value={formData.formalsSplit.title} onChange={e => handleObjectChange('formalsSplit', 'title', e.target.value)} className="w-full border p-2 text-sm" placeholder="Title" />
            <textarea value={formData.formalsSplit.description} onChange={e => handleObjectChange('formalsSplit', 'description', e.target.value)} className="w-full border p-2 text-sm h-24" placeholder="Description" />
            <input type="text" value={formData.formalsSplit.buttonText} onChange={e => handleObjectChange('formalsSplit', 'buttonText', e.target.value)} className="w-full border p-2 text-sm" placeholder="Button Text" />
            {renderCategorySelect(formData.formalsSplit.link, val => handleObjectChange('formalsSplit', 'link', val))}
          </div>
        </div>
      </Accordion>

      <Accordion title="Co-Ords Banner">
        <div className="border border-[#EAEAEA] p-4 flex flex-col md:flex-row gap-6 bg-white">
          {renderImageUpload('coOrdsBanner', undefined, 'image', formData.coOrdsBanner?.image, "Banner Image")}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Image URL (Cloudinary or /images/...)</label>
              <input 
                type="text" 
                value={formData.coOrdsBanner?.image || ''} 
                onChange={e => handleObjectChange('coOrdsBanner', 'image', e.target.value)} 
                className="w-full border p-2 text-sm" 
                placeholder="Image URL (e.g. https://res.cloudinary.com/...)" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Title</label>
              <input 
                type="text" 
                value={formData.coOrdsBanner?.title || ''} 
                onChange={e => handleObjectChange('coOrdsBanner', 'title', e.target.value)} 
                className="w-full border p-2 text-sm" 
                placeholder="Title (e.g. CO-ORDS)" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Subtitle</label>
              <input 
                type="text" 
                value={formData.coOrdsBanner?.subtitle || ''} 
                onChange={e => handleObjectChange('coOrdsBanner', 'subtitle', e.target.value)} 
                className="w-full border p-2 text-sm" 
                placeholder="Subtitle (e.g. PERFECTLY PUT TOGETHER)" 
              />
            </div>
            {renderCategorySelect(formData.coOrdsBanner?.link || '/collections/co-ords', val => handleObjectChange('coOrdsBanner', 'link', val))}
          </div>
        </div>
      </Accordion>

      <Accordion title="Store Locator Banner">
        <div className="border border-[#EAEAEA] p-4 flex flex-col md:flex-row gap-6 bg-white">
          {renderImageUpload('storeLocatorBanner', undefined, 'image', formData.storeLocatorBanner?.image, "Banner Image")}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Image URL (Cloudinary or /images/...)</label>
              <input 
                type="text" 
                value={formData.storeLocatorBanner?.image || ''} 
                onChange={e => handleObjectChange('storeLocatorBanner', 'image', e.target.value)} 
                className="w-full border p-2 text-sm" 
                placeholder="Image URL (e.g. https://res.cloudinary.com/...)" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Title</label>
              <input 
                type="text" 
                value={formData.storeLocatorBanner?.title || ''} 
                onChange={e => handleObjectChange('storeLocatorBanner', 'title', e.target.value)} 
                className="w-full border p-2 text-sm" 
                placeholder="Title (e.g. STORE LOCATOR)" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Subtitle</label>
              <input 
                type="text" 
                value={formData.storeLocatorBanner?.subtitle || ''} 
                onChange={e => handleObjectChange('storeLocatorBanner', 'subtitle', e.target.value)} 
                className="w-full border p-2 text-sm" 
                placeholder="Subtitle (e.g. Step Into The World Of VANYA)" 
              />
            </div>
            {renderCategorySelect(formData.storeLocatorBanner?.link || '/store-locator', val => handleObjectChange('storeLocatorBanner', 'link', val))}
          </div>
        </div>
      </Accordion>

      <Accordion title="#VANYAspotted Gallery">
        <div className="mb-4 flex justify-end">
          <button onClick={() => handleAddToArray('spottedGallery', { image: '', link: '/' })} className="text-xs uppercase tracking-widest flex items-center gap-1 text-blue-600 hover:underline">
            <Plus size={14} /> Add Image
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {formData.spottedGallery.map((item, idx) => (
            <div key={idx} className="border border-[#EAEAEA] p-2 relative bg-white flex flex-col gap-2">
              <button onClick={() => handleRemoveFromArray('spottedGallery', idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 opacity-100 z-10 bg-white rounded p-1"><Trash2 size={14} /></button>
              {renderImageUpload('spottedGallery', idx, 'image', item.image)}
              <input type="text" value={item.link} onChange={e => handleArrayChange('spottedGallery', idx, 'link', e.target.value)} className="w-full border p-1 text-xs" placeholder="Link (Instagram URL)" />
            </div>
          ))}
        </div>
      </Accordion>

      <input type="file" accept="image/*,video/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
    </div>
  );
};

export default AdminHomePage;
