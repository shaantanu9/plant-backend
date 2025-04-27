import { toObjectId } from '@utils';

// Define the pipeline stage types more flexibly
interface MatchStage {
  $match: Record<string, any>;
}
interface LookupStage {
  $lookup: Record<string, any>;
}
interface UnwindStage {
  $unwind: string | Record<string, any>;
}
interface AddFieldsStage {
  $addFields: Record<string, any>;
}
interface SortStage {
  $sort: Record<string, number>;
}
interface SkipStage {
  $skip: number;
}
interface LimitStage {
  $limit: number;
}
interface CountStage {
  $count: string;
}
interface ProjectStage {
  $project: Record<string, any>;
}
interface GroupStage {
  $group: Record<string, any>;
}
interface GeoNearStage {
  $geoNear: any;
}

type PipelineStage =
  | MatchStage
  | LookupStage
  | UnwindStage
  | AddFieldsStage
  | SortStage
  | SkipStage
  | LimitStage
  | CountStage
  | ProjectStage
  | GroupStage
  | GeoNearStage;

// Better type safety for subscription type
type SubscriptionType = 'daily' | 'weekly' | 'custom';
type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'custom';
type DeliveryDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
type FrequencyUnit = 'days' | 'weeks' | 'months';

interface BuildSubscriberQueryPayload {
  // Basic filters
  userId?: string;
  name?: string;
  mobile?: string;

  // Address filters
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  landmark?: string;
  apartment?: string;

  // Delivery zone and preferences
  zone?: string;
  zones?: string[];
  subscriptionType?: SubscriptionType | SubscriptionType[];
  deliveryDays?: DeliveryDay | DeliveryDay[];
  deliveryDayCount?: number;
  preferredTimeSlot?: TimeSlot | TimeSlot[];

  // Custom frequency filters
  isCustomFrequency?: boolean;
  customFrequencyInterval?: number;
  customFrequencyIntervalUnit?: FrequencyUnit;

  // Container metrics
  minContainerCount?: number;
  maxContainerCount?: number;
  minPendingContainers?: number;
  maxPendingContainers?: number;
  minDepositBalance?: number;
  maxDepositBalance?: number;
  hasDeposit?: boolean;
  hasAssignedContainers?: boolean;
  containerIds?: string[];

  // Relationship filters
  assignedTo?: string;
  unassigned?: boolean;
  primaryAdmin?: string;
  relatedAdmin?: string;
  assignedAdmins?: string[];

  // Subscription filters
  hasActiveSubscriptions?: boolean;
  subscriptionId?: string;
  subscriptionIds?: string[];
  minActiveSubscriptions?: number;
  maxActiveSubscriptions?: number;

  // Status filters
  isActive?: boolean;
  swapEnabled?: boolean;

  // Date range filters
  lastDeliveryAfter?: Date | string;
  lastDeliveryBefore?: Date | string;
  joinedAfter?: Date | string;
  joinedBefore?: Date | string;
  nextBillingAfter?: Date | string;
  nextBillingBefore?: Date | string;

  // Location-based search
  nearLocation?: {
    lat: number;
    lng: number;
    maxDistance?: number; // in meters
  };

  // Delivery eligibility
  eligibleForDeliveryOnDate?: Date;
  eligibleForDeliveryOnDay?: DeliveryDay;
  hasDeliveryToday?: boolean;
  nextDeliveryDate?: Date;

  // Notification preferences
  reminderEnabled?: boolean;
  notificationPreferences?: {
    deliveryReminders?: boolean;
    returnReminders?: boolean;
    promotions?: boolean;
  };

  // Payment related
  paymentMethod?: string | string[];
  minDepositPaid?: number;
  maxDepositPaid?: number;

  // Pagination & sorting
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  skip?: number;

  // Group by options
  groupBy?: 'zone' | 'subscriptionType' | 'assignedTo' | 'timeSlot' | 'deliveryDay';

  // Include options (control which related data to include)
  include?: {
    user?: boolean;
    deliveryPersonnel?: boolean;
    subscriptions?: boolean;
    deliveryHistory?: boolean;
    upcomingDeliveries?: boolean;
    containerHistory?: boolean;
  };

  // Search
  searchTerm?: string;

  // Special flags
  includeCount?: boolean;
  onlyIds?: boolean;
}

const buildSubscriberQuery = (payload: BuildSubscriberQueryPayload): PipelineStage[] => {
  const pipeline: PipelineStage[] = [];

  // Track if we need to count total results
  const needCount = payload.includeCount === true;

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
        query: { isActive: payload.isActive !== false }, // Only active subscribers by default unless explicitly false
        distanceMultiplier: 0.001, // Convert to kilometers
      },
    });
  }

  const matchCriteria: PipelineStage = { $match: { $and: [] } };

  // If payload is nearly empty, return all active subscribers
  if (
    Object.keys(payload).length === 0 ||
    (Object.keys(payload).length <= 3 &&
      (payload.limit !== undefined ||
        payload.skip !== undefined ||
        payload.includeCount !== undefined))
  ) {
    matchCriteria.$match.$and.push({
      isActive: true,
    });
  }

  // Search term (searches across multiple fields)
  if (payload.searchTerm) {
    const searchCriteria = { $regex: payload.searchTerm, $options: 'i' };
    matchCriteria.$match.$and.push({
      $or: [
        { name: searchCriteria },
        { mobile: searchCriteria },
        { address: searchCriteria },
        { 'fullAddress.street': searchCriteria },
        { 'fullAddress.city': searchCriteria },
        { 'fullAddress.landmark': searchCriteria },
        { 'fullAddress.zipCode': searchCriteria },
        { 'fullAddress.apartment': searchCriteria },
        { zone: searchCriteria },
      ],
    });
  }

  // Basic filters
  if (payload.userId) {
    matchCriteria.$match.$and.push({
      userId: toObjectId(payload.userId),
    });
  }

  if (payload.name) {
    matchCriteria.$match.$and.push({
      name: { $regex: payload.name, $options: 'i' },
    });
  }

  if (payload.mobile) {
    matchCriteria.$match.$and.push({
      mobile: { $regex: payload.mobile, $options: 'i' },
    });
  }

  // Address filters
  if (payload.address) {
    matchCriteria.$match.$and.push({
      address: { $regex: payload.address, $options: 'i' },
    });
  }

  if (payload.city) {
    matchCriteria.$match.$and.push({
      'fullAddress.city': { $regex: payload.city, $options: 'i' },
    });
  }

  if (payload.state) {
    matchCriteria.$match.$and.push({
      'fullAddress.state': { $regex: payload.state, $options: 'i' },
    });
  }

  if (payload.zipCode) {
    matchCriteria.$match.$and.push({
      'fullAddress.zipCode': { $regex: payload.zipCode, $options: 'i' },
    });
  }

  if (payload.landmark) {
    matchCriteria.$match.$and.push({
      'fullAddress.landmark': { $regex: payload.landmark, $options: 'i' },
    });
  }

  if (payload.apartment) {
    matchCriteria.$match.$and.push({
      'fullAddress.apartment': { $regex: payload.apartment, $options: 'i' },
    });
  }

  // Zone filters
  if (payload.zone) {
    matchCriteria.$match.$and.push({
      zone: payload.zone,
    });
  }

  if (payload.zones && payload.zones.length > 0) {
    matchCriteria.$match.$and.push({
      zone: { $in: payload.zones },
    });
  }

  // Subscription type
  if (payload.subscriptionType) {
    if (Array.isArray(payload.subscriptionType)) {
      matchCriteria.$match.$and.push({
        subscriptionType: { $in: payload.subscriptionType },
      });
    } else {
      matchCriteria.$match.$and.push({
        subscriptionType: payload.subscriptionType,
      });
    }
  }

  // Delivery days
  if (payload.deliveryDays) {
    if (Array.isArray(payload.deliveryDays)) {
      matchCriteria.$match.$and.push({
        deliveryDays: { $all: payload.deliveryDays },
      });
    } else {
      matchCriteria.$match.$and.push({
        deliveryDays: payload.deliveryDays,
      });
    }
  }

  // Delivery day count
  if (payload.deliveryDayCount !== undefined) {
    matchCriteria.$match.$and.push({
      $expr: { $eq: [{ $size: '$deliveryDays' }, payload.deliveryDayCount] },
    });
  }

  // Preferred time slot
  if (payload.preferredTimeSlot) {
    if (Array.isArray(payload.preferredTimeSlot)) {
      matchCriteria.$match.$and.push({
        preferredTimeSlot: { $in: payload.preferredTimeSlot },
      });
    } else {
      matchCriteria.$match.$and.push({
        preferredTimeSlot: payload.preferredTimeSlot,
      });
    }
  }

  // Custom frequency filters
  if (payload.isCustomFrequency !== undefined) {
    matchCriteria.$match.$and.push({
      isCustomFrequency: payload.isCustomFrequency,
    });
  }

  if (payload.customFrequencyInterval !== undefined) {
    matchCriteria.$match.$and.push({
      customFrequencyInterval: payload.customFrequencyInterval,
    });
  }

  if (payload.customFrequencyIntervalUnit) {
    matchCriteria.$match.$and.push({
      customFrequencyIntervalUnit: payload.customFrequencyIntervalUnit,
    });
  }

  // Container metrics
  if (payload.minContainerCount !== undefined || payload.maxContainerCount !== undefined) {
    const containerFilter: any = {};
    if (payload.minContainerCount !== undefined) containerFilter.$gte = payload.minContainerCount;
    if (payload.maxContainerCount !== undefined) containerFilter.$lte = payload.maxContainerCount;
    matchCriteria.$match.$and.push({ containerCount: containerFilter });
  }

  if (payload.minPendingContainers !== undefined || payload.maxPendingContainers !== undefined) {
    const pendingFilter: any = {};
    if (payload.minPendingContainers !== undefined)
      pendingFilter.$gte = payload.minPendingContainers;
    if (payload.maxPendingContainers !== undefined)
      pendingFilter.$lte = payload.maxPendingContainers;
    matchCriteria.$match.$and.push({ pendingContainers: pendingFilter });
  }

  if (payload.minDepositBalance !== undefined || payload.maxDepositBalance !== undefined) {
    const depositFilter: any = {};
    if (payload.minDepositBalance !== undefined) depositFilter.$gte = payload.minDepositBalance;
    if (payload.maxDepositBalance !== undefined) depositFilter.$lte = payload.maxDepositBalance;
    matchCriteria.$match.$and.push({ depositBalance: depositFilter });
  }

  if (payload.hasDeposit !== undefined) {
    if (payload.hasDeposit) {
      matchCriteria.$match.$and.push({ depositBalance: { $gt: 0 } });
    } else {
      matchCriteria.$match.$and.push({ depositBalance: { $lte: 0 } });
    }
  }

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

  if (payload.containerIds && payload.containerIds.length > 0) {
    matchCriteria.$match.$and.push({
      assignedContainers: {
        $in: payload.containerIds.map(id => toObjectId(id)),
      },
    });
  }

  // Relationship filters
  if (payload.assignedTo) {
    matchCriteria.$match.$and.push({
      assignedTo: toObjectId(payload.assignedTo),
    });
  }

  // Handle unassigned filter
  if (payload.unassigned === true) {
    matchCriteria.$match.$and.push({
      $or: [{ assignedTo: { $exists: false } }, { assignedTo: null }],
    });
  }

  if (payload.primaryAdmin) {
    matchCriteria.$match.$and.push({
      primaryAdmin: toObjectId(payload.primaryAdmin),
    });
  }

  if (payload.relatedAdmin) {
    matchCriteria.$match.$and.push({
      relatedAdmins: toObjectId(payload.relatedAdmin),
    });
  }

  if (payload.assignedAdmins && payload.assignedAdmins.length > 0) {
    matchCriteria.$match.$and.push({
      $or: [
        { primaryAdmin: { $in: payload.assignedAdmins.map(id => toObjectId(id)) } },
        { relatedAdmins: { $in: payload.assignedAdmins.map(id => toObjectId(id)) } },
      ],
    });
  }

  // Subscription filters
  if (payload.hasActiveSubscriptions !== undefined) {
    if (payload.hasActiveSubscriptions) {
      matchCriteria.$match.$and.push({
        activeSubscriptions: { $exists: true, $ne: [] },
      });
    } else {
      matchCriteria.$match.$and.push({
        $or: [{ activeSubscriptions: { $exists: false } }, { activeSubscriptions: { $size: 0 } }],
      });
    }
  }

  if (payload.subscriptionId) {
    matchCriteria.$match.$and.push({
      activeSubscriptions: toObjectId(payload.subscriptionId),
    });
  }

  if (payload.subscriptionIds && payload.subscriptionIds.length > 0) {
    matchCriteria.$match.$and.push({
      activeSubscriptions: {
        $in: payload.subscriptionIds.map(id => toObjectId(id)),
      },
    });
  }

  if (
    payload.minActiveSubscriptions !== undefined ||
    payload.maxActiveSubscriptions !== undefined
  ) {
    let expr: any = {};

    if (
      payload.minActiveSubscriptions !== undefined &&
      payload.maxActiveSubscriptions !== undefined
    ) {
      expr = {
        $and: [
          { $gte: [{ $size: '$activeSubscriptions' }, payload.minActiveSubscriptions] },
          { $lte: [{ $size: '$activeSubscriptions' }, payload.maxActiveSubscriptions] },
        ],
      };
    } else if (payload.minActiveSubscriptions !== undefined) {
      expr = { $gte: [{ $size: '$activeSubscriptions' }, payload.minActiveSubscriptions] };
    } else if (payload.maxActiveSubscriptions !== undefined) {
      expr = { $lte: [{ $size: '$activeSubscriptions' }, payload.maxActiveSubscriptions] };
    }

    matchCriteria.$match.$and.push({ $expr: expr });
  }

  // Status filters
  if (payload.isActive !== undefined) {
    matchCriteria.$match.$and.push({
      isActive: payload.isActive,
    });
  }

  if (payload.swapEnabled !== undefined) {
    matchCriteria.$match.$and.push({
      swapEnabled: payload.swapEnabled,
    });
  }

  // Date range filters
  if (payload.lastDeliveryAfter || payload.lastDeliveryBefore) {
    const dateFilter: any = {};
    if (payload.lastDeliveryAfter) dateFilter.$gte = new Date(payload.lastDeliveryAfter);
    if (payload.lastDeliveryBefore) dateFilter.$lte = new Date(payload.lastDeliveryBefore);
    matchCriteria.$match.$and.push({ lastDeliveryDate: dateFilter });
  }

  if (payload.joinedAfter || payload.joinedBefore) {
    const dateFilter: any = {};
    if (payload.joinedAfter) dateFilter.$gte = new Date(payload.joinedAfter);
    if (payload.joinedBefore) dateFilter.$lte = new Date(payload.joinedBefore);
    matchCriteria.$match.$and.push({ joinDate: dateFilter });
  }

  if (payload.nextBillingAfter || payload.nextBillingBefore) {
    const dateFilter: any = {};
    if (payload.nextBillingAfter) dateFilter.$gte = new Date(payload.nextBillingAfter);
    if (payload.nextBillingBefore) dateFilter.$lte = new Date(payload.nextBillingBefore);
    matchCriteria.$match.$and.push({ nextBillingDate: dateFilter });
  }

  // Delivery eligibility
  if (payload.eligibleForDeliveryOnDay) {
    matchCriteria.$match.$and.push({
      $or: [
        // Daily subscribers are eligible every day
        { subscriptionType: 'daily' },
        // Weekly subscribers with this day in their delivery schedule
        {
          $and: [
            { subscriptionType: 'weekly' },
            { deliveryDays: payload.eligibleForDeliveryOnDay },
          ],
        },
      ],
    });
  }

  if (payload.eligibleForDeliveryOnDate) {
    const dateObj = new Date(payload.eligibleForDeliveryOnDate);
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];

    matchCriteria.$match.$and.push({
      $or: [
        // Daily subscribers
        { subscriptionType: 'daily' },
        // Weekly subscribers on the correct day
        {
          $and: [{ subscriptionType: 'weekly' }, { deliveryDays: dayOfWeek }],
        },
        // Custom frequency subscribers who are due
        {
          $and: [
            { isCustomFrequency: true },
            { lastDeliveryDate: { $exists: true, $ne: null } },
            // Note: Complex custom frequency calculations require an addFields stage
            // We'll add this logic below
          ],
        },
      ],
    });
  }

  // Notification preferences
  if (payload.reminderEnabled !== undefined) {
    matchCriteria.$match.$and.push({
      reminderEnabled: payload.reminderEnabled,
    });
  }

  if (payload.notificationPreferences) {
    if (payload.notificationPreferences.deliveryReminders !== undefined) {
      matchCriteria.$match.$and.push({
        'notificationPreferences.deliveryReminders':
          payload.notificationPreferences.deliveryReminders,
      });
    }

    if (payload.notificationPreferences.returnReminders !== undefined) {
      matchCriteria.$match.$and.push({
        'notificationPreferences.returnReminders': payload.notificationPreferences.returnReminders,
      });
    }

    if (payload.notificationPreferences.promotions !== undefined) {
      matchCriteria.$match.$and.push({
        'notificationPreferences.promotions': payload.notificationPreferences.promotions,
      });
    }
  }

  // Payment method filter
  if (payload.paymentMethod) {
    if (Array.isArray(payload.paymentMethod)) {
      matchCriteria.$match.$and.push({
        paymentMethod: { $in: payload.paymentMethod },
      });
    } else {
      matchCriteria.$match.$and.push({
        paymentMethod: payload.paymentMethod,
      });
    }
  }

  // Deposit paid filters
  if (payload.minDepositPaid !== undefined || payload.maxDepositPaid !== undefined) {
    const depositFilter: any = {};
    if (payload.minDepositPaid !== undefined) depositFilter.$gte = payload.minDepositPaid;
    if (payload.maxDepositPaid !== undefined) depositFilter.$lte = payload.maxDepositPaid;
    matchCriteria.$match.$and.push({ depositPaid: depositFilter });
  }

  // Add the match criteria to the pipeline if there are conditions
  if (matchCriteria.$match.$and.length > 0) {
    pipeline.push(matchCriteria);
  }

  // Calculate next delivery date for custom frequency subscribers
  if (payload.eligibleForDeliveryOnDate) {
    pipeline.push({
      $addFields: {
        // Calculate next delivery date for custom frequency subscribers
        nextDeliveryDate: {
          $cond: {
            if: { $eq: ['$isCustomFrequency', true] },
            then: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ['$customFrequencyIntervalUnit', 'days'] },
                    then: {
                      $add: [
                        '$lastDeliveryDate',
                        { $multiply: ['$customFrequencyInterval', 24 * 60 * 60 * 1000] },
                      ],
                    },
                  },
                  {
                    case: { $eq: ['$customFrequencyIntervalUnit', 'weeks'] },
                    then: {
                      $add: [
                        '$lastDeliveryDate',
                        { $multiply: ['$customFrequencyInterval', 7 * 24 * 60 * 60 * 1000] },
                      ],
                    },
                  },
                  {
                    case: { $eq: ['$customFrequencyIntervalUnit', 'months'] },
                    then: {
                      $add: [
                        '$lastDeliveryDate',
                        { $multiply: ['$customFrequencyInterval', 30 * 24 * 60 * 60 * 1000] },
                      ],
                    },
                  },
                ],
                default: '$lastDeliveryDate',
              },
            },
            else: null,
          },
        },
      },
    });

    // Filter custom frequency subscribers based on nextDeliveryDate
    pipeline.push({
      $match: {
        $or: [
          // Keep non-custom frequency subscribers
          { isCustomFrequency: { $ne: true } },
          // Or custom frequency subscribers whose next delivery date is today or earlier
          {
            $and: [
              { isCustomFrequency: true },
              {
                nextDeliveryDate: {
                  $lte: new Date(payload.eligibleForDeliveryOnDate),
                },
              },
            ],
          },
        ],
      },
    });
  }

  // First get a count if needed
  if (needCount) {
    // Create a copy of the pipeline for counting
    const countPipeline = [...pipeline];
    countPipeline.push({ $count: 'totalCount' });
  }

  // Include related data based on include options
  if (payload.include) {
    const { include } = payload;

    // User details
    if (include.user) {
      pipeline.push({
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      });

      pipeline.push({
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true,
        },
      });
    }

    // Delivery personnel
    if (include.deliveryPersonnel) {
      pipeline.push({
        $lookup: {
          from: 'deliverypersonnel',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'deliveryPersonnelDetails',
        },
      });

      pipeline.push({
        $unwind: {
          path: '$deliveryPersonnelDetails',
          preserveNullAndEmptyArrays: true,
        },
      });
    }

    // Subscriptions
    if (include.subscriptions) {
      pipeline.push({
        $lookup: {
          from: 'subscriptions',
          localField: 'activeSubscriptions',
          foreignField: '_id',
          as: 'subscriptionDetails',
        },
      });
    }

    // Delivery history
    if (include.deliveryHistory) {
      pipeline.push({
        $lookup: {
          from: 'deliveries',
          let: { subscriberId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$subscriberId', '$$subscriberId'] },
              },
            },
            { $sort: { date: -1 } },
            { $limit: 10 },
          ],
          as: 'deliveryHistory',
        },
      });
    }

    // Upcoming deliveries
    if (include.upcomingDeliveries) {
      pipeline.push({
        $lookup: {
          from: 'deliveries',
          let: { subscriberId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$subscriberId', '$$subscriberId'] },
                    { $gt: ['$date', new Date()] },
                    { $eq: ['$status', 'scheduled'] },
                  ],
                },
              },
            },
            { $sort: { date: 1 } },
            { $limit: 5 },
          ],
          as: 'upcomingDeliveries',
        },
      });
    }

    // Container history
    if (include.containerHistory) {
      pipeline.push({
        $lookup: {
          from: 'containers',
          localField: 'assignedContainers',
          foreignField: '_id',
          as: 'containerDetails',
        },
      });
    }
  } else {
    // Default lookups if include options not specified
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
          from: 'deliverypersonnel',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'deliveryPersonnelDetails',
        },
      },
      {
        $lookup: {
          from: 'subscriptions',
          localField: 'activeSubscriptions',
          foreignField: '_id',
          as: 'subscriptionDetails',
        },
      },
    );

    // Unwind arrays but preserve null values
    pipeline.push(
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$deliveryPersonnelDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
    );
  }

  // Add computed fields
  pipeline.push({
    $addFields: {
      // Calculate pending container rate
      pendingContainerRate: {
        $cond: {
          if: { $eq: ['$containerCount', 0] },
          then: 0,
          else: {
            $multiply: [{ $divide: ['$pendingContainers', '$containerCount'] }, 100],
          },
        },
      },
      // Calculate days since last delivery
      daysSinceLastDelivery: {
        $cond: {
          if: { $eq: ['$lastDeliveryDate', null] },
          then: null,
          else: {
            $divide: [{ $subtract: [new Date(), '$lastDeliveryDate'] }, 24 * 60 * 60 * 1000],
          },
        },
      },
      // Calculate membership duration in days
      membershipDays: {
        $divide: [{ $subtract: [new Date(), '$joinDate'] }, 24 * 60 * 60 * 1000],
      },
      // Add email from user details
      email: '$userDetails.email',
      // Add full delivery personnel info
      deliveryPersonnelName: {
        $cond: {
          if: { $ifNull: ['$deliveryPersonnelDetails', false] },
          then: '$deliveryPersonnelDetails.name',
          else: 'Unassigned',
        },
      },
      // Add subscription count
      subscriptionCount: { $size: { $ifNull: ['$activeSubscriptions', []] } },
      // Calculate container-related metrics
      containerReturnRate: {
        $cond: {
          if: { $eq: ['$pendingContainers', 0] },
          then: 100,
          else: {
            $multiply: [
              {
                $divide: [
                  { $subtract: ['$containerCount', '$pendingContainers'] },
                  '$containerCount',
                ],
              },
              100,
            ],
          },
        },
      },
      // Format human-readable dates
      lastDeliveryFormatted: {
        $cond: {
          if: { $eq: ['$lastDeliveryDate', null] },
          then: 'Never',
          else: {
            $dateToString: { format: '%Y-%m-%d', date: '$lastDeliveryDate' },
          },
        },
      },
      joinDateFormatted: {
        $dateToString: { format: '%Y-%m-%d', date: '$joinDate' },
      },
      // Calculate days until next billing
      daysUntilNextBilling: {
        $cond: {
          if: { $eq: ['$nextBillingDate', null] },
          then: null,
          else: {
            $ceil: {
              $divide: [{ $subtract: ['$nextBillingDate', new Date()] }, 24 * 60 * 60 * 1000],
            },
          },
        },
      },
    },
  });

  // Group by if requested
  if (payload.groupBy) {
    let groupId: any = {};
    let groupFields: any = {};

    switch (payload.groupBy) {
      case 'zone':
        groupId = '$zone';
        groupFields = {
          zone: { $first: '$zone' },
        };
        break;
      case 'subscriptionType':
        groupId = '$subscriptionType';
        groupFields = {
          subscriptionType: { $first: '$subscriptionType' },
        };
        break;
      case 'assignedTo':
        groupId = '$assignedTo';
        groupFields = {
          assignedTo: { $first: '$assignedTo' },
          deliveryPersonnelName: { $first: '$deliveryPersonnelName' },
        };
        break;
      case 'timeSlot':
        groupId = '$preferredTimeSlot';
        groupFields = {
          timeSlot: { $first: '$preferredTimeSlot' },
        };
        break;
      case 'deliveryDay':
        // This will create one group per unique combination of delivery days
        groupId = '$deliveryDays';
        groupFields = {
          deliveryDays: { $first: '$deliveryDays' },
        };
        break;
    }

    pipeline.push({
      $group: {
        _id: groupId,
        count: { $sum: 1 },
        subscribers: { $push: '$$ROOT' },
        containerCount: { $sum: '$containerCount' },
        pendingContainers: { $sum: '$pendingContainers' },
        depositBalance: { $sum: '$depositBalance' },
        ...groupFields,
      },
    });

    // Sort groups by count descending by default
    pipeline.push({
      $sort: { count: -1 },
    });
  } else {
    // Sorting logic for individual subscribers
    if (payload.sortField && payload.sortOrder) {
      const sortOrder = payload.sortOrder === 'asc' ? 1 : -1;
      pipeline.push({ $sort: { [payload.sortField]: sortOrder } });
    } else {
      // Default sort by join date (most recent first)
      pipeline.push({ $sort: { joinDate: -1 } });
    }
  }

  // Only return IDs if specified
  if (payload.onlyIds) {
    pipeline.push({
      $project: {
        _id: 1,
      },
    });
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

// Get eligible subscribers for delivery on a specific day/date
const buildEligibleDeliverySubscribersQuery = (options: {
  date?: Date;
  day?: DeliveryDay;
  personnelId?: string;
  adminId?: string;
  zone?: string;
  zones?: string[];
  excludeExistingDeliveries?: boolean;
}) => {
  const pipeline: PipelineStage[] = [];
  let targetDate = options.date || new Date();
  let targetDay = options.day;

  // Calculate day if not provided
  if (!targetDay) {
    targetDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
      targetDate.getDay()
    ] as DeliveryDay;
  }

  // Start with an initial match stage
  const initialMatchConditions: Record<string, any> = { isActive: true };

  // Filter by personnel if provided
  if (options.personnelId) {
    initialMatchConditions.assignedTo = toObjectId(options.personnelId);
  }

  // Filter by admin
  if (options.adminId) {
    initialMatchConditions.$or = [
      { primaryAdmin: toObjectId(options.adminId) },
      { relatedAdmins: toObjectId(options.adminId) },
    ];
  }

  // Filter by zone(s)
  if (options.zone) {
    initialMatchConditions.zone = options.zone;
  }

  if (options.zones && options.zones.length > 0) {
    initialMatchConditions.zone = { $in: options.zones };
  }

  // Add the initial match stage to the pipeline
  pipeline.push({ $match: initialMatchConditions });

  if (options.excludeExistingDeliveries) {
    // Need to lookup deliveries for today
    const todayStart = new Date(targetDate);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(targetDate);
    todayEnd.setHours(23, 59, 59, 999);

    pipeline.push({
      $lookup: {
        from: 'deliveries',
        let: { subscriberId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$subscriberId', '$$subscriberId'] },
                  { $gte: ['$scheduledDate', todayStart] },
                  { $lte: ['$scheduledDate', todayEnd] },
                  { $nin: ['$status', ['cancelled', 'failed']] }, // Exclude cancelled/failed deliveries
                ],
              },
            },
          },
          { $limit: 1 }, // We only need to know if at least one exists
        ],
        as: 'todaysDeliveries',
      },
    });
    // Filter out subscribers who already have a delivery scheduled for today
    pipeline.push({
      $match: {
        todaysDeliveries: { $size: 0 },
      },
    });

    // Remove the lookup field if not needed later
    // Ensure $project type matches ProjectStage
    pipeline.push({ $project: { todaysDeliveries: 0 } });
  }

  // Calculate next delivery date for custom frequency
  pipeline.push({
    $addFields: {
      // For custom frequency, calculate the next delivery date
      nextDeliveryDate: {
        $cond: {
          if: {
            $and: [{ $eq: ['$isCustomFrequency', true] }, { $ne: ['$lastDeliveryDate', null] }],
          },
          then: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$customFrequencyIntervalUnit', 'days'] },
                  then: {
                    $add: [
                      '$lastDeliveryDate',
                      { $multiply: ['$customFrequencyInterval', 24 * 60 * 60 * 1000] },
                    ],
                  },
                },
                {
                  case: { $eq: ['$customFrequencyIntervalUnit', 'weeks'] },
                  then: {
                    $add: [
                      '$lastDeliveryDate',
                      { $multiply: ['$customFrequencyInterval', 7 * 24 * 60 * 60 * 1000] },
                    ],
                  },
                },
                {
                  case: { $eq: ['$customFrequencyIntervalUnit', 'months'] },
                  then: {
                    $add: [
                      '$lastDeliveryDate',
                      { $multiply: ['$customFrequencyInterval', 30 * 24 * 60 * 60 * 1000] },
                    ],
                  },
                },
              ],
              default: '$lastDeliveryDate',
            },
          },
          else: {
            $cond: {
              // If custom frequency but no last delivery, assume eligible if join date was before today? Needs clarification.
              if: { $eq: ['$isCustomFrequency', true] },
              then: '$joinDate', // Or null to prevent delivery? Or assume they are due? For now, let's use joinDate.
              else: null, // Not custom frequency
            },
          },
        },
      },
    },
  }); // Explicitly type as AddFieldsStage

  // Final filtering stage based on eligibility for the target day/date
  pipeline.push({
    $match: {
      $or: [
        // Daily subscribers are always eligible
        { subscriptionType: 'daily' },
        // Weekly subscribers are eligible if the target day is in their deliveryDays
        {
          $and: [{ subscriptionType: 'weekly' }, { deliveryDays: targetDay }],
        },
        // Custom frequency subscribers are eligible if their calculated next delivery date is on or before the target date
        {
          $and: [{ isCustomFrequency: true }, { nextDeliveryDate: { $lte: targetDate } }],
        },
      ],
    },
  }); // Explicitly type as MatchStage

  return pipeline;
};

export { buildSubscriberQuery, BuildSubscriberQueryPayload, buildEligibleDeliverySubscribersQuery };
