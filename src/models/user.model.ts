// import { NextFunction } from "express";
// import mongoose from "mongoose";
// const bcrypt = require("bcryptjs");

// const UserSchema = new mongoose.Schema({
//   // Basic user information
//   name: { type: String, required: true, trim: true },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true,
//   },
//   password: { type: String, required: true, minlength: 8 },
//   phone: { type: String, match: /^[0-9]{10}$/ },
//   role: {
//     type: String,
//     enum: ["admin", "delivery", "subscriber"],
//     required: true,
//   },

//   // Status fields
//   isActive: { type: Boolean, default: true },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },

//   // Address and location information
//   address: {
//     street: { type: String, trim: true },
//     city: { type: String, trim: true },
//     state: { type: String, trim: true },
//     zipCode: { type: String, trim: true },
//     coordinates: {
//       lat: { type: Number },
//       lng: { type: Number }
//     }
//   },
//   zone: { type: String, trim: true }, // For delivery zone assignment

//   // Authentication and security
//   emailVerified: { type: Boolean, default: false },
//   phoneVerified: { type: Boolean, default: false },
//   resetPasswordToken: { type: String },
//   resetPasswordExpires: { type: Date },
//   lastLogin: { type: Date },
//   loginAttempts: { type: Number, default: 0 },
//   lockUntil: { type: Date },
//   tokens: [{
//     token: { type: String },
//     device: { type: String },
//     createdAt: { type: Date, default: Date.now }
//   }],

//   // User profile and preferences
//   profilePicture: { type: String },
//   preferences: {
//     notifications: {
//       email: { type: Boolean, default: true },
//       sms: { type: Boolean, default: true },
//       push: { type: Boolean, default: true }
//     },
//     language: { type: String, default: 'en' },
//     reminderTime: { type: String, default: '18:00' } // Time for delivery reminders
//   },

//   // Role-specific references (using references to maintain separation of concerns)
//   subscriberDetails: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Subscriber'
//   },
//   personnelDetails: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'DeliveryPersonnel'
//   },

//   // Additional contact information
//   alternatePhone: { type: String, match: /^[0-9]{10}$/ },
//   emergencyContact: {
//     name: { type: String, trim: true },
//     phone: { type: String, match: /^[0-9]{10}$/ },
//     relationship: { type: String, trim: true }
//   },

//   // App-specific fields
//   fcmToken: { type: String }, // For push notifications
//   appVersion: { type: String }, // Last used app version
//   deviceInfo: { type: String }, // Device information
//   onboardingCompleted: { type: Boolean, default: false },
// });

// // Hash password before saving
// UserSchema.pre("save", async function (this: any, next: NextFunction) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Update the 'updatedAt' field on save
// UserSchema.pre("save", function(this: any, next: NextFunction) {
//   this.updatedAt = new Date();
//   next();
// });

// // Method to compare passwords
// UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// // Method to check if account is locked
// UserSchema.methods.isLocked = function(): boolean {
//   // Check if lockUntil exists and is greater than current time
//   return !!(this.lockUntil && this.lockUntil > Date.now());
// };

// // Method to generate password reset token
// UserSchema.methods.generatePasswordResetToken = function(): string {
//   // Generate a random token
//   const resetToken = require('crypto').randomBytes(32).toString('hex');

//   // Hash and set the token to the user
//   this.resetPasswordToken = require('crypto')
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   // Set expiration (1 hour)
//   this.resetPasswordExpires = Date.now() + 3600000;

//   return resetToken;
// };

// // Static method to find by email with specific projections
// UserSchema.statics.findByEmail = function(email: string) {
//   return this.findOne({ email }).select('-password -tokens -resetPasswordToken -resetPasswordExpires');
// };

// // Create and export the User model
// const User = mongoose.model("User", UserSchema);

// export default User;

import * as argon2 from 'argon2';
import { NextFunction } from 'express';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // Basic user information
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true, minlength: 8 },
  phone: { type: String },
  role: {
    type: String,
    enum: ['admin', 'delivery', 'subscriber'],
    required: true,
  },
  roles: [{ type: String, enum: ['admin', 'delivery', 'subscriber'] }],

  // role specific fields
  deliveryDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPersonnel',
  },
  subscriberDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscriber',
  },

  // Status fields
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // Address and location information
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  zone: { type: String, trim: true }, // For delivery zone assignment

  // Authentication and security
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  tokens: [
    {
      token: { type: String },
      device: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],

  // User profile and preferences
  profilePicture: { type: String },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    language: { type: String, default: 'en' },
    reminderTime: { type: String, default: '18:00' }, // Time for delivery reminders
  },

  personnelDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPersonnel',
  },

  // Additional contact information
  alternatePhone: { type: String, match: /^[0-9]{10}$/ },
  emergencyContact: {
    name: { type: String, trim: true },
    phone: { type: String },
    relationship: { type: String, trim: true },
  },

  // App-specific fields
  fcmToken: { type: String }, // For push notifications
  appVersion: { type: String }, // Last used app version
  deviceInfo: { type: String }, // Device information
  onboardingCompleted: { type: Boolean, default: false },

  // For admin users
  businessDetails: {
    businessName: { type: String },
    // id
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  },

  // For delivery personnel
  deliveryCapabilities: {
    vehicleType: { type: String },
    hasInsulatedBag: { type: Boolean, default: false },
    hasTemperatureControl: { type: Boolean, default: false },
  },

  // For all users
  defaultAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isLoggedIn: { type: Boolean, default: false },
  logoutTime: { type: Date },
  token: { type: String },
});

// Hash password with Argon2 before saving
UserSchema.pre('save', async function (this: any, next: NextFunction) {
  if (!this.isModified('password')) return next();

  try {
    // Hash password with Argon2 using recommended settings
    this.password = await argon2.hash(this.password, {
      type: argon2.argon2id, // Recommended variant (combines argon2i and argon2d)
      memoryCost: 65536, // 64 MiB memory usage
      timeCost: 3, // 3 iterations
      parallelism: 4, // 4 threads
      hashLength: 32, // 32-byte hash
    });
    next();
  } catch (err) {
    next(err);
  }
});

// Update the 'updatedAt' field on save
UserSchema.pre('save', function (this: any, next: NextFunction) {
  this.updatedAt = new Date();
  next();
});

// Method to compare passwords using Argon2
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (error) {
    throw error;
  }
};

// Method to check if account is locked
UserSchema.methods.isLocked = function (): boolean {
  // Check if lockUntil exists and is greater than current time
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Method to generate password reset token
UserSchema.methods.generatePasswordResetToken = function (): string {
  // Generate a random token
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash and set the token to the user
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set expiration (1 hour)
  this.resetPasswordExpires = Date.now() + 3600000;

  return resetToken;
};

// Static method to find by email with specific projections
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email }).select(
    '-password -tokens -resetPasswordToken -resetPasswordExpires',
  );
};

// Create and export the User model
const User = mongoose.model('User', UserSchema);

export default User;
