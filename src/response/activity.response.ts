import HTTP from './code.response';

export default (lang: string) => {
  if (lang.split(' ').length > 1) {
    return {
      httpCode: HTTP.SUCCESS,
      message: lang,
    };
  }

  return {
    ACTIVITY_CREATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Activity Created Successfully',
    },
    ACTIVITY_UPDATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Activity Updated Successfully',
    },
    ACTIVITY_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Activity Found Successfully',
    },
    ACTIVITIES_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Activities Found Successfully',
    },
    ACTIVITY_ADDED: {
      httpCode: HTTP.SUCCESS,
      message: 'Activity Added Successfully',
    },
    RECENT_ACTIVITIES_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Recent Activities Retrieved Successfully',
    },
    ACTIVITY_NOT_FOUND: {
      httpCode: HTTP.NOT_FOUND,
      message: 'Activity Not Found',
    },
    ACTIVITY_RETRIEVE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Retrieving Activity',
    },
    ACTIVITY_UPDATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Updating Activity',
    },
    ACTIVITY_CREATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Creating Activity',
    },
    ACTIVITY_ADD_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Adding Activity',
    },
  };
};
