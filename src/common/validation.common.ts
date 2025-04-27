// import { Joi } from "celebrate";
// import { ENUM_ARRAY } from "./enum.common";

// export const VALIDATION = {
//   INTEGRATION: {
//     NAME: Joi.string().trim().min(3).max(40),
//     PLAN: Joi.number().valid(...ENUM_ARRAY.INTEGRATION.PLAN),
//     PRICE: Joi.number().min(0),
//     CATEGORY: Joi.object().keys({
//       name: Joi.string(),
//     }),
//   },
//   GENERAL: {
//     NAME: Joi.string().trim().min(3).max(40),
//     EMAIL: Joi.string().trim().email().max(100),
//     PASSWORD: Joi.string().min(8).max(20),
//     OBJECT: Joi.object(),
//     DATE: Joi.date().iso(),
//     NUMBER: Joi.number(),
//     ARRAY_OF_IDS: Joi.any(),
//     ARRAY_OF_NUMBERS: Joi.array().items(Joi.number()),
//     ARRAY_OF_STRINGS: Joi.array().items(Joi.string()),
//     ARRAY_OF_OBJECTS: Joi.array().items(Joi.object()),
//     CAPTCHA: Joi.string(),
//     PRICE: Joi.number().min(0),
//     STRING: Joi.string(),
//     BOOLEAN: Joi.boolean(),
//     ID: Joi.string().regex(/^[a-f\d]{24}$/i),
//     DESCRIPTION: Joi.string().trim().min(0).max(400),
//     PAGINATION: {
//       page: Joi.number().min(1).optional(),
//       limit: Joi.number().min(3).max(100).default(10).optional(),
//       search: Joi.string().trim().optional(),
//       sortBy: Joi.string().optional(),
//       sortOrder: Joi.string().optional(),
//     },
//   },
//   HOST: {
//     NUMBER_OF_EMPLOYEES: Joi.number().min(0),
//     COMPANY_NAME: Joi.string().trim().min(3).max(40),
//     ADDRESS: Joi.string().min(2).max(200),
//     USER_NAME: Joi.string()
//       .pattern(/^[a-z][a-z0-9_]{2,19}$/)
//       .min(3)
//       .max(20),
//     SPACE: {
//       STATUS: Joi.string().valid(...ENUM_ARRAY.SPACE.STATUS),
//       ALLOWED_INVITATION: Joi.number().min(0).required(),
//       AREA: Joi.object({
//         _id: Joi.string()
//           .regex(/^[a-f\d]{24}$/i)
//           .required(),
//         name: Joi.string().trim().min(3).max(40).required(),
//       }),
//     },
//     EMPLOYEE: {
//       CREATE_EMPLOYEE: Joi.array().items({
//         name: Joi.string().trim().min(3).max(40),
//         email: Joi.string().trim().email().max(100),
//         phoneNo: Joi.any(),
//         groupIds: Joi.array().items(Joi.string()).optional(),
//         qualifications: Joi.array().items(Joi.string()).optional(),
//       }),
//     },
//     FULL_ADDRESS: Joi.object({
//       country: Joi.string().min(2).max(40),
//       state: Joi.string().min(2).max(40),
//       city: Joi.string().min(2).max(40),
//       postalCode: Joi.number(),
//       line1: Joi.string().optional(),
//       line2: Joi.string().optional(),
//       placeId: Joi.string(),
//       formattedAddress: Joi.string(),
//       latitude: Joi.number(),
//       longitude: Joi.number(),
//       countryCode: Joi.string(),
//     }),
//     UPDATE_SUBSCRIPTION: {
//       INTEGRATION: Joi.array()
//         .items({
//           _id: Joi.string()
//             .regex(/^[a-f\d]{24}$/i)
//             .required(),
//           name: Joi.string().trim().min(3).max(40),
//           price: Joi.number().min(0),
//           integrationNumber: Joi.number().min(1),
//         })
//         .optional(),
//     },
//     VAT: Joi.any(),
//   },
//   USER: {
//     VERIFICATION_CODE: Joi.string(),
//     OTP: Joi.string(),
//   },
//   BOOKING: {
//     PRICE: Joi.object({
//       name: Joi.string(),
//       price: Joi.number().min(0),
//       startTime: Joi.string(),
//       endTime: Joi.string(),
//       day: Joi.string(),
//       _id: Joi.string().regex(/^[a-f\d]{24}$/i),
//     }),
//   },
//   ADMIN: {
//     NAME: Joi.string().trim().min(3).max(40),
//     EMAIL: Joi.string().trim().email().max(100),
//     PASSWORD: Joi.string().min(8).max(20),
//   },
// };
