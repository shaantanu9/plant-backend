// import mongoose from "mongoose";

// const SubscriberSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//     unique: true,
//   },
//   address: { type: String, required: true, trim: true },
//   subscriptionType: { type: String, enum: ["daily", "weekly"], required: true },
//   swapEnabled: { type: Boolean, default: true },
//   deliveryDays: [
//     { type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
//   ],
//   containerCount: { type: Number, default: 0 },
//   pendingContainers: { type: Number, default: 0 },
//   assignedTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "DeliveryPersonnel",
//   },
//   zone: { type: String, trim: true },
//   notes: { type: String },
//   isActive: { type: Boolean, default: true },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },

//   // Additions to Subscriber model
//   activeSubscriptions: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Subscription",
//     },
//   ],
//   containerDeposit: {
//     totalPaid: { type: Number, default: 0 },
//     refundable: { type: Number, default: 0 },
//   },
//   deliveryAddress: {
//     street: { type: String },
//     city: { type: String },
//     state: { type: String },
//     zipCode: { type: String },
//     landmark: { type: String },
//     coordinates: {
//       lat: { type: Number },
//       lng: { type: Number },
//     },
//   },
//   deliveryPreferences: {
//     timeSlotPreference: { type: String },
//     alternateRecipient: {
//       name: { type: String },
//       phone: { type: String },
//     },
//     leaveAtDoor: { type: Boolean, default: false },
//     specialInstructions: { type: String },
//   },
// });

// // module.exports = mongoose.model("Subscriber", SubscriberSchema);

// const Subscriber = mongoose.model("Subscriber", SubscriberSchema);

// export default Subscriber;

import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { type: String, required: false },
  mobile: { type: String, required: false },
  // Address details (more comprehensive)
  address: { type: String, required: true, trim: true },
  fullAddress: {
    street: { type: String },
    apartment: { type: String },
    landmark: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },

  // Delivery preferences
  zone: { type: String, trim: true },
  subscriptionType: { type: String, enum: ['daily', 'weekly'], required: true },
  deliveryDays: [{ type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }],
  preferredTimeSlot: { type: String },
  alternateRecipient: {
    name: { type: String },
    phone: { type: String },
  },
  customFrequency: {
    interval: { type: Number },
    intervalUnit: {
      type: String,
      enum: ['days', 'weeks', 'months'],
    },
  },
  deliveryInstructions: { type: String },

  // Container management
  containerCount: { type: Number, default: 0 },
  pendingContainers: { type: Number, default: 0 },
  depositBalance: { type: Number, default: 0 },

  // Subscription references
  activeSubscriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
    },
  ],

  // Service provider relationships
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPersonnel',
  },
  primaryAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the main vendor they subscribe from
  },
  relatedAdmins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // All vendors they subscribe from
    },
  ],

  // Notifications and reminders
  reminderEnabled: { type: Boolean, default: true },
  notificationPreferences: {
    deliveryReminders: { type: Boolean, default: true },
    returnReminders: { type: Boolean, default: true },
    promotions: { type: Boolean, default: true },
  },

  // Status fields
  swapEnabled: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  notes: { type: String },

  // Payment information
  paymentMethod: { type: String },
  billingAddress: { type: String },

  // Timestamps
  lastDeliveryDate: { type: Date },
  joinDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isCustomFrequency: { type: Boolean, default: false },
  customFrequencyInterval: { type: Number },
  customFrequencyIntervalUnit: {
    type: String,
    enum: ['days', 'weeks', 'months'],
  },
  nextBillingDate: { type: Date },
  depositPaid: { type: Number, default: 0 },
  depositRefundable: { type: Number, default: 0 },
  assignedContainers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Container',
    },
  ],
  pendingContainerReturns: { type: Number, default: 0 },
});

// Indexes
SubscriberSchema.index({ zone: 1, isActive: 1 });
SubscriberSchema.index({ 'fullAddress.coordinates': '2dsphere' });

const Subscriber = mongoose.model('Subscriber', SubscriberSchema);

export default Subscriber;
// import {deliveryPersonnelService} from '../../lib/api/services';
