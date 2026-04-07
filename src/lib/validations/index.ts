import { z } from 'zod';

export const couponSchema = z.object({
  code: z.string().min(3).max(50),
  discount_type: z.enum(['percentage', 'fixed']),
  value: z.number().positive(),
  expiry_date: z.string().datetime(), // ISO date string
  is_active: z.boolean().optional(),
});

export const commissionSchema = z.object({
  seller_id: z.number().int().positive(),
  percentage: z.number().min(0).max(100),
});

export const payoutUpdateSchema = z.object({
  status: z.enum(['pending', 'completed', 'failed', 'rejected']),
  transaction_id: z.string().optional(),
});

export const inventoryUpdateSchema = z.object({
  stock: z.number().int().min(0),
  price: z.number().positive().optional(),
  gift_customization: z.boolean().optional(),
});

export const shippingZoneSchema = z.object({
  zone_name: z.string().min(2),
  charge: z.number().min(0),
});

export const ticketSchema = z.object({
  subject: z.string().min(5),
  message: z.string().min(10),
});

export const ticketReplySchema = z.object({
  message: z.string().min(2),
  status: z.enum(['open', 'pending', 'resolved']).optional(),
});
