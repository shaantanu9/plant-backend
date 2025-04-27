import { z } from 'zod';

// Coordinates schema
const CoordinateSchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Full address schema
const FullAddressSchema = z.object({
  street: z.string().optional(),
  apartment: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  coordinates: CoordinateSchema.optional(),
});

// Alternate recipient schema
const AlternateRecipientSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
});

// Notification preferences schema
const NotificationPreferencesSchema = z.object({
  deliveryReminders: z.boolean().default(true),
  returnReminders: z.boolean().default(true),
  promotions: z.boolean().default(true),
});

// Main Subscriber schema
export const SubscriberSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  name: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string(),
  fullAddress: FullAddressSchema.optional(),

  // Delivery preferences
  zone: z.string().trim().optional(),
  subscriptionType: z.enum(['daily', 'weekly']),
  deliveryDays: z.array(z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])),
  preferredTimeSlot: z.string().optional(),
  alternateRecipient: AlternateRecipientSchema.optional(),
  deliveryInstructions: z.string().optional(),

  // Container management
  containerCount: z.number().int().nonnegative().default(0),
  pendingContainers: z.number().int().nonnegative().default(0),
  depositBalance: z.number().default(0),

  // Subscription references
  activeSubscriptions: z.array(z.string()).optional(),

  // Service provider relationships
  assignedTo: z.string().optional(),
  primaryAdmin: z.string().optional(),
  relatedAdmins: z.array(z.string()).optional(),

  // Notifications and reminders
  reminderEnabled: z.boolean().default(true),
  notificationPreferences: NotificationPreferencesSchema.optional(),

  // Status fields
  swapEnabled: z.boolean().default(true),
  isActive: z.boolean().default(true),
  notes: z.string().optional(),

  // Payment information
  paymentMethod: z.string().optional(),
  billingAddress: z.string().optional(),

  // Timestamps
  lastDeliveryDate: z.date().optional(),
  joinDate: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Create Subscriber schema (required fields)
export const CreateSubscriberSchema = SubscriberSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  lastDeliveryDate: true,
  joinDate: true,
  userId: true,
})
  .required({
    name: true,
    mobile: true,
    address: true,
    subscriptionType: true,
    deliveryDays: true,
    zone: true,
    swapEnabled: true,
  })
  // add role to the data
  .transform(data => {
    return {
      ...data,
      role: 'subscriber',
    };
  });

// Update Subscriber schema (all fields optional)
export const UpdateSubscriberSchema = SubscriberSchema.partial().omit({
  _id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
