// import { Model } from "mongoose";
// import BaseEntity from "./base.entity";
// import DeliveryPersonnelModel from "@models/deliveryPersonnel.model";
// import { toObjectId } from "@utils";

// class DeliveryPersonnel extends BaseEntity {
//   constructor(model: Model<any>) {
//     super(model);
//   }

//   // Existing functions
//   public async addDeliveryPersonnel(data: any) {
//     return this.create(data);
//   }

//   public async getDeliveryPersonnelById(personnelId: string) {
//     return this.findOne({ _id: toObjectId(personnelId) });
//   }

//   public async getDeliveryPersonnelsBySubscriberId(subscriberId: string) {
//     return this.find({ subscriberId: toObjectId(subscriberId) });
//   }

//   public async modifyDeliveryPersonnelStatusById(
//     personnelId: string,
//     status: string
//   ) {
//     return this.updateOne({ _id: toObjectId(personnelId) }, { status });
//   }

//   public async removeDeliveryPersonnelById(personnelId: string) {
//     return this.deleteOne({ _id: toObjectId(personnelId) });
//   }

//   // New functions

//   // Get delivery personnel by userId
//   public async getDeliveryPersonnelByUserId(userId: string) {
//     return this.findOne({ userId: toObjectId(userId) });
//   }

//   // Get delivery personnel by zone
//   public async getDeliveryPersonnelByZone(zone: string) {
//     return this.find({ zone });
//   }

//   // Get active delivery personnel
//   public async getActiveDeliveryPersonnel() {
//     return this.find({ isActive: true });
//   }

//   // Get active delivery personnel by zone
//   public async getActiveDeliveryPersonnelByZone(zone: string) {
//     return this.find({ zone, isActive: true });
//   }

//   // Update delivery personnel zone
//   public async updateDeliveryPersonnelZone(personnelId: string, zone: string) {
//     return this.updateOne(
//       { _id: toObjectId(personnelId) },
//       { zone, updatedAt: new Date() }
//     );
//   }

//   // Toggle delivery personnel active status
//   public async toggleActiveStatus(personnelId: string, isActive: boolean) {
//     return this.updateOne(
//       { _id: toObjectId(personnelId) },
//       { isActive, updatedAt: new Date() }
//     );
//   }

//   // Assign subscriber to delivery personnel
//   public async assignSubscriber(personnelId: string, subscriberId: string) {
//     return this.model.findByIdAndUpdate(
//       toObjectId(personnelId),
//       {
//         $addToSet: { assignedSubscribers: toObjectId(subscriberId) },
//         updatedAt: new Date()
//       },
//       { new: true }
//     );
//   }

//   // Assign multiple subscribers to delivery personnel
//   public async assignSubscribers(personnelId: string, subscriberIds: string[]) {
//     const subscriberObjectIds = subscriberIds.map(id => toObjectId(id));

//     return this.model.findByIdAndUpdate(
//       toObjectId(personnelId),
//       {
//         $addToSet: { assignedSubscribers: { $each: subscriberObjectIds } },
//         updatedAt: new Date()
//       },
//       { new: true }
//     );
//   }

//   // Remove subscriber assignment from delivery personnel
//   public async removeSubscriber(personnelId: string, subscriberId: string) {
//     return this.model.findByIdAndUpdate(
//       toObjectId(personnelId),
//       {
//         $pull: { assignedSubscribers: toObjectId(subscriberId) },
//         updatedAt: new Date()
//       },
//       { new: true }
//     );
//   }

//   // Get assigned subscribers for a delivery personnel with populated data
//   public async getAssignedSubscribers(personnelId: string) {
//     return this.model.findById(toObjectId(personnelId))
//       .populate('assignedSubscribers')
//       .then(personnel => personnel?.assignedSubscribers || []);
//   }

//   // Count personnel by zone
//   public async countPersonnelByZone(zone: string) {
//     return this.model.countDocuments({ zone });
//   }

//   // Get personnel with the least number of assigned subscribers in a zone
//   public async getPersonnelWithLeastSubscribersInZone(zone: string) {
//     return this.model.aggregate([
//       { $match: { zone, isActive: true } },
//       { $project: {
//           userId: 1,
//           zone: 1,
//           isActive: 1,
//           assignedSubscriberCount: { $size: '$assignedSubscribers' }
//         }
//       },
//       { $sort: { assignedSubscriberCount: 1 } },
//       { $limit: 1 }
//     ]);
//   }

//   // Get workload statistics for all personnel
//   public async getPersonnelWorkloadStats() {
//     return this.model.aggregate([
//       { $match: { isActive: true } },
//       { $project: {
//           _id: 1,
//           userId: 1,
//           zone: 1,
//           assignedSubscriberCount: { $size: '$assignedSubscribers' }
//         }
//       },
//       { $sort: { zone: 1, assignedSubscriberCount: 1 } }
//     ]);
//   }

//   // Check if personnel is assigned to a specific subscriber
//   public async isPersonnelAssignedToSubscriber(personnelId: string, subscriberId: string) {
//     const personnel = await this.model.findOne({
//       _id: toObjectId(personnelId),
//       assignedSubscribers: toObjectId(subscriberId)
//     });

//     return !!personnel;
//   }

//   // Find personnel with capacity for more subscribers
//   public async findPersonnelWithCapacity(maxSubscribers: number = 20) {
//     return this.model.aggregate([
//       { $match: { isActive: true } },
//       { $project: {
//           _id: 1,
//           userId: 1,
//           zone: 1,
//           assignedSubscriberCount: { $size: '$assignedSubscribers' }
//         }
//       },
//       { $match: { assignedSubscriberCount: { $lt: maxSubscribers } } },
//       { $sort: { assignedSubscriberCount: 1 } }
//     ]);
//   }

//   // Redistribute subscribers among personnel in a zone
//   public async redistributeSubscribersInZone(zone: string, maxPerPersonnel: number = 20) {
//     // This would be a complex operation involving multiple steps
//     // 1. Get all personnel in the zone
//     // 2. Get all subscribers in the zone
//     // 3. Calculate optimal distribution
//     // 4. Update assignments

//     // For now, I'll provide a simpler implementation that just balances existing assignments
//     const personnel = await this.getActiveDeliveryPersonnelByZone(zone);

//     if (personnel.length === 0) {
//       return { success: false, message: "No active personnel in zone" };
//     }

//     // Get personnel with their current assignments
//     const workloadStats = await this.model.aggregate([
//       { $match: { zone, isActive: true } },
//       { $project: {
//           _id: 1,
//           assignedSubscriberCount: { $size: '$assignedSubscribers' },
//           assignedSubscribers: 1
//         }
//       },
//       { $sort: { assignedSubscriberCount: -1 } }
//     ]);

//     // Simple algorithm: move subscribers from most loaded to least loaded
//     if (workloadStats.length < 2) {
//       return { success: false, message: "Need at least 2 personnel for redistribution" };
//     }

//     // This is just a placeholder for the concept - a real implementation would
//     // require careful handling of the actual reassignment operations
//     return {
//       success: true,
//       message: "Redistribution plan generated",
//       plan: workloadStats
//     };
//   }

//   // Update multiple fields for delivery personnel
//   public async updateDeliveryPersonnel(personnelId: string, updateData: any) {
//     const allowedFields = ['zone', 'isActive'];
//     const filteredData: any = {};

//     Object.keys(updateData).forEach(key => {
//       if (allowedFields.includes(key)) {
//         filteredData[key] = updateData[key];
//       }
//     });

//     filteredData.updatedAt = new Date();

//     return this.updateOne(
//       { _id: toObjectId(personnelId) },
//       filteredData
//     );
//   }

//   // Transfer subscribers between personnel
//   public async transferSubscribers(fromPersonnelId: string, toPersonnelId: string, subscriberIds: string[]) {
//     const subscriberObjectIds = subscriberIds.map(id => toObjectId(id));

//     // Remove from source personnel
//     await this.model.findByIdAndUpdate(
//       toObjectId(fromPersonnelId),
//       {
//         $pull: { assignedSubscribers: { $in: subscriberObjectIds } },
//         updatedAt: new Date()
//       }
//     );

//     // Add to target personnel
//     return this.model.findByIdAndUpdate(
//       toObjectId(toPersonnelId),
//       {
//         $addToSet: { assignedSubscribers: { $each: subscriberObjectIds } },
//         updatedAt: new Date()
//       },
//       { new: true }
//     );
//   }
// }

// export const DeliveryPersonnelEntities = new DeliveryPersonnel(
//   DeliveryPersonnelModel
// );

import { Model } from 'mongoose';
import DeliveryPersonnelModel from '@models/deliveryPersonnel.model';
import { toObjectId } from '@utils';
import BaseEntity from './base.entity';

class DeliveryPersonnel extends BaseEntity {
  constructor(model: Model<any>) {
    super(model);
  }

  // *** Basic CRUD operations ***

  public async addDeliveryPersonnel(data: any) {
    return this.create(data);
  }

  public async getDeliveryPersonnelById(personnelId: string) {
    return this.findOne({ _id: toObjectId(personnelId) });
  }

  public async getDeliveryPersonnelByUserId(userId: string) {
    return this.findOne({ userId: toObjectId(userId) });
  }

  public async removeDeliveryPersonnelById(personnelId: string) {
    return this.deleteOne({ _id: toObjectId(personnelId) });
  }

  // *** Query operations ***

  public async getDeliveryPersonnelByZone(zone: string) {
    return this.find({ zone });
  }

  public async getActiveDeliveryPersonnel() {
    return this.find({ isActive: true });
  }

  public async getActiveDeliveryPersonnelByZone(zone: string) {
    return this.find({ zone, isActive: true });
  }

  public async getPersonnelByPrimaryZone(zone: string) {
    return this.find({ primaryZones: zone, isActive: true });
  }

  public async getPersonnelBySecondaryZone(zone: string) {
    return this.find({ secondaryZones: zone, isActive: true });
  }

  public async getPersonnelByVehicleType(vehicleType: string) {
    return this.find({ vehicleType, isActive: true });
  }

  public async getPersonnelWithinRadius(lat: number, lng: number, radiusKm: number) {
    // MongoDB geospatial query to find personnel within a certain radius
    return this.model.find({
      isActive: true,
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: radiusKm * 1000, // Convert km to meters
        },
      },
    });
  }

  public async getAvailablePersonnelByDay(day: string) {
    return this.find({
      availableDays: day,
      isActive: true,
    });
  }

  public async getPersonnelForTimeSlot(start: string, end: string) {
    return this.find({
      isActive: true,
      availableTimeSlots: {
        $elemMatch: {
          start: { $lte: start },
          end: { $gte: end },
        },
      },
    });
  }

  public async getDeliveryPersonnelsBySubscriberId(subscriberId: string) {
    return this.find({
      assignedSubscribers: toObjectId(subscriberId),
      isActive: true,
    });
  }

  // *** Admin relationship management ***

  public async assignAdmin(personnelId: string, adminId: string, isPrimary: boolean = false) {
    // If setting as primary, first remove any existing primary
    if (isPrimary) {
      await this.model.findByIdAndUpdate(
        toObjectId(personnelId),
        {
          $set: {
            'assignedAdmins.$[elem].isPrimary': false,
          },
        },
        {
          arrayFilters: [{ 'elem.isPrimary': true }],
          multi: true,
        },
      );
    }

    // Now add the new admin or update if exists
    return this.model.findByIdAndUpdate(
      toObjectId(personnelId),
      {
        $addToSet: {
          assignedAdmins: {
            adminId: toObjectId(adminId),
            isPrimary,
          },
        },
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  public async removeAdmin(personnelId: string, adminId: string) {
    return this.model.findByIdAndUpdate(
      toObjectId(personnelId),
      {
        $pull: {
          assignedAdmins: {
            adminId: toObjectId(adminId),
          },
        },
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  public async setAdminAsPrimary(personnelId: string, adminId: string) {
    // First remove primary flag from all admins
    await this.model.findByIdAndUpdate(toObjectId(personnelId), {
      $set: {
        'assignedAdmins.$[].isPrimary': false,
      },
    });

    // Then set the specified admin as primary
    return this.model.findByIdAndUpdate(
      toObjectId(personnelId),
      {
        $set: {
          'assignedAdmins.$[elem].isPrimary': true,
        },
        updatedAt: new Date(),
      },
      {
        arrayFilters: [{ 'elem.adminId': toObjectId(adminId) }],
        new: true,
      },
    );
  }

  public async getPersonnelByAdminId(adminId: string) {
    return this.find({
      'assignedAdmins.adminId': toObjectId(adminId),
      isActive: true,
    });
  }

  public async getPrimaryPersonnelForAdmin(adminId: string) {
    return this.find({
      assignedAdmins: {
        $elemMatch: {
          adminId: toObjectId(adminId),
          isPrimary: true,
        },
      },
      isActive: true,
    });
  }

  // *** Subscriber assignment management ***

  public async assignSubscriber(personnelId: string, subscriberId: string) {
    return this.model.findByIdAndUpdate(
      toObjectId(personnelId),
      {
        $addToSet: { assignedSubscribers: toObjectId(subscriberId) },
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  public async assignSubscribers(personnelId: string, subscriberIds: string[]) {
    const subscriberObjectIds = subscriberIds.map(id => toObjectId(id));

    return this.model.findByIdAndUpdate(
      toObjectId(personnelId),
      {
        $addToSet: { assignedSubscribers: { $each: subscriberObjectIds } },
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  public async removeSubscriber(personnelId: string, subscriberId: string) {
    return this.model.findByIdAndUpdate(
      toObjectId(personnelId),
      {
        $pull: { assignedSubscribers: toObjectId(subscriberId) },
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  public async getAssignedSubscribers(personnelId: string) {
    return this.model
      .findById(toObjectId(personnelId))
      .populate('assignedSubscribers')
      .then(personnel => personnel?.assignedSubscribers || []);
  }

  public async isPersonnelAssignedToSubscriber(personnelId: string, subscriberId: string) {
    const personnel = await this.model.findOne({
      _id: toObjectId(personnelId),
      assignedSubscribers: toObjectId(subscriberId),
    });

    return !!personnel;
  }

  public async transferSubscribers(
    fromPersonnelId: string,
    toPersonnelId: string,
    subscriberIds: string[],
  ) {
    const subscriberObjectIds = subscriberIds.map(id => toObjectId(id));

    // Remove from source personnel
    await this.model.findByIdAndUpdate(toObjectId(fromPersonnelId), {
      $pull: { assignedSubscribers: { $in: subscriberObjectIds } },
      updatedAt: new Date(),
    });

    // Add to target personnel
    return this.model.findByIdAndUpdate(
      toObjectId(toPersonnelId),
      {
        $addToSet: { assignedSubscribers: { $each: subscriberObjectIds } },
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  // *** Status and zone management ***

  public async toggleActiveStatus(personnelId: string, isActive: boolean) {
    const now = new Date();
    return this.updateOne(
      { _id: toObjectId(personnelId) },
      {
        isActive,
        lastActiveAt: now,
        updatedAt: now,
      },
    );
  }

  public async updateDeliveryPersonnelZone(personnelId: string, zone: string) {
    return this.updateOne({ _id: toObjectId(personnelId) }, { zone, updatedAt: new Date() });
  }

  public async updatePrimaryZones(personnelId: string, zones: string[]) {
    return this.updateOne(
      { _id: toObjectId(personnelId) },
      {
        primaryZones: zones,
        updatedAt: new Date(),
      },
    );
  }

  public async updateSecondaryZones(personnelId: string, zones: string[]) {
    return this.updateOne(
      { _id: toObjectId(personnelId) },
      {
        secondaryZones: zones,
        updatedAt: new Date(),
      },
    );
  }

  public async addPrimaryZone(personnelId: string, zone: string) {
    return this.model.findByIdAndUpdate(
      toObjectId(personnelId),
      {
        $addToSet: { primaryZones: zone },
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  public async addSecondaryZone(personnelId: string, zone: string) {
    return this.model.findByIdAndUpdate(
      toObjectId(personnelId),
      {
        $addToSet: { secondaryZones: zone },
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  public async removePrimaryZone(personnelId: string, zone: string) {
    return this.model.findByIdAndUpdate(
      toObjectId(personnelId),
      {
        $pull: { primaryZones: zone },
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  public async removeSecondaryZone(personnelId: string, zone: string) {
    return this.model.findByIdAndUpdate(
      toObjectId(personnelId),
      {
        $pull: { secondaryZones: zone },
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  // *** Vehicle information management ***

  public async updateVehicleInfo(personnelId: string, vehicleType: string, vehicleNumber?: string) {
    const updateData: any = {
      vehicleType,
      updatedAt: new Date(),
    };

    if (vehicleNumber) {
      updateData.vehicleNumber = vehicleNumber;
    }

    return this.updateOne({ _id: toObjectId(personnelId) }, updateData);
  }

  // *** Availability management ***

  public async updateAvailableDays(personnelId: string, days: string[]) {
    return this.updateOne(
      { _id: toObjectId(personnelId) },
      {
        availableDays: days,
        updatedAt: new Date(),
      },
    );
  }

  public async updateTimeSlots(personnelId: string, timeSlots: { start: string; end: string }[]) {
    return this.updateOne(
      { _id: toObjectId(personnelId) },
      {
        availableTimeSlots: timeSlots,
        updatedAt: new Date(),
      },
    );
  }

  public async addTimeSlot(personnelId: string, start: string, end: string) {
    return this.model.findByIdAndUpdate(
      toObjectId(personnelId),
      {
        $push: {
          availableTimeSlots: { start, end },
        },
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  public async removeTimeSlot(personnelId: string, start: string, end: string) {
    return this.model.findByIdAndUpdate(
      toObjectId(personnelId),
      {
        $pull: {
          availableTimeSlots: { start, end },
        },
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  // *** Capacity management ***

  public async updateMaxDeliveriesPerDay(personnelId: string, maxDeliveries: number) {
    return this.updateOne(
      { _id: toObjectId(personnelId) },
      {
        maxDeliveriesPerDay: maxDeliveries,
        updatedAt: new Date(),
      },
    );
  }

  public async updateMaxWeight(personnelId: string, maxWeightKg: number) {
    return this.updateOne(
      { _id: toObjectId(personnelId) },
      {
        maxWeight: maxWeightKg,
        updatedAt: new Date(),
      },
    );
  }

  // *** Location tracking ***

  public async updateCurrentLocation(personnelId: string, lat: number, lng: number) {
    const now = new Date();
    return this.updateOne(
      { _id: toObjectId(personnelId) },
      {
        currentLocation: {
          lat,
          lng,
          lastUpdated: now,
        },
        lastActiveAt: now,
        updatedAt: now,
      },
    );
  }

  public async getPersonnelCurrentLocation(personnelId: string) {
    const personnel: any = await this.findOne(
      { _id: toObjectId(personnelId) },
      { currentLocation: 1 },
    );
    return personnel?.currentLocation;
  }

  // *** Performance metrics tracking ***

  public async incrementDeliveryStats(
    personnelId: string,
    status: 'completed' | 'missed',
    containersDelivered: number = 0,
    containersCollected: number = 0,
  ) {
    const update: any = {
      $inc: {
        'deliveryStats.totalDeliveries': 1,
        'deliveryStats.containersDelivered': containersDelivered,
        'deliveryStats.containersCollected': containersCollected,
      },
      updatedAt: new Date(),
    };

    if (status === 'completed') {
      update.$inc['deliveryStats.completedDeliveries'] = 1;
    } else if (status === 'missed') {
      update.$inc['deliveryStats.missedDeliveries'] = 1;
    }

    return this.updateOne({ _id: toObjectId(personnelId) }, update);
  }

  public async updateDeliveryRating(personnelId: string, rating: number) {
    // First get the current stats to calculate new average
    const personnel: any = await this.findOne(
      { _id: toObjectId(personnelId) },
      { 'deliveryStats.avgRating': 1, 'deliveryStats.completedDeliveries': 1 },
    );

    if (!personnel || !personnel.deliveryStats) {
      return this.updateOne(
        { _id: toObjectId(personnelId) },
        {
          'deliveryStats.avgRating': rating,
          updatedAt: new Date(),
        },
      );
    }

    // Calculate the new average rating
    const currentAvg = personnel.deliveryStats.avgRating || 5;
    const deliveryCount = personnel.deliveryStats.completedDeliveries || 0;

    let newAvg = currentAvg;
    if (deliveryCount > 0) {
      // Weight the new rating based on total deliveries
      // This is a simple approach; you might want a more sophisticated algorithm
      newAvg = (currentAvg * deliveryCount + rating) / (deliveryCount + 1);
    } else {
      newAvg = rating;
    }

    return this.updateOne(
      { _id: toObjectId(personnelId) },
      {
        'deliveryStats.avgRating': newAvg,
        updatedAt: new Date(),
      },
    );
  }

  public async resetDeliveryStats(personnelId: string) {
    return this.updateOne(
      { _id: toObjectId(personnelId) },
      {
        deliveryStats: {
          totalDeliveries: 0,
          completedDeliveries: 0,
          missedDeliveries: 0,
          avgRating: 5,
          containersDelivered: 0,
          containersCollected: 0,
        },
        updatedAt: new Date(),
      },
    );
  }

  public async getPersonnelDeliveryStats(personnelId: string) {
    const personnel: any = await this.findOne(
      { _id: toObjectId(personnelId) },
      { deliveryStats: 1 },
    );
    return personnel?.deliveryStats;
  }

  // *** Payment details management ***

  public async updatePaymentDetails(
    personnelId: string,
    accountNumber: string,
    bankName: string,
    ifscCode: string,
  ) {
    return this.updateOne(
      { _id: toObjectId(personnelId) },
      {
        paymentDetails: {
          accountNumber,
          bankName,
          ifscCode,
        },
        updatedAt: new Date(),
      },
    );
  }

  public async getPaymentDetails(personnelId: string) {
    const personnel: any = await this.findOne(
      { _id: toObjectId(personnelId) },
      { paymentDetails: 1 },
    );
    return personnel?.paymentDetails;
  }

  // *** Analytics and statistics ***

  public async countPersonnelByZone(zone: string) {
    return this.model.countDocuments({ zone });
  }

  public async getPersonnelWithLeastSubscribersInZone(zone: string) {
    return this.model.aggregate([
      { $match: { zone, isActive: true } },
      {
        $project: {
          userId: 1,
          zone: 1,
          isActive: 1,
          assignedSubscriberCount: { $size: '$assignedSubscribers' },
        },
      },
      { $sort: { assignedSubscriberCount: 1 } },
      { $limit: 1 },
    ]);
  }

  public async getPersonnelWorkloadStats() {
    return this.model.aggregate([
      { $match: { isActive: true } },
      {
        $project: {
          _id: 1,
          userId: 1,
          zone: 1,
          primaryZones: 1,
          assignedSubscriberCount: { $size: '$assignedSubscribers' },
          deliveryStats: 1,
          maxDeliveriesPerDay: 1,
        },
      },
      { $sort: { zone: 1, assignedSubscriberCount: 1 } },
    ]);
  }

  public async findPersonnelWithCapacity(maxSubscribers: number = 20) {
    return this.model.aggregate([
      { $match: { isActive: true } },
      {
        $project: {
          _id: 1,
          userId: 1,
          zone: 1,
          primaryZones: 1,
          secondaryZones: 1,
          assignedSubscriberCount: { $size: '$assignedSubscribers' },
          maxDeliveriesPerDay: 1,
          availableCapacity: {
            $subtract: ['$maxDeliveriesPerDay', { $size: '$assignedSubscribers' }],
          },
        },
      },
      {
        $match: {
          $or: [
            { assignedSubscriberCount: { $lt: maxSubscribers } },
            { availableCapacity: { $gt: 0 } },
          ],
        },
      },
      { $sort: { availableCapacity: -1 } },
    ]);
  }

  public async getTopPerformingPersonnel(limit: number = 5) {
    return this.model.aggregate([
      { $match: { isActive: true } },
      {
        $project: {
          _id: 1,
          userId: 1,
          zone: 1,
          completionRate: {
            $cond: [
              { $eq: ['$deliveryStats.totalDeliveries', 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: [
                      '$deliveryStats.completedDeliveries',
                      '$deliveryStats.totalDeliveries',
                    ],
                  },
                  100,
                ],
              },
            ],
          },
          avgRating: '$deliveryStats.avgRating',
          totalDeliveries: '$deliveryStats.totalDeliveries',
        },
      },
      // Only consider personnel with at least 10 deliveries
      { $match: { totalDeliveries: { $gte: 10 } } },
      // Calculate overall score (completion rate * rating)
      {
        $addFields: {
          overallScore: {
            $multiply: ['$completionRate', '$avgRating'],
          },
        },
      },
      { $sort: { overallScore: -1 } },
      { $limit: limit },
    ]);
  }

  // *** Bulk operations and optimization ***

  public async redistributeSubscribersInZone(zone: string, maxPerPersonnel: number = 20) {
    // Get all personnel in the zone
    const personnel = await this.getActiveDeliveryPersonnelByZone(zone);

    if (personnel.length === 0) {
      return { success: false, message: 'No active personnel in zone' };
    }

    // Get detailed workload info
    const workloadStats = await this.model.aggregate([
      { $match: { zone, isActive: true } },
      {
        $project: {
          _id: 1,
          assignedSubscriberCount: { $size: '$assignedSubscribers' },
          assignedSubscribers: 1,
          maxDeliveriesPerDay: 1,
        },
      },
      { $sort: { assignedSubscriberCount: -1 } },
    ]);

    if (workloadStats.length < 2) {
      return { success: false, message: 'Need at least 2 personnel for redistribution' };
    }

    // This is a placeholder - in a real implementation, you'd calculate actual transfers
    // Example plan structure:
    const redistributionPlan = {
      success: true,
      message: 'Redistribution plan generated',
      transfers: [
        /* Example structure:
        {
          fromPersonnelId: workloadStats[0]._id,
          toPersonnelId: workloadStats[workloadStats.length - 1]._id,
          subscribersToMove: workloadStats[0].assignedSubscribers.slice(0, 5)
        }
        */
      ],
    };

    return redistributionPlan;
  }

  public async updateDeliveryPersonnel(personnelId: string, updateData: any) {
    const allowedFields = [
      'zone',
      'isActive',
      'vehicleType',
      'vehicleNumber',
      'maxDeliveriesPerDay',
      'maxWeight',
    ];

    const filteredData: any = {};

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    filteredData.updatedAt = new Date();

    return this.updateOne({ _id: toObjectId(personnelId) }, filteredData);
  }

  public async bulkUpdatePersonnel(updates: any[]) {
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: toObjectId(update.personnelId) },
        update: {
          $set: { ...update.data, updatedAt: new Date() },
        },
      },
    }));

    if (bulkOps.length > 0) {
      return this.model.bulkWrite(bulkOps);
    }

    return { modifiedCount: 0 };
  }
}

export const DeliveryPersonnelEntities = new DeliveryPersonnel(DeliveryPersonnelModel);
