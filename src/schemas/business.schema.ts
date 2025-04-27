// import { object, string } from 'zod';
// import { commonSchema } from './common.schema';
// export const CreateBusinessSchema = object({
//   businessName: commonSchema.name,
//   businessType: string({
//     required_error: 'Business type is required',
//   }),
//   description: commonSchema.description,

//   address: object({
//     street: string(),
//     city: string(),
//     state: string(),
//     postalCode: string(),
//     country: string(),
//   }),
// });

// export const UpdateBusinessSchema = object({
//   name: commonSchema.name.optional(),
//   type: string().optional(),
//   description: commonSchema.description.optional(),
//   address: object({
//     street: string().optional(),
//     city: string().optional(),
//     state: string().optional(),
//     postalCode: string().optional(),
//     country: string().optional(),
//   }).optional(),
// });


import { z } from 'zod';

// Business hours schema
const BusinessHoursSchema = z.object({
  day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  open: z.string(),
  close: z.string(),
  isClosed: z.boolean().default(false),
});

// Main Business schema
export const BusinessSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Business name is required"),
  description: z.string().optional(),
  type: z.enum(['restaurant', 'grocery', 'farm', 'manufacturer', 'distributor']),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string(),
  website: z.string().url().optional(),
  logo: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string().default('US'),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
  businessHours: z.array(BusinessHoursSchema).optional(),
  ownerId: z.string(),
  managers: z.array(z.string()).optional(),
  taxId: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseExpiry: z.date().optional(),
  certifications: z.array(z.string()).optional(),
  paymentMethods: z.array(z.enum([
    'credit_card', 'debit_card', 'bank_transfer', 'check', 'cash'
  ])).optional(),
  status: z.enum(['active', 'pending', 'suspended', 'inactive']).default('pending'),
  subscription: z.object({
    plan: z.enum(['basic', 'premium', 'enterprise']),
    startDate: z.date(),
    endDate: z.date(),
    autoRenew: z.boolean().default(true),
  }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create Business schema
export const CreateBusinessSchema = BusinessSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
}).required({
  name: true,
  type: true,
  contactEmail: true,
  contactPhone: true,
  address: true,
  ownerId: true,
});

// Update Business schema
export const UpdateBusinessSchema = BusinessSchema.partial().omit({
  _id: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
});