import { toObjectId } from '@utils';

// Define the pipeline stage types
type PipelineStage =
  | { $match: { $and: any[] } }
  | {
      $lookup: {
        from: string;
        localField: string;
        foreignField: string;
        as: string;
      };
    }
  | { $unwind: { path: string; preserveNullAndEmptyArrays: boolean } }
  | { $addFields: Record<string, any> }
  | { $sort: Record<string, number> }
  | { $skip: number }
  | { $limit: number }
  | { $count: string }
  | { $project: Record<string, any> }
  | { $group: Record<string, any> };

interface BuildItemQueryPayload {
  // Basic filters
  adminId?: string;
  name?: string;
  category?: string;
  categories?: string[];
  containerType?: string;

  // Price filters
  minPrice?: number;
  maxPrice?: number;
  hasDiscount?: boolean;

  // Container filters
  requiresReturn?: boolean;
  minDepositAmount?: number;
  maxDepositAmount?: number;

  // Dietary filters
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  allergens?: string[];

  // Subscription options
  hasFrequency?: string; // e.g., "daily", "weekly"

  // Inventory filters
  inStock?: boolean;
  minStockQuantity?: number;

  // Active status
  isActive?: boolean;

  // Nutritional filters
  minCalories?: number;
  maxCalories?: number;
  minProteins?: number;
  maxProteins?: number;

  // Pagination & sorting
  sortField?: string;
  sortOrder?: string;
  limit?: number;
  skip?: number;

  // Search
  searchTerm?: string;
}

const buildItemQuery = (payload: BuildItemQueryPayload): PipelineStage[] => {
  const pipeline: PipelineStage[] = [];
  const matchCriteria: PipelineStage = { $match: { $and: [] } };

  // If payload is nearly empty, return all active items
  if (
    Object.keys(payload).length === 0 ||
    (Object.keys(payload).length <= 3 &&
      (payload.limit !== undefined ||
        payload.skip !== undefined ||
        payload.sortField !== undefined))
  ) {
    matchCriteria.$match.$and.push({
      isActive: true,
    });
  }

  // Search term (full-text search across name and description)
  if (payload.searchTerm) {
    matchCriteria.$match.$and.push({
      $or: [
        { name: { $regex: payload.searchTerm, $options: 'i' } },
        { description: { $regex: payload.searchTerm, $options: 'i' } },
        { category: { $regex: payload.searchTerm, $options: 'i' } },
      ],
    });
  }

  // Filter by adminId
  if (payload.adminId) {
    matchCriteria.$match.$and.push({
      adminId: toObjectId(payload.adminId),
    });
  }

  // Filter by name
  if (payload.name) {
    matchCriteria.$match.$and.push({
      name: { $regex: payload.name, $options: 'i' },
    });
  }

  // Filter by category
  if (payload.category) {
    matchCriteria.$match.$and.push({
      category: payload.category,
    });
  }

  // Filter by multiple categories
  if (payload.categories && payload.categories.length > 0) {
    matchCriteria.$match.$and.push({
      category: { $in: payload.categories },
    });
  }

  // Filter by container type
  if (payload.containerType) {
    matchCriteria.$match.$and.push({
      containerType: payload.containerType,
    });
  }

  // Filter by price range
  if (payload.minPrice !== undefined || payload.maxPrice !== undefined) {
    const priceFilter: any = {};
    if (payload.minPrice !== undefined) priceFilter.$gte = payload.minPrice;
    if (payload.maxPrice !== undefined) priceFilter.$lte = payload.maxPrice;
    matchCriteria.$match.$and.push({ price: priceFilter });
  }

  // Filter items with discounts
  if (payload.hasDiscount !== undefined) {
    if (payload.hasDiscount) {
      matchCriteria.$match.$and.push({
        discountedPrice: { $exists: true, $ne: null, $gt: 0 },
        $expr: { $lt: ['$discountedPrice', '$price'] },
      });
    } else {
      matchCriteria.$match.$and.push({
        $or: [
          { discountedPrice: { $exists: false } },
          { discountedPrice: null },
          { $expr: { $gte: ['$discountedPrice', '$price'] } },
        ],
      });
    }
  }

  // Filter by container return requirement
  if (payload.requiresReturn !== undefined) {
    matchCriteria.$match.$and.push({
      requiresReturn: payload.requiresReturn,
    });
  }

  // Filter by deposit amount range
  if (payload.minDepositAmount !== undefined || payload.maxDepositAmount !== undefined) {
    const depositFilter: any = {};
    if (payload.minDepositAmount !== undefined) depositFilter.$gte = payload.minDepositAmount;
    if (payload.maxDepositAmount !== undefined) depositFilter.$lte = payload.maxDepositAmount;
    matchCriteria.$match.$and.push({ depositAmount: depositFilter });
  }

  // Filter by dietary restrictions
  if (payload.isVegetarian !== undefined) {
    matchCriteria.$match.$and.push({
      isVegetarian: payload.isVegetarian,
    });
  }

  if (payload.isVegan !== undefined) {
    matchCriteria.$match.$and.push({
      isVegan: payload.isVegan,
    });
  }

  if (payload.isGlutenFree !== undefined) {
    matchCriteria.$match.$and.push({
      isGlutenFree: payload.isGlutenFree,
    });
  }

  // Filter by allergens (e.g., exclude items with specific allergens)
  if (payload.allergens && payload.allergens.length > 0) {
    matchCriteria.$match.$and.push({
      'nutritionalInfo.allergens': { $not: { $in: payload.allergens } },
    });
  }

  // Filter by subscription frequency
  if (payload.hasFrequency) {
    matchCriteria.$match.$and.push({
      'availableFrequencies.frequency': payload.hasFrequency,
    });
  }

  // Filter by inventory status
  if (payload.inStock !== undefined) {
    matchCriteria.$match.$and.push({
      inStock: payload.inStock,
    });
  }

  // Filter by stock quantity
  if (payload.minStockQuantity !== undefined) {
    matchCriteria.$match.$and.push({
      stockQuantity: { $gte: payload.minStockQuantity },
    });
  }

  // Filter by active status
  if (payload.isActive !== undefined) {
    matchCriteria.$match.$and.push({
      isActive: payload.isActive,
    });
  }

  // Filter by nutritional info - calories
  if (payload.minCalories !== undefined || payload.maxCalories !== undefined) {
    const caloriesFilter: any = {};
    if (payload.minCalories !== undefined) caloriesFilter.$gte = payload.minCalories;
    if (payload.maxCalories !== undefined) caloriesFilter.$lte = payload.maxCalories;
    matchCriteria.$match.$and.push({
      'nutritionalInfo.calories': caloriesFilter,
    });
  }

  // Filter by nutritional info - proteins
  if (payload.minProteins !== undefined || payload.maxProteins !== undefined) {
    const proteinsFilter: any = {};
    if (payload.minProteins !== undefined) proteinsFilter.$gte = payload.minProteins;
    if (payload.maxProteins !== undefined) proteinsFilter.$lte = payload.maxProteins;
    matchCriteria.$match.$and.push({
      'nutritionalInfo.proteins': proteinsFilter,
    });
  }

  // Add the match criteria to the pipeline if there are conditions
  if (matchCriteria.$match.$and.length > 0) {
    pipeline.push(matchCriteria);
  }

  // Add lookup stages to get related data
  pipeline.push({
    $lookup: {
      from: 'users',
      localField: 'adminId',
      foreignField: '_id',
      as: 'adminDetails',
    },
  });

  // Unwind adminDetails but preserve null values
  pipeline.push({
    $unwind: {
      path: '$adminDetails',
      preserveNullAndEmptyArrays: true,
    },
  });

  // Add computed fields
  pipeline.push({
    $addFields: {
      // Calculate the effective price (discounted or regular)
      effectivePrice: {
        $cond: {
          if: {
            $and: [
              { $ne: ['$discountedPrice', null] },
              { $gt: ['$discountedPrice', 0] },
              { $lt: ['$discountedPrice', '$price'] },
            ],
          },
          then: '$discountedPrice',
          else: '$price',
        },
      },
      // Calculate discount percentage
      discountPercentage: {
        $cond: {
          if: {
            $and: [
              { $ne: ['$discountedPrice', null] },
              { $gt: ['$discountedPrice', 0] },
              { $lt: ['$discountedPrice', '$price'] },
            ],
          },
          then: {
            $multiply: [
              {
                $divide: [{ $subtract: ['$price', '$discountedPrice'] }, '$price'],
              },
              100,
            ],
          },
          else: 0,
        },
      },
      // Calculate the total price including tax
      totalPrice: {
        $multiply: [
          {
            $cond: {
              if: {
                $and: [
                  { $ne: ['$discountedPrice', null] },
                  { $gt: ['$discountedPrice', 0] },
                  { $lt: ['$discountedPrice', '$price'] },
                ],
              },
              then: '$discountedPrice',
              else: '$price',
            },
          },
          { $add: [1, { $divide: ['$taxRate', 100] }] },
        ],
      },
      // Calculate if item is low in stock
      isLowStock: {
        $and: [
          { $eq: ['$inStock', true] },
          { $lte: ['$stockQuantity', 10] }, // Assuming 10 is low stock threshold
        ],
      },
      // Business/admin name
      businessName: '$adminDetails.businessName',
    },
  });

  // Sorting logic
  if (payload.sortField && payload.sortOrder) {
    const sortOrder = payload.sortOrder === 'asc' ? 1 : -1;
    pipeline.push({ $sort: { [payload.sortField]: sortOrder } });
  } else {
    // Default sort by name ascending
    pipeline.push({ $sort: { name: 1 } });
  }

  // Pagination
  if (payload.skip) {
    pipeline.push({ $skip: Number(payload.skip) });
  }

  if (payload.limit) {
    pipeline.push({ $limit: Number(payload.limit) });
  }

  return pipeline;
};

export { buildItemQuery, BuildItemQueryPayload };
