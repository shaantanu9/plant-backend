// import mongoose from "mongoose";
// const DeliveryPersonnelSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//     unique: true,
//   },
//   zone: { type: String, required: true, trim: true },
//   isActive: { type: Boolean, default: true },
//   assignedSubscribers: [
//     { type: mongoose.Schema.Types.ObjectId, ref: "Subscriber" },
//   ],
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// //   module.exports = mongoose.model('DeliveryPersonnel', DeliveryPersonnelSchema);

// const DeliveryPersonnel = mongoose.model(
//   "DeliveryPersonnel",
//   DeliveryPersonnelSchema
// );

// export default DeliveryPersonnel;

import mongoose from 'mongoose';

const DeliveryPersonnelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },

  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },

  // Basic information
  zone: { type: String, required: false, trim: true, default: 'Default Zone' },

  vehicleType: {
    type: String,
    enum: ['bicycle', 'motorcycle', 'car', 'van', 'truck', 'other', 'bike'],
  },
  vehicleNumber: { type: String },

  // Availability
  isActive: { type: Boolean, default: true },
  availableDays: [
    {
      type: String,
      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  ],
  availableTimeSlots: [
    {
      start: { type: String }, // HH:MM format
      end: { type: String }, // HH:MM format
    },
  ],

  // Capacity
  maxDeliveriesPerDay: { type: Number, default: 30 },
  maxWeight: { type: Number }, // Maximum weight in kg

  // Route and zone details
  primaryZones: [{ type: String }],
  secondaryZones: [{ type: String }],
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    lastUpdated: { type: Date },
  },

  // Admins this personnel works for
  assignedAdmins: [
    {
      adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      isPrimary: { type: Boolean, default: false },
    },
  ],

  // Subscriber assignments
  assignedSubscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscriber' }],

  // Performance metrics
  deliveryStats: {
    totalDeliveries: { type: Number, default: 0 },
    completedDeliveries: { type: Number, default: 0 },
    missedDeliveries: { type: Number, default: 0 },
    avgRating: { type: Number, default: 5 },
    containersDelivered: { type: Number, default: 0 },
    containersCollected: { type: Number, default: 0 },
  },

  // Payment details (if relevant)
  paymentDetails: {
    accountNumber: { type: String },
    bankName: { type: String },
    ifscCode: { type: String },
  },

  // Timestamps
  lastActiveAt: { type: Date },
  joiningDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // isDeleted
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedReason: { type: String },

  // adminId
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminName: { type: String },
});

// Indexes
DeliveryPersonnelSchema.index({ zone: 1, isActive: 1 });
DeliveryPersonnelSchema.index({ 'assignedAdmins.adminId': 1 });
DeliveryPersonnelSchema.index({ currentLocation: '2dsphere' });

const DeliveryPersonnel = mongoose.model('DeliveryPersonnel', DeliveryPersonnelSchema);

export default DeliveryPersonnel;
