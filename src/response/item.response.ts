import HTTP from './code.response';

export default (lang: string) => {
  if (lang.split(' ').length > 1) {
    return {
      httpCode: HTTP.SUCCESS,
      message: lang,
    };
  }

  return {
    ITEM_CREATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Item Created Successfully',
    },
    ITEM_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Item Found Successfully',
    },
    ITEM_NOT_FOUND: {
      httpCode: HTTP.NOT_FOUND,
      message: 'Item Not Found',
    },
    ITEM_RETRIEVE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Retrieving Item',
    },
    ITEM_CREATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Creating Item',
    },

    ITEM_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Item Updated Successfully',
    },
    ITEM_UPDATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Updating Item',
    },
    ITEM_DELETED: {
      httpCode: HTTP.SUCCESS,
      message: 'Item Deleted Successfully',
    },

    ITEM_DELETE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Deleting Item',
    },

    ITEM_STATUS_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Item Status Updated Successfully',
    },

    ITEM_STATUS_UPDATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Updating Item Status',
    },

    ITEM_STATUS_HISTORY_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Item Status History Retrieved Successfully',
    },

    ITEM_STATUS_HISTORY_RETRIEVE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Retrieving Item Status History',
    },
    ITEMS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Items Retrieved Successfully',
    },
    ITEMS_RETRIEVE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Retrieving Items',
    },
    ITEM_STATUS_RETRIEVED: {
      httpCode: HTTP.SUCCESS,
      message: 'Item Status Retrieved Successfully',
    },
    ITEM_STATUS_RETRIEVE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Retrieving Item Status',
    },
  };
};
