import HTTP from './code.response';

export default (lang: string) => {
  console.log('LANG FROM SUB', lang);
  if (lang.split(' ').length > 1) {
    const msg = {
      httpCode: HTTP.SUCCESS,
      message: lang,
    };
    // console.log("INSIDE IF", msg);
    return msg;
  }

  return {
    // Basic CRUD responses
    SUBSCRIBER_CREATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber created successfully',
    },
    SUBSCRIBER_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber updated successfully',
    },
    SUBSCRIBER_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber found successfully',
    },
    SUBSCRIBERS_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscribers found successfully',
    },
    SUBSCRIBER_DELETED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber deleted successfully',
    },

    // Query operations
    ACTIVE_SUBSCRIBERS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Active subscribers retrieved successfully',
    },
    SUBSCRIBERS_BY_TYPE_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscribers by subscription type retrieved successfully',
    },
    SUBSCRIBERS_BY_ZONE_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscribers by zone retrieved successfully',
    },
    SUBSCRIBERS_BY_PERSONNEL_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscribers by delivery personnel retrieved successfully',
    },
    SUBSCRIBERS_BY_DAY_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscribers by delivery day retrieved successfully',
    },
    SUBSCRIBERS_WITHOUT_PERSONNEL_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscribers without assigned personnel retrieved successfully',
    },
    SUBSCRIBERS_WITH_PENDING_CONTAINERS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscribers with pending containers retrieved successfully',
    },

    // Personnel assignment
    DELIVERY_PERSONNEL_ASSIGNED: {
      httpCode: HTTP.SUCCESS,
      message: 'Delivery personnel assigned successfully',
    },
    DELIVERY_PERSONNEL_REMOVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Delivery personnel removed successfully',
    },
    DELIVERY_PERSONNEL_ALREADY_ASSIGNED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Delivery personnel already assigned to this subscriber',
    },
    NO_PERSONNEL_ASSIGNED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'No delivery personnel assigned to this subscriber',
    },

    // Container management
    CONTAINER_COUNTS_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container counts updated successfully',
    },
    CONTAINER_COUNT_INCREMENTED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container count incremented successfully',
    },
    PENDING_CONTAINERS_DECREMENTED: {
      httpCode: HTTP.SUCCESS,
      message: 'Pending container count decremented successfully',
    },
    CONTAINER_STATISTICS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container statistics retrieved successfully',
    },

    // Status management
    ACTIVE_STATUS_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber active status updated successfully',
    },
    SWAP_ENABLED_STATUS_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Swap enabled status updated successfully',
    },

    // Subscription settings
    DELIVERY_DAYS_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Delivery days updated successfully',
    },
    SUBSCRIPTION_TYPE_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscription type updated successfully',
    },
    INVALID_SUBSCRIPTION_TYPE: {
      httpCode: HTTP.BAD_REQUEST,
      message: "Invalid subscription type. Must be 'daily' or 'weekly'",
    },
    INVALID_DELIVERY_DAYS: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Invalid delivery days format',
    },

    // Search and analytics
    SEARCH_RESULTS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Search results retrieved successfully',
    },
    SUBSCRIBER_COUNTS_BY_ZONE_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber counts by zone retrieved successfully',
    },
    SUBSCRIBER_COUNTS_BY_TYPE_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber counts by subscription type retrieved successfully',
    },
    TOP_SUBSCRIBERS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Top subscribers retrieved successfully',
    },
    SUBSCRIBER_COUNTS_BY_ADMIN_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber counts by admin retrieved successfully',
    },

    // Aggregate statistics
    SUBSCRIBER_STATISTICS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber statistics retrieved successfully',
    },
    SUBSCRIBER_GROWTH_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber growth data retrieved successfully',
    },
    RETENTION_STATISTICS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber retention statistics retrieved successfully',
    },

    // Error responses
    SUBSCRIBER_NOT_FOUND: {
      httpCode: HTTP.NOT_FOUND,
      message: 'Subscriber not found',
    },
    SUBSCRIBER_CREATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error creating subscriber',
    },
    SUBSCRIBER_UPDATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error updating subscriber',
    },
    SUBSCRIBER_RETRIEVE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error retrieving subscriber',
    },
    SUBSCRIBER_DELETE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error deleting subscriber',
    },
    MISSING_REQUIRED_FIELDS: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Missing required fields',
    },
    INVALID_PARAMETER_VALUE: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Invalid parameter value',
    },
    INVALID_CONTAINER_COUNT: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Container count must be a positive number',
    },
    INVALID_PENDING_CONTAINER_COUNT: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Pending container count must be a non-negative number',
    },
    SUBSCRIBER_COUNTS_BY_ZONE_SUCCESS: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber counts by zone retrieved successfully',
    },
    SUBSCRIBER_COUNTS_BY_TYPE_SUCCESS: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber counts by subscription type retrieved successfully',
    },
    SUBSCRIBERS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscribers retrieved successfully',
    },
    SUBSCRIBER_COUNTS_BY_ADMIN_SUCCESS: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber counts by admin retrieved successfully',
    },
    SUBSCRIBER_STATISTICS_SUCCESS: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriber statistics retrieved successfully',
    },

    // For backward compatibility
    SUBSCRIBER: (message: string) => ({
      httpCode: HTTP.SUCCESS,
      message,
    }),
  };
};
