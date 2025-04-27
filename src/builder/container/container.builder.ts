import { toObjectId } from '@utils';

interface BuildContainerQueryPayload {
  // Basic identification
  name?: string;
  containerType?: string;

  // Admin/User relationships
  adminId?: string;
  subscriberId?: string;

  // Tracking fields
  serialNumber?: string;
  qrCode?: string;
  batchNumber?: string;

  // Container status
  status?: string[];
  condition?: string[];

  // Date ranges
  deliveredAfter?: Date;
  deliveredBefore?: Date;
  expectedReturnBefore?: Date;

  // Financial tracking
  depositCollected?: boolean;
  depositRefunded?: boolean;

  // Pagination & sorting
  sortField?: string;
  sortOrder?: string;
  limit?: number;
  skip?: number;

  // Search
  searchTerm?: string;
}

const buildContainerQuery = (payload: BuildContainerQueryPayload) => {
  const pipeline = [];
  const matchCriteria = { $match: { $and: [] as any[] } };

  // If payload only contains pagination params, return all containers
  if (
    Object.keys(payload).length === 0 ||
    (Object.keys(payload).length <= 2 &&
      (payload.limit !== undefined || payload.skip !== undefined))
  ) {
    matchCriteria.$match.$and.push({
      name: { $regex: '', $options: 'i' },
    });
  }

  // Search term (searches across multiple fields)
  if (payload.searchTerm) {
    const searchCriteria = { $regex: payload.searchTerm, $options: 'i' };
    matchCriteria.$match.$and.push({
      $or: [
        { name: searchCriteria },
        { description: searchCriteria },
        { serialNumber: searchCriteria },
        { qrCode: searchCriteria },
        { batchNumber: searchCriteria },
      ],
    });
  }

  // Filter by name
  if (payload.name) {
    matchCriteria.$match.$and.push({
      name: { $regex: payload.name, $options: 'i' },
    });
  }

  // Filter by container type
  if (payload.containerType) {
    matchCriteria.$match.$and.push({
      containerType: payload.containerType,
    });
  }

  // Filter by admin ID
  if (payload.adminId) {
    matchCriteria.$match.$and.push({
      adminId: toObjectId(payload.adminId),
    });
  }

  // Filter by subscriber ID
  if (payload.subscriberId) {
    matchCriteria.$match.$and.push({
      subscriberId: toObjectId(payload.subscriberId),
    });
  }

  // Filter by serial number
  if (payload.serialNumber) {
    matchCriteria.$match.$and.push({
      serialNumber: { $regex: payload.serialNumber, $options: 'i' },
    });
  }

  // Filter by QR code
  if (payload.qrCode) {
    matchCriteria.$match.$and.push({
      qrCode: { $regex: payload.qrCode, $options: 'i' },
    });
  }

  // Filter by batch number
  if (payload.batchNumber) {
    matchCriteria.$match.$and.push({
      batchNumber: { $regex: payload.batchNumber, $options: 'i' },
    });
  }

  // Filter by status (can be multiple)
  if (payload.status && payload.status.length > 0) {
    matchCriteria.$match.$and.push({
      status: { $in: payload.status },
    });
  }

  // Filter by condition (can be multiple)
  if (payload.condition && payload.condition.length > 0) {
    matchCriteria.$match.$and.push({
      condition: { $in: payload.condition },
    });
  }

  // Filter by delivery date range
  if (payload.deliveredAfter || payload.deliveredBefore) {
    const dateFilter: any = {};
    if (payload.deliveredAfter) dateFilter.$gte = new Date(payload.deliveredAfter);
    if (payload.deliveredBefore) dateFilter.$lte = new Date(payload.deliveredBefore);
    matchCriteria.$match.$and.push({ deliveryDate: dateFilter });
  }

  // Filter by expected return date
  if (payload.expectedReturnBefore) {
    matchCriteria.$match.$and.push({
      expectedReturnDate: { $lte: new Date(payload.expectedReturnBefore) },
    });
  }

  // Filter by deposit status
  if (payload.depositCollected !== undefined) {
    matchCriteria.$match.$and.push({
      depositCollected: payload.depositCollected,
    });
  }

  if (payload.depositRefunded !== undefined) {
    matchCriteria.$match.$and.push({
      depositRefunded: payload.depositRefunded,
    });
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
  );

  // Add computed fields
  pipeline.push({
    $addFields: {
      daysSinceDelivery: {
        $cond: {
          if: { $ne: ['$deliveryDate', null] },
          then: {
            $divide: [{ $subtract: [new Date(), '$deliveryDate'] }, 24 * 60 * 60 * 1000],
          },
          else: null,
        },
      },
      daysUntilExpectedReturn: {
        $cond: {
          if: { $ne: ['$expectedReturnDate', null] },
          then: {
            $divide: [{ $subtract: ['$expectedReturnDate', new Date()] }, 24 * 60 * 60 * 1000],
          },
          else: null,
        },
      },
      isOverdue: {
        $cond: {
          if: { $ne: ['$expectedReturnDate', null] },
          then: { $lt: ['$expectedReturnDate', new Date()] },
          else: false,
        },
      },
    },
  });

  // Sorting logic
  if (payload.sortField && payload.sortOrder) {
    const sortOrder = payload.sortOrder === 'asc' ? 1 : -1;
    pipeline.push({ $sort: { [payload.sortField]: sortOrder } });
  } else {
    // Default sort by most recently updated
    pipeline.push({ $sort: { updatedAt: -1 } });
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

export { buildContainerQuery, BuildContainerQueryPayload };
