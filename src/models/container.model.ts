// import mongoose from "mongoose";

// const ContainerSchema = new mongoose.Schema({
//   // Basic identification
//   name: { type: String, required: true },
//   description: { type: String },
//   containerType: {
//     type: String,
//     enum: ["milk-jar", "tiffin", "food-box", "water-can", "bottle", "other"],
//     required: true
//   },

//   // Admin relationship (which business owns this container)
//   adminId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },

//   // Item relationship (what product is this container for)
//   itemId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Item"
//   },

//   // Tracking fields
//   serialNumber: { type: String },
//   qrCode: { type: String },
//   batchNumber: { type: String },

//   // Container metrics
//   capacity: { type: Number }, // in ml
//   material: { type: String },
//   weight: { type: Number }, // in grams

//   // Current state
//   subscriberId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Subscriber"
//   },
//   subscriptionId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Subscription"
//   },
//   status: {
//     type: String,
//     enum: [
//       "in-inventory",
//       "assigned",
//       "in-transit-to-subscriber",
//       "with-subscriber",
//       "in-transit-to-warehouse",
//       "returned",
//       "being-cleaned",
//       "under-maintenance",
//       "lost",
//       "damaged"
//     ],
//     default: "in-inventory"
//   },
//   condition: {
//     type: String,
//     enum: ["excellent", "good", "fair", "poor", "unusable"],
//     default: "excellent"
//   },

//   // Tracking logistics
//   deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: "Delivery" },
//   returnDeliveryId: { type: mongoose.Schema.Types.ObjectId, ref: "Delivery" },
//   deliveryDate: { type: Date },
//   expectedReturnDate: { type: Date },
//   actualReturnDate: { type: Date },

//   // Financial tracking
//   depositAmount: { type: Number, default: 0 },
//   depositCollected: { type: Boolean, default: false },
//   depositRefunded: { type: Boolean, default: false },

//   // Maintenance
//   lastCleanedAt: { type: Date },
//   cleanedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   maintenanceHistory: [{
//     date: { type: Date },
//     type: { type: String, enum: ["cleaning", "repair", "inspection"] },
//     notes: { type: String },
//     performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
//   }],

//   // History tracking
//   statusHistory: [{
//     status: { type: String },
//     date: { type: Date, default: Date.now },
//     updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     notes: { type: String }
//   }],

//   // Timestamps
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Middleware to update timestamps
// ContainerSchema.pre('save', function(next) {
//   this.updatedAt = new Date();
//   next();
// });

// // Method to update status with history
// ContainerSchema.methods.updateStatus = function(status, userId, notes = '') {
//   this.status = status;
//   this.statusHistory.push({
//     status,
//     date: new Date(),
//     updatedBy: userId,
//     notes
//   });
//   return this.save();
// };

// // Indexes for efficient queries
// ContainerSchema.index({ adminId: 1, status: 1 });
// ContainerSchema.index({ subscriberId: 1, status: 1 });
// ContainerSchema.index({ serialNumber: 1 });
// ContainerSchema.index({ qrCode: 1 });

// const Container = mongoose.model("Container", ContainerSchema);

// export default Container;

import mongoose from 'mongoose';

const ContainerSchema = new mongoose.Schema({
  // Basic identification
  name: { type: String, required: true },
  description: { type: String },
  containerType: {
    type: String,
    enum: ['milk-jar', 'tiffin', 'food-box', 'water-can', 'bottle', 'other'],
    required: true,
  },

  // Admin relationship (which business owns this container)
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Item relationship (what product is this container for)
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
  },

  // Tracking fields
  serialNumber: { type: String },
  qrCode: { type: String },
  batchNumber: { type: String },

  // Container metrics
  capacity: { type: Number }, // in ml
  material: { type: String },
  weight: { type: Number }, // in grams

  // Current state
  subscriberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscriber',
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
  },
  status: {
    type: String,
    enum: [
      'in-inventory',
      'assigned',
      'in-transit-to-subscriber',
      'with-subscriber',
      'in-transit-to-warehouse',
      'returned',
      'being-cleaned',
      'under-maintenance',
      'lost',
      'damaged',
    ],
    default: 'in-inventory',
  },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'unusable'],
    default: 'excellent',
  },

  // Tracking logistics
  deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' },
  returnDeliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' },
  deliveryDate: { type: Date },
  expectedReturnDate: { type: Date },
  actualReturnDate: { type: Date },

  // Financial tracking
  depositAmount: { type: Number, default: 0 },
  depositCollected: { type: Boolean, default: false },
  depositRefunded: { type: Boolean, default: false },

  // Maintenance
  lastCleanedAt: { type: Date },
  cleanedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  maintenanceHistory: [
    {
      date: { type: Date },
      type: { type: String, enum: ['cleaning', 'repair', 'inspection'] },
      notes: { type: String },
      performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],

  // History tracking
  statusHistory: [
    {
      status: { type: String },
      date: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      notes: { type: String },
    },
  ],

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update timestamps
ContainerSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Method to update status with history
interface StatusHistory {
  status: string;
  date: Date;
  updatedBy: mongoose.Schema.Types.ObjectId;
  notes: string;
}

interface UpdateStatusFunction {
  (
    status: string,
    userId: mongoose.Schema.Types.ObjectId,
    notes?: string,
  ): Promise<mongoose.Document>;
}

ContainerSchema.methods.updateStatus = function (
  this: mongoose.Document & { status: string; statusHistory: StatusHistory[] },
  status: string,
  userId: mongoose.Schema.Types.ObjectId,
  notes: string = '',
): Promise<mongoose.Document> {
  this.status = status;
  this.statusHistory.push({
    status,
    date: new Date(),
    updatedBy: userId,
    notes,
  });
  return this.save();
} as UpdateStatusFunction;

// Indexes for efficient queries
ContainerSchema.index({ adminId: 1, status: 1 });
ContainerSchema.index({ subscriberId: 1, status: 1 });
ContainerSchema.index({ serialNumber: 1 });
ContainerSchema.index({ qrCode: 1 });

const Container = mongoose.model('Container', ContainerSchema);

export default Container;
