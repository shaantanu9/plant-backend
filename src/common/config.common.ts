import dotenv from 'dotenv';

export const SYS_ERR = {
  NODE_ENV_INVALID: 100,
  BOOTSTRAP_ERROR: 101,
  MONGO_CONN_FAILED: 103,
  REDIS_CONN_FAILED: 104,
};

// configure dotenv to load environment variables from .env file
dotenv.config({ path: `./ENV_FILES/.env.${process.env.NODE_ENV}` });
// dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// configure environment variables
export const CONFIG = {
  NODE_ENV: <string>process.env.NODE_ENV || 'development',
  PORT: <string>process.env.PORT || 8083,
  BASE_URL: <string>process.env.BASE_URL || 'http://localhost:3200',
  MONGO_URI: <string>process.env.MONGO_URI || '',
  REDIS_URI: <string>process.env.REDIS_URI || '',
  REDIS_PORT: <string>process.env.REDIS_PORT || '',
  REDIS_PASSWORD: <string>process.env.REDIS_PASSWORD || '',
  REDIS_DB: <string>process.env.REDIS_DB || '',
  RESET_PASSWORD: <string>process.env.RESET_PASSWORD || '',
  USER_DOMAIN: <string>process.env.USER_DOMAIN || '',
  HOST_DOMAIN: <string>process.env.HOST_DOMAIN || '',
  RESET_PASSWORD_URL:
    <string>process.env.RESET_PASSWORD_URL || 'http://localhost:3030/reset-password',
  API_URL: <string>process.env.API_URL || '',
  FAST_TWO_SMS_API_KEY: <string>process.env.FAST_TWO_SMS_API_KEY || '',
  TWO_FACTOR_API_KEY: <string>process.env.TWO_FACTOR_API_KEY || '',
  JWT: {
    SECRET: <string>process.env.JWT_SECRET || '',
    EXPIRES_IN: <string>process.env.JWT_EXPIRES_IN || '',
    REFRESH_TOKEN_EXPIRES_IN: <string>process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '',
    RESET_PASSWORD_EXPIRES_IN: <string>process.env.JWT_RESET_PASSWORD_EXPIRES_IN || '',
    VERIFY_EMAIL_EXPIRES_IN: <string>process.env.JWT_VERIFY_EMAIL_EXPIRES_IN || '',
    RESET_PASSWORD_SECRET: <string>process.env.JWT_RESET_PASSWORD_SECRET || '',
  },
  // AWS
  AWS: {
    ACCESS_KEY: <string>process.env.AWS_ACCESS_KEY || '',
    BUCKET_NAME: <string>process.env.AWS_BUCKET_NAME || '',
    SECRET_KEY: <string>process.env.AWS_SECRET_KEY || '',
    REGION: <string>process.env.AWS_REGION || '',
    BASE_URL: <string>process.env.AWS_BASE_URL || '',
    SES_EMAIL: process.env.SES_EMAIL || 'demo@soobati.com',
    SES_ACCESS_KEY: process.env.SES_ACCESS_KEY_ID || '',
    SES_SECRET_KEY: process.env.SES_SECRET_ACCESS_KEY || '',
    SES_REGION: process.env.SNS_REGION || 'ap-south-1',
  },
  GOOGLE_CAPTCHA_SECRET_KEY: <string>(process.env.GOOGLE_CAPTCHA_SECRET_KEY || ''),
  GOOGLE_GENERATIVEAI_API_KEY: <string>(process.env.GOOGLE_GENERATIVEAI_API_KEY || ''),
  STRIPE: {
    SECRET_KEY: <string>process.env.STRIPE_SECRET_KEY || '',
    API_VERSION: <string>process.env.STRIPE_SECRET_API_VERSION || '2022-11-15',
  },
  S3: {
    ACCESS_KEY: <string>process.env.S3_ACCESS_KEY_ID,
    SECRET_KEY: <string>process.env.S3_SECRET_ACCESS_KEY,
  },
  SNS: {
    ACCESS_KEY: <string>process.env.SNS_ACCESS_KEY_ID,
    SECRET_KEY: <string>process.env.SNS_SECRET_ACCESS_KEY,
    REGION: <string>process.env.SNS_REGION,
  },
  IMAGE_KIT_PRIVATE_KEY: <string>process.env.IMAGE_KIT_PRIVATE_KEY || '',
  IMAGE_KIT_PUBLIC_KEY: <string>process.env.IMAGE_KIT_PUBLIC_KEY || '',
};

export const WEB_PANELS = {
  FB_URL: `https://www.facebook.com/DeskNow-110955887345222`,
  INSTA_URL: `https://www.instagram.com/desknow/`,
  LINKEDIN_URL: `https://www.linkedin.com/company/desknow/`,
  TWITTER_URL: `https://twitter.com/Desknow3`,
  PAM_FB_URL: `https://www.facebook.com/desknowgmbh/`,
  PAM_INSTA_URL: `https://www.instagram.com/pam_by_desknow/`,
  PAM_LINKEDIN_URL: `https://www.linkedin.com/company/desknow/`,
  PAM_TWITTER_URL: `https://twitter.com/pam_by_DeskNow`,
  USER_PANEL_DEEP_LINK__API_BASE_URL: `${process.env.BASE_URL}/api/user/deeplink/`,
  HOST_PANEL_LOCAL: `http://localhost:3200`,
  IDPM_USER_PANEL: 'https://idpm.desk-now.com/',
  CONTACT_US_COMMON:
    (process.env.NODE_ENV === 'prod'
      ? 'https://desk.club/'
      : process.env.NODE_ENV === 'dev'
        ? 'https://bookings-dev.desk.club/'
        : process.env.NODE_ENV === 'staging'
          ? 'https://staging-booking.desk-now.com/'
          : 'http://localhost:3200') + '/content/contact-us',
  FAQ_COMMON:
    (process.env.NODE_ENV === 'prod'
      ? 'https://desk.club/'
      : process.env.NODE_ENV === 'dev'
        ? 'https://bookings-dev.desk.club/'
        : process.env.NODE_ENV === 'staging'
          ? 'https://staging-booking.desk-now.com/'
          : 'http://localhost:3200') + '/content/faq',
  HOST_PANEL_CONTACT_US:
    (process.env.NODE_ENV === 'prod'
      ? 'https://desk.club/'
      : process.env.NODE_ENV === 'dev'
        ? 'https://bookings-dev.desk.club/'
        : process.env.NODE_ENV === 'staging'
          ? 'https://staging-host.desk-now.com/'
          : 'http://localhost:3200') + '/content/contact-us',
  HOST_PANEL_FAQ:
    (process.env.NODE_ENV === 'prod'
      ? 'https://desk.club/'
      : process.env.NODE_ENV === 'dev'
        ? 'https://bookings-dev.desk.club/'
        : process.env.NODE_ENV === 'staging'
          ? 'https://staging-host.desk-now.com/'
          : 'http://localhost:3200') + '/content/faq',
  DESK_CLUB_COMMON:
    process.env.NODE_ENV === 'prod'
      ? 'https://desk.club'
      : process.env.NODE_ENV === 'dev'
        ? 'https://bookings-dev.desk.club/'
        : process.env.NODE_ENV === 'staging'
          ? 'https://staging-booking.desk-now.com/'
          : 'http://localhost:3200',
  HOST_PANEL_COMMON:
    process.env.NODE_ENV === 'prod'
      ? 'https://desk.club/'
      : process.env.NODE_ENV === 'dev'
        ? 'https://bookings-dev.desk.club/'
        : process.env.NODE_ENV === 'staging'
          ? 'https://staging-host.desk-now.com/'
          : 'http://localhost:3200',
  USER_PANEL_COMMON:
    process.env.NODE_ENV === 'prod'
      ? 'https://desk.club/'
      : process.env.NODE_ENV === 'dev'
        ? 'https://bookings-dev.desk.club/'
        : process.env.NODE_ENV === 'staging'
          ? 'https://staging-booking.desk-now.com/'
          : 'http://localhost:3200',
};

export const BASE = {
  URL: <string>process.env.BASE_URL,
  ADMIN: <string>process.env.BASE_ADMIN_URL,
  EMAIL_URL: <string>process.env.BASE_URL + '/api/user',
  HOST_EMAIL_URL: <string>process.env.BASE_URL + '/api/host',
  APP_URL: <string>process.env.APP_URL,
  HOST_URL: <string>process.env.HOST_URL,
  AWS: {
    IMAGE_PATH: 'desk_new/solid-images/',
    AR_MODEL_PATH: 'desk_new/models/',
    INVOICE_PATH: 'desk_now/v2/invoices/',
  },
  ANDROID: process.env.ANDROID_URL,
  S3_ICON_URL: 'https://desknow-live.s3.eu-central-1.amazonaws.com',
};
