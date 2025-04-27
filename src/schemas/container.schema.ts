import { z } from 'zod';

// Container contents schema
const ContainerContentSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().int().positive(),
  expiryDate: z.date().optional(),
  temperatureRequirements: z.object({
    minTemp: z.number(),
    maxTemp: z.number(),
    unit: z.enum(['C', 'F']).default('C'),
  }).optional(),
});

// Temperature log schema
const TemperatureLogSchema = z.object({
  timestamp: z.date(),
  temperature: z.number(),
  humidity: z.number().optional(),
  recordedBy: z.string().optional(),
});

// Main Container schema
export const ContainerSchema = z.object({
  _id: z.string().optional(),
  containerId: z.string().uuid().optional(),
  qrCode: z.string().optional(),
  type: z.enum(['standard', 'cold', 'frozen', 'heated', 'fragile']),
  status: z.enum(['available', 'in_use', 'in_transit', 'delivered', 'returned', 'damaged']),
  size: z.enum(['small', 'medium', 'large', 'extra_large']),
  currentLocation: z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
    address: z.string().optional(),
    updatedAt: z.date().optional(),
  }).optional(),
  contents: z.array(ContainerContentSchema).optional(),
  assignedTo: z.string().optional(),
  assignedToDelivery: z.string().optional(),
  temperatureLogs: z.array(TemperatureLogSchema).optional(),
  currentTemperature: z.number().optional(),
  batteryLevel: z.number().min(0).max(100).optional(),
  maintenanceHistory: z.array(z.object({
    date: z.date(),
    type: z.enum(['cleaning', 'repair', 'inspection', 'battery_replacement']),
    notes: z.string().optional(),
    performedBy: z.string(),
  })).optional(),
  lastCleaned: z.date().optional(),
  purchaseDate: z.date().optional(),
  warrantyExpiry: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create Container schema
export const CreateContainerSchema = ContainerSchema.omit({
  _id: true,
  temperatureLogs: true,
  maintenanceHistory: true,
  createdAt: true,
  updatedAt: true,
}).required({
  type: true,
  status: true,
  size: true,
});

// Update Container schema
export const UpdateContainerSchema = ContainerSchema.partial().omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});