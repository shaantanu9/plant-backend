import { Model } from 'mongoose';
import ItemModel from '@models/item.model';
import { toObjectId } from '@utils';
import BaseEntity from './base.entity';

class ItemEntity extends BaseEntity {
  constructor(model: Model<any>) {
    super(model);
  }

  // *** Basic CRUD operations ***

  public async addItem(data: any) {
    return this.create(data);
  }

  public async getItemById(itemId: string) {
    return this.findOne({ _id: toObjectId(itemId) });
  }

  public async updateItem(itemId: string, data: any) {
    return this.findOneAndUpdate({ _id: toObjectId(itemId) }, data, { new: true });
  }

  public async removeItemById(itemId: string) {
    return this.deleteOne({ _id: toObjectId(itemId) });
  }

  // *** Admin-specific operations ***

  public async getItemsByAdminId(adminId: string) {
    return this.find({ adminId: toObjectId(adminId) });
  }

  public async getActiveItemsByAdminId(adminId: string) {
    return this.find({
      adminId: toObjectId(adminId),
      isActive: true,
    });
  }

  public async toggleItemActiveStatus(itemId: string, isActive: boolean) {
    return this.updateOne(
      { _id: toObjectId(itemId) },
      {
        isActive,
        updatedAt: new Date(),
      },
    );
  }

  public async countItemsByAdmin(adminId: string) {
    return this.model.countDocuments({
      adminId: toObjectId(adminId),
    });
  }

  public async getAdminItemSummary(adminId: string) {
    return this.model.aggregate([
      { $match: { adminId: toObjectId(adminId) } },
      {
        $group: {
          _id: {
            isActive: '$isActive',
            containerType: '$containerType',
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          isActive: '$_id.isActive',
          containerType: '$_id.containerType',
          count: 1,
        },
      },
      { $sort: { containerType: 1, isActive: -1 } },
    ]);
  }

  // *** Search and filtering operations ***

  public async searchItems(
    query: string,
    filters: any = {},
    adminId?: string,
    activeOnly: boolean = true,
  ) {
    const searchCondition: any = {
      $or: [
        { name: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') },
        { category: new RegExp(query, 'i') },
      ],
    };

    if (adminId) {
      searchCondition.adminId = toObjectId(adminId);
    }

    if (activeOnly) {
      searchCondition.isActive = true;
    }

    // Apply additional filters
    if (filters.containerType) {
      searchCondition.containerType = filters.containerType;
    }

    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      searchCondition.price = {};

      if (filters.priceMin !== undefined) {
        searchCondition.price.$gte = parseFloat(filters.priceMin);
      }

      if (filters.priceMax !== undefined) {
        searchCondition.price.$lte = parseFloat(filters.priceMax);
      }
    }

    if (filters.category) {
      searchCondition.category = filters.category;
    }

    // Dietary preference filters
    if (filters.isVegetarian) {
      searchCondition.isVegetarian = true;
    }

    if (filters.isVegan) {
      searchCondition.isVegan = true;
    }

    if (filters.isGlutenFree) {
      searchCondition.isGlutenFree = true;
    }

    // Stock availability
    if (filters.inStock) {
      searchCondition.inStock = true;
    }

    return this.find(searchCondition);
  }

  public async getItemsByCategory(category: string, adminId?: string) {
    const query: any = { category };

    if (adminId) {
      query.adminId = toObjectId(adminId);
      query.isActive = true;
    }

    return this.find(query);
  }

  public async getItemsByContainerType(containerType: string, adminId?: string) {
    const query: any = { containerType };

    if (adminId) {
      query.adminId = toObjectId(adminId);
      query.isActive = true;
    }

    return this.find(query);
  }

  public async getItemsWithDietaryPreferences(
    preferences: {
      vegetarian?: boolean;
      vegan?: boolean;
      glutenFree?: boolean;
    },
    adminId?: string,
  ) {
    const query: any = { isActive: true };

    if (preferences.vegetarian) {
      query.isVegetarian = true;
    }

    if (preferences.vegan) {
      query.isVegan = true;
    }

    if (preferences.glutenFree) {
      query.isGlutenFree = true;
    }

    if (adminId) {
      query.adminId = toObjectId(adminId);
    }

    return this.find(query);
  }

  // *** Pricing and subscription operations ***

  public async updateItemPrice(itemId: string, price: number, discountedPrice?: number) {
    const updateData: any = {
      price,
      updatedAt: new Date(),
    };

    if (discountedPrice !== undefined) {
      updateData.discountedPrice = discountedPrice;
    }

    return this.updateOne({ _id: toObjectId(itemId) }, updateData);
  }

  public async updateItemFrequencies(
    itemId: string,
    frequencies: Array<{ frequency: string; price: number }>,
  ) {
    return this.updateOne(
      { _id: toObjectId(itemId) },
      {
        availableFrequencies: frequencies,
        updatedAt: new Date(),
      },
    );
  }

  public async addItemFrequency(itemId: string, frequency: string, price: number) {
    // First check if the frequency already exists
    const item: any = await this.findOne({ _id: toObjectId(itemId) }, { availableFrequencies: 1 });

    if (!item) return null;

    const existingFrequency = item.availableFrequencies?.find(
      (f: any) => f.frequency === frequency,
    );

    if (existingFrequency) {
      // Update existing frequency price
      return this.updateOne(
        {
          _id: toObjectId(itemId),
          'availableFrequencies.frequency': frequency,
        },
        {
          'availableFrequencies.$.price': price,
          updatedAt: new Date(),
        },
      );
    } else {
      // Add new frequency
      return this.updateOne(
        { _id: toObjectId(itemId) },
        {
          $push: {
            availableFrequencies: { frequency, price },
          },
          updatedAt: new Date(),
        },
      );
    }
  }

  public async removeItemFrequency(itemId: string, frequency: string) {
    return this.updateOne(
      { _id: toObjectId(itemId) },
      {
        $pull: {
          availableFrequencies: { frequency },
        },
        updatedAt: new Date(),
      },
    );
  }

  public async updateItemTaxRate(itemId: string, taxRate: number) {
    return this.updateOne(
      { _id: toObjectId(itemId) },
      {
        taxRate,
        updatedAt: new Date(),
      },
    );
  }

  public async getPriceForFrequency(itemId: string, frequency: string) {
    const item: any = await this.findOne(
      { _id: toObjectId(itemId) },
      { price: 1, availableFrequencies: 1 },
    );

    if (!item) return null;

    const frequencyOption = item.availableFrequencies?.find((f: any) => f.frequency === frequency);

    if (frequencyOption && frequencyOption.price !== undefined) {
      return frequencyOption.price;
    }

    return item.price;
  }

  // *** Inventory operations ***

  public async updateItemStock(itemId: string, inStock: boolean, quantity?: number) {
    const updateData: any = {
      inStock,
      updatedAt: new Date(),
    };

    if (quantity !== undefined) {
      updateData.stockQuantity = quantity;
    }

    return this.updateOne({ _id: toObjectId(itemId) }, updateData);
  }

  public async incrementStockQuantity(itemId: string, amount: number) {
    return this.updateOne(
      { _id: toObjectId(itemId) },
      {
        $inc: { stockQuantity: amount },
        updatedAt: new Date(),
      },
    );
  }

  public async decrementStockQuantity(itemId: string, amount: number) {
    // First check if we have enough quantity
    const item: any = await this.findOne({ _id: toObjectId(itemId) }, { stockQuantity: 1 });

    if (!item || !item.stockQuantity || item.stockQuantity < amount) {
      // Not enough stock
      return { success: false, message: 'Insufficient stock' };
    }

    // Update stock
    const newQuantity = item.stockQuantity - amount;

    return this.updateOne(
      { _id: toObjectId(itemId) },
      {
        stockQuantity: newQuantity,
        inStock: newQuantity > 0,
        updatedAt: new Date(),
      },
    );
  }

  public async getItemsWithLowStock(threshold: number, adminId?: string) {
    const query: any = {
      stockQuantity: { $lte: threshold },
      isActive: true,
    };

    if (adminId) {
      query.adminId = toObjectId(adminId);
    }

    return this.find(query);
  }

  // *** Category management ***

  public async getAdminCategories(adminId: string) {
    return this.model.distinct('category', {
      adminId: toObjectId(adminId),
      isActive: true,
    });
  }

  public async getItemCountByCategory(adminId: string) {
    return this.model.aggregate([
      {
        $match: {
          adminId: toObjectId(adminId),
          isActive: true,
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);
  }

  // *** Container-related operations ***

  public async updateContainerSettings(
    itemId: string,
    containerType: string,
    requiresReturn: boolean,
    depositAmount: number,
  ) {
    return this.updateOne(
      { _id: toObjectId(itemId) },
      {
        containerType,
        requiresReturn,
        depositAmount,
        updatedAt: new Date(),
      },
    );
  }

  public async getContainerTypes(adminId: string) {
    return this.model.distinct('containerType', {
      adminId: toObjectId(adminId),
      isActive: true,
    });
  }

  public async getItemsRequiringDeposit(adminId: string) {
    return this.find({
      adminId: toObjectId(adminId),
      depositAmount: { $gt: 0 },
      requiresReturn: true,
      isActive: true,
    });
  }

  // *** Nutritional information operations ***

  public async updateNutritionalInfo(
    itemId: string,
    nutritionalInfo: {
      calories?: number;
      proteins?: number;
      carbs?: number;
      fats?: number;
      allergens?: string[];
    },
  ) {
    // Build the update object with only fields that are provided
    const updateFields: any = {};

    for (const [key, value] of Object.entries(nutritionalInfo)) {
      if (value !== undefined) {
        updateFields[`nutritionalInfo.${key}`] = value;
      }
    }

    updateFields.updatedAt = new Date();

    return this.updateOne({ _id: toObjectId(itemId) }, updateFields);
  }

  public async addAllergen(itemId: string, allergen: string) {
    return this.updateOne(
      { _id: toObjectId(itemId) },
      {
        $addToSet: { 'nutritionalInfo.allergens': allergen },
        updatedAt: new Date(),
      },
    );
  }

  public async removeAllergen(itemId: string, allergen: string) {
    return this.updateOne(
      { _id: toObjectId(itemId) },
      {
        $pull: { 'nutritionalInfo.allergens': allergen },
        updatedAt: new Date(),
      },
    );
  }

  public async getItemsWithAllergens(allergens: string[], adminId?: string) {
    const query: any = {
      'nutritionalInfo.allergens': { $in: allergens },
      isActive: true,
    };

    if (adminId) {
      query.adminId = toObjectId(adminId);
    }

    return this.find(query);
  }

  // *** Bulk operations and statistics ***

  public async bulkUpdatePrices(
    updates: { itemId: string; price: number; discountedPrice?: number }[],
  ) {
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: toObjectId(update.itemId) },
        update: {
          $set: {
            price: update.price,
            ...(update.discountedPrice !== undefined
              ? { discountedPrice: update.discountedPrice }
              : {}),
            updatedAt: new Date(),
          },
        },
      },
    }));

    if (bulkOps.length > 0) {
      return this.model.bulkWrite(bulkOps);
    }

    return { modifiedCount: 0 };
  }

  public async bulkToggleActiveStatus(itemIds: string[], isActive: boolean) {
    const objectIds = itemIds.map(id => toObjectId(id));

    return this.updateMany(
      { _id: { $in: objectIds } },
      {
        isActive,
        updatedAt: new Date(),
      },
    );
  }

  public async getPopularItems(adminId: string, limit: number = 5) {
    // This would typically require joining with subscription or order data
    // This is a placeholder - in a real app, you'd use order history or subscription counts
    return this.find(
      {
        adminId: toObjectId(adminId),
        isActive: true,
      },
      {},
      { limit },
    );
  }

  public async getRecentItems(adminId: string, limit: number = 5) {
    return this.find(
      {
        adminId: toObjectId(adminId),
        isActive: true,
      },
      {},
      { sort: { createdAt: -1 }, limit },
    );
  }

  public async getItemStatsByContainerType(adminId: string) {
    return this.model.aggregate([
      { $match: { adminId: toObjectId(adminId) } },
      {
        $group: {
          _id: '$containerType',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          requiresReturnCount: {
            $sum: { $cond: ['$requiresReturn', 1, 0] },
          },
          totalDepositValue: { $sum: '$depositAmount' },
        },
      },
      {
        $project: {
          _id: 0,
          containerType: '$_id',
          count: 1,
          avgPrice: 1,
          requiresReturnCount: 1,
          totalDepositValue: 1,
          returnRate: {
            $multiply: [{ $divide: ['$requiresReturnCount', '$count'] }, 100],
          },
        },
      },
      { $sort: { count: -1 } },
    ]);
  }
}

export const ItemEntities = new ItemEntity(ItemModel);
