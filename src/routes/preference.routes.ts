// import { Router, Request, Response, NextFunction } from "express";

// import { PreferencesController } from "@controllers";
// import BaseRoute from "./base.routes"; // Adjust the import path if necessary

// class PreferencesRoutes extends BaseRoute {
//   public path: string;

//   constructor(path: string) {
//     super();
//     this.path = path;
//     this.init();
//   }

//   get instance(): Router {
//     return this.router;
//   }

//   init() {
//     this.router.get(
//       "/user/:userId",
//       (req: Request, res: Response, next: NextFunction) =>
//         PreferencesController.findPreferencesByUserId(req, res, next)
//     );

//     this.router.put(
//       "/user/:userId",
//       (req: Request, res: Response, next: NextFunction) =>
//         PreferencesController.updatePreferences(req, res, next)
//     );

//     this.router.delete(
//       "/user/:userId",
//       (req: Request, res: Response, next: NextFunction) =>
//         PreferencesController.deletePreferences(req, res, next)
//     );

//     this.router.post(
//       "/match/:preferenceType",
//       (req: Request, res: Response, next: NextFunction) =>
//         PreferencesController.findUsersWithMatchingPreferences(req, res, next)
//     );

//     this.router.get(
//       "/location/:location",
//       (req: Request, res: Response, next: NextFunction) =>
//         PreferencesController.findUsersByLocation(req, res, next)
//     );

//     this.router.post(
//       "/salary",
//       (req: Request, res: Response, next: NextFunction) =>
//         PreferencesController.findUsersBySalaryRange(req, res, next)
//     );

//     this.router.get(
//       "/service/:serviceCategory",
//       (req: Request, res: Response, next: NextFunction) =>
//         PreferencesController.findUsersByServiceCategory(req, res, next)
//     );

//     this.router.post(
//       "/partner-preferences",
//       (req: Request, res: Response, next: NextFunction) =>
//         PreferencesController.findUsersByPartnerPreferences(req, res, next)
//     );
//   }
// }

// export default new PreferencesRoutes("/preferences");
