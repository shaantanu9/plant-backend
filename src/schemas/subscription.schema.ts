import { z } from 'zod';

// Product schema for subscription items
const ProductSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  name: z.string(),
  price: z.number().positive(),
  frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly']),
});

// Delivery window schema
const DeliveryWindowSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  days: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])),
});

// Billing details schema
const BillingDetailsSchema = z.object({
  paymentMethod: z.enum(['credit_card', 'debit_card', 'bank_transfer', 'wallet']),
  cardLast4: z.string().optional(),
  billingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string().default('US'),
  }),
  autoRenew: z.boolean().default(true),
});

// Main Subscription schema
export const SubscriptionSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  status: z.enum(['active', 'paused', 'cancelled', 'expired']),
  plan: z.enum(['basic', 'premium', 'family']),
  startDate: z.date(),
  endDate: z.date(),
  nextDeliveryDate: z.date(),
  products: z.array(ProductSchema),
  deliveryAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
    instructions: z.string().optional(),
  }),
  deliveryWindow: DeliveryWindowSchema,
  billingDetails: BillingDetailsSchema,
  discountCode: z.string().optional(),
  totalAmount: z.number().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  pauseDetails: z.object({
    pauseStart: z.date(),
    pauseEnd: z.date(),
    reason: z.string(),
  }).optional(),
  cancellationReason: z.string().optional(),
});

// Create Subscription schema
export const CreateSubscriptionSchema = SubscriptionSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
}).required({
  userId: true,
  plan: true,
  products: true,
  deliveryAddress: true,
  deliveryWindow: true,
  billingDetails: true,
});

// Update Subscription schema
export const UpdateSubscriptionSchema = SubscriptionSchema.partial().omit({
  _id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

// Pause Subscription schema
export const PauseSubscriptionSchema = z.object({
  pauseStart: z.date(),
  pauseEnd: z.date(),
  reason: z.string(),
});

// Cancel Subscription schema
export const CancelSubscriptionSchema = z.object({
  cancellationReason: z.string(),
});