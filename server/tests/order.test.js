const request = require('supertest');
const express = require('express');
const orderRoutes = require('../routes/orderRoutes');
const Product = require('../models/Product');
const { errorHandler } = require('../middlewares/errorMiddleware');

const app = express();
app.use(express.json());
// Mock user for testing private routes
app.use((req, res, next) => {
  req.user = { _id: '64a1b2c3d4e5f60011223344', role: 'customer' };
  next();
});
app.use('/api/v1/orders', orderRoutes);
app.use(errorHandler);

describe('Order Creation Transaction API', () => {
  it('should successfully create an order and decrement stock', async () => {
    // 1. Create a product in the memory DB
    const product = await Product.create({
      title: 'Test Shirt',
      slug: 'test-shirt',
      sku: 'TEST-123',
      description: 'A nice test shirt',
      price: 1500,
      category: '64a1b2c3d4e5f60011223355',
      images: [
        { url: 'http://test.com/1.jpg', publicId: '1' },
        { url: 'http://test.com/2.jpg', publicId: '2' },
        { url: 'http://test.com/3.jpg', publicId: '3' },
      ],
      variants: [{ size: 'M', stock: 10 }]
    });

    const orderPayload = {
      orderItems: [
        {
          product: product._id,
          title: 'Test Shirt',
          size: 'M',
          quantity: 2,
          price: 1500,
          image: 'http://test.com/1.jpg'
        }
      ],
      shippingAddress: {
        fullName: 'Test User',
        phone: '03001234567',
        addressLine: '123 Test St',
        city: 'Lahore',
        province: 'Punjab'
      },
      paymentMethod: 'COD',
      itemsSubtotal: 3000,
      shippingFee: 250,
      grandTotal: 3250
    };

    const res = await request(app).post('/api/v1/orders').send(orderPayload);
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('orderNumber');
    expect(res.body.grandTotal).toBe(3250);

    // 2. Verify stock was decremented properly
    const updatedProduct = await Product.findById(product._id);
    const mVariant = updatedProduct.variants.find(v => v.size === 'M');
    expect(mVariant.stock).toBe(8); // 10 - 2
  });

  it('should abort transaction and fail if stock is insufficient', async () => {
    const product = await Product.create({
      title: 'Low Stock Shirt',
      slug: 'low-stock',
      sku: 'TEST-LOW',
      description: 'A nice test shirt',
      price: 1500,
      category: '64a1b2c3d4e5f60011223355',
      images: [
        { url: 'http://test.com/1.jpg', publicId: '1' },
        { url: 'http://test.com/2.jpg', publicId: '2' },
        { url: 'http://test.com/3.jpg', publicId: '3' },
      ],
      variants: [{ size: 'S', stock: 1 }] // Only 1 in stock
    });

    const orderPayload = {
      orderItems: [
        {
          product: product._id,
          title: 'Low Stock Shirt',
          size: 'S',
          quantity: 3, // Requesting 3!
          price: 1500,
          image: 'http://test.com/1.jpg'
        }
      ],
      shippingAddress: {
        fullName: 'Test User',
        phone: '03001234567',
        addressLine: '123 Test St',
        city: 'Lahore',
        province: 'Punjab'
      },
      paymentMethod: 'COD',
      itemsSubtotal: 4500,
      shippingFee: 250,
      grandTotal: 4750
    };

    const res = await request(app).post('/api/v1/orders').send(orderPayload);
    
    expect(res.statusCode).toBe(400); // Bad request
    expect(res.body.message).toContain('Insufficient stock');

    // Verify stock was NOT decremented (transaction rollback)
    const updatedProduct = await Product.findById(product._id);
    const sVariant = updatedProduct.variants.find(v => v.size === 'S');
    expect(sVariant.stock).toBe(1); 
  });
});
