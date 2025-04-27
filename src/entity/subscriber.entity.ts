// import { Model } from "mongoose";
// import BaseEntity from "./base.entity";
// import SubscriberModel from "@models/subscriber.model";
// import { toObjectId } from "@utils";

// class SubscriberEntity extends BaseEntity {
//   constructor(model: Model<any>) {
//     super(model);
//   }

//   // Basic CRUD operations

//   // Create a new subscriber
//   public async createSubscriber(data: any) {
//     return this.create(data);
//   }

//   // Find subscriber by ID
//   public async findSubscriberById(subscriberId: string) {
//     return this.findOne({ _id: toObjectId(subscriberId) });
//   }

//   // Find subscriber by user ID
//   public async findSubscriberByUserId(userId: string) {
//     return this.findOne({ userId: toObjectId(userId) });
//   }

//   // Get all subscribers
//   public async getAllSubscribers(options: any = {}) {
//     return this.find(options);
//   }

//   // Update subscriber by ID
//   public async updateSubscriberById(subscriberId: string, updates: any) {
//     return this.updateOne({ _id: toObjectId(subscriberId) }, { ...updates, updatedAt: new Date() });
//   }

//   // Update subscriber by user ID
//   public async updateSubscriber(userId: string, updates: any) {
//     return this.updateOne({ userId: toObjectId(userId) }, { ...updates, updatedAt: new Date() });
//   }

//   // Delete subscriber by ID
//   public async deleteSubscriberById(subscriberId: string) {
//     return this.deleteOne({ _id: toObjectId(subscriberId) });
//   }

//   // Delete subscriber by user ID
//   public async deleteSubscriber(userId: string) {
//     return this.deleteOne({ userId: toObjectId(userId) });
//   }

//   // Advanced query operations

//   // Find active subscribers
//   public async findActiveSubscribers() {
//     return this.find({ isActive: true });
//   }

//   // Find subscribers by subscription type
//   public async findSubscribersByType(subscriptionType: string) {
//     return this.find({ subscriptionType });
//   }

//   // Find subscribers by zone
//   public async findSubscribersByZone(zone: string) {
//     return this.find({ zone });
//   }

//   // Find subscribers by delivery personnel
//   public async findSubscribersByDeliveryPersonnel(personnelId: string) {
//     return this.find({ assignedTo: toObjectId(personnelId) });
//   }

//   // Find subscribers by delivery day
//   public async findSubscribersByDeliveryDay(day: string) {
//     return this.find({ deliveryDays: day });
//   }

//   // Find subscribers without assigned delivery personnel
//   public async findSubscribersWithoutPersonnel() {
//     return this.find({ assignedTo: { $exists: false } });
//   }

//   // Find subscribers with pending containers
//   public async findSubscribersWithPendingContainers() {
//     return this.find({ pendingContainers: { $gt: 0 } });
//   }

//   // Subscription management

//   // Assign delivery personnel to subscriber
//   public async assignDeliveryPersonnel(subscriberId: string, personnelId: string) {
//     return this.updateOne(
//       { _id: toObjectId(subscriberId) },
//       { assignedTo: toObjectId(personnelId), updatedAt: new Date() }
//     );
//   }

//   // Remove delivery personnel assignment
//   public async removeDeliveryPersonnel(subscriberId: string) {
//     return this.updateOne(
//       { _id: toObjectId(subscriberId) },
//       { $unset: { assignedTo: "" }, updatedAt: new Date() }
//     );
//   }

//   // Update container count
//   public async updateContainerCount(subscriberId: string, containerCount: number, pendingContainers: number) {
//     return this.updateOne(
//       { _id: toObjectId(subscriberId) },
//       { containerCount, pendingContainers, updatedAt: new Date() }
//     );
//   }

//   // Increment container count
//   public async incrementContainerCount(subscriberId: string, increment: number = 1) {
//     return this.model.findByIdAndUpdate(
//       toObjectId(subscriberId),
//       {
//         $inc: { containerCount: increment, pendingContainers: increment },
//         updatedAt: new Date()
//       },
//       { new: true }
//     );
//   }

//   // Decrement pending containers
//   public async decrementPendingContainers(subscriberId: string, decrement: number = 1) {
//     return this.model.findByIdAndUpdate(
//       toObjectId(subscriberId),
//       {
//         $inc: { pendingContainers: -Math.abs(decrement) },
//         updatedAt: new Date()
//       },
//       { new: true }
//     );
//   }

//   // Toggle active status
//   public async toggleActiveStatus(subscriberId: string, isActive: boolean) {
//     return this.updateOne(
//       { _id: toObjectId(subscriberId) },
//       { isActive, updatedAt: new Date() }
//     );
//   }

//   // Toggle swap enabled
//   public async toggleSwapEnabled(subscriberId: string, swapEnabled: boolean) {
//     return this.updateOne(
//       { _id: toObjectId(subscriberId) },
//       { swapEnabled, updatedAt: new Date() }
//     );
//   }

//   // Update delivery days
//   public async updateDeliveryDays(subscriberId: string, deliveryDays: string[]) {
//     // Validate delivery days
//     const validDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//     const filteredDays = deliveryDays.filter(day => validDays.includes(day));

//     return this.updateOne(
//       { _id: toObjectId(subscriberId) },
//       { deliveryDays: filteredDays, updatedAt: new Date() }
//     );
//   }

//   // Update subscription type
//   public async updateSubscriptionType(subscriberId: string, subscriptionType: string) {
//     if (!["daily", "weekly"].includes(subscriptionType)) {
//       throw new Error("Invalid subscription type");
//     }

//     return this.updateOne(
//       { _id: toObjectId(subscriberId) },
//       { subscriptionType, updatedAt: new Date() }
//     );
//   }

//   // Search and analytics

//   // Search subscribers by various criteria
//   public async searchSubscribers(term: string) {
//     const regex = new RegExp(term, 'i');

//     return this.find({
//       $or: [
//         { address: { $regex: regex } },
//         { zone: { $regex: regex } },
//         { notes: { $regex: regex } }
//       ]
//     });
//   }

//   // Count subscribers by zone
//   public async countSubscribersByZone() {
//     return this.model.aggregate([
//       { $match: { isActive: true } },
//       { $group: { _id: "$zone", count: { $sum: 1 } } },
//       { $project: { zone: "$_id", count: 1, _id: 0 } },
//       { $sort: { zone: 1 } }
//     ]);
//   }

//   // Count subscribers by subscription type
//   public async countSubscribersByType() {
//     return this.model.aggregate([
//       { $match: { isActive: true } },
//       { $group: { _id: "$subscriptionType", count: { $sum: 1 } } },
//       { $project: { type: "$_id", count: 1, _id: 0 } }
//     ]);
//   }

//   // Get subscriber container statistics
//   public async getContainerStatistics() {
//     return this.model.aggregate([
//       { $match: { isActive: true } },
//       { $group: {
//           _id: null,
//           totalContainers: { $sum: "$containerCount" },
//           totalPendingContainers: { $sum: "$pendingContainers" },
//           subscriberCount: { $sum: 1 }
//         }
//       },
//       { $project: {
//           _id: 0,
//           totalContainers: 1,
//           totalPendingContainers: 1,
//           subscriberCount: 1,
//           avgContainersPerSubscriber: {
//             $cond: [
//               { $eq: ["$subscriberCount", 0] },
//               0,
//               { $divide: ["$totalContainers", "$subscriberCount"] }
//             ]
//           },
//           pendingContainerPercentage: {
//             $cond: [
//               { $eq: ["$totalContainers", 0] },
//               0,
//               { $multiply: [{ $divide: ["$totalPendingContainers", "$totalContainers"] }, 100] }
//             ]
//           }
//         }
//       }
//     ]);
//   }

//   // Get subscribers with highest pending containers
//   public async getTopSubscribersByPendingContainers(limit: number = 10) {
//     return this.model.find({ pendingContainers: { $gt: 0 } })
//       .sort({ pendingContainers: -1 })
//       .limit(limit)
//       .lean();
//   }
// }

// export const SubscriberEntities = new SubscriberEntity(SubscriberModel);

import { Model } from 'mongoose';
import SubscriberModel from '@models/subscriber.model';
import { toObjectId } from '@utils';
import BaseEntity from './base.entity';
  // import { SubscriberController } from '@controllers';

class SubscriberEntity extends BaseEntity {
  constructor(model: Model<any>) {
    super(model);
  }

  // *** Basic CRUD operations ***

  public async createSubscriber(data: any) {
    // Set default timestamps if not provided
    if (!data.joinDate) data.joinDate = new Date();
    if (!data.createdAt) data.createdAt = new Date();
    if (!data.updatedAt) data.updatedAt = new Date();

    return this.create(data);
  }

  public async findSubscriberById(subscriberId: string) {
    return this.findOne({ _id: toObjectId(subscriberId) });
  }

  public async findSubscriberByUserId(userId: string) {
    return this.findOne({ userId: toObjectId(userId) });
  }

  public async getAllSubscribers(options: any = {}) {
    return this.find(options);
  }

  public async updateSubscriberById(subscriberId: string, updates: any) {
    return this.updateOne({ _id: toObjectId(subscriberId) }, { ...updates, updatedAt: new Date() });
  }

  public async updateSubscriber(userId: string, updates: any) {
    return this.updateOne({ userId: toObjectId(userId) }, { ...updates, updatedAt: new Date() });
  }

  public async getSubscriberWithDetails(subscriberId: string) {
    return this.findOne({ _id: toObjectId(subscriberId) }, {}, {}, true, {
      path: 'activeSubscriptions assignedTo primaryAdmin relatedAdmins',
      select: 'name email phone status',
    });
  }

  public async deleteSubscriberById(subscriberId: string) {
    return this.deleteOne({ _id: toObjectId(subscriberId) });
  }

  public async deleteSubscriber(userId: string) {
    return this.deleteOne({ userId: toObjectId(userId) });
  }

  // *** Address management ***

  public async updateAddress(subscriberId: string, address: string, fullAddress: any) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        address,
        fullAddress,
        updatedAt: new Date(),
      },
    );
  }

  public async updateCoordinates(subscriberId: string, lat: number, lng: number) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        'fullAddress.coordinates.lat': lat,
        'fullAddress.coordinates.lng': lng,
        updatedAt: new Date(),
      },
    );
  }

  public async getNearbySubscribers(lat: number, lng: number, radiusInKm: number = 5) {
    // Convert km to radians (Earth's radius is approximately 6371 km)
    // MongoDB uses radians for geospatial queries
    const radiusInRadians = radiusInKm / 6371;
    console.log('radiusInRadians', radiusInRadians);

    return this.model
      .find({
        'fullAddress.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat], // MongoDB uses [longitude, latitude] order
            },
            $maxDistance: radiusInKm * 1000, // Convert to meters
          },
        },
        isActive: true,
      })
      .lean();
  }

  public async getSubscribersByRadius(centerLat: number, centerLng: number, radiusInKm: number) {
    return this.model.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [centerLng, centerLat] },
          distanceField: 'distance',
          maxDistance: radiusInKm * 1000, // Convert to meters
          spherical: true,
        },
      },
      { $match: { isActive: true } },
      { $sort: { distance: 1 } },
    ]);
  }

  // *** Delivery preferences management ***

  public async updatePreferredTimeSlot(subscriberId: string, timeSlot: string) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        preferredTimeSlot: timeSlot,
        updatedAt: new Date(),
      },
    );
  }

  public async updateAlternateRecipient(subscriberId: string, name: string, phone: string) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        alternateRecipient: { name, phone },
        updatedAt: new Date(),
      },
    );
  }

  public async updateDeliveryInstructions(subscriberId: string, instructions: string) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        deliveryInstructions: instructions,
        updatedAt: new Date(),
      },
    );
  }

  // *** Container and deposit management ***

  public async updateContainerCount(
    subscriberId: string,
    containerCount: number,
    pendingContainers: number,
  ) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      { containerCount, pendingContainers, updatedAt: new Date() },
    );
  }

  public async incrementContainerCount(subscriberId: string, increment: number = 1) {
    return this.model.findByIdAndUpdate(
      toObjectId(subscriberId),
      {
        $inc: { containerCount: increment, pendingContainers: increment },
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  public async decrementPendingContainers(subscriberId: string, decrement: number = 1) {
    return this.model.findByIdAndUpdate(
      toObjectId(subscriberId),
      {
        $inc: { pendingContainers: -Math.abs(decrement) },
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  public async updateDepositBalance(subscriberId: string, depositAmount: number) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        depositBalance: depositAmount,
        updatedAt: new Date(),
      },
    );
  }

  public async addToDepositBalance(subscriberId: string, amount: number) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        $inc: { depositBalance: amount },
        updatedAt: new Date(),
      },
    );
  }

  public async subtractFromDepositBalance(subscriberId: string, amount: number) {
    // First check current balance to avoid negative values
    const subscriber: any = await this.findOne(
      { _id: toObjectId(subscriberId) },
      { depositBalance: 1 },
    );

    if (!subscriber) return null;

    const currentBalance = subscriber.depositBalance || 0;
    if (currentBalance < amount) {
      return { success: false, message: 'Insufficient deposit balance' };
    }

    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        $inc: { depositBalance: -amount },
        updatedAt: new Date(),
      },
    );
  }

  // *** Subscription references management ***

  public async addActiveSubscription(subscriberId: string, subscriptionId: string) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        $addToSet: { activeSubscriptions: toObjectId(subscriptionId) },
        updatedAt: new Date(),
      },
    );
  }

  public async removeActiveSubscription(subscriberId: string, subscriptionId: string) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        $pull: { activeSubscriptions: toObjectId(subscriptionId) },
        updatedAt: new Date(),
      },
    );
  }

  public async getActiveSubscriptions(subscriberId: string) {
    const subscriber = await this.model
      .findById(toObjectId(subscriberId), { activeSubscriptions: 1 })
      .populate('activeSubscriptions');

    return subscriber?.activeSubscriptions || [];
  }

  // *** Service provider relationship management ***

  public async assignDeliveryPersonnel(subscriberId: string, personnelId: string) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        assignedTo: toObjectId(personnelId),
        updatedAt: new Date(),
      },
    );
  }

  public async removeDeliveryPersonnel(subscriberId: string) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        $unset: { assignedTo: '' },
        updatedAt: new Date(),
      },
    );
  }

  public async setPrimaryAdmin(subscriberId: string, adminId: string) {
    // Add to related admins if not already there
    await this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        $addToSet: { relatedAdmins: toObjectId(adminId) },
      },
    );

    // Set as primary admin
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        primaryAdmin: toObjectId(adminId),
        updatedAt: new Date(),
      },
    );
  }

  public async addRelatedAdmin(subscriberId: string, adminId: string) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        $addToSet: { relatedAdmins: toObjectId(adminId) },
        updatedAt: new Date(),
      },
    );
  }

  public async removeRelatedAdmin(subscriberId: string, adminId: string) {
    // Don't remove if it's the primary admin
    const subscriber: any = await this.findOne(
      { _id: toObjectId(subscriberId) },
      { primaryAdmin: 1 },
    );

    if (subscriber?.primaryAdmin?.toString() === adminId) {
      return { success: false, message: 'Cannot remove primary admin' };
    }

    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        $pull: { relatedAdmins: toObjectId(adminId) },
        updatedAt: new Date(),
      },
    );
  }

  public async getSubscribersByAdmin(adminId: string) {
    return this.find({
      $or: [{ primaryAdmin: toObjectId(adminId) }, { relatedAdmins: toObjectId(adminId) }],
    });
  }

  public async getPrimarySubscribers(adminId: string) {
    return this.find({ primaryAdmin: toObjectId(adminId) });
  }

  // *** Notification preferences management ***

  public async updateReminderEnabled(subscriberId: string, enabled: boolean) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        reminderEnabled: enabled,
        updatedAt: new Date(),
      },
    );
  }

  public async updateNotificationPreferences(
    subscriberId: string,
    preferences: {
      deliveryReminders?: boolean;
      returnReminders?: boolean;
      promotions?: boolean;
    },
  ) {
    const updateObj: any = { updatedAt: new Date() };

    if (preferences.deliveryReminders !== undefined) {
      updateObj['notificationPreferences.deliveryReminders'] = preferences.deliveryReminders;
    }

    if (preferences.returnReminders !== undefined) {
      updateObj['notificationPreferences.returnReminders'] = preferences.returnReminders;
    }

    if (preferences.promotions !== undefined) {
      updateObj['notificationPreferences.promotions'] = preferences.promotions;
    }

    return this.updateOne({ _id: toObjectId(subscriberId) }, updateObj);
  }

  public async getSubscribersForReminders(reminderType: string) {
    const field = `notificationPreferences.${reminderType}`;
    const query: any = { isActive: true, reminderEnabled: true };
    query[field] = true;

    return this.find(query);
  }

  // *** Status management ***

  public async toggleActiveStatus(subscriberId: string, isActive: boolean) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        isActive,
        updatedAt: new Date(),
      },
    );
  }

  public async toggleSwapEnabled(subscriberId: string, swapEnabled: boolean) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        swapEnabled,
        updatedAt: new Date(),
      },
    );
  }

  public async updateDeliveryDays(subscriberId: string, deliveryDays: string[]) {
    // Validate delivery days
    const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const filteredDays = deliveryDays.filter(day => validDays.includes(day));

    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        deliveryDays: filteredDays,
        updatedAt: new Date(),
      },
    );
  }

  public async updateSubscriptionType(subscriberId: string, subscriptionType: string) {
    if (!['daily', 'weekly'].includes(subscriptionType)) {
      throw new Error('Invalid subscription type');
    }

    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        subscriptionType,
        updatedAt: new Date(),
      },
    );
  }

  public async updateLastDeliveryDate(subscriberId: string, date: Date = new Date()) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        lastDeliveryDate: date,
        updatedAt: new Date(),
      },
    );
  }

  // *** Payment information management ***

  public async updatePaymentMethod(subscriberId: string, paymentMethod: string) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        paymentMethod,
        updatedAt: new Date(),
      },
    );
  }

  public async updateBillingAddress(subscriberId: string, billingAddress: string) {
    return this.updateOne(
      { _id: toObjectId(subscriberId) },
      {
        billingAddress,
        updatedAt: new Date(),
      },
    );
  }

  // *** Advanced query operations ***

  public async findActiveSubscribers() {
    return this.find({ isActive: true });
  }

  public async findSubscribersByType(subscriptionType: string) {
    return this.find({ subscriptionType, isActive: true });
  }

  public async findSubscribersByZone(zone: string) {
    return this.find({ zone, isActive: true });
  }

  public async findSubscribersByDeliveryPersonnel(personnelId: string) {
    return this.find({ assignedTo: toObjectId(personnelId), isActive: true });
  }

  public async findSubscribersByDeliveryDay(day: string) {
    return this.find({ deliveryDays: day, isActive: true });
  }

  public async findSubscribersByTimeSlot(timeSlot: string) {
    return this.find({ preferredTimeSlot: timeSlot, isActive: true });
  }

  public async findSubscribersWithoutPersonnel() {
    return this.find({
      assignedTo: { $exists: false },
      isActive: true,
    });
  }

  public async findSubscribersWithPendingContainers() {
    return this.find({
      pendingContainers: { $gt: 0 },
      isActive: true,
    });
  }

  public async findNewSubscribers(days: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.find({
      joinDate: { $gte: cutoffDate },
      isActive: true,
    });
  }

  // *** Search operations ***

  public async searchSubscribers(term: string, filters: any = {}) {
    const regex = new RegExp(term, 'i');

    const query: any = {
      $or: [
        { address: { $regex: regex } },
        { 'fullAddress.street': { $regex: regex } },
        { 'fullAddress.city': { $regex: regex } },
        { 'fullAddress.landmark': { $regex: regex } },
        { zone: { $regex: regex } },
        { notes: { $regex: regex } },
      ],
    };

    // Apply filters
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.subscriptionType) {
      query.subscriptionType = filters.subscriptionType;
    }

    if (filters.zone) {
      query.zone = filters.zone;
    }

    if (filters.hasPendingContainers) {
      query.pendingContainers = { $gt: 0 };
    }

    if (filters.adminId) {
      query.$or = [
        { primaryAdmin: toObjectId(filters.adminId) },
        { relatedAdmins: toObjectId(filters.adminId) },
      ];
    }

    return this.find(query);
  }

  // *** Analytics and statistics ***

  public async countSubscribersByZone() {
    return this.model.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$zone', count: { $sum: 1 } } },
      { $project: { zone: '$_id', count: 1, _id: 0 } },
      { $sort: { zone: 1 } },
    ]);
  }

  public async countSubscribersByType() {
    return this.model.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$subscriptionType', count: { $sum: 1 } } },
      { $project: { type: '$_id', count: 1, _id: 0 } },
    ]);
  }

  public async countSubscribersByDay() {
    return this.model.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$deliveryDays' },
      { $group: { _id: '$deliveryDays', count: { $sum: 1 } } },
      { $project: { day: '$_id', count: 1, _id: 0 } },
      { $sort: { day: 1 } },
    ]);
  }

  public async countSubscribersByAdmin(adminId: string) {
    return this.model.aggregate([
      {
        $match: {
          $or: [{ primaryAdmin: toObjectId(adminId) }, { relatedAdmins: toObjectId(adminId) }],
          isActive: true,
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
      { $project: { count: 1, _id: 0 } },
    ]);
  }

  public async getContainerStatistics() {
    return this.model.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalContainers: { $sum: '$containerCount' },
          totalPendingContainers: { $sum: '$pendingContainers' },
          totalDeposits: { $sum: '$depositBalance' },
          subscriberCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalContainers: 1,
          totalPendingContainers: 1,
          totalDeposits: 1,
          subscriberCount: 1,
          avgContainersPerSubscriber: {
            $cond: [
              { $eq: ['$subscriberCount', 0] },
              0,
              { $divide: ['$totalContainers', '$subscriberCount'] },
            ],
          },
          pendingContainerPercentage: {
            $cond: [
              { $eq: ['$totalContainers', 0] },
              0,
              {
                $multiply: [{ $divide: ['$totalPendingContainers', '$totalContainers'] }, 100],
              },
            ],
          },
          avgDepositPerSubscriber: {
            $cond: [
              { $eq: ['$subscriberCount', 0] },
              0,
              { $divide: ['$totalDeposits', '$subscriberCount'] },
            ],
          },
        },
      },
    ]);
  }

  public async getContainerStatisticsByAdmin(adminId: string) {
    return this.model.aggregate([
      {
        $match: {
          $or: [{ primaryAdmin: toObjectId(adminId) }, { relatedAdmins: toObjectId(adminId) }],
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          totalContainers: { $sum: '$containerCount' },
          totalPendingContainers: { $sum: '$pendingContainers' },
          totalDeposits: { $sum: '$depositBalance' },
          subscriberCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalContainers: 1,
          totalPendingContainers: 1,
          totalDeposits: 1,
          subscriberCount: 1,
          returnRate: {
            $cond: [
              { $eq: ['$totalContainers', 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: [
                      {
                        $subtract: ['$totalContainers', '$totalPendingContainers'],
                      },
                      '$totalContainers',
                    ],
                  },
                  100,
                ],
              },
            ],
          },
        },
      },
    ]);
  }

  public async getTopSubscribersByPendingContainers(limit: number = 10) {
    return this.model
      .find({ pendingContainers: { $gt: 0 }, isActive: true })
      .sort({ pendingContainers: -1 })
      .limit(limit)
      .lean();
  }

  public async getSubscribersByJoinDate(period: string = 'monthly', limit: number = 12) {
    const groupBy: any = {};

    switch (period) {
      case 'daily':
        groupBy._id = {
          year: { $year: '$joinDate' },
          month: { $month: '$joinDate' },
          day: { $dayOfMonth: '$joinDate' },
        };
        break;
      case 'weekly':
        groupBy._id = {
          year: { $year: '$joinDate' },
          week: { $week: '$joinDate' },
        };
        break;
      case 'monthly':
      default:
        groupBy._id = {
          year: { $year: '$joinDate' },
          month: { $month: '$joinDate' },
        };
    }

    groupBy.count = { $sum: 1 };

    return this.model.aggregate([
      { $match: { joinDate: { $exists: true } } },
      { $group: groupBy },
      {
        $sort: {
          '_id.year': -1,
          '_id.month': -1,
          '_id.day': -1,
          '_id.week': -1,
        },
      },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          period: '$_id',
          count: 1,
        },
      },
    ]);
  }

  public async getSubscriberStats() {
    return this.model.aggregate([
      {
        $facet: {
          totalCount: [{ $count: 'count' }],
          activeCount: [{ $match: { isActive: true } }, { $count: 'count' }],
          pendingContainersCount: [
            { $match: { pendingContainers: { $gt: 0 } } },
            { $count: 'count' },
          ],
          byZone: [
            { $group: { _id: '$zone', count: { $sum: 1 } } },
            { $project: { zone: '$_id', count: 1, _id: 0 } },
            { $sort: { count: -1 } },
          ],
          byType: [
            { $group: { _id: '$subscriptionType', count: { $sum: 1 } } },
            { $project: { type: '$_id', count: 1, _id: 0 } },
          ],
        },
      },
    ]);
  }

  // *** Bulk operations ***

  public async bulkAddSubscribers(subscribers: any[]) {
    const now = new Date();

    // Add timestamps to each subscriber
    const subscribersWithTimestamps = subscribers.map(subscriber => ({
      ...subscriber,
      joinDate: subscriber.joinDate || now,
      createdAt: subscriber.createdAt || now,
      updatedAt: subscriber.updatedAt || now,
    }));

    return this.insertMany(subscribersWithTimestamps);
  }

  public async bulkUpdateZones(updates: { subscriberId: string; zone: string }[]) {
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: toObjectId(update.subscriberId) },
        update: {
          $set: {
            zone: update.zone,
            updatedAt: new Date(),
          },
        },
      },
    }));

    if (bulkOps.length > 0) {
      return this.model.bulkWrite(bulkOps);
    }

    return { modifiedCount: 0 };
  }

  // public async bulkAssignDeliveryPersonnel(subscriberIds: string[], personnelId: string) {
  //   const objectIds = subscriberIds.map(id => toObjectId(id));

  //   return this.updateMany(
  //     { _id: { $in: objectIds } },
  //     {
  //       assignedTo: toObjectId(personnelId),
  //       updatedAt: new Date(),
  //     },
  //   );
  // }

  public async findDeliveriesForToday(day: string) {
    // Get current day in "Mon", "Tue", etc. format
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = day || days[new Date().getDay()];

    return this.find({
      deliveryDays: currentDay,
      isActive: true,
    });
  }

  public async getUnassignedSubscribersByZone(zone: string) {
    return this.find({
      zone,
      isActive: true,
      assignedTo: { $exists: false },
    });
  }

  public async redistributeSubscribers(
    fromPersonnelId: string,
    toPersonnelId: string,
    percentage: number = 50,
  ) {
    if (percentage < 1 || percentage > 100) {
      throw new Error('Percentage must be between 1 and 100');
    }

    // Get subscribers assigned to source personnel
    const subscribers = await this.find({
      assignedTo: toObjectId(fromPersonnelId),
      isActive: true,
    });

    if (!subscribers.length) return { modifiedCount: 0 };

    // Calculate number of subscribers to move
    const count = Math.ceil(subscribers.length * (percentage / 100));
    const subscribersToMove = subscribers.slice(0, count);

    // Update assignments
    const subscriberIds = subscribersToMove.map((s: any) => s._id);
    return this.updateMany(
      { _id: { $in: subscriberIds } },
      {
        assignedTo: toObjectId(toPersonnelId),
        updatedAt: new Date(),
      },
    );
  }
  // getContainerStatisticsByAdmin
  // public async getContainerStatisticsByAdmin(adminId: string) {
  //   return this.model.aggregate([
  //     {
  //       $match: {
  //         $or: [
  //           { primaryAdmin: toObjectId(adminId) },
  //           { relatedAdmins: toObjectId(adminId) },
  //         ],
  //         isActive: true,
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: null,
  //         totalContainers: { $sum: "$containerCount" },
  //         totalPendingContainers: { $sum: "$pendingContainers" },
  //         totalDeposits: { $sum: "$depositBalance" },
  //         subscriberCount: { $sum: 1 },
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 0,
  //         totalContainers: 1,
  //         totalPendingContainers: 1,
  //         totalDeposits: 1,
  //         subscriberCount: 1,
  //         returnRate: {
  //           $cond: [
  //             { $eq: ["$totalContainers", 0] },
  //             0,
  //             {
  //               $multiply: [
  //                 {
  //                   $divide: [
  //                     {
  //                       $subtract: [
  //                         "$totalContainers",
  //                         "$totalPendingContainers",
  //                       ],
  //                     },
  //                     "$totalContainers",
  //                   ],
  //                 },
  //                 100,
  //               ],
  //             },
  //           ],
  //         },
  //       },
  //     },
  //   ]);
  // }

  // getSubscriberSubscriptionDetails
  public async getSubscriberSubscriptionDetails(subscriberId: string) {
    return this.model.findById(subscriberId).populate({
      path: 'activeSubscriptions',
      populate: {
        path: 'items',
        model: 'Item',
      },
    });
  }

  /**
   * Bulk assign delivery personnel to subscribers
   */
  public async bulkAssignDeliveryPersonnel(subscriberIds: string[], personnelId: string) {
    if (!subscriberIds || subscriberIds.length === 0) {
      return { success: false, message: 'No subscribers selected', updated: 0 };
    }

    const result = await this.updateMany(
      { _id: { $in: subscriberIds.map(id => toObjectId(id)) } },
      {
        assignedTo: toObjectId(personnelId),
        updatedAt: new Date(),
      },
    );

    return {
      success: true,
      message: `Assigned ${result.modifiedCount} subscribers to delivery personnel`,
      updated: result.modifiedCount,
    };
  }

  /**
   * Get subscribers with filtering and search capabilities
   */
  public async getSubscribersWithFilters(filters: {
    search?: string;
    zone?: string;
    isActive?: boolean;
    assignedTo?: string;
    adminId?: string;
    subscriptionType?: string;
    hasDeliveryToday?: boolean;
  }) {
    const query: any = {};

    // Basic filters
    if (filters.zone) query.zone = filters.zone;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    if (filters.subscriptionType) query.subscriptionType = filters.subscriptionType;

    // Admin filter
    if (filters.adminId) {
      query.$or = [
        { primaryAdmin: toObjectId(filters.adminId) },
        { relatedAdmins: toObjectId(filters.adminId) },
      ];
    }

    // Personnel filter
    if (filters.assignedTo === 'unassigned') {
      query.assignedTo = { $exists: false };
    } else if (filters.assignedTo) {
      query.assignedTo = toObjectId(filters.assignedTo);
    }

    // Search filter
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      if (!query.$or) query.$or = [];

      query.$or = [
        ...query.$or,
        { name: { $regex: searchRegex } },
        { mobile: { $regex: searchRegex } },
        { address: { $regex: searchRegex } },
        { 'fullAddress.street': { $regex: searchRegex } },
        { 'fullAddress.city': { $regex: searchRegex } },
      ];
    }

    // Fetch subscribers with those filters
    const subscribers = await this.find(query);

    // If we need to filter by existing deliveries today
    if (filters.hasDeliveryToday !== undefined) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const deliveries = await this.model.db
        .collection('deliveries')
        .find({
          date: { $gte: startOfDay, $lte: endOfDay },
        })
        .toArray();

      const subscribersWithDeliveries = new Set(
        deliveries.map((d: any) => d.subscriberId.toString()),
      );

      if (filters.hasDeliveryToday) {
        // Return only subscribers who have deliveries today
        return subscribers.filter((sub: any) => subscribersWithDeliveries.has(sub._id.toString()));
      } else {
        // Return only subscribers who don't have deliveries today
        return subscribers.filter((sub: any) => !subscribersWithDeliveries.has(sub._id.toString()));
      }
    }

    return subscribers;
  }
}

export const SubscriberEntities = new SubscriberEntity(SubscriberModel);
