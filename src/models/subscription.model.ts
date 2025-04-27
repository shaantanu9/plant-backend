import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  // Relationships
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
  },

  // type of subscription - this is key for differentiating between different subscription types
  subscriptionType: {
    type: String,
    enum: ['physical', 'digital'],
    required: true,
    default: 'physical',
  },
  // Subscription details
  name: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  frequency: {
    type: String,
    enum: ['daily', 'alternate-days', 'weekly', 'monthly'],
    required: true,
  },

  // custome frequency
  customFrequency: {
    interval: { type: Number },
    intervalUnit: {
      type: String,
      enum: ['days', 'weeks', 'months'],
    },
  },

  //  digital subscription details
  platform: {
    type: String,
    enum: ['web', 'mobile', 'desktop'],
  },
  accessLink: { type: String },
  planName: { type: String },
  accountEmail: { type: String },
  userName: { type: String },
  sharedWith: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  renewalDate: { type: Date },
  expiryDate: { type: Date },

  // pricing details
  pricing: {
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    isPerUnit: { type: Boolean, default: false },
  },

  // Schedule details
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  autoRenew: { type: Boolean, default: true },
  deliveryDays: [
    {
      type: String,
      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  ],
  deliveryTimeSlot: {
    from: { type: String }, // HH:MM format
    to: { type: String }, // HH:MM format
  },

  // Payment details
  pricePerUnit: { type: Number, required: true },
  unitName: { type: String },
  billingCycle: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'monthly',
  },
  nextBillingDate: { type: Date },
  depositPaid: { type: Number, default: 0 },

  // Container tracking
  assignedContainers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Container',
    },
  ],
  pendingContainerReturns: { type: Number, default: 0 },
  category: {
    type: String,
    enum: [
      'water',
      'food',
      'entertainment',
      'utilities',
      'software',
      'fitness',
      'education',
      'news',
      'retail',
      'other',
      'dailyneeds',
    ],
  },

  // cancelled subscriptions
  cancalleation: {
    date: { type: Date },
    reason: { type: String },
    refundAmount: { type: Number },
    refundStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    feedback: { type: String },
  },

  // trail period
  trialPeriod: {
    isTrial: { type: Boolean, default: false },
    trialStartDate: { type: Date },
    trialEndDate: { type: Date },
    convertedToPaid: { type: Boolean, default: false },
    convertedDate: { type: Date },
    convertedAmount: { type: Number },
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled', 'completed'],
    default: 'active',
  },

  // Pause history
  pauseHistory: [
    {
      startDate: { type: Date },
      endDate: { type: Date },
      reason: { type: String },
    },
  ],

  paymentHistory: [
    {
      amount: { type: Number },
      date: { type: Date },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
      },
      transactionId: { type: String },
    },
  ],

  // Special instructions
  deliveryInstructions: { type: String },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

SubscriptionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});
// Indexes
SubscriptionSchema.index({ subscriberId: 1, status: 1 });
SubscriptionSchema.index({ adminId: 1, status: 1 });
SubscriptionSchema.index({ itemId: 1 });

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

export default Subscription;
