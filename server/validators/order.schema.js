const { z } = require('zod');

const createOrderSchema = z.object({
  body: z.object({
    guestInfo: z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(10)
    }).optional(),
    orderItems: z.array(z.object({
      product: z.string().regex(/^[0-9a-fA-F]{24}$/),
      title: z.string(),
      size: z.string(),
      quantity: z.number().int().min(1),
      price: z.number().min(0),
      image: z.string()
    })).min(1),
    shippingAddress: z.object({
      fullName: z.string().min(1),
      phone: z.string().min(10),
      addressLine: z.string().min(1),
      city: z.string().min(1),
      province: z.string().min(1)
    }),
    paymentMethod: z.enum(['COD', 'CARD', 'JAZZCASH', 'EASYPAISA'])
  }).strict()
});

const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
    note: z.string().optional()
  }).strict(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/)
  })
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema
};
