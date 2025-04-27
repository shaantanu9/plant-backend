import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  // Admin relationship (which business offers this item)
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Basic item details
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  category: { type: String },

  // Container details
  containerType: { type: String, required: true },
  requiresReturn: { type: Boolean, default: true },
  depositAmount: { type: Number, default: 0 },

  // Pricing
  price: { type: Number, required: true },
  discountedPrice: { type: Number },
  taxRate: { type: Number, default: 0 },

  // Nutritional info (for food items)
  nutritionalInfo: {
    calories: { type: Number },
    proteins: { type: Number },
    carbs: { type: Number },
    fats: { type: Number },
    allergens: [{ type: String }],
  },

  // Operational flags
  isActive: { type: Boolean, default: true },
  isVegetarian: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },

  // Subscription options
  availableFrequencies: [
    {
      frequency: {
        type: String,
        enum: ['daily', 'alternate-days', 'weekly', 'monthly'],
      },
      price: { type: Number }, // Override price for specific frequency
    },
  ],

  // Inventory
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes
ItemSchema.index({ adminId: 1, isActive: 1 });
ItemSchema.index({ name: 'text', description: 'text' });

const Item = mongoose.model('Item', ItemSchema);

export default Item;
