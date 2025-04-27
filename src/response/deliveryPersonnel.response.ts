import HTTP from './code.response';

export default (lang: string) => {
  if (lang.split(' ').length > 1) {
    return {
      httpCode: HTTP.SUCCESS,
      message: lang,
    };
  }

  return {
    // Basic CRUD responses
    DELIVERY_PERSONNEL_CREATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Delivery personnel created successfully',
    },
    DELIVERY_PERSONNEL_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Delivery personnel updated successfully',
    },
    DELIVERY_PERSONNEL_DELETED: {
      httpCode: HTTP.SUCCESS,
      message: 'Delivery personnel deleted successfully',
    },
    DELIVERY_PERSONNEL_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Delivery personnel found successfully',
    },
    DELIVERY_PERSONNEL_NOT_FOUND: {
      httpCode: HTTP.NOT_FOUND,
      message: 'Delivery personnel not found',
    },

    // Query operations responses
    DELIVERY_PERSONNEL_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Delivery personnel retrieved successfully',
    },
    ACTIVE_DELIVERY_PERSONNEL_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Active delivery personnel retrieved successfully',
    },
    DELIVERY_PERSONNEL_BY_ZONE_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Delivery personnel by zone retrieved successfully',
    },
    DELIVERY_PERSONNEL_BY_SUBSCRIBER_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Delivery personnel by subscriber retrieved successfully',
    },
    PERSONNEL_BY_PRIMARY_ZONE_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Personnel by primary zone retrieved successfully',
    },
    PERSONNEL_BY_SECONDARY_ZONE_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Personnel by secondary zone retrieved successfully',
    },
    PERSONNEL_BY_VEHICLE_TYPE_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Personnel by vehicle type retrieved successfully',
    },
    PERSONNEL_WITHIN_RADIUS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Personnel within radius retrieved successfully',
    },
    AVAILABLE_PERSONNEL_BY_DAY_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Available personnel by day retrieved successfully',
    },
    PERSONNEL_FOR_TIME_SLOT_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Personnel for time slot retrieved successfully',
    },

    // Admin relationship management responses
    ADMIN_ASSIGNED: {
      httpCode: HTTP.SUCCESS,
      message: 'Admin assigned to delivery personnel successfully',
    },
    ADMIN_REMOVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Admin removed from delivery personnel successfully',
    },
    ADMIN_SET_AS_PRIMARY: {
      httpCode: HTTP.SUCCESS,
      message: 'Admin set as primary successfully',
    },
    PERSONNEL_BY_ADMIN_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Personnel by admin retrieved successfully',
    },
    PRIMARY_PERSONNEL_FOR_ADMIN_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Primary personnel for admin retrieved successfully',
    },

    // Subscriber assignment management responses
    SUBSCRIBER_ASSIGNED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber assigned to delivery personnel successfully',
    },
    SUBSCRIBERS_ASSIGNED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscribers assigned to delivery personnel successfully',
    },
    SUBSCRIBER_REMOVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber removed from delivery personnel successfully',
    },
    ASSIGNED_SUBSCRIBERS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Assigned subscribers retrieved successfully',
    },
    PERSONNEL_SUBSCRIBER_ASSIGNMENT_CHECKED: {
      httpCode: HTTP.SUCCESS,
      message: 'Personnel subscriber assignment checked successfully',
    },
    SUBSCRIBERS_TRANSFERRED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscribers transferred successfully',
    },

    // Status and zone management responses
    ACTIVE_STATUS_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Active status updated successfully',
    },
    ZONE_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Zone updated successfully',
    },
    PRIMARY_ZONES_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Primary zones updated successfully',
    },
    SECONDARY_ZONES_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Secondary zones updated successfully',
    },
    PRIMARY_ZONE_ADDED: {
      httpCode: HTTP.SUCCESS,
      message: 'Primary zone added successfully',
    },
    SECONDARY_ZONE_ADDED: {
      httpCode: HTTP.SUCCESS,
      message: 'Secondary zone added successfully',
    },
    PRIMARY_ZONE_REMOVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Primary zone removed successfully',
    },
    SECONDARY_ZONE_REMOVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Secondary zone removed successfully',
    },

    // Vehicle information management responses
    VEHICLE_INFO_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Vehicle information updated successfully',
    },

    // Availability management responses
    AVAILABLE_DAYS_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Available days updated successfully',
    },
    TIME_SLOTS_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Time slots updated successfully',
    },
    TIME_SLOT_ADDED: {
      httpCode: HTTP.SUCCESS,
      message: 'Time slot added successfully',
    },
    TIME_SLOT_REMOVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Time slot removed successfully',
    },

    // Capacity management responses
    MAX_DELIVERIES_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Maximum deliveries updated successfully',
    },
    PERSONNEL_WITH_CAPACITY_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Personnel with capacity retrieved successfully',
    },
    WORKLOAD_STATS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Workload statistics retrieved successfully',
    },
    PERSONNEL_COUNT_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Personnel count retrieved successfully',
    },
    LEAST_SUBSCRIBERS_PERSONNEL_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Personnel with least subscribers retrieved successfully',
    },
    SUBSCRIBERS_REDISTRIBUTED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscribers redistributed successfully',
    },
    DELIVERY_PERSONNEL_STATUS_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Delivery personnel status updated successfully',
    },

    // Statistics and analytics responses
    DELIVERY_STATS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Delivery statistics retrieved successfully',
    },
    PERFORMANCE_METRICS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Performance metrics retrieved successfully',
    },
    SCHEDULE_COMPLIANCE_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Schedule compliance retrieved successfully',
    },
    WORKLOAD_DISTRIBUTION_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Workload distribution retrieved successfully',
    },

    // Error responses
    DELIVERY_PERSONNEL_RETRIEVE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error retrieving delivery personnel',
    },
    DELIVERY_PERSONNEL_CREATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error creating delivery personnel',
    },
    DELIVERY_PERSONNEL_UPDATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error updating delivery personnel',
    },
    DELIVERY_PERSONNEL_DELETE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error deleting delivery personnel',
    },
    MISSING_REQUIRED_FIELDS: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Missing required fields',
    },
    INVALID_PARAMETER_VALUE: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Invalid parameter value',
    },
    INVALID_DAY_FORMAT: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Invalid day format. Use Mon, Tue, etc.',
    },
    INVALID_TIME_FORMAT: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Invalid time format',
    },
    INVALID_COORDINATE_FORMAT: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Invalid coordinate format',
    },
    INVALID_SUBSCRIBER_IDS: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Invalid subscriber IDs',
    },
    SUBSCRIBER_ALREADY_ASSIGNED: {
      httpCode: HTTP.CONFLICT,
      message: 'Subscriber already assigned to this personnel',
    },
    OPERATION_FAILED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Operation failed',
    },
    MAX_CAPACITY_REACHED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Maximum capacity reached',
    },
    ZONE_ALREADY_EXISTS: {
      httpCode: HTTP.CONFLICT,
      message: 'Zone already exists for this personnel',
    },
    TIME_SLOT_CONFLICT: {
      httpCode: HTTP.CONFLICT,
      message: 'Time slot conflicts with existing time slots',
    },
    UNKNOWN_ERROR: {
      httpCode: HTTP.INTERNAL_SERVER_ERROR,
      message: 'An unknown error occurred',
    },

    // Backward compatibility - for existing string-based responses
    DELIVERY_PERSONNEL: (message: string) => ({
      httpCode: HTTP.SUCCESS,
      message: message || 'Operation completed successfully',
    }),
  };
};
