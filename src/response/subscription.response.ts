import HTTP from './code.response';

export default (lang: string) => {
  if (lang.split(' ').length > 1) {
    return {
      httpCode: HTTP.SUCCESS,
      message: lang,
    };
  }

  return {
    CREATE_SUCCESS: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscription Created Successfully',
    },
    FETCH_SUCCESS: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscription Fetched Successfully',
    },
    UPDATE_SUCCESS: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscription Updated Successfully',
    },
    DELETE_SUCCESS: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscription Deleted Successfully',
    },
    GET_SUCCESS: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscription Retrieved Successfully',
    },
    GET_ALL_SUCCESS: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscriptions Retrieved Successfully',
    },
    GET_ALL_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Retrieving Subscriptions',
    },
    GET_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Retrieving Subscription',
    },
    CREATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Creating Subscription',
    },
    UPDATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Updating Subscription',
    },
    SUBSCRIPTION_CREATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscription Created Successfully',
    },
    SUBSCRIPTION_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Subscription Found Successfully',
    },
    SUBSCRIPTION_NOT_FOUND: {
      httpCode: HTTP.NOT_FOUND,
      message: 'Subscription Not Found',
    },
    SUBSCRIPTION_RETRIEVE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Retrieving Subscription',
    },
    SUBSCRIPTION_CREATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Creating Subscription',
    },
    SUBSCRIPTION_UPDATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Updating Subscription',
    },
    SUBSCRIPTION_DELETE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Deleting Subscription',
    },
    SUBSCRIPTION_ALREADY_EXISTS: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Already Exists',
    },
    SUBSCRIPTION_NOT_ACTIVE: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Not Active',
    },
    SUBSCRIPTION_NOT_PAID: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Not Paid',
    },
    SUBSCRIPTION_NOT_VERIFIED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Not Verified',
    },
    SUBSCRIPTION_NOT_APPROVED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Not Approved',
    },
    SUBSCRIPTION_NOT_COMPLETED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Not Completed',
    },
    SUBSCRIPTION_ALREADY_COMPLETED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Already Completed',
    },
    SUBSCRIPTION_ALREADY_VERIFIED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Already Verified',
    },
    SUBSCRIPTION_ALREADY_APPROVED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Already Approved',
    },
    SUBSCRIPTION_ALREADY_PAID: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Already Paid',
    },
    SUBSCRIPTION_ALREADY_ACTIVE: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Already Active',
    },
    SUBSCRIPTION_ALREADY_PAUSED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Already Paused',
    },
    SUBSCRIPTION_ALREADY_CANCELLED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Already Cancelled',
    },
    SUBSCRIPTION_PAUSED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Paused',
    },
    SUBSCRIPTION_CANCELLED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Cancelled',
    },
    SUBSCRIPTION_ALREADY_DELETED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Already Deleted',
    },
    SUBSCRIPTION_DELETED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Deleted',
    },
    SUBSCRIPTION_NOT_DELETED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Not Deleted',
    },
    SUBSCRIPTION_ALREADY_RESTORED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Already Restored',
    },
    SUBSCRIPTION_RESTORED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Restored',
    },
    SUBSCRIPTION_NOT_RESTORED: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Not Restored',
    },
    SUBSCRIPTION_PAID: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Subscription Paid',
    },
  };
};
