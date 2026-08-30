const { z } = require('zod');

const imageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  alt: z.string().optional().default(''),
  isPrimary: z.boolean().optional().default(false)
});

const variantSchema = z.object({
  size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'Free Size']),
  stock: z.number().int().min(0).default(0)
});

const extraFieldSchema = z.object({
  label: z.string().min(1).max(100),
  value: z.string().min(1).max(2000)
});

const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(150),
    slug: z.string().min(1),
    sku: z.string().min(1).regex(/^[A-Z0-9-]+$/i, 'Invalid SKU format').optional(),
    description: z.string().min(1).max(3000),
    fabricDetails: z.string().max(1000).optional(),
    careInstructions: z.array(z.string().max(200)).optional(),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
    collectionTag: z.string().optional(),
    price: z.number().min(0),
    compareAtPrice: z.number().min(0).optional(),
    images: z.array(imageSchema).min(3).max(8),
    variants: z.array(variantSchema).min(1),
    extraFields: z.array(extraFieldSchema).optional(),
    isVideoCommerce: z.boolean().optional(),
    videoUrl: z.string().url().optional(),
    isFeatured: z.boolean().optional(),
    isNewArrival: z.boolean().optional(),
    isBestSeller: z.boolean().optional(),
    status: z.enum(['draft', 'published', 'archived']).optional()
  }).strict()
});

const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial().strict(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID')
  })
});

const updateStockSchema = z.object({
  body: z.object({
    size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'Free Size']),
    delta: z.number().int()
  }).strict(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID')
  })
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  updateStockSchema
};
