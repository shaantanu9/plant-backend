// import { Model } from "mongoose";
// import BaseEntity from "./base.entity";
// import PreferencesModel from "@models/preference.model"; // Import your Preferences model
// import { toObjectId } from "@utils";

// class PreferencesEntity extends BaseEntity {
//   constructor(model: Model<any>) {
//     super(model);
//   }

//   // Create new preferences for a user
//   public async createPreferences(data: any) {
//     return this.create(data);
//   }

//   // Find preferences by user ID
//   public async findPreferencesByUserId(userId: string) {
//     return this.findOne({ userId: toObjectId(userId) });
//   }

//   // Update preferences for a user
//   public async updatePreferences(userId: string, updates: any) {
//     return this.updateOne({ userId: toObjectId(userId) }, updates);
//   }

//   // Delete preferences for a user
//   public async deletePreferences(userId: string) {
//     return this.deleteOne({ userId: toObjectId(userId) });
//   }

//   // Find users with matching preferences
//   public async findUsersWithMatchingPreferences(preferenceType: string, filters: any) {
//     const query: any = { preferenceType };
//     if (preferenceType === "matchmaking") {
//       query["filters.partnerPreferences"] = filters.partnerPreferences;
//     } else if (preferenceType === "job") {
//       query["filters.salaryRange"] = filters.salaryRange;
//     } else if (preferenceType === "service") {
//       query["filters.serviceCategory"] = filters.serviceCategory;
//     }
//     return this.find(query);
//   }

//   // Find users by location
//   public async findUsersByLocation(location: string) {
//     return this.find({ "filters.location": location });
//   }

//   // Find users by salary range
//   public async findUsersBySalaryRange(salaryRange: [number, number]) {
//     return this.find({ "filters.salaryRange": { $elemMatch: { $gte: salaryRange[0], $lte: salaryRange[1] } } });
//   }

//   // Find users by service category
//   public async findUsersByServiceCategory(serviceCategory: string) {
//     return this.find({ "filters.serviceCategory": serviceCategory });
//   }

//   // Find users with specific partner preferences
//   public async findUsersByPartnerPreferences(partnerPreferences: any) {
//     return this.find({ "filters.partnerPreferences": partnerPreferences });
//   }
// }

// export const PreferencesEntities = new PreferencesEntity(PreferencesModel);
