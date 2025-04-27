import { z } from 'zod';

// Coordinate schema
const CoordinateSchema = z.object({
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Address schema
const AddressSchema = z.object({
  street: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  zipCode: z.string().trim().optional(),
  coordinates: CoordinateSchema.optional(),
});

// Notification preferences schema
const NotificationPreferencesSchema = z.object({
  email: z.boolean().default(true),
  sms: z.boolean().default(true),
  push: z.boolean().default(true),
});

// User preferences schema
const PreferencesSchema = z.object({
  notifications: NotificationPreferencesSchema.optional(),
  language: z.string().default('en'),
  reminderTime: z.string().default('18:00'),
});

// Emergency contact schema
const EmergencyContactSchema = z.object({
  name: z.string().trim().optional(),
  phone: z.string().optional(),
  relationship: z.string().trim().optional(),
});

// Token schema
const TokenSchema = z.object({
  token: z.string(),
  device: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
});

// Business details schema
const BusinessDetailsSchema = z.object({
  businessName: z.string().optional(),
  businessId: z.string().optional(),
});

// Delivery capabilities schema
const DeliveryCapabilitiesSchema = z.object({
  vehicleType: z.string().optional(),
  hasInsulatedBag: z.boolean().default(false),
  hasTemperatureControl: z.boolean().default(false),
});

// Main User schema
export const UserSchema = z.object({
  // Basic user information
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  role: z.enum(['admin', 'delivery', 'subscriber']),
  roles: z.array(z.enum(['admin', 'delivery', 'subscriber'])).optional(),

  // Role-specific references
  deliveryDetails: z.string().optional(),
  subscriberDetails: z.string().optional(),
  personnelDetails: z.string().optional(),

  // Status fields
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),

  // Address and location
  address: AddressSchema.optional(),
  zone: z.string().trim().optional(),

  // Authentication and security
  emailVerified: z.boolean().default(false),
  phoneVerified: z.boolean().default(false),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.date().optional(),
  lastLogin: z.date().optional(),
  loginAttempts: z.number().default(0),
  lockUntil: z.date().optional(),
  tokens: z.array(TokenSchema).optional(),

  // User profile and preferences
  profilePicture: z.string().optional(),
  preferences: PreferencesSchema.optional(),

  // Additional contact information
  alternatePhone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Alternate phone must be 10 digits')
    .optional(),
  emergencyContact: EmergencyContactSchema.optional(),

  // App-specific fields
  fcmToken: z.string().optional(),
  appVersion: z.string().optional(),
  deviceInfo: z.string().optional(),
  onboardingCompleted: z.boolean().default(false),

  // For admin users
  businessDetails: BusinessDetailsSchema.optional(),

  // For delivery personnel
  deliveryCapabilities: DeliveryCapabilitiesSchema.optional(),

  // For all users
  defaultAdmin: z.string().optional(),
  isLoggedIn: z.boolean().default(false),
  logoutTime: z.date().optional(),
  token: z.string().optional(),
});

// Partial schema for updates (all fields optional)
export const UserUpdateSchema = UserSchema.partial();

// Login schema
export const UserLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// create user schema
export const UserCreateSchema = UserSchema.pick({
  name: true,
  email: true,
  password: true,
  phone: true,
  role: true,

  // optional fields
  alternatePhone: true,
  profilePicture: true,
  address: true,
  zone: true,
  businessDetails: true,
  deliveryCapabilities: true,
  preferences: true,
  emergencyContact: true,
  fcmToken: true,
  appVersion: true,
  deviceInfo: true,
  onboardingCompleted: true,
}).required({
  name: true,
  email: true,
  password: true,
  role: true,
});
