// import { ActivityController } from "@controllers";
// import { NextFunction, Request, Response, Router } from "express";
// import BaseRoute from "./base.routes"; // Adjust the import path if necessary

// class ActivityRoute extends BaseRoute {
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
//     // Create a new activity
//     this.router.post(
//       "/",
//       // userVerifyJWT, // Uncomment if authentication is needed
//       (req: Request, res: Response, next: NextFunction) => {
//         ActivityController.createActivity(req, res, next);
//       }
//     );

//     // Find activity by ID
//     this.router.get(
//       "/:activityId",
//       // userVerifyJWT, // Uncomment if authentication is needed
//       (req: Request, res: Response, next: NextFunction) => {
//         ActivityController.findActivityById(req, res, next);
//       }
//     );

//     // Find activities by user ID
//     this.router.get(
//       "/user/:userId",
//       // userVerifyJWT, // Uncomment if authentication is needed
//       (req: Request, res: Response, next: NextFunction) => {
//         ActivityController.findActivitiesByUserId(req, res, next);
//       }
//     );

//     // Find activities by type
//     this.router.get(
//       "/type/:activityType",
//       // userVerifyJWT, // Uncomment if authentication is needed
//       (req: Request, res: Response, next: NextFunction) => {
//         ActivityController.findActivitiesByType(req, res, next);
//       }
//     );

//     // Update activity details by ID
//     this.router.put(
//       "/:activityId",
//       // userVerifyJWT, // Uncomment if authentication is needed
//       (req: Request, res: Response, next: NextFunction) => {
//         ActivityController.updateActivity(req, res, next);
//       }
//     );

//     // Add a new activity record
//     this.router.post(
//       "/add",
//       // userVerifyJWT, // Uncomment if authentication is needed
//       (req: Request, res: Response, next: NextFunction) => {
//         ActivityController.addActivity(req, res, next);
//       }
//     );

//     // Get activities for a user within a time range
//     this.router.get(
//       "/user/:userId/range",
//       // userVerifyJWT, // Uncomment if authentication is needed
//       (req: Request, res: Response, next: NextFunction) => {
//         ActivityController.getUserActivitiesInRange(req, res, next);
//       }
//     );

//     // Get activities for all users within a time range
//     this.router.get(
//       "/range",
//       // userVerifyJWT, // Uncomment if authentication is needed
//       (req: Request, res: Response, next: NextFunction) => {
//         ActivityController.getAllActivitiesInRange(req, res, next);
//       }
//     );

//     // Get recent activities
//     this.router.get(
//       "/recent/:hours",
//       // userVerifyJWT, // Uncomment if authentication is needed
//       (req: Request, res: Response, next: NextFunction) => {
//         ActivityController.getRecentActivities(req, res, next);
//       }
//     );
//   }
// }

// export default new ActivityRoute("/activities");
