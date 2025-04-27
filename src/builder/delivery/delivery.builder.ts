import { toObjectId } from '@utils';

// --- More Flexible Pipeline Stage Types ---
// Revert to inline object literals but keep $match flexible
type PipelineStage =
  | { $match: Record<string, any> } // Use Record<string, any> for flexibility
  | { $lookup: Record<string, any> }
  | { $unwind: string | Record<string, any> }
  | { $addFields: Record<string, any> }
  | { $sort: Record<string, number> }
  | { $skip: number }
  | { $limit: number }
  | { $count: string }
  | { $project: Record<string, any> }
  | { $group: Record<string, any> }
  | { $geoNear: any };

// Define types for better type safety
type DeliveryStatus = 'scheduled' | 'in-transit' | 'delivered' | 'partial' | 'missed' | 'cancelled';
type VerificationMethod = 'signature' | 'photo' | 'code' | 'none';
type ContainerCondition = 'excellent' | 'good' | 'fair' | 'poor';
type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'custom';

interface BuildDeliveryQueryPayload {
  // Basic relationships
  subscriberId?: string;
  subscriberIds?: string[];
  personnelId?: string;
  personnelIds?: string[];
  adminId?: string;
  adminIds?: string[];

  // Zone filters (requires lookup to subscribers)
  zone?: string;
  zones?: string[];

  // Date and time filters
  dateFrom?: Date | string;
  dateTo?: Date | string;
  scheduledTimeFrom?: Date | string;
  scheduledTimeTo?: Date | string;
  actualDeliveryTimeFrom?: Date | string;
  actualDeliveryTimeTo?: Date | string;
  estimatedArrivalFrom?: Date | string;
  estimatedArrivalTo?: Date | string;
  createdAtFrom?: Date | string;
  createdAtTo?: Date | string;
  updatedAtFrom?: Date | string;
  updatedAtTo?: Date | string;

  // Time slot filter
  scheduledTimeSlot?: TimeSlot | TimeSlot[];

  // Status filters
  status?: DeliveryStatus | DeliveryStatus[];
  isLate?: boolean;
  completed?: boolean;
  missedDelivery?: boolean;
  hasFutureDeliveries?: boolean;

  // Timeout/lateness filter
  daysLate?: number;
  daysLateMax?: number;

  // Container filters
  minContainersToDeliver?: number;
  maxContainersToDeliver?: number;
  minContainersDelivered?: number;
  maxContainersDelivered?: number;
  minContainersToReturn?: number;
  maxContainersToReturn?: number;
  minContainersReturned?: number;
  maxContainersReturned?: number;
  hasUnreturnedContainers?: boolean;
  containerDeliveryComplete?: boolean;
  containerReturnComplete?: boolean;
  containerIds?: string[];
  containerCondition?: ContainerCondition | ContainerCondition[];

  // Route and distance
  minRouteOrder?: number;
  maxRouteOrder?: number;
  minDeliveryDistance?: number;
  maxDeliveryDistance?: number;
  hasRouteAssigned?: boolean;

  // Payment filters
  paymentCollected?: boolean;
  minAmountCollected?: number;
  maxAmountCollected?: number;
  paymentPending?: boolean;

  // Verification filters
  verificationMethod?: VerificationMethod | VerificationMethod[];
  verified?: boolean;
  hasVerificationData?: boolean;

  // Subscription related
  subscriptionId?: string;
  subscriptionIds?: string[];
  itemId?: string;
  itemIds?: string[];
  allSubscriptionsFulfilled?: boolean;

  // Notes filters
  hasNotes?: boolean;
  hasSubscriberNotes?: boolean;
  hasPersonnelNotes?: boolean;
  notesSearch?: string;

  // Pagination & sorting
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  skip?: number;

  // Group by options
  groupBy?: 'personnel' | 'subscriber' | 'admin' | 'date' | 'status' | 'zone' | 'timeSlot';

  // Include options (control which related data to include)
  include?: {
    subscriber?: boolean;
    personnel?: boolean;
    admin?: boolean;
    subscriptions?: boolean;
    containers?: boolean;
    routeDetails?: boolean;
  };

  // Search
  searchTerm?: string;

  // Special flags
  includeCount?: boolean;
  onlyIds?: boolean;
  calculateStats?: boolean;
}

const buildDeliveryQuery = (payload: BuildDeliveryQueryPayload): PipelineStage[] => {
  const pipeline: PipelineStage[] = [];
  const countPipeline: PipelineStage[] = []; // Separate pipeline for counting
  const needCount = payload.includeCount === true;

  // --- Conditional Subscriber Lookup for Zone Filtering ---
  const needsZoneFilter = payload.zone || (payload.zones && payload.zones.length > 0);
  const zoneFilterStages: PipelineStage[] = [];
  if (needsZoneFilter) {
    // Perform subscriber lookup early if needed for filtering
    zoneFilterStages.push({
      $lookup: {
        from: 'subscribers',
        localField: 'subscriberId',
        foreignField: '_id',
        as: 'subscriberDetailsForFilter',
        pipeline: [{ $project: { _id: 1, zone: 1 } }], // Only fetch necessary fields
      },
    });
    zoneFilterStages.push({
      $unwind: {
        path: '$subscriberDetailsForFilter',
        preserveNullAndEmptyArrays: true, // Keep deliveries even if subscriber lookup fails
      },
    });
    pipeline.push(...zoneFilterStages);
    if (needCount) {
      countPipeline.push(...zoneFilterStages);
    }
  }

  // --- Build Main Match Conditions ---
  const matchConditionsList: Record<string, any>[] = []; // Use a list to build $and clause

  // Default: Exclude cancelled deliveries unless explicitly requested
  let statusCondition: Record<string, any> | null = null;
  if (!payload.status || (Array.isArray(payload.status) && !payload.status.includes('cancelled'))) {
    statusCondition = { status: { $ne: 'cancelled' } };
  } else if (typeof payload.status === 'string' && payload.status !== 'cancelled') {
    statusCondition = { status: payload.status };
  } else if (Array.isArray(payload.status)) {
    statusCondition = { status: { $in: payload.status } };
  } else if (typeof payload.status === 'string' && payload.status === 'cancelled') {
    statusCondition = { status: 'cancelled' };
  }
  if (statusCondition) {
    matchConditionsList.push(statusCondition);
  }

  // Search term
  if (payload.searchTerm) {
    const searchCriteria = { $regex: payload.searchTerm, $options: 'i' };
    matchConditionsList.push({
      $or: [
        { notes: searchCriteria },
        { subscriberNotes: searchCriteria },
        { personnelNotes: searchCriteria },
        // { deliveryCode: searchCriteria }
      ],
    });
  }

  // Relationship Filters
  if (payload.subscriberId)
    matchConditionsList.push({ subscriberId: toObjectId(payload.subscriberId) });
  if (payload.subscriberIds && payload.subscriberIds.length > 0) {
    matchConditionsList.push({
      subscriberId: { $in: payload.subscriberIds.map(id => toObjectId(id)) },
    });
  }
  if (payload.personnelId)
    matchConditionsList.push({ personnelId: toObjectId(payload.personnelId) });
  if (payload.personnelIds && payload.personnelIds.length > 0) {
    matchConditionsList.push({
      personnelId: { $in: payload.personnelIds.map(id => toObjectId(id)) },
    });
  }
  if (payload.adminId) matchConditionsList.push({ adminId: toObjectId(payload.adminId) });
  if (payload.adminIds && payload.adminIds.length > 0) {
    matchConditionsList.push({ adminId: { $in: payload.adminIds.map(id => toObjectId(id)) } });
  }

  // Zone Filter (uses pre-fetched data)
  if (payload.zone) {
    matchConditionsList.push({ 'subscriberDetailsForFilter.zone': payload.zone });
  }
  if (payload.zones && payload.zones.length > 0) {
    matchConditionsList.push({ 'subscriberDetailsForFilter.zone': { $in: payload.zones } });
  }

  // Date & Time Filters
  const addDateFilter = (field: string, from?: Date | string, to?: Date | string) => {
    if (from || to) {
      const filter: any = {};
      if (from) filter.$gte = new Date(from);
      if (to) filter.$lte = new Date(to);
      matchConditionsList.push({ [field]: filter }); // Push as separate object
    }
  };
  addDateFilter('date', payload.dateFrom, payload.dateTo);
  addDateFilter('scheduledTime', payload.scheduledTimeFrom, payload.scheduledTimeTo);
  addDateFilter('actualDeliveryTime', payload.actualDeliveryTimeFrom, payload.actualDeliveryTimeTo);
  addDateFilter('estimatedArrival', payload.estimatedArrivalFrom, payload.estimatedArrivalTo);
  addDateFilter('createdAt', payload.createdAtFrom, payload.createdAtTo);
  addDateFilter('updatedAt', payload.updatedAtFrom, payload.updatedAtTo);

  // Time Slot Filter
  if (payload.scheduledTimeSlot) {
    if (Array.isArray(payload.scheduledTimeSlot)) {
      matchConditionsList.push({ scheduledTimeSlot: { $in: payload.scheduledTimeSlot } });
    } else {
      matchConditionsList.push({ scheduledTimeSlot: payload.scheduledTimeSlot });
    }
  }

  // Status Filters
  // Note: Base status filter applied earlier
  if (payload.completed !== undefined) {
    matchConditionsList.push({
      status: payload.completed
        ? { $in: ['delivered', 'partial'] }
        : { $nin: ['delivered', 'partial'] },
    });
  }
  if (payload.missedDelivery !== undefined) {
    matchConditionsList.push({ status: payload.missedDelivery ? 'missed' : { $ne: 'missed' } });
  }

  // Timeout/Lateness Filter (using $expr)
  if (payload.daysLate !== undefined || payload.daysLateMax !== undefined) {
    const lateConditions: any = {};
    const daysLateExpr = {
      $divide: [{ $subtract: [new Date(), '$date'] }, 24 * 60 * 60 * 1000],
    };
    if (payload.daysLate !== undefined) lateConditions.$gte = [daysLateExpr, payload.daysLate];
    if (payload.daysLateMax !== undefined)
      lateConditions.$lte = [daysLateExpr, payload.daysLateMax];

    const lateFilter = {
      $expr: {
        // Use $expr for comparisons involving calculated values
        $and: [
          { $in: ['$status', ['scheduled', 'in-transit']] },
          { $lt: ['$date', new Date()] },
          // Only include $gte/$lte if they exist
          ...(lateConditions.$gte ? [{ $gte: lateConditions.$gte }] : []),
          ...(lateConditions.$lte ? [{ $lte: lateConditions.$lte }] : []),
        ],
      },
    };
    matchConditionsList.push(lateFilter);
  }

  // Container Filters
  const addNumericRangeFilter = (field: string, min?: number, max?: number) => {
    if (min !== undefined || max !== undefined) {
      const filter: any = {};
      if (min !== undefined) filter.$gte = min;
      if (max !== undefined) filter.$lte = max;
      matchConditionsList.push({ [field]: filter });
    }
  };
  addNumericRangeFilter(
    'containersToDeliverCount',
    payload.minContainersToDeliver,
    payload.maxContainersToDeliver,
  );
  addNumericRangeFilter(
    'containersDeliveredCount',
    payload.minContainersDelivered,
    payload.maxContainersDelivered,
  );
  addNumericRangeFilter(
    'containersToReturnCount',
    payload.minContainersToReturn,
    payload.maxContainersToReturn,
  );
  addNumericRangeFilter(
    'containersReturnedCount',
    payload.minContainersReturned,
    payload.maxContainersReturned,
  );

  // Container completion filters using $expr
  if (payload.hasUnreturnedContainers !== undefined) {
    matchConditionsList.push({
      $expr: {
        [payload.hasUnreturnedContainers ? '$lt' : '$eq']: [
          '$containersReturnedCount',
          '$containersToReturnCount',
        ],
      },
    });
  }
  if (payload.containerDeliveryComplete !== undefined) {
    matchConditionsList.push({
      $expr: {
        [payload.containerDeliveryComplete ? '$eq' : '$lt']: [
          '$containersDeliveredCount',
          '$containersToDeliverCount',
        ],
      },
    });
  }
  if (payload.containerReturnComplete !== undefined) {
    matchConditionsList.push({
      $expr: {
        [payload.containerReturnComplete ? '$eq' : '$lt']: [
          '$containersReturnedCount',
          '$containersToReturnCount',
        ],
      },
    });
  }

  if (payload.containerIds && payload.containerIds.length > 0) {
    matchConditionsList.push({
      involvedContainerIds: { $in: payload.containerIds.map(id => toObjectId(id)) },
    });
  }

  // Route and Distance Filters
  addNumericRangeFilter('routeOrder', payload.minRouteOrder, payload.maxRouteOrder);
  addNumericRangeFilter(
    'deliveryDistance',
    payload.minDeliveryDistance,
    payload.maxDeliveryDistance,
  );
  if (payload.hasRouteAssigned !== undefined) {
    matchConditionsList.push({
      routeOrder: payload.hasRouteAssigned
        ? { $exists: true, $ne: null }
        : { $in: [null, undefined] },
    });
  }

  // Payment Filters
  if (payload.paymentCollected !== undefined)
    matchConditionsList.push({ paymentCollected: payload.paymentCollected });
  addNumericRangeFilter('amountCollected', payload.minAmountCollected, payload.maxAmountCollected);
  if (payload.paymentPending !== undefined) {
    matchConditionsList.push({ paymentCollected: payload.paymentPending ? { $ne: true } : true });
  }

  // Verification Filters
  if (payload.verificationMethod) {
    matchConditionsList.push({
      verificationMethod: Array.isArray(payload.verificationMethod)
        ? { $in: payload.verificationMethod }
        : payload.verificationMethod,
    });
  }
  if (payload.verified !== undefined) matchConditionsList.push({ verified: payload.verified });
  if (payload.hasVerificationData !== undefined) {
    matchConditionsList.push({
      verificationData: payload.hasVerificationData
        ? { $exists: true, $nin: [null, ''] }
        : { $in: [null, ''] },
    });
  }

  // Subscription/Item Filters
  if (payload.subscriptionId)
    matchConditionsList.push({ 'items.subscriptionId': toObjectId(payload.subscriptionId) });
  if (payload.subscriptionIds && payload.subscriptionIds.length > 0) {
    matchConditionsList.push({
      'items.subscriptionId': { $in: payload.subscriptionIds.map(id => toObjectId(id)) },
    });
  }
  if (payload.itemId) matchConditionsList.push({ 'items.itemId': toObjectId(payload.itemId) });
  if (payload.itemIds && payload.itemIds.length > 0) {
    matchConditionsList.push({
      'items.itemId': { $in: payload.itemIds.map(id => toObjectId(id)) },
    });
  }

  // Notes Filters
  if (payload.hasNotes !== undefined) {
    matchConditionsList.push({
      notes: payload.hasNotes ? { $exists: true, $nin: [null, ''] } : { $in: [null, ''] },
    });
  }
  if (payload.hasSubscriberNotes !== undefined) {
    matchConditionsList.push({
      subscriberNotes: payload.hasSubscriberNotes
        ? { $exists: true, $nin: [null, ''] }
        : { $in: [null, ''] },
    });
  }
  if (payload.hasPersonnelNotes !== undefined) {
    matchConditionsList.push({
      personnelNotes: payload.hasPersonnelNotes
        ? { $exists: true, $nin: [null, ''] }
        : { $in: [null, ''] },
    });
  }
  if (payload.notesSearch) {
    const searchRegex = { $regex: payload.notesSearch, $options: 'i' };
    matchConditionsList.push({
      $or: [
        { notes: searchRegex },
        { subscriberNotes: searchRegex },
        { personnelNotes: searchRegex },
      ],
    });
  }

  // --- Add Combined Match Stage ---
  if (matchConditionsList.length > 0) {
    const matchStage = { $match: { $and: matchConditionsList } };
    pipeline.push(matchStage);
    if (needCount) {
      countPipeline.push(matchStage);
    }
  }

  // --- Remove Temporary Lookup Field ---
  if (needsZoneFilter) {
    const projectStage = { $project: { subscriberDetailsForFilter: 0 } };
    pipeline.push(projectStage);
    // No need to add this to countPipeline
  }

  // --- Handle Count Pipeline ---
  if (needCount) {
    countPipeline.push({ $count: 'totalCount' });
    // NOTE: Returning only the main pipeline. Caller needs to execute countPipeline separately if needed.
  }

  // --- Include Related Data (Lookups) ---
  const includeOptions = payload.include || {};

  const addLookup = (
    from: string,
    localField: string,
    foreignField: string,
    as: string,
    projectFields?: Record<string, any>,
  ) => {
    const lookupPipelineSteps: PipelineStage[] = [];
    if (projectFields) {
      lookupPipelineSteps.push({ $project: projectFields });
    }
    const lookupStage = {
      $lookup: {
        from,
        localField,
        foreignField,
        as,
        ...(lookupPipelineSteps.length > 0 && { pipeline: lookupPipelineSteps }),
      },
    };
    pipeline.push(lookupStage);
    // Unwind if it's expected to be a single document
    pipeline.push({ $unwind: { path: `$${as}`, preserveNullAndEmptyArrays: true } });
  };

  if (includeOptions.subscriber) {
    addLookup('subscribers', 'subscriberId', '_id', 'subscriberDetails', {
      name: 1,
      mobile: 1,
      address: 1,
      fullAddress: 1,
      zone: 1,
      preferredTimeSlot: 1,
    });
  }
  if (includeOptions.personnel) {
    addLookup('deliverypersonnel', 'personnelId', '_id', 'personnelDetails', {
      name: 1,
      email: 1,
      phone: 1,
      zone: 1,
    });
  }
  if (includeOptions.admin) {
    addLookup('users', 'adminId', '_id', 'adminDetails', {
      email: 1,
      firstName: 1,
      lastName: 1,
      role: 1,
    });
  }
  if (includeOptions.subscriptions) {
    pipeline.push({
      $lookup: {
        from: 'subscriptions',
        localField: 'items.subscriptionId',
        foreignField: '_id',
        as: 'subscriptionDetails',
      },
    });
  }
  if (includeOptions.containers) {
    pipeline.push({
      $lookup: {
        from: 'containers',
        localField: 'involvedContainerIds',
        foreignField: '_id',
        as: 'containerObjects',
      },
    });
  }

  // --- Add Computed Fields ---
  const fieldsToAdd: Record<string, any> = {};
  let computedFieldsAdded = false;

  // Always add formatted dates
  fieldsToAdd.dateFormatted = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };
  fieldsToAdd.actualDeliveryTimeFormatted = {
    $cond: {
      if: { $ne: ['$actualDeliveryTime', null] },
      then: { $dateToString: { format: '%Y-%m-%d %H:%M', date: '$actualDeliveryTime' } },
      else: null,
    },
  };
  computedFieldsAdded = true;

  // Add isLate calculation (moved here to ensure fields exist)
  fieldsToAdd.isLateCalculated = {
    $cond: {
      if: { $in: ['$status', ['scheduled', 'in-transit']] },
      then: { $lt: ['$date', new Date()] },
      else: false,
    },
  };

  // Add other calculations if needed (e.g., completion percentages)

  if (computedFieldsAdded) {
    pipeline.push({ $addFields: fieldsToAdd });
  }

  // --- Add Match Stage for Computed Fields (if filtering on them) ---
  const computedMatchConditions: Record<string, any>[] = [];
  if (payload.isLate !== undefined) {
    computedMatchConditions.push({ isLateCalculated: payload.isLate });
  }
  // Add other filters based on computed fields here

  if (computedMatchConditions.length > 0) {
    pipeline.push({ $match: { $and: computedMatchConditions } });
  }

  // --- Grouping ---
  if (payload.groupBy) {
    let groupId: any = {};
    const groupFields: any = {};

    switch (payload.groupBy) {
      case 'personnel':
        groupId = '$personnelId';
        groupFields.personnelDetails = { $first: '$personnelDetails' };
        break;
      case 'subscriber':
        groupId = '$subscriberId';
        groupFields.subscriberDetails = { $first: '$subscriberDetails' };
        break;
      case 'admin':
        groupId = '$adminId';
        groupFields.adminDetails = { $first: '$adminDetails' };
        break;
      case 'date':
        groupId = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };
        break;
      case 'status':
        groupId = '$status';
        break;
      case 'zone':
        groupId = '$subscriberDetails.zone';
        groupFields.zone = { $first: '$subscriberDetails.zone' };
        break;
      case 'timeSlot':
        groupId = '$scheduledTimeSlot';
        break;
    }

    pipeline.push({
      $group: {
        _id: groupId,
        count: { $sum: 1 },
        deliveries: { $push: '$$ROOT' },
        totalContainersDelivered: { $sum: '$containersDeliveredCount' },
        totalContainersReturned: { $sum: '$containersReturnedCount' },
        ...groupFields,
      },
    });
    pipeline.push({ $sort: { count: -1 } });
  } else {
    // --- Sorting (Only if not grouping) ---
    const sortField = payload.sortField || 'date'; // Default sort field
    const sortOrder = payload.sortOrder === 'asc' ? 1 : -1;
    pipeline.push({ $sort: { [sortField]: sortOrder } });
  }

  // --- Projection (Only IDs) ---
  if (payload.onlyIds) {
    if (!payload.groupBy) {
      pipeline.push({ $project: { _id: 1 } });
    } else {
      pipeline.push({ $project: { _id: 1, count: 1 } }); // Example: return group id and count
    }
  }

  // --- Pagination ---
  if (payload.skip !== undefined) {
    pipeline.push({ $skip: Number(payload.skip) });
  }
  if (payload.limit !== undefined) {
    pipeline.push({ $limit: Number(payload.limit) });
  }

  return pipeline;
};

export { buildDeliveryQuery, BuildDeliveryQueryPayload };
