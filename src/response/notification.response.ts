import HTTP from './code.response';

export default (lang: string) => ({
  PREFERENCES_FOUND: {
    httpCode: HTTP.SUCCESS,
    message: 'Preferences Found Successfully',
  },
  PREFERENCES_NOT_FOUND: {
    httpCode: HTTP.NOT_FOUND,
    message: 'Preferences Not Found',
  },
  PREFERENCES_UPDATED: {
    httpCode: HTTP.SUCCESS,
    message: 'Preferences Updated Successfully',
  },
  PREFERENCES_DELETED: {
    httpCode: HTTP.SUCCESS,
    message: 'Preferences Deleted Successfully',
  },
  USERS_WITH_MATCHING_PREFERENCES_FOUND: {
    httpCode: HTTP.SUCCESS,
    message: 'Users with Matching Preferences Found Successfully',
  },
  USERS_BY_LOCATION_FOUND: {
    httpCode: HTTP.SUCCESS,
    message: 'Users by Location Found Successfully',
  },
  USERS_BY_SALARY_RANGE_FOUND: {
    httpCode: HTTP.SUCCESS,
    message: 'Users by Salary Range Found Successfully',
  },
  USERS_BY_SERVICE_CATEGORY_FOUND: {
    httpCode: HTTP.SUCCESS,
    message: 'Users by Service Category Found Successfully',
  },
  USERS_BY_PARTNER_PREFERENCES_FOUND: {
    httpCode: HTTP.SUCCESS,
    message: 'Users by Partner Preferences Found Successfully',
  },
  ERROR_UPDATING_PREFERENCES: {
    httpCode: HTTP.BAD_REQUEST,
    message: 'Error Updating Preferences',
  },
  ERROR_DELETING_PREFERENCES: {
    httpCode: HTTP.BAD_REQUEST,
    message: 'Error Deleting Preferences',
  },
  ERROR_FINDING_USERS_WITH_MATCHING_PREFERENCES: {
    httpCode: HTTP.BAD_REQUEST,
    message: 'Error Finding Users with Matching Preferences',
  },
  ERROR_FINDING_USERS_BY_LOCATION: {
    httpCode: HTTP.BAD_REQUEST,
    message: 'Error Finding Users by Location',
  },
  ERROR_FINDING_USERS_BY_SALARY_RANGE: {
    httpCode: HTTP.BAD_REQUEST,
    message: 'Error Finding Users by Salary Range',
  },
  ERROR_FINDING_USERS_BY_SERVICE_CATEGORY: {
    httpCode: HTTP.BAD_REQUEST,
    message: 'Error Finding Users by Service Category',
  },
  ERROR_FINDING_USERS_BY_PARTNER_PREFERENCES: {
    httpCode: HTTP.BAD_REQUEST,
    message: 'Error Finding Users by Partner Preferences',
  },
});
