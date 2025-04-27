// import { Model } from "mongoose";
// import BaseEntity from "./base.entity";
// import ReviewModel from "@models/review.model"; // Import your Review model
// import { toObjectId } from "@utils";

// class ReviewEntity extends BaseEntity {
//   constructor(model: Model<any>) {
//     super(model);
//   }

//   // Create a new review
//   public async createReview(data: any) {
//     return this.create(data);
//   }

//   // Find review by ID
//   public async findReviewById(reviewId: string) {
//     return this.findOne({ _id: toObjectId(reviewId) });
//   }

//   // Find reviews by service ID
//   public async findReviewsByServiceId(serviceId: string) {
//     return this.find({ serviceId: toObjectId(serviceId) });
//   }

//   // Find reviews by reviewer ID
//   public async findReviewsByReviewerId(reviewerId: string) {
//     return this.find({ reviewerId: toObjectId(reviewerId) });
//   }

//   // Update a review by ID
//   public async updateReview(reviewId: string, updates: any) {
//     return this.updateOne({ _id: toObjectId(reviewId) }, updates);
//   }

//   // Delete a review by ID
//   public async deleteReview(reviewId: string) {
//     return this.deleteOne({ _id: toObjectId(reviewId) });
//   }

//   // Find reviews with a specific rating for a service
//   public async findReviewsByRating(serviceId: string, rating: number) {
//     return this.find({
//       serviceId: toObjectId(serviceId),
//       rating,
//     });
//   }

//   // Find all reviews for a service sorted by rating
//   public async findReviewsByServiceIdSortedByRating(
//     serviceId: string,
//     sortOrder: "asc" | "desc" = "desc"
//   ) {
//     const result: any = await this.find({ serviceId: toObjectId(serviceId) });
//     return result.sort({ rating: sortOrder });
//   }

//   // Find average rating for a service
//   public async findAverageRatingForService(serviceId: string) {
//     const result: any = await this.basicAggregate([
//       { $match: { serviceId: toObjectId(serviceId) } },
//       { $group: { _id: "$serviceId", averageRating: { $avg: "$rating" } } },
//     ]);
//     return result.length > 0 ? result[0].averageRating : null;
//   }
// }

// export const ReviewEntities = new ReviewEntity(ReviewModel);
