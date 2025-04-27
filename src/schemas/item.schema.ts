import { z } from 'zod';

// Nutritional info schema
const NutritionalInfoSchema = z.object({
  calories: z.number().optional(),
  proteins: z.number().optional(),
  carbs: z.number().optional(),
  fats: z.number().optional(),
  allergens: z.array(z.string()).optional(),
});

// Frequency price schema
const FrequencyPriceSchema = z.object({
  frequency: z.enum(['daily', 'alternate-days', 'weekly', 'monthly']),
  price: z.number().optional(),
});

// Main Item schema
export const ItemSchema = z.object({
  _id: z.string().optional(),

  // Admin relationship
  adminId: z.string(),

  // Basic item details
  name: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  category: z.string().optional(),

  // Container details
  containerType: z.string(),
  requiresReturn: z.boolean().default(true),
  depositAmount: z.number().default(0),

  // Pricing
  price: z.number().positive(),
  discountedPrice: z.number().optional(),
  taxRate: z.number().default(0),

  // Nutritional info
  nutritionalInfo: NutritionalInfoSchema.optional(),

  // Operational flags
  isActive: z.boolean().default(true),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),

  // Subscription options
  availableFrequencies: z.array(FrequencyPriceSchema).optional(),

  // Inventory
  inStock: z.boolean().default(true),
  stockQuantity: z.number().int().optional(),

  // Timestamps
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create Item schema (required fields)
export const CreateItemSchema = ItemSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
}).required({
  adminId: true,
  name: true,
  containerType: true,
  price: true,
});

// Update Item schema (all fields optional)
export const UpdateItemSchema = ItemSchema.partial().omit({
  _id: true,
  adminId: true,
  createdAt: true,
  updatedAt: true,
});

// Item search schema
export const ItemSearchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  adminId: z.string().optional(),
  isActive: z.boolean().optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isGlutenFree: z.boolean().optional(),
  inStock: z.boolean().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sort: z.enum(['name', 'price', 'createdAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});
