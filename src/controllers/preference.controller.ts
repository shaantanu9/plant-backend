// import { Request, Response, NextFunction } from "express";
// import BaseController from "./base.controller";
// import { PreferencesEntities } from "@entity";
// import { RESPONSE } from "@response"; // Adjust the import path if necessary

// class PreferencesControllerClass extends BaseController {
//   constructor() {
//     super();
//   }

//   // Find preferences by user ID
//   public async findPreferencesByUserId(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { userId } = req.params;
//       const preferences = await PreferencesEntities.findPreferencesByUserId(
//         userId
//       );
//       if (!preferences) {
//         return this.notFound(
//           res,
//           RESPONSE.PREFERENCES("").PREFERENCES_NOT_FOUND.message
//         ); // Adjust the response message
//       }
//       return this.sendResponse(
//         res,
//         preferences,
//         RESPONSE.PREFERENCES("Preferences found")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Update preferences for a user
//   public async updatePreferences(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { userId } = req.params;
//       const updates = req.body;
//       const result = await PreferencesEntities.updatePreferences(
//         userId,
//         updates
//       );
//       if (!result.matchedCount) {
//         return this.notFound(
//           res,
//           RESPONSE.PREFERENCES("").PREFERENCES_NOT_FOUND.message
//         ); // Adjust the response message
//       }
//       return this.sendResponse(
//         res,
//         result,
//         RESPONSE.PREFERENCES("Preferences updated")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Delete preferences for a user
//   public async deletePreferences(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { userId } = req.params;
//       const result:any = await PreferencesEntities.deletePreferences(userId);
//       if (!result.deletedCount) {
//         return this.notFound(
//           res,
//           RESPONSE.PREFERENCES("").PREFERENCES_NOT_FOUND.message
//         );
//       }
//       return this.sendResponse(
//         res,
//         null,
//         RESPONSE.PREFERENCES("Preferences deleted")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Find users with matching preferences
//   public async findUsersWithMatchingPreferences(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { preferenceType } = req.params;
//       const filters = req.body;
//       const users = await PreferencesEntities.findUsersWithMatchingPreferences(
//         preferenceType,
//         filters
//       );
//       return this.sendResponse(
//         res,
//         users,
//         RESPONSE.PREFERENCES("Users with matching preferences found")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Find users by location
//   public async findUsersByLocation(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { location } = req.params;
//       const users = await PreferencesEntities.findUsersByLocation(location);
//       return this.sendResponse(
//         res,
//         users,
//         RESPONSE.PREFERENCES("Users by location found")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Find users by salary range
//   public async findUsersBySalaryRange(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const salaryRange: [number, number] = req.body;
//       const users = await PreferencesEntities.findUsersBySalaryRange(
//         salaryRange
//       );
//       return this.sendResponse(
//         res,
//         users,
//         RESPONSE.PREFERENCES("Users by salary range found")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Find users by service category
//   public async findUsersByServiceCategory(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { serviceCategory } = req.params;
//       const users = await PreferencesEntities.findUsersByServiceCategory(
//         serviceCategory
//       );
//       return this.sendResponse(
//         res,
//         users,
//         RESPONSE.PREFERENCES("Users by service category found")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Find users with specific partner preferences
//   public async findUsersByPartnerPreferences(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const partnerPreferences = req.body;
//       const users = await PreferencesEntities.findUsersByPartnerPreferences(
//         partnerPreferences
//       );
//       return this.sendResponse(
//         res,
//         users,
//         RESPONSE.PREFERENCES("Users by partner preferences found")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }
// }

// export const PreferencesController = new PreferencesControllerClass();
