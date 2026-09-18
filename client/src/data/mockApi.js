import axios from 'axios';
import { mockData } from './mockData'; // Keeping this for announcements & video shopping
import { API_BASE_URL } from '../api/apiClient';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export const mockApi = {
  getCollectionProducts: async (handle, { cursor, limit = 10, sort }) => {
    try {
      const params = { limit };

      // Pass cursor for pagination (base64 encoded by backend)
      if (cursor) {
        params.cursor = cursor;
      }
      
      // Send slug directly to backend — no need to fetch all categories first
      if (handle && handle !== 'all') {
        params.categorySlug = handle;
      }

      const { data } = await api.get('/products', { params });
      
      let items = data.products || [];

      // Handle frontend sorting
      if (sort === 'Price, low to high') {
        items.sort((a, b) => a.price - b.price);
      } else if (sort === 'Price, high to low') {
        items.sort((a, b) => b.price - a.price);
      }

      // Normalize backend product format to frontend format
      items = items.map(p => ({
        ...p,
        id: p._id,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        availableSizes: p.variants?.filter(v => v.stock > 0).map(v => v.size) || [],
        images: p.images?.length > 0 ? p.images.map(img => img.url) : ['/images/placeholder.jpg'],
        collectionHandles: [p.category?.slug || 'all']
      }));

      return {
        items,
        nextCursor: data.nextCursor || null
      };
    } catch (error) {
      console.error('Error fetching collection products:', error);
      return { items: [], nextCursor: null };
    }
  },

  getProduct: async (idOrSku) => {
    try {
      try {
        const { data: p } = await api.get(`/products/${idOrSku}`);
        return {
          ...p,
          id: p._id,
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          availableSizes: p.variants?.filter(v => v.stock > 0).map(v => v.size) || [],
          images: p.images?.length > 0 ? p.images.map(img => img.url) : ['/images/placeholder.jpg'],
          collectionHandles: [p.category?.slug || 'all']
        };
      } catch (idError) {
        const { data } = await api.get('/products', { params: { keyword: idOrSku } });
        if (data.products && data.products.length > 0) {
          const p = data.products[0];
          return {
            ...p,
            id: p._id,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            availableSizes: p.variants?.filter(v => v.stock > 0).map(v => v.size) || [],
            images: p.images?.length > 0 ? p.images.map(img => img.url) : ['/images/placeholder.jpg'],
            collectionHandles: [p.category?.slug || 'all']
          };
        }
        throw new Error("Product not found");
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  getCollections: async () => {
    try {
      const { data } = await api.get('/categories');
      return data.map(cat => ({
        handle: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
        title: cat.name,
        image: cat.coverImage?.url || '/images/hero.jpg' 
      }));
    } catch (error) {
      console.error('Error fetching collections:', error);
      return mockData.collections; // fallback
    }
  },

  getAnnouncements: async () => {
    return mockData.announcements;
  },
  
  getVideoShopping: async () => {
    try {
      const { data } = await api.get('/products', { params: { isVideoCommerce: true, limit: 10 } });
      return data.products.map(p => ({
        id: p._id,
        videoUrl: p.videoUrl,
        coverImage: p.images?.[0]?.url || '/images/placeholder.jpg',
        views: Math.floor(Math.random() * 500) + 100, // fake views for now
        productSlug: p.slug,
        productSku: p.sku
      }));
    } catch (err) {
      return mockData.videoShopping;
    }
  }
};
