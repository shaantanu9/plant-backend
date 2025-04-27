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

interface BuildReportQueryPayload {
  // Report type filter
  type?: 'daily' | 'weekly' | 'monthly' | string;

  // Date filters
  dateFrom?: Date | string;
  dateTo?: Date | string;

  // Performance metrics filters
  minTotalDeliveries?: number;
  maxTotalDeliveries?: number;
  minCompletionRate?: number; // percentage
  maxCompletionRate?: number; // percentage

  // Container metrics filters
  minContainersDelivered?: number;
  maxContainersDelivered?: number;
  minContainersReturned?: number;
  maxContainersReturned?: number;
  minReturnRate?: number; // percentage
  maxReturnRate?: number; // percentage

  // Subscriber filters
  subscriberId?: string;
  subscriberName?: string;

  // Aggregation options
  groupBy?: 'day' | 'week' | 'month' | 'year';

  // Pagination & sorting
  sortField?: string;
  sortOrder?: string;
  limit?: number;
  skip?: number;
}

const buildReportQuery = (payload: BuildReportQueryPayload): PipelineStage[] => {
  const pipeline: PipelineStage[] = [];
  const matchCriteria: PipelineStage = { $match: { $and: [] } };

  // If payload is nearly empty, return most recent reports first
  if (
    Object.keys(payload).length === 0 ||
    (Object.keys(payload).length <= 2 &&
      (payload.limit !== undefined || payload.skip !== undefined))
  ) {
    matchCriteria.$match.$and.push({
      type: { $in: ['daily', 'weekly', 'monthly'] },
    });
  }

  // Filter by report type
  if (payload.type) {
    matchCriteria.$match.$and.push({
      type: payload.type,
    });
  }

  // Filter by date range
  if (payload.dateFrom || payload.dateTo) {
    const dateFilter: any = {};
    if (payload.dateFrom) dateFilter.$gte = new Date(payload.dateFrom);
    if (payload.dateTo) dateFilter.$lte = new Date(payload.dateTo);
    matchCriteria.$match.$and.push({ date: dateFilter });
  }

  // Filter by total deliveries range
  if (payload.minTotalDeliveries !== undefined || payload.maxTotalDeliveries !== undefined) {
    const deliveriesFilter: any = {};
    if (payload.minTotalDeliveries !== undefined)
      deliveriesFilter.$gte = payload.minTotalDeliveries;
    if (payload.maxTotalDeliveries !== undefined)
      deliveriesFilter.$lte = payload.maxTotalDeliveries;
    matchCriteria.$match.$and.push({ totalDeliveries: deliveriesFilter });
  }

  // Filter by completion rate range
  if (payload.minCompletionRate !== undefined || payload.maxCompletionRate !== undefined) {
    const completionRateExpr = {
      $cond: {
        if: { $eq: ['$totalDeliveries', 0] },
        then: 0,
        else: {
          $multiply: [{ $divide: ['$completedDeliveries', '$totalDeliveries'] }, 100],
        },
      },
    };

    if (payload.minCompletionRate !== undefined) {
      matchCriteria.$match.$and.push({
        $expr: {
          $gte: [completionRateExpr, payload.minCompletionRate],
        },
      });
    }

    if (payload.maxCompletionRate !== undefined) {
      matchCriteria.$match.$and.push({
        $expr: {
          $lte: [completionRateExpr, payload.maxCompletionRate],
        },
      });
    }
  }

  // Filter by containers delivered range
  if (
    payload.minContainersDelivered !== undefined ||
    payload.maxContainersDelivered !== undefined
  ) {
    const containersFilter: any = {};
    if (payload.minContainersDelivered !== undefined)
      containersFilter.$gte = payload.minContainersDelivered;
    if (payload.maxContainersDelivered !== undefined)
      containersFilter.$lte = payload.maxContainersDelivered;
    matchCriteria.$match.$and.push({ containersDelivered: containersFilter });
  }

  // Filter by containers returned range
  if (payload.minContainersReturned !== undefined || payload.maxContainersReturned !== undefined) {
    const containersFilter: any = {};
    if (payload.minContainersReturned !== undefined)
      containersFilter.$gte = payload.minContainersReturned;
    if (payload.maxContainersReturned !== undefined)
      containersFilter.$lte = payload.maxContainersReturned;
    matchCriteria.$match.$and.push({ containersReturned: containersFilter });
  }

  // Filter by containers return rate range
  if (payload.minReturnRate !== undefined || payload.maxReturnRate !== undefined) {
    const returnRateExpr = {
      $cond: {
        if: { $eq: ['$containersDelivered', 0] },
        then: 0,
        else: {
          $multiply: [{ $divide: ['$containersReturned', '$containersDelivered'] }, 100],
        },
      },
    };

    if (payload.minReturnRate !== undefined) {
      matchCriteria.$match.$and.push({
        $expr: {
          $gte: [returnRateExpr, payload.minReturnRate],
        },
      });
    }

    if (payload.maxReturnRate !== undefined) {
      matchCriteria.$match.$and.push({
        $expr: {
          $lte: [returnRateExpr, payload.maxReturnRate],
        },
      });
    }
  }

  // Filter by subscriber ID
  if (payload.subscriberId) {
    matchCriteria.$match.$and.push({
      'subscriberDetails.subscriberId': toObjectId(payload.subscriberId),
    });
  }

  // Filter by subscriber name
  if (payload.subscriberName) {
    matchCriteria.$match.$and.push({
      'subscriberDetails.name': {
        $regex: payload.subscriberName,
        $options: 'i',
      },
    });
  }

  // Add the match criteria to the pipeline if there are conditions
  if (matchCriteria.$match.$and.length > 0) {
    pipeline.push(matchCriteria);
  }

  // Check if we need to group by time period
  if (payload.groupBy) {
    let groupByDateField: any;

    // Set up the date grouping based on specified period
    switch (payload.groupBy) {
      case 'day':
        groupByDateField = {
          $dateToString: { format: '%Y-%m-%d', date: '$date' },
        };
        break;
      case 'week':
        groupByDateField = {
          $concat: [{ $toString: { $year: '$date' } }, '-W', { $toString: { $week: '$date' } }],
        };
        break;
      case 'month':
        groupByDateField = {
          $dateToString: { format: '%Y-%m', date: '$date' },
        };
        break;
      case 'year':
        groupByDateField = {
          $dateToString: { format: '%Y', date: '$date' },
        };
        break;
    }

    // Add the grouping stage
    pipeline.push({
      $group: {
        _id: groupByDateField,
        firstDate: { $min: '$date' },
        lastDate: { $max: '$date' },
        totalDeliveries: { $sum: '$totalDeliveries' },
        completedDeliveries: { $sum: '$completedDeliveries' },
        missedDeliveries: { $sum: '$missedDeliveries' },
        containersDelivered: { $sum: '$containersDelivered' },
        containersReturned: { $sum: '$containersReturned' },
        pendingContainers: { $sum: '$pendingContainers' },
        reportsCount: { $sum: 1 },
      },
    });

    // Add computed fields for the grouped data
    pipeline.push({
      $addFields: {
        period: '$_id',
        date: '$firstDate', // Use first date for sorting
        completionRate: {
          $cond: {
            if: { $eq: ['$totalDeliveries', 0] },
            then: 0,
            else: {
              $multiply: [{ $divide: ['$completedDeliveries', '$totalDeliveries'] }, 100],
            },
          },
        },
        returnRate: {
          $cond: {
            if: { $eq: ['$containersDelivered', 0] },
            then: 0,
            else: {
              $multiply: [{ $divide: ['$containersReturned', '$containersDelivered'] }, 100],
            },
          },
        },
      },
    });
  } else {
    // If not grouping, just add computed fields to each report
    pipeline.push({
      $addFields: {
        completionRate: {
          $cond: {
            if: { $eq: ['$totalDeliveries', 0] },
            then: 0,
            else: {
              $multiply: [{ $divide: ['$completedDeliveries', '$totalDeliveries'] }, 100],
            },
          },
        },
        returnRate: {
          $cond: {
            if: { $eq: ['$containersDelivered', 0] },
            then: 0,
            else: {
              $multiply: [{ $divide: ['$containersReturned', '$containersDelivered'] }, 100],
            },
          },
        },
        pendingContainerRate: {
          $cond: {
            if: { $eq: ['$containersDelivered', 0] },
            then: 0,
            else: {
              $multiply: [{ $divide: ['$pendingContainers', '$containersDelivered'] }, 100],
            },
          },
        },
      },
    });

    // Add subscriber lookup if not grouping
    pipeline.push({
      $lookup: {
        from: 'subscribers',
        localField: 'subscriberDetails.subscriberId',
        foreignField: '_id',
        as: 'subscriberFullDetails',
      },
    });
  }

  // Sorting logic
  if (payload.sortField && payload.sortOrder) {
    const sortOrder = payload.sortOrder === 'asc' ? 1 : -1;
    pipeline.push({ $sort: { [payload.sortField]: sortOrder } });
  } else {
    // Default sort by date descending (newest first)
    pipeline.push({ $sort: { date: -1 } });
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

export { buildReportQuery, BuildReportQueryPayload };
