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
  | { $group: Record<string, any> }
  | { $geoNear: any };

interface BuildDeliveryPersonnelQueryPayload {
  // Basic filters
  userId?: string;
  zone?: string;
  zones?: string[];
  isActive?: boolean;

  // Vehicle filters
  vehicleType?: string;

  // Availability filters
  availableDays?: string[];
  availableTimeStart?: string; // HH:MM format
  availableTimeEnd?: string; // HH:MM format

  // Capacity filters
  minMaxDeliveriesPerDay?: number;
  maxMaxDeliveriesPerDay?: number;
  minMaxWeight?: number;
  maxMaxWeight?: number;

  // Admin relationship filters
  adminId?: string;
  isPrimaryAdmin?: boolean;

  // Subscriber relationship filters
  subscriberId?: string;
  hasAssignedSubscribers?: boolean;

  // Location-based filters
  nearLocation?: {
    lat: number;
    lng: number;
    maxDistance?: number; // in meters
  };

  // Performance filters
  minTotalDeliveries?: number;
  minCompletionRate?: number; // percentage
  minAvgRating?: number;

  // Last active filters
  lastActiveAfter?: Date | string;
  lastActiveBefore?: Date | string;

  // Joining date filters
  joiningAfter?: Date | string;
  joiningBefore?: Date | string;

  // Pagination & sorting
  sortField?: string;
  sortOrder?: string;
  limit?: number;
  skip?: number;

  // Search
  searchTerm?: string;
}

const buildDeliveryPersonnelQuery = (
  payload: BuildDeliveryPersonnelQueryPayload,
): PipelineStage[] => {
  const pipeline: PipelineStage[] = [];

  // If there's a geo-near query, it must be the first stage in the pipeline
  if (payload.nearLocation) {
    pipeline.push({
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [payload.nearLocation.lng, payload.nearLocation.lat],
        },
        distanceField: 'distance',
        maxDistance: payload.nearLocation.maxDistance || 10000, // Default 10km
        spherical: true,
      },
    });
  }

  const matchCriteria: PipelineStage = { $match: { $and: [] } };

  // If payload is empty or only has pagination params, return all personnel
  if (
    Object.keys(payload).length === 0 ||
    (Object.keys(payload).length <= 2 &&
      (payload.limit !== undefined || payload.skip !== undefined))
  ) {
    matchCriteria.$match.$and.push({
      isActive: { $in: [true, false] },
    });
  }

  // Search term (searches across multiple fields)
  if (payload.searchTerm) {
    const searchCriteria = { $regex: payload.searchTerm, $options: 'i' };
    matchCriteria.$match.$and.push({
      $or: [
        { zone: searchCriteria },
        { vehicleNumber: searchCriteria },
        { primaryZones: searchCriteria },
        { secondaryZones: searchCriteria },
      ],
    });
  }

  // Filter by userId
  if (payload.userId) {
    matchCriteria.$match.$and.push({
      userId: toObjectId(payload.userId),
    });
  }

  // Filter by zone
  if (payload.zone) {
    matchCriteria.$match.$and.push({
      zone: payload.zone,
    });
  }

  // Filter by multiple zones (primary or secondary)
  if (payload.zones && payload.zones.length > 0) {
    matchCriteria.$match.$and.push({
      $or: [
        { primaryZones: { $in: payload.zones } },
        { secondaryZones: { $in: payload.zones } },
        { zone: { $in: payload.zones } },
      ],
    });
  }

  // Filter by active status
  if (payload.isActive !== undefined) {
    matchCriteria.$match.$and.push({
      isActive: payload.isActive,
    });
  }

  // Filter by vehicle type
  if (payload.vehicleType) {
    matchCriteria.$match.$and.push({
      vehicleType: payload.vehicleType,
    });
  }

  // Filter by available days
  if (payload.availableDays && payload.availableDays.length > 0) {
    matchCriteria.$match.$and.push({
      availableDays: { $all: payload.availableDays },
    });
  }

  // Filter by available time slots
  if (payload.availableTimeStart || payload.availableTimeEnd) {
    const timeQuery: any = { $elemMatch: {} };

    if (payload.availableTimeStart) {
      timeQuery.$elemMatch.start = { $lte: payload.availableTimeStart };
    }

    if (payload.availableTimeEnd) {
      timeQuery.$elemMatch.end = { $gte: payload.availableTimeEnd };
    }

    matchCriteria.$match.$and.push({
      availableTimeSlots: timeQuery,
    });
  }

  // Filter by max deliveries per day
  if (
    payload.minMaxDeliveriesPerDay !== undefined ||
    payload.maxMaxDeliveriesPerDay !== undefined
  ) {
    const deliveriesFilter: any = {};
    if (payload.minMaxDeliveriesPerDay !== undefined)
      deliveriesFilter.$gte = payload.minMaxDeliveriesPerDay;
    if (payload.maxMaxDeliveriesPerDay !== undefined)
      deliveriesFilter.$lte = payload.maxMaxDeliveriesPerDay;

    matchCriteria.$match.$and.push({
      maxDeliveriesPerDay: deliveriesFilter,
    });
  }

  // Filter by max weight
  if (payload.minMaxWeight !== undefined || payload.maxMaxWeight !== undefined) {
    const weightFilter: any = {};
    if (payload.minMaxWeight !== undefined) weightFilter.$gte = payload.minMaxWeight;
    if (payload.maxMaxWeight !== undefined) weightFilter.$lte = payload.maxMaxWeight;

    matchCriteria.$match.$and.push({
      maxWeight: weightFilter,
    });
  }

  // Filter by assigned admin
  if (payload.adminId) {
    matchCriteria.$match.$and.push({
      'assignedAdmins.adminId': toObjectId(payload.adminId),
    });

    // Additional filter for primary admin
    if (payload.isPrimaryAdmin !== undefined) {
      matchCriteria.$match.$and.push({
        assignedAdmins: {
          $elemMatch: {
            adminId: toObjectId(payload.adminId),
            isPrimary: payload.isPrimaryAdmin,
          },
        },
      });
    }
  }

  // Filter by assigned subscriber
  if (payload.subscriberId) {
    matchCriteria.$match.$and.push({
      assignedSubscribers: toObjectId(payload.subscriberId),
    });
  }

  // Filter by whether they have assigned subscribers
  if (payload.hasAssignedSubscribers !== undefined) {
    if (payload.hasAssignedSubscribers) {
      matchCriteria.$match.$and.push({
        assignedSubscribers: { $exists: true, $ne: [] },
      });
    } else {
      matchCriteria.$match.$and.push({
        $or: [{ assignedSubscribers: { $exists: false } }, { assignedSubscribers: { $size: 0 } }],
      });
    }
  }

  // Filter by performance metrics
  if (payload.minTotalDeliveries !== undefined) {
    matchCriteria.$match.$and.push({
      'deliveryStats.totalDeliveries': { $gte: payload.minTotalDeliveries },
    });
  }

  if (payload.minCompletionRate !== undefined) {
    matchCriteria.$match.$and.push({
      $expr: {
        $gte: [
          {
            $multiply: [
              {
                $cond: [
                  { $eq: ['$deliveryStats.totalDeliveries', 0] },
                  0,
                  {
                    $divide: [
                      '$deliveryStats.completedDeliveries',
                      '$deliveryStats.totalDeliveries',
                    ],
                  },
                ],
              },
              100,
            ],
          },
          payload.minCompletionRate,
        ],
      },
    });
  }

  if (payload.minAvgRating !== undefined) {
    matchCriteria.$match.$and.push({
      'deliveryStats.avgRating': { $gte: payload.minAvgRating },
    });
  }

  // Filter by last active date
  if (payload.lastActiveAfter || payload.lastActiveBefore) {
    const dateFilter: any = {};
    if (payload.lastActiveAfter) dateFilter.$gte = new Date(payload.lastActiveAfter);
    if (payload.lastActiveBefore) dateFilter.$lte = new Date(payload.lastActiveBefore);
    matchCriteria.$match.$and.push({ lastActiveAt: dateFilter });
  }

  // Filter by joining date
  if (payload.joiningAfter || payload.joiningBefore) {
    const dateFilter: any = {};
    if (payload.joiningAfter) dateFilter.$gte = new Date(payload.joiningAfter);
    if (payload.joiningBefore) dateFilter.$lte = new Date(payload.joiningBefore);
    matchCriteria.$match.$and.push({ joiningDate: dateFilter });
  }

  // Add the match criteria to the pipeline if there are conditions
  if (matchCriteria.$match.$and.length > 0) {
    pipeline.push(matchCriteria);
  }

  // Add lookup stages to get related data
  pipeline.push(
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    {
      $lookup: {
        from: 'subscribers',
        localField: 'assignedSubscribers',
        foreignField: '_id',
        as: 'subscriberDetails',
      },
    },
  );

  // Unwind user details but preserve null values
  pipeline.push({
    $unwind: {
      path: '$userDetails',
      preserveNullAndEmptyArrays: true,
    },
  });

  // Add computed fields
  pipeline.push({
    $addFields: {
      // Calculate completion rate
      completionRate: {
        $cond: {
          if: { $eq: ['$deliveryStats.totalDeliveries', 0] },
          then: 0,
          else: {
            $multiply: [
              {
                $divide: ['$deliveryStats.completedDeliveries', '$deliveryStats.totalDeliveries'],
              },
              100,
            ],
          },
        },
      },
      // Calculate container return rate
      containerReturnRate: {
        $cond: {
          if: { $eq: ['$deliveryStats.containersDelivered', 0] },
          then: 0,
          else: {
            $multiply: [
              {
                $divide: [
                  '$deliveryStats.containersCollected',
                  '$deliveryStats.containersDelivered',
                ],
              },
              100,
            ],
          },
        },
      },
      // Calculate days since last active
      daysSinceLastActive: {
        $cond: {
          if: { $eq: ['$lastActiveAt', null] },
          then: null,
          else: {
            $divide: [{ $subtract: [new Date(), '$lastActiveAt'] }, 24 * 60 * 60 * 1000],
          },
        },
      },
      // Calculate days since joining
      daysActive: {
        $divide: [{ $subtract: [new Date(), '$joiningDate'] }, 24 * 60 * 60 * 1000],
      },
      // Combine name from user details
      fullName: {
        $concat: [
          { $ifNull: ['$userDetails.firstName', ''] },
          ' ',
          { $ifNull: ['$userDetails.lastName', ''] },
        ],
      },
      // Add count of assigned subscribers
      subscriberCount: { $size: { $ifNull: ['$assignedSubscribers', []] } },
      // Add phone from user details
      phone: '$userDetails.phone',
      // Add email from user details
      email: '$userDetails.email',
    },
  });

  // Sorting logic
  if (payload.sortField && payload.sortOrder) {
    const sortOrder = payload.sortOrder === 'asc' ? 1 : -1;
    pipeline.push({ $sort: { [payload.sortField]: sortOrder } });
  } else {
    // Default sort by last active date (most recent first)
    pipeline.push({ $sort: { lastActiveAt: -1 } });
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

export { buildDeliveryPersonnelQuery, BuildDeliveryPersonnelQueryPayload };
