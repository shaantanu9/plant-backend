import HTTP from './code.response';

export default (lang: string) => {
  if (lang.split(' ').length > 1) {
    return {
      httpCode: HTTP.SUCCESS,
      message: lang,
    };
  }

  return {
    REPORT_CREATED: {
      httpCode: HTTP.SUCCESS,
      message: 'Report Created Successfully',
    },
    REPORT_FOUND: {
      httpCode: HTTP.SUCCESS,
      message: 'Report Found Successfully',
    },
    REPORT_NOT_FOUND: {
      httpCode: HTTP.NOT_FOUND,
      message: 'Report Not Found',
    },
    REPORT_RETRIEVE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Retrieving Report',
    },
    REPORT_CREATE_ERROR: {
      httpCode: HTTP.BAD_REQUEST,
      message: 'Error Creating Report',
    },
  };
};
