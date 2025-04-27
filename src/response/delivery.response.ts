import HTTP from './code.response';

export default (lang: string) => {
  if (lang.split(' ').length > 1) {
    return {
      httpCode: HTTP.SUCCESS,
      message: lang,
    };
  }

  return {
    DELIVERY_CREATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Delivery Created Successfully',
    },
    DELIVERY_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Delivery Updated Successfully',
    },
    DELIVERY_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Delivery Found Successfully',
    },
    DELIVERIES_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Deliveries Found Successfully',
    },
    DELIVERY_ADDED: {
      httpCode: HTTP.SUCCESS,
      message: 'Delivery Added Successfully',
    },
    RECENT_DELIVERIES_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Recent Deliveries Retrieved Successfully',
    },
    DELIVERY_NOT_FOUND: {
      httpCode: HTTP.NOT_FOUND,
      message: 'Delivery Not Found',
    },
    DELIVERY_RETRIEVE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Retrieving Delivery',
    },
    DELIVERY_UPDATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Updating Delivery',
    },
    DELIVERY_CREATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Creating Delivery',
    },
    DELIVERY_ADD_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Adding Delivery',
    },
  };
};
