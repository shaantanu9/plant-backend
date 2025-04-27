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

interface BuildSubscriptionQueryPayload {
  // Relationship filters
  subscriberId?: string;
  adminId?: string;
  itemId?: string;

  // Subscription details
  name?: string;
  minQuantity?: number;
  maxQuantity?: number;
  frequency?: string | string[];

  // Schedule filters
  startedAfter?: Date | string;
  startedBefore?: Date | string;
  endingBefore?: Date | string;
  deliveryDays?: string[];

  // Payment filters
  minPricePerUnit?: number;
  maxPricePerUnit?: number;
  billingCycle?: string;
  billingDueInDays?: number; // For finding subscriptions with billing due soon
  minDepositPaid?: number;

  // Container filters
  hasAssignedContainers?: boolean;
  minPendingContainerReturns?: number;

  // Status filters
  status?: string | string[];

  // Special filters
  isPaused?: boolean;
  hasEndDate?: boolean;
  hasPauseHistory?: boolean;

  // Date range filters
  createdAfter?: Date | string;
  createdBefore?: Date | string;
  updatedAfter?: Date | string;
  updatedBefore?: Date | string;

  // Pagination & sorting
  sortField?: string;
  sortOrder?: string;
  limit?: number;
  skip?: number;

  // Search
  searchTerm?: string;
}

const buildSubscriptionQuery = (payload: BuildSubscriptionQueryPayload): PipelineStage[] => {
  const pipeline: PipelineStage[] = [];
  const matchCriteria: PipelineStage = { $match: { $and: [] } };

  // If payload is empty or only has pagination params, return active subscriptions by default
  if (
    Object.keys(payload).length === 0 ||
    (Object.keys(payload).length <= 2 &&
      (payload.limit !== undefined || payload.skip !== undefined))
  ) {
    matchCriteria.$match.$and.push({
      status: 'active',
    });
  }

  // Search term (searches across multiple fields)
  if (payload.searchTerm) {
    const searchCriteria = { $regex: payload.searchTerm, $options: 'i' };
    matchCriteria.$match.$and.push({
      $or: [
        { name: searchCriteria },
        { unitName: searchCriteria },
        { deliveryInstructions: searchCriteria },
      ],
    });
  }

  // Relationship filters
  if (payload.subscriberId) {
    matchCriteria.$match.$and.push({
      subscriberId: toObjectId(payload.subscriberId),
    });
  }

  if (payload.adminId) {
    matchCriteria.$match.$and.push({
      adminId: toObjectId(payload.adminId),
    });
  }

  if (payload.itemId) {
    matchCriteria.$match.$and.push({
      itemId: toObjectId(payload.itemId),
    });
  }

  // Subscription details filters
  if (payload.name) {
    matchCriteria.$match.$and.push({
      name: { $regex: payload.name, $options: 'i' },
    });
  }

  if (payload.minQuantity !== undefined || payload.maxQuantity !== undefined) {
    const quantityFilter: any = {};
    if (payload.minQuantity !== undefined) quantityFilter.$gte = payload.minQuantity;
    if (payload.maxQuantity !== undefined) quantityFilter.$lte = payload.maxQuantity;
    matchCriteria.$match.$and.push({ quantity: quantityFilter });
  }

  if (payload.frequency) {
    if (Array.isArray(payload.frequency)) {
      matchCriteria.$match.$and.push({
        frequency: { $in: payload.frequency },
      });
    } else {
      matchCriteria.$match.$and.push({
        frequency: payload.frequency,
      });
    }
  }

  // Schedule filters
  if (payload.startedAfter || payload.startedBefore) {
    const startDateFilter: any = {};
    if (payload.startedAfter) startDateFilter.$gte = new Date(payload.startedAfter);
    if (payload.startedBefore) startDateFilter.$lte = new Date(payload.startedBefore);
    matchCriteria.$match.$and.push({ startDate: startDateFilter });
  }

  if (payload.endingBefore) {
    matchCriteria.$match.$and.push({
      endDate: { $lte: new Date(payload.endingBefore), $ne: null },
    });
  }

  if (payload.deliveryDays && payload.deliveryDays.length > 0) {
    matchCriteria.$match.$and.push({
      deliveryDays: { $all: payload.deliveryDays },
    });
  }

  // Payment filters
  if (payload.minPricePerUnit !== undefined || payload.maxPricePerUnit !== undefined) {
    const priceFilter: any = {};
    if (payload.minPricePerUnit !== undefined) priceFilter.$gte = payload.minPricePerUnit;
    if (payload.maxPricePerUnit !== undefined) priceFilter.$lte = payload.maxPricePerUnit;
    matchCriteria.$match.$and.push({ pricePerUnit: priceFilter });
  }

  if (payload.billingCycle) {
    matchCriteria.$match.$and.push({
      billingCycle: payload.billingCycle,
    });
  }

  if (payload.billingDueInDays !== undefined) {
    const dueDateLimit = new Date();
    dueDateLimit.setDate(dueDateLimit.getDate() + payload.billingDueInDays);

    matchCriteria.$match.$and.push({
      nextBillingDate: { $lte: dueDateLimit, $gte: new Date() },
    });
  }

  if (payload.minDepositPaid !== undefined) {
    matchCriteria.$match.$and.push({
      depositPaid: { $gte: payload.minDepositPaid },
    });
  }

  // Container filters
  if (payload.hasAssignedContainers !== undefined) {
    if (payload.hasAssignedContainers) {
      matchCriteria.$match.$and.push({
        assignedContainers: { $exists: true, $ne: [] },
      });
    } else {
      matchCriteria.$match.$and.push({
        $or: [{ assignedContainers: { $exists: false } }, { assignedContainers: { $size: 0 } }],
      });
    }
  }

  if (payload.minPendingContainerReturns !== undefined) {
    matchCriteria.$match.$and.push({
      pendingContainerReturns: { $gte: payload.minPendingContainerReturns },
    });
  }

  // Status filters
  if (payload.status) {
    if (Array.isArray(payload.status)) {
      matchCriteria.$match.$and.push({
        status: { $in: payload.status },
      });
    } else {
      matchCriteria.$match.$and.push({
        status: payload.status,
      });
    }
  }

  // Special filters
  if (payload.isPaused !== undefined) {
    if (payload.isPaused) {
      matchCriteria.$match.$and.push({
        status: 'paused',
      });
    } else {
      matchCriteria.$match.$and.push({
        status: { $ne: 'paused' },
      });
    }
  }

  if (payload.hasEndDate !== undefined) {
    if (payload.hasEndDate) {
      matchCriteria.$match.$and.push({
        endDate: { $exists: true, $ne: null },
      });
    } else {
      matchCriteria.$match.$and.push({
        $or: [{ endDate: { $exists: false } }, { endDate: null }],
      });
    }
  }

  if (payload.hasPauseHistory !== undefined) {
    if (payload.hasPauseHistory) {
      matchCriteria.$match.$and.push({
        pauseHistory: { $exists: true, $ne: [] },
      });
    } else {
      matchCriteria.$match.$and.push({
        $or: [{ pauseHistory: { $exists: false } }, { pauseHistory: { $size: 0 } }],
      });
    }
  }

  // Date range filters
  if (payload.createdAfter || payload.createdBefore) {
    const createdAtFilter: any = {};
    if (payload.createdAfter) createdAtFilter.$gte = new Date(payload.createdAfter);
    if (payload.createdBefore) createdAtFilter.$lte = new Date(payload.createdBefore);
    matchCriteria.$match.$and.push({ createdAt: createdAtFilter });
  }

  if (payload.updatedAfter || payload.updatedBefore) {
    const updatedAtFilter: any = {};
    if (payload.updatedAfter) updatedAtFilter.$gte = new Date(payload.updatedAfter);
    if (payload.updatedBefore) updatedAtFilter.$lte = new Date(payload.updatedBefore);
    matchCriteria.$match.$and.push({ updatedAt: updatedAtFilter });
  }

  // Add the match criteria to the pipeline if there are conditions
  if (matchCriteria.$match.$and.length > 0) {
    pipeline.push(matchCriteria);
  }

  // Add lookup stages to get related data
  pipeline.push(
    {
      $lookup: {
        from: 'subscribers',
        localField: 'subscriberId',
        foreignField: '_id',
        as: 'subscriberDetails',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'adminId',
        foreignField: '_id',
        as: 'adminDetails',
      },
    },
    {
      $lookup: {
        from: 'items',
        localField: 'itemId',
        foreignField: '_id',
        as: 'itemDetails',
      },
    },
    {
      $lookup: {
        from: 'containers',
        localField: 'assignedContainers',
        foreignField: '_id',
        as: 'containerDetails',
      },
    },
  );

  // Unwind arrays but preserve null values
  pipeline.push(
    {
      $unwind: {
        path: '$subscriberDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$adminDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$itemDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
  );

  // Add computed fields
  pipeline.push({
    $addFields: {
      // Calculate the total price
      totalPrice: { $multiply: ['$quantity', '$pricePerUnit'] },

      // Calculate days since start
      daysSinceStart: {
        $divide: [{ $subtract: [new Date(), '$startDate'] }, 24 * 60 * 60 * 1000],
      },

      // Calculate days until end (if endDate exists)
      daysUntilEnd: {
        $cond: {
          if: { $eq: ['$endDate', null] },
          then: null,
          else: {
            $divide: [{ $subtract: ['$endDate', new Date()] }, 24 * 60 * 60 * 1000],
          },
        },
      },

      // Calculate days until next billing
      daysUntilNextBilling: {
        $cond: {
          if: { $eq: ['$nextBillingDate', null] },
          then: null,
          else: {
            $divide: [{ $subtract: ['$nextBillingDate', new Date()] }, 24 * 60 * 60 * 1000],
          },
        },
      },

      // Calculate container return rate
      containerReturnRate: {
        $cond: {
          if: { $eq: [{ $size: '$assignedContainers' }, 0] },
          then: 100,
          else: {
            $multiply: [
              {
                $divide: [
                  {
                    $subtract: [{ $size: '$assignedContainers' }, '$pendingContainerReturns'],
                  },
                  { $size: '$assignedContainers' },
                ],
              },
              100,
            ],
          },
        },
      },

      // Calculate lifetime value
      lifetimeValue: {
        $reduce: {
          input: '$paymentHistory',
          initialValue: 0,
          in: {
            $add: [
              '$$value',
              {
                $cond: {
                  if: { $eq: ['$$this.status', 'completed'] },
                  then: '$$this.amount',
                  else: 0,
                },
              },
            ],
          },
        },
      },

      // Add subscriber name
      subscriberName: {
        $concat: [{ $ifNull: ['$subscriberDetails.name', ''] }],
      },

      // Add item name
      itemName: '$itemDetails.name',

      // Add admin/business name
      businessName: '$adminDetails.businessName',

      // Add container count
      containerCount: { $size: { $ifNull: ['$assignedContainers', []] } },

      // Is billing due soon (next 7 days)
      isBillingDueSoon: {
        $cond: {
          if: { $eq: ['$nextBillingDate', null] },
          then: false,
          else: {
            $lte: [
              '$nextBillingDate',
              {
                $add: [new Date(), 7 * 24 * 60 * 60 * 1000],
              },
            ],
          },
        },
      },
    },
  });

  // Sorting logic
  if (payload.sortField && payload.sortOrder) {
    const sortOrder = payload.sortOrder === 'asc' ? 1 : -1;
    pipeline.push({ $sort: { [payload.sortField]: sortOrder } });
  } else {
    // Default sort by start date (most recent first)
    pipeline.push({ $sort: { startDate: -1 } });
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

export { buildSubscriptionQuery, BuildSubscriptionQueryPayload };
