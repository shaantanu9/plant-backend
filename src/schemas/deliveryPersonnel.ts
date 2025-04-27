import { z } from 'zod';

// Vehicle schema
const VehicleSchema = z.object({
  type: z.enum(['bicycle', 'motorcycle', 'car', 'van', 'truck']),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().optional(),
  licensePlate: z.string().optional(),
  color: z.string().optional(),
});

// Availability schema
const AvailabilitySchema = z.object({
  day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  startTime: z.string(),
  endTime: z.string(),
});

// Rating schema
const RatingSchema = z.object({
  userId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  createdAt: z.date().optional(),
});

// Main DeliveryPersonnel schema
export const DeliveryPersonnelSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  status: z.enum(['active', 'inactive', 'on_delivery', 'off_duty']),
  vehicle: VehicleSchema,
  currentLocation: z.object({
    lat: z.number(),
    lng: z.number(),
    lastUpdated: z.date(),
  }).optional(),
  availability: z.array(AvailabilitySchema),
  maxDeliveryDistance: z.number().positive(),
  ratings: z.array(RatingSchema).optional(),
  averageRating: z.number().min(0).max(5).optional(),
  deliveryCapacity: z.number().int().positive(),
  completedDeliveries: z.number().int().default(0),
  currentDeliveries: z.array(z.string()).optional(),
  preferredZones: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  bankInfo: z.object({
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
    bankName: z.string().optional(),
  }).optional(),
  insuranceInfo: z.object({
    provider: z.string().optional(),
    policyNumber: z.string().optional(),
    expiryDate: z.date().optional(),
  }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create DeliveryPersonnel schema
export const CreateDeliveryPersonnelSchema = DeliveryPersonnelSchema.omit({
  _id: true,
  averageRating: true,
  completedDeliveries: true,
  createdAt: true,
  updatedAt: true,
}).required({
  userId: true,
  status: true,
  vehicle: true,
  availability: true,
  maxDeliveryDistance: true,
  deliveryCapacity: true,
});

// Update DeliveryPersonnel schema
export const UpdateDeliveryPersonnelSchema = DeliveryPersonnelSchema.partial().omit({
  _id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});