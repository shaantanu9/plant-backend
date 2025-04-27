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
    CONTAINER_CREATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Created Successfully',
    },
    CONTAINER_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Updated Successfully',
    },
    CONTAINER_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Found Successfully',
    },
    CONTAINERS_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Containers Found Successfully',
    },
    CONTAINER_DELETED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Deleted Successfully',
    },

    // Assignment operations
    CONTAINER_ASSIGNED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Assigned to Subscriber Successfully',
    },
    CONTAINER_IN_TRANSIT_TO_SUBSCRIBER: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Marked as In Transit to Subscriber',
    },
    CONTAINER_WITH_SUBSCRIBER: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Marked as With Subscriber',
    },
    CONTAINER_IN_TRANSIT_TO_WAREHOUSE: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Marked as In Transit to Warehouse',
    },
    CONTAINER_RETURNED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Marked as Returned',
    },

    // Status management
    CONTAINER_STATUS_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Status Updated Successfully',
    },
    STATUS_HISTORY_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Status History Retrieved Successfully',
    },

    // Maintenance operations
    MAINTENANCE_RECORDED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Maintenance Recorded Successfully',
    },
    CONTAINER_CLEANED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Marked as Cleaned',
    },
    CONTAINER_CONDITION_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Condition Updated Successfully',
    },
    CONTAINER_UNDER_MAINTENANCE: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Marked as Under Maintenance',
    },
    CONTAINER_IN_INVENTORY: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Marked as Back in Inventory',
    },

    // Deposit management
    DEPOSIT_COLLECTED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Deposit Marked as Collected',
    },
    DEPOSIT_REFUNDED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Deposit Marked as Refunded',
    },
    DEPOSIT_STATISTICS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Deposit Statistics Retrieved Successfully',
    },

    // Bulk operations
    BULK_CONTAINERS_CREATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Bulk Containers Created Successfully',
    },
    BULK_CONTAINERS_RETURNED: {
      httpCode: HTTP.SUCCESS,
      message: 'Bulk Containers Marked as Returned',
    },
    BULK_CONTAINERS_LOST: {
      httpCode: HTTP.SUCCESS,
      message: 'Bulk Containers Marked as Lost',
    },

    // Query and statistics
    CONTAINERS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Containers Retrieved Successfully',
    },
    CONTAINER_COUNT_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Count Retrieved Successfully',
    },
    CONTAINER_STATISTICS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Statistics Retrieved Successfully',
    },
    CONDITION_STATISTICS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Condition Statistics Retrieved Successfully',
    },
    INVENTORY_SUMMARY_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Inventory Summary Retrieved Successfully',
    },
    CONTAINERS_SEARCH_RESULTS: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Search Results Retrieved',
    },
    CONTAINER_BY_QR_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Found by QR Code',
    },
    CONTAINER_BY_SERIAL_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Found by Serial Number',
    },
    OVERDUE_CONTAINERS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Overdue Containers Retrieved Successfully',
    },

    // Miscellaneous reused responses
    CONTAINER_ADDED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Added Successfully',
    },
    RECENT_CONTAINERS_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Recent Containers Retrieved Successfully',
    },

    // Error responses
    CONTAINER_NOT_FOUND: {
      httpCode: HTTP.NOT_FOUND,
      message: 'Container Not Found',
    },
    CONTAINER_RETRIEVE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Retrieving Container',
    },
    CONTAINER_UPDATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Updating Container',
    },
    CONTAINER_CREATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Creating Container',
    },
    CONTAINER_ADD_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Adding Container',
    },
    INVALID_CONTAINER_STATUS: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Invalid Container Status',
    },
    INVALID_CONTAINER_CONDITION: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Invalid Container Condition',
    },
    MISSING_REQUIRED_FIELDS: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Missing Required Fields',
    },
    INVALID_DATE_FORMAT: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Invalid Date Format',
    },
    INVALID_DEPOSIT_AMOUNT: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Invalid Deposit Amount',
    },
    CONTAINER_INVENTORY_SUMMARY_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Container Inventory Summary Retrieved Successfully',
    },
    CONTAINER_STATISTICS_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Retrieving Container Statistics',
    },
    DEPOSIT_STATISTICS_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Retrieving Deposit Statistics',
    },
    CONTAINER_ASSIGN_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Assigning Container',
    },
    CONTAINER_RETURN_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Returning Container',
    },
    CONTAINER_LOST_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Marking Container as Lost',
    },
    CONTAINER_CLEAN_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Marking Container as Cleaned',
    },
  };
};
