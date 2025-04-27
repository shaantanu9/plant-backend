// import { Request, Response, NextFunction } from "express";
// import BaseController from "./base.controller";
// import { ReviewEntities } from "@entity";
// import { RESPONSE } from "@response"; // Adjust the import path if necessary

// class ReviewControllerClass extends BaseController {
//   constructor() {
//     super();
//   }

//   // Create a new review
//   public async createReview(req: Request, res: Response, next: NextFunction) {
//     try {
//       const data = req.body;
//       const review = await ReviewEntities.createReview(data);
//       return this.sendResponse(res, review, RESPONSE.REVIEW("Review created"));
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Find review by ID
//   public async findReviewById(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { reviewId } = req.params;
//       const review = await ReviewEntities.findReviewById(reviewId);
//       if (!review) {
//         return this.notFound(res, RESPONSE.REVIEW("").REVIEW_NOT_FOUND.message);
//       }
//       return this.sendResponse(res, review, RESPONSE.REVIEW("Review found"));
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Find reviews by service ID
//   public async findReviewsByServiceId(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { serviceId } = req.params;
//       const reviews = await ReviewEntities.findReviewsByServiceId(serviceId);
//       return this.sendResponse(res, reviews, RESPONSE.REVIEW("").REVIEWS_FOUND);
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Find reviews by reviewer ID
//   public async findReviewsByReviewerId(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { reviewerId } = req.params;
//       const reviews = await ReviewEntities.findReviewsByReviewerId(reviewerId);
//       return this.sendResponse(res, reviews, RESPONSE.REVIEW("Reviews found").REVIEWS_FOUND);
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Update a review by ID
//   public async updateReview(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { reviewId } = req.params;
//       const updates = req.body;
//       const result = await ReviewEntities.updateReview(reviewId, updates);
//       if (!result.matchedCount) {
//         return this.notFound(res, RESPONSE.REVIEW("").REVIEW_NOT_FOUND.message);
//       }
//       return this.sendResponse(res, result, RESPONSE.REVIEW("Review updated"));
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Delete a review by ID
//   public async deleteReview(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { reviewId } = req.params;
//       const result: any = await ReviewEntities.deleteReview(reviewId);
//       if (!result.deletedCount) {
//         return this.notFound(res, RESPONSE.REVIEW("").REVIEW_NOT_FOUND.message);
//       }
//       return this.sendResponse(res, null, RESPONSE.REVIEW("Review deleted"));
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Find reviews with a specific rating for a service
//   public async findReviewsByRating(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { serviceId } = req.params;
//       const { rating } = req.query; // Expecting rating as a query parameter
//       const reviews = await ReviewEntities.findReviewsByRating(
//         serviceId,
//         Number(rating)
//       );
//       return this.sendResponse(
//         res,
//         reviews,
//         RESPONSE.REVIEW("Reviews with specific rating found")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Find all reviews for a service sorted by rating
//   public async findReviewsByServiceIdSortedByRating(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { serviceId } = req.params;
//       const { sortOrder } = req.query; // Expecting sortOrder as a query parameter ('asc' or 'desc')
//       const reviews = await ReviewEntities.findReviewsByServiceIdSortedByRating(
//         serviceId,
//         sortOrder as "asc" | "desc"
//       );
//       return this.sendResponse(
//         res,
//         reviews,
//         RESPONSE.REVIEW("Reviews sorted by rating found")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Find average rating for a service
//   public async findAverageRatingForService(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { serviceId } = req.params;
//       const averageRating = await ReviewEntities.findAverageRatingForService(
//         serviceId
//       );
//       if (averageRating === null) {
//         return this.notFound(
//           res,
//           RESPONSE.REVIEW("").AVERAGE_RATING_FOUND.message
//         );
//       }
//       return this.sendResponse(
//         res,
//         { averageRating },
//         RESPONSE.REVIEW("Average rating found")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }
// }

// export const ReviewController = new ReviewControllerClass();
