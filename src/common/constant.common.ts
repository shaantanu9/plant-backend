import { BASE, WEB_PANELS } from '@common';
// import moment from "moment";

export const CONSTANT = {
  // DATE_CONSTANTS: {
  //   monthStart: (month: number, year: number) => {
  //     return moment()
  //       .year(year)
  //       .month(month - 1)
  //       .startOf("month")
  //       .toDate();
  //   },

  //   monthEnd: (month: number, year: number) => {
  //     return moment()
  //       .year(year)
  //       .month(month - 1)
  //       .endOf("month")
  //       .toDate();
  //   },

  //   yearStart: (year: number) => {
  //     return moment().year(year).startOf("year").toDate();
  //   },

  //   yearEnd: (year: number) => {
  //     return moment().year(year).endOf("year").toDate();
  //   },

  //   nextYear: (offset: number) => {
  //     return moment()
  //       .utcOffset(Math.floor(offset / 60000))
  //       .add(1, "y")
  //       .toDate();
  //   },

  //   deleteOn: (days: number) => {
  //     return moment().utcOffset(0).add(days, "d").toDate();
  //   },

  //   addDurationToDate: (date: string, duration: string, type: any) => {
  //     return moment(date).add(duration, type).toDate();
  //   },

  //   pastFiveMinutes: (
  //     offset: number,
  //     date?:
  //       | string
  //       | number
  //       | void
  //       | moment.Moment
  //       | Date
  //       | (string | number)[]
  //       | moment.MomentInputObject
  //       | undefined
  //   ) => {
  //     return date
  //       ? moment(date)
  //           .utcOffset(Math.floor(offset / 60000))
  //           .subtract(5, "m")
  //           .toDate()
  //       : moment().utcOffset(0).subtract(5, "m").toDate();
  //   },

  //   currentTime: (offset?: number) => {
  //     return offset
  //       ? moment()
  //           .utcOffset(Math.floor(offset / 60000))
  //           .toDate()
  //       : moment().utcOffset(0).toDate();
  //   },

  //   fromDate: (date: string, offset: number) => {
  //     return moment(date)
  //       .utcOffset(Math.floor(offset / 60000))
  //       .toDate();
  //   },

  //   hourlyFromDate: (date: string, offset: number) => {
  //     return moment(date)
  //       .utcOffset(Math.floor(offset / 60000))
  //       .add(1, "seconds")
  //       .toDate();
  //   },

  //   toDate: (date: string, offset: number) => {
  //     return moment(date)
  //       .utcOffset(Math.floor(offset / 60000))
  //       .toDate();
  //   },

  //   hourlyToDate: (date: string, offset: number) => {
  //     return moment(date)
  //       .utcOffset(Math.floor(offset / 60000))
  //       .subtract(1, "seconds")
  //       .toDate();
  //   },

  //   formatTime: (date: string, offset: number) => {
  //     return moment(date)
  //       .utcOffset(Math.floor(offset / 60000))
  //       .format("MMM DD,YYYY");
  //   },
  //   utcTimeDate: (date: string) => {
  //     return moment(date).utc().toDate();
  //   },

  //   lastTwentyFourHours: (offset?: number) => {
  //     return offset
  //       ? moment()
  //           .utcOffset(Math.floor(offset / 60000))
  //           .subtract(7, "d")
  //           .toDate()
  //       : moment().utcOffset(0).subtract(7, "d").toDate();
  //   },

  //   pastDay: (offset: number, date?: string) => {
  //     return date
  //       ? moment(parseInt(date))
  //           .utcOffset(Math.floor(offset / 60000))
  //           .subtract(1, "d")
  //           .toDate()
  //       : moment()
  //           .utcOffset(Math.floor(offset / 60000))
  //           .subtract(1, "d")
  //           .toDate();
  //   },

  //   midNightTime: (date?: string, offset?: number) => {
  //     return date
  //       ? moment(parseInt(date))
  //           .utcOffset(offset ? Math.floor(offset / 60000) : 330)
  //           .endOf("d")
  //           .toDate()
  //       : moment().utcOffset(0).endOf("d").toDate();
  //   },

  //   previousMidNight: () => {
  //     return moment().utcOffset(0).subtract(1, "d").startOf("d").toDate();
  //   },

  //   midNightTimeStamp: () => {
  //     return moment().utcOffset(0).endOf("d").unix();
  //   },

  //   nextSevenDayDate: (date: any, offset?: number) => {
  //     return moment(parseInt(date))
  //       .utcOffset(offset ? Math.floor(offset / 60000) : 330)
  //       .add(7, "d")
  //       .endOf("d")
  //       .toDate();
  //   },

  //   currentUtcTimeStamp: () => {
  //     return moment().utc().unix() * 1000;
  //   },

  //   currentUtcTimeDate: () => {
  //     return moment().utc().toDate();
  //   },

  //   utcMidNightTimestamp: () => {
  //     return moment().utc().endOf("d").unix() * 1000;
  //   },

  //   nextFiveMinutes: () => {
  //     return moment().utcOffset(0).add(4, "m").unix() * 1000;
  //   },

  //   previousFiveMinutes: () => {
  //     return moment().utcOffset(0).subtract(5, "m").unix() * 1000;
  //   },

  //   currentLocalDay: (offset: number) => {
  //     return new Date(
  //       new Date(new Date().getTime() + offset).setHours(0, 0, 0, 0)
  //     );
  //   },

  //   calculateCurrentDate: (date: string, offset: number) => {
  //     return moment(date).add(Math.abs(offset), "minute").toDate();
  //   },

  //   calculateEndOfDay: (date: any = moment(), offset: number) => {
  //     return moment(date).endOf("day").utcOffset(offset, true).toDate();
  //   },

  //   calculateStartOfDay: (date: any = moment(), offset: number = 120) => {
  //     return moment(date).startOf("day").utcOffset(offset, true).toDate();
  //   },
  //   getDayName: (date: string) => {
  //     return moment(date).format('dddd').toLowerCase();
  //   },
  //   getDayDifference: (date1: any, date2: any, offset: number = 120) => {
  //     // Ensure date1 and date2 are valid Moment.js objects
  //     const momentDate1 = moment(date1);
  //     const momentDate2 = moment(date2);

  //     // Apply the UTC offset to both dates
  //     momentDate1.utcOffset(offset, true);
  //     momentDate2.utcOffset(offset, true);

  //     // Calculate the difference in minutes
  //     const differenceInMinutes = momentDate2.diff(momentDate1, 'days');
  //     return differenceInMinutes;
  //   }
  // },
  TRANSACTION_ID_PREFIX: 'DNP_',
  BOOKING_ID_PREFIX: 'DNP',
  EMAILER_URLS: {
    WEB_PANEL: WEB_PANELS.HOST_PANEL_COMMON,
    CONTACT_US: WEB_PANELS.CONTACT_US_COMMON,
    FAQUrl: WEB_PANELS.FAQ_COMMON,
  },
  VERIFY_EMAIL_LOGO: `${BASE.S3_ICON_URL}/site-images/logo.png`,
  VERIFY_EMAIL_BG: `${BASE.S3_ICON_URL}/site-images/login-bg.png`,
  GIFT_CARD_LOGO: `${BASE.S3_ICON_URL}/site-images/giftCardBg.jpg`,
  GIFT_CARD_BG: `${BASE.S3_ICON_URL}/site-images/giftCardLogo.png`,
  ADDRESS_PIN: `${BASE.S3_ICON_URL}/site-images/addressPin.svg`,
  LINKEDIN_ICON: `${BASE.S3_ICON_URL}/site-images/linkedinLogo.png`,
  CLAIMED_STATIC_IMAGES: [
    `${BASE.S3_ICON_URL}/site-images/propertyPlaceHolder11.svg`,
    `${BASE.S3_ICON_URL}/site-images/propertyPlaceHolder11.svg`,
  ],
  APP_STORE_BADGE: `${BASE.S3_ICON_URL}/site-images/App_Store_Badge_US_Black.png`,
  COMPLEMENTRAY_2: `${BASE.S3_ICON_URL}/site-images/complementary2_1.jpg`,
  FACEBOOK_LOGO_PNG: `${BASE.S3_ICON_URL}/site-images/facebookLogo.png`,
  GOOGLE_PLAY_BADGE: `${BASE.S3_ICON_URL}/site-images/Google_Play_Badge_US.png`,
  INSTAGRAM_LOGO: `${BASE.S3_ICON_URL}/site-images/instagramLogo.png`,
  LINKEDIN_LOGO: `${BASE.S3_ICON_URL}/site-images/linkedinLogo.png`,
  MOCKUPER_6: `${BASE.S3_ICON_URL}/site-images/mockuper_6.png`,
  PEXELS_COTTONBRO: `${BASE.S3_ICON_URL}/site-images/pexels-cottonbro-3201783.jpg`,
  PEXELS_DARIA: `${BASE.S3_ICON_URL}/site-images/pexels-daria-shevtsova-1467435.jpg`,
  PEXELS_PEW: `${BASE.S3_ICON_URL}/site-images/pexels-pew-nguyen-244133.jpg`,
  TWITTER_LOGO_NEW: `${BASE.S3_ICON_URL}/site-images/twitterLogo.png`,
  BANNER_PNG: `${BASE.S3_ICON_URL}/site-images/banner.png`,
  SPLASH_LOGO: `${BASE.S3_ICON_URL}/site-images/splash.svg`,
  PAM_LOGO: `${BASE.S3_ICON_URL}/site-images/Pamlogo.png`,
  FACEBOOK_LOGO: `${BASE.S3_ICON_URL}/site-images/facebook.svg`,
  IG_LOGO: `${BASE.S3_ICON_URL}/site-images/instagramLogo.png`,

  TERM_AND_CONDITION_ATTACHMENT: [
    {
      fileName: '20211115_AVV_SaaS_AWSDTAG_DE.Final.pdf',
      href: 'https://desknow-live.s3.eu-central-1.amazonaws.com/20211115_AVV_SaaS_AWSDTAG_DE.Final.pdf',
      contentType: 'application/pdf',
    },
    {
      fileName: 'Datenschutzerklaerung.pdf',
      href: 'https://desknow-live.s3.eu-central-1.amazonaws.com/Datenschutzerklaerung.pdf',
      contentType: 'application/pdf',
    },
    {
      fileName: 'DeskNow_AGB.pdf',
      href: 'https://desknow-live.s3.eu-central-1.amazonaws.com/DeskNow_AGB.pdf',
      contentType: 'application/pdf',
    },
  ],
  SPACE_PLACEHOLDER_URL:
    'https://desknow-live.s3.eu-central-1.amazonaws.com/space_placeholder.png.png',
};

export const EMAIL_CONSTANTS = {
  logo: CONSTANT.VERIFY_EMAIL_LOGO,
  facebookLogo: CONSTANT.FACEBOOK_LOGO_PNG,
  mockpur: CONSTANT.MOCKUPER_6,
  appStore: CONSTANT.APP_STORE_BADGE,
  googlePlay: CONSTANT.GOOGLE_PLAY_BADGE,
  igLogo: CONSTANT.INSTAGRAM_LOGO,
  twitterLogo: CONSTANT.TWITTER_LOGO_NEW,
  linkedinLogo: CONSTANT.LINKEDIN_LOGO,
  curratedLogo: CONSTANT.COMPLEMENTRAY_2,
  complementaryLogo: CONSTANT.PEXELS_DARIA,
  printingLogo: CONSTANT.PEXELS_COTTONBRO,
  healthierLogo: CONSTANT.PEXELS_PEW,
  addressPin: CONSTANT.ADDRESS_PIN,
  webPanelUrl: WEB_PANELS.USER_PANEL_COMMON,
  contactUsUrl: WEB_PANELS.CONTACT_US_COMMON,
  FAQUrl: WEB_PANELS.FAQ_COMMON,
  tAndCUrl: `${WEB_PANELS.USER_PANEL_COMMON}/content/term-condition`,
  playStoreLink: 'https://play.google.com/store/apps/details?id=com.desknow.user&pli=1',
  appStoreLink: 'https://apps.apple.com/us/app/desknow/id1529222764',
  bookingAppLink: WEB_PANELS.USER_PANEL_COMMON,
  desknowLink: 'http://www.desk-now.com',
};
