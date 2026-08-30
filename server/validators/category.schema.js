const { z } = require('zod');

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(80),
    slug: z.string().min(1),
    description: z.string().max(500).optional(),
    coverImage: z.object({
      url: z.string().url(),
      publicId: z.string().min(1)
    }),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().optional()
  }).strict()
});

const updateCategorySchema = z.object({
  body: createCategorySchema.shape.body.partial().strict(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID')
  })
});

const reorderCategoriesSchema = z.object({
  body: z.object({
    reorders: z.array(z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/),
      sortOrder: z.number().int()
    }))
  }).strict()
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  reorderCategoriesSchema
};
