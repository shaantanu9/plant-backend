// import mongoose from "mongoose";

// const DeliverySchema = new mongoose.Schema({
//   subscriberId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Subscriber",
//     required: true,
//   },
//   personnelId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "DeliveryPersonnel",
//     required: true,
//   },
//   date: { type: Date, required: true },
//   scheduledTime: { type: String },
//   status: {
//     type: String,
//     enum: ["scheduled", "pending", "completed", "missed"],
//     default: "scheduled",
//   },
//   containersToDeliver: { type: Number, required: true, min: 0 },
//   containersDelivered: { type: Number, default: 0, min: 0 },
//   containersToReturn: { type: Number, required: true, min: 0 },
//   containersReturned: { type: Number, default: 0, min: 0 },
//   notes: { type: String },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// // Unique index for subscriber delivery per day
// DeliverySchema.index({ subscriberId: 1, date: 1 }, { unique: true });

// //   module.exports = mongoose.model('Delivery', DeliverySchema);
// const Delivery = mongoose.model("Delivery", DeliverySchema);

// export default Delivery;

import mongoose from 'mongoose';

const DeliverySchema = new mongoose.Schema({
  // Basic relationship fields
  subscriberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscriber',
    required: true,
  },
  personnelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPersonnel',
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The vendor/admin whose items are being delivered
    required: true,
  },

  // Schedule information
  date: { type: Date, required: true },
  scheduledTime: { type: String },
  actualDeliveryTime: { type: Date },
  estimatedArrival: { type: Date },

  // Multiple subscriptions in one delivery
  subscriptions: [
    {
      subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
      },
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
      },
      quantity: { type: Number },
      fulfilled: { type: Boolean, default: false },
    },
  ],

  // Container tracking - enhanced
  containersToDeliver: { type: Number, required: true, min: 0 },
  containersDelivered: { type: Number, default: 0, min: 0 },
  containersToReturn: { type: Number, required: true, min: 0 },
  containersReturned: { type: Number, default: 0, min: 0 },

  // Detailed container tracking
  containerDetails: {
    delivered: [
      {
        containerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Container' },
        condition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
        verified: { type: Boolean, default: false },
      },
    ],
    returned: [
      {
        containerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Container' },
        condition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
        verified: { type: Boolean, default: false },
      },
    ],
  },

  // Status tracking
  status: {
    type: String,
    enum: ['scheduled', 'in-transit', 'delivered', 'partial', 'missed', 'cancelled'],
    default: 'scheduled',
  },

  // Delivery verification
  verificationMethod: {
    type: String,
    enum: ['signature', 'photo', 'code', 'none'],
    default: 'none',
  },
  verificationData: { type: String }, // Signature image URL, photo URL, or verification code

  // Notes and communication
  notes: { type: String },
  subscriberNotes: { type: String }, // Notes from the subscriber
  personnelNotes: { type: String }, // Notes from delivery personnel

  // Route information
  routeOrder: { type: Number }, // Position in delivery route
  deliveryDistance: { type: Number }, // Distance in km

  // Payment tracking (especially for COD)
  paymentCollected: { type: Boolean, default: false },
  amountCollected: { type: Number, default: 0 },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Unique index for subscriber delivery per day
DeliverySchema.index({ subscriberId: 1, adminId: 1, date: 1 }, { unique: true });
DeliverySchema.index({ personnelId: 1, date: 1, status: 1 });
DeliverySchema.index({ date: 1, status: 1 });

const Delivery = mongoose.model('Delivery', DeliverySchema);

export default Delivery;
