import HTTP from './code.response';

export default (lang: string) => ({
  REVIEW_CREATED: {
    httpCode: HTTP.SUCCESS,
    message: 'Review Created Successfully',
  },
  REVIEW_FOUND: {
    httpCode: HTTP.SUCCESS,
    message: 'Review Found Successfully',
  },
  REVIEWS_FOUND: {
    httpCode: HTTP.SUCCESS,
    message: 'Reviews Found Successfully',
  },
  REVIEW_UPDATED: {
    httpCode: HTTP.SUCCESS,
    message: 'Review Updated Successfully',
  },
  REVIEW_DELETED: {
    httpCode: HTTP.SUCCESS,
    message: 'Review Deleted Successfully',
  },
  REVIEWS_WITH_SPECIFIC_RATING_FOUND: {
    httpCode: HTTP.SUCCESS,
    message: 'Reviews with Specific Rating Found Successfully',
  },
  REVIEWS_SORTED_BY_RATING_FOUND: {
    httpCode: HTTP.SUCCESS,
    message: 'Reviews Sorted by Rating Found Successfully',
  },
  AVERAGE_RATING_FOUND: {
    httpCode: HTTP.SUCCESS,
    message: 'Average Rating Found Successfully',
  },
  REVIEW_NOT_FOUND: {
    httpCode: HTTP.NOT_FOUND,
    message: 'Review Not Found',
  },
  ERROR_CREATING_REVIEW: {
    httpCode: HTTP.BAD_REQUEST,
    message: 'Error Creating Review',
  },
  ERROR_UPDATING_REVIEW: {
    httpCode: HTTP.BAD_REQUEST,
    message: 'Error Updating Review',
  },
  ERROR_DELETING_REVIEW: {
    httpCode: HTTP.BAD_REQUEST,
    message: 'Error Deleting Review',
  },
  ERROR_FINDING_REVIEWS_BY_SERVICE_ID: {
    httpCode: HTTP.BAD_REQUEST,
    message: 'Error Finding Reviews by Service ID',
  },
  ERROR_FINDING_REVIEWS_BY_REVIEWER_ID: {
    httpCode: HTTP.BAD_REQUEST,
    message: 'Error Finding Reviews by Reviewer ID',
  },
  ERROR_FINDING_REVIEWS_BY_RATING: {
    httpCode: HTTP.BAD_REQUEST,
    message: 'Error Finding Reviews by Rating',
  },
  ERROR_FINDING_REVIEWS_BY_SERVICE_ID_SORTED_BY_RATING: {
    httpCode: HTTP.BAD_REQUEST,
    message: 'Error Finding Reviews Sorted by Rating',
  },
  ERROR_FINDING_AVERAGE_RATING_FOR_SERVICE: {
    httpCode: HTTP.BAD_REQUEST,
    message: 'Error Finding Average Rating for Service',
  },
});
