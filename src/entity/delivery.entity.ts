import { Model, PipelineStage } from 'mongoose';
import DeliveryModel from '@models/delivery.model';
import { toObjectId } from '@utils';
import BaseEntity from './base.entity';
// Add these imports at the top if not already there
import { SubscriberEntities } from './subscriber.entity';
import { format } from 'date-fns';
import { DeliveryPersonnelEntities } from './deliveryPersonnel.entity';
import SubscriberModel from '@models/subscriber.model'; // Import the actual Subscriber Model

// --- Define Types Locally if not imported ---
// (Add definitions if these aren't globally available or imported correctly elsewhere)
type DeliveryDay = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

class DeliveryEntity extends BaseEntity {
  constructor(model: Model<any> = DeliveryModel) {
    super(model);
  }

  // Existing functions remain the same...

  // *** Admin-related methods ***

  public async getDeliveriesByAdminId(adminId: string) {
    return this.find({ adminId: toObjectId(adminId) });
  }

  public async getDeliveriesByAdminAndDate(adminId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.find({
      adminId: toObjectId(adminId),
      date: { $gte: startOfDay, $lte: endOfDay },
    });
  }

  // *** Subscription-related methods ***

  public async getDeliveriesBySubscriptionId(subscriptionId: string) {
    return this.find({
      'subscriptions.subscriptionId': toObjectId(subscriptionId),
    });
  }

  public async addSubscriptionToDelivery(deliveryId: string, subscriptionData: any) {
    return this.updateOne(
      { _id: toObjectId(deliveryId) },
      {
        $push: { subscriptions: subscriptionData },
        updatedAt: new Date(),
      },
    );
  }

  public async updateSubscriptionFulfillment(
    deliveryId: string,
    subscriptionId: string,
    fulfilled: boolean,
  ) {
    return this.updateOne(
      {
        _id: toObjectId(deliveryId),
        'subscriptions.subscriptionId': toObjectId(subscriptionId),
      },
      {
        $set: { 'subscriptions.$.fulfilled': fulfilled },
        updatedAt: new Date(),
      },
    );
  }

  // *** Container detailed tracking ***

  public async addDeliveredContainer(
    deliveryId: string,
    containerId: string,
    condition: string = 'excellent',
    verified: boolean = false,
  ) {
    return this.updateOne(
      { _id: toObjectId(deliveryId) },
      {
        $push: {
          'containerDetails.delivered': {
            containerId: toObjectId(containerId),
            condition,
            verified,
          },
        },
        $inc: { containersDelivered: 1 },
        updatedAt: new Date(),
      },
    );
  }

  public async addReturnedContainer(
    deliveryId: string,
    containerId: string,
    condition: string = 'excellent',
    verified: boolean = false,
  ) {
    return this.updateOne(
      { _id: toObjectId(deliveryId) },
      {
        $push: {
          'containerDetails.returned': {
            containerId: toObjectId(containerId),
            condition,
            verified,
          },
        },
        $inc: { containersReturned: 1 },
        updatedAt: new Date(),
      },
    );
  }

  public async updateContainerCondition(
    deliveryId: string,
    containerId: string,
    isDelivered: boolean,
    condition: string,
  ) {
    const arrayField = isDelivered ? 'containerDetails.delivered' : 'containerDetails.returned';

    return this.updateOne(
      {
        _id: toObjectId(deliveryId),
        [`${arrayField}.containerId`]: toObjectId(containerId),
      },
      {
        $set: { [`${arrayField}.$.condition`]: condition },
        updatedAt: new Date(),
      },
    );
  }

  public async verifyContainer(
    deliveryId: string,
    containerId: string,
    isDelivered: boolean,
    verified: boolean = true,
  ) {
    const arrayField = isDelivered ? 'containerDetails.delivered' : 'containerDetails.returned';

    return this.updateOne(
      {
        _id: toObjectId(deliveryId),
        [`${arrayField}.containerId`]: toObjectId(containerId),
      },
      {
        $set: { [`${arrayField}.$.verified`]: verified },
        updatedAt: new Date(),
      },
    );
  }

  public async getDeliveredContainers(deliveryId: string) {
    const delivery: any = await this.findOne(
      { _id: toObjectId(deliveryId) },
      { 'containerDetails.delivered': 1 },
    );
    return delivery?.containerDetails?.delivered || [];
  }

  public async getReturnedContainers(deliveryId: string) {
    const delivery: any = await this.findOne(
      { _id: toObjectId(deliveryId) },
      { 'containerDetails.returned': 1 },
    );
    return delivery?.containerDetails?.returned || [];
  }

  // *** Enhanced status tracking ***

  public async updateDeliveryStatus(deliveryId: string, status: string) {
    return this.updateOne({ _id: toObjectId(deliveryId) }, { status, updatedAt: new Date() });
  }

  public async markAsInTransit(deliveryId: string, estimatedArrival?: Date) {
    const updateData: any = {
      status: 'in-transit',
      updatedAt: new Date(),
    };

    if (estimatedArrival) {
      updateData.estimatedArrival = estimatedArrival;
    }

    return this.updateOne({ _id: toObjectId(deliveryId) }, updateData);
  }

  public async markAsDelivered(
    deliveryId: string,
    actualDeliveryTime: Date = new Date(),
    notes?: string,
  ) {
    const updateData: any = {
      status: 'delivered',
      actualDeliveryTime,
      updatedAt: new Date(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    return this.updateOne({ _id: toObjectId(deliveryId) }, updateData);
  }

  public async markAsPartial(
    deliveryId: string,
    containersDelivered: number,
    containersReturned: number,
    notes?: string,
  ) {
    const updateData: any = {
      status: 'partial',
      containersDelivered,
      containersReturned,
      actualDeliveryTime: new Date(),
      updatedAt: new Date(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    return this.updateOne({ _id: toObjectId(deliveryId) }, updateData);
  }

  public async cancelDelivery(deliveryId: string, notes?: string) {
    const updateData: any = {
      status: 'cancelled',
      updatedAt: new Date(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    return this.updateOne({ _id: toObjectId(deliveryId) }, updateData);
  }

  // *** Verification methods ***

  public async updateVerificationMethod(
    deliveryId: string,
    method: 'signature' | 'photo' | 'code' | 'none',
  ) {
    return this.updateOne(
      { _id: toObjectId(deliveryId) },
      {
        verificationMethod: method,
        updatedAt: new Date(),
      },
    );
  }

  public async setVerificationData(deliveryId: string, data: string) {
    return this.updateOne(
      { _id: toObjectId(deliveryId) },
      {
        verificationData: data,
        updatedAt: new Date(),
      },
    );
  }

  public async verifyWithSignature(deliveryId: string, signatureImageUrl: string) {
    return this.updateOne(
      { _id: toObjectId(deliveryId) },
      {
        verificationMethod: 'signature',
        verificationData: signatureImageUrl,
        updatedAt: new Date(),
      },
    );
  }

  public async verifyWithPhoto(deliveryId: string, photoUrl: string) {
    return this.updateOne(
      { _id: toObjectId(deliveryId) },
      {
        verificationMethod: 'photo',
        verificationData: photoUrl,
        updatedAt: new Date(),
      },
    );
  }

  public async verifyWithCode(deliveryId: string, code: string, providedCode: string) {
    if (code !== providedCode) {
      throw new Error('Verification code does not match');
    }

    return this.updateOne(
      { _id: toObjectId(deliveryId) },
      {
        verificationMethod: 'code',
        verificationData: code,
        updatedAt: new Date(),
      },
    );
  }

  // *** Notes management ***

  public async updateSubscriberNotes(deliveryId: string, notes: string) {
    return this.updateOne(
      { _id: toObjectId(deliveryId) },
      {
        subscriberNotes: notes,
        updatedAt: new Date(),
      },
    );
  }

  public async updatePersonnelNotes(deliveryId: string, notes: string) {
    return this.updateOne(
      { _id: toObjectId(deliveryId) },
      {
        personnelNotes: notes,
        updatedAt: new Date(),
      },
    );
  }

  // *** Route management ***

  public async updateRouteOrder(deliveryId: string, routeOrder: number) {
    return this.updateOne(
      { _id: toObjectId(deliveryId) },
      {
        routeOrder,
        updatedAt: new Date(),
      },
    );
  }

  public async updateDeliveryDistance(deliveryId: string, distanceKm: number) {
    return this.updateOne(
      { _id: toObjectId(deliveryId) },
      {
        deliveryDistance: distanceKm,
        updatedAt: new Date(),
      },
    );
  }

  public async optimizeRouteOrder(personnelId: string, date: Date) {
    // This is a placeholder for route optimization logic
    // In a real implementation, you would use a routing algorithm
    // based on the subscriber addresses and delivery priorities

    const deliveries = await this.find({
      personnelId: toObjectId(personnelId),
      date,
    });

    // For now, just assigning sequential route numbers
    const updates: any = deliveries.map((delivery: any, index) => ({
      updateOne: {
        filter: { _id: delivery._id },
        update: {
          routeOrder: index + 1,
          updatedAt: new Date(),
        },
      },
    }));

    if (updates.length > 0) {
      return this.model.bulkWrite(updates);
    }

    return { modifiedCount: 0 };
  }

  // *** Payment tracking ***

  public async updatePaymentStatus(deliveryId: string, collected: boolean, amount: number = 0) {
    return this.updateOne(
      { _id: toObjectId(deliveryId) },
      {
        paymentCollected: collected,
        amountCollected: amount,
        updatedAt: new Date(),
      },
    );
  }

  public async getPaymentCollectionReport(personnelId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const pipeline = [
      {
        $match: {
          personnelId: toObjectId(personnelId),
          date: { $gte: startOfDay, $lte: endOfDay },
          paymentCollected: true,
        },
      },
      {
        $group: {
          _id: null,
          totalCollected: { $sum: '$amountCollected' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalCollected: 1,
          count: 1,
        },
      },
    ];

    const result = await this.model.aggregate(pipeline);
    return result.length > 0 ? result[0] : { totalCollected: 0, count: 0 };
  }

  // *** Advanced queries and analytics ***

  public async getAdminDeliveryStatistics(adminId: string, startDate: Date, endDate: Date) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const pipeline = [
      {
        $match: {
          adminId: toObjectId(adminId),
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          containersDelivered: { $sum: '$containersDelivered' },
          containersReturned: { $sum: '$containersReturned' },
          payments: {
            $sum: { $cond: ['$paymentCollected', '$amountCollected', 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
          containersDelivered: 1,
          containersReturned: 1,
          payments: 1,
        },
      },
    ];

    return this.model.aggregate(pipeline);
  }

  public async getDeliveryEfficiencyByPersonnel(startDate: Date, endDate: Date) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const pipeline = [
      {
        $match: {
          date: { $gte: start, $lte: end },
          status: { $in: ['completed', 'partial', 'delivered'] },
        },
      },
      {
        $group: {
          _id: '$personnelId',
          totalDeliveries: { $sum: 1 },
          totalDistance: { $sum: '$deliveryDistance' },
          avgTimeSpent: {
            $avg: { $subtract: ['$actualDeliveryTime', '$date'] },
          },
        },
      },
      {
        $lookup: {
          from: 'deliverypersonnel',
          localField: '_id',
          foreignField: '_id',
          as: 'personnel',
        },
      },
      { $unwind: { path: '$personnel', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          personnelId: '$_id',
          name: {
            $concat: ['$personnel.firstName', ' ', '$personnel.lastName'],
          },
          totalDeliveries: 1,
          totalDistance: 1,
          avgTimeSpent: { $divide: ['$avgTimeSpent', 60000] }, // Convert to minutes
          deliveriesPerKm: {
            $cond: [
              { $eq: ['$totalDistance', 0] },
              0,
              { $divide: ['$totalDeliveries', '$totalDistance'] },
            ],
          },
        },
      },
    ];

    return this.model.aggregate(pipeline);
  }

  public async getSubscriberDeliverySummary(subscriberId: string, months: number = 3) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const pipeline = [
      {
        $match: {
          subscriberId: toObjectId(subscriberId),
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          totalDeliveries: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          missed: { $sum: { $cond: [{ $eq: ['$status', 'missed'] }, 1, 0] } },
          containersDelivered: { $sum: '$containersDelivered' },
          containersReturned: { $sum: '$containersReturned' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          totalDeliveries: 1,
          completed: 1,
          missed: 1,
          containersDelivered: 1,
          containersReturned: 1,
          returnRate: {
            $cond: [
              { $eq: ['$containersDelivered', 0] },
              0,
              {
                $multiply: [{ $divide: ['$containersReturned', '$containersDelivered'] }, 100],
              },
            ],
          },
        },
      },
      // { $sort: { year: 1, month: 1 } }
    ];

    return this.model.aggregate(pipeline);
  }

  // updateDeliveryNotes
  public async updateDeliveryNotes(deliveryId: string, notes: string) {
    return this.updateOne({ _id: toObjectId(deliveryId) }, { notes, updatedAt: new Date() });
  }

  // updateContainersReturned
  public async updateContainersReturned(deliveryId: string, containersReturned: number) {
    return this.updateOne(
      { _id: toObjectId(deliveryId) },
      { containersReturned, updatedAt: new Date() },
    );
  }

  // updateContainersDelivered
  public async updateContainersDelivered(deliveryId: string, containersDelivered: number) {
    return this.updateOne(
      { _id: toObjectId(deliveryId) },
      { containersDelivered, updatedAt: new Date() },
    );
  }

  // removeDeliveryById
  public async removeDeliveryById(deliveryId: string) {
    return this.deleteOne({ _id: toObjectId(deliveryId) });
  }

  // getDeliveriesBySubscriberId
  public async getDeliveriesBySubscriberId(subscriberId: string) {
    return this.find({ subscriberId: toObjectId(subscriberId) });
  }

  // getDeliveryById
  public async getDeliveryById(deliveryId: string) {
    return this.findOne({ _id: toObjectId(deliveryId) });
  }

  // addDelivery
  public async addDelivery(data: any) {
    return this.create(data);
  }

  // getDeliveriesByPersonnelId
  public async getDeliveriesByPersonnelId(personnelId: string) {
    return this.find({ personnelId: toObjectId(personnelId) });
  }

  // bulkCreateDeliveries
  public async bulkCreateDeliveries(deliveries: any[]) {
    return this.model.insertMany(deliveries);
  }

  /**
   * Auto-generate deliveries for all personnel for specified date
   */
  public async autoGenerateAllDeliveriesForDate(date: Date = new Date(), adminId: string) {
    // Find all delivery personnel
    // const personnelCollection = this.model.db.collection('deliverypersonnel');
    const allPersonnel: any = await DeliveryPersonnelEntities.find({
      isActive: true,
      adminId: toObjectId(adminId),
    });

    const results = [];

    // Generate deliveries for each personnel
    for (const personnel of allPersonnel) {
      const personnelData = {
        personnelId: personnel._id,
        assignedSubscribers: personnel.assignedSubscribers,
        zone: personnel.zone,
      };
      const result: any = await this.generateDeliveriesForPersonnel(
        personnelData.personnelId,
        date,
        {
          adminId: adminId,
        },
      );
      results.push({
        personnelId: personnel._id,
        name: `${personnel.firstName} ${personnel.lastName}`,
        deliveriesCreated: result.insertedCount || 0,
      });
    }

    return results;
  }

  /**
   * Get subscribers who should get deliveries on a specific day (by delivery day)
   */
  public async getSubscribersByDeliveryDay(day: string) {
    return SubscriberEntities.findSubscribersByDeliveryDay(day);
  }

  /**
   * Assign optimal delivery personnel based on subscriber location
   */
  public async assignOptimalDeliveryPersonnel(subscriberId: string) {
    // Get subscriber details
    const subscriber: any = await SubscriberEntities.findSubscriberById(subscriberId);
    if (!subscriber || !subscriber.fullAddress || !subscriber.fullAddress.coordinates) {
      return { success: false, message: 'Subscriber location not available' };
    }

    // Get available personnel
    const personnelCollection = this.model.db.collection('deliverypersonnel');
    const availablePersonnel = await personnelCollection
      .find({
        isActive: true,
        'availability.available': true,
      })
      .toArray();

    if (availablePersonnel.length === 0) {
      return { success: false, message: 'No available delivery personnel' };
    }

    // Find personnel who already serves this zone
    const zonePersonnel = availablePersonnel.filter(
      p => p.assignedZones && p.assignedZones.includes(subscriber.zone),
    );

    if (zonePersonnel.length > 0) {
      // Select personnel with fewest assigned subscribers
      const bestPersonnel = zonePersonnel.sort(
        (a, b) => (a.subscriberCount || 0) - (b.subscriberCount || 0),
      )[0];

      await SubscriberEntities.assignDeliveryPersonnel(subscriberId, bestPersonnel._id.toString());

      return {
        success: true,
        personnelId: bestPersonnel._id,
        personnelName: `${bestPersonnel.firstName} ${bestPersonnel.lastName}`,
      };
    }

    // No perfect match - find nearest personnel
    // This would require geospatial queries or a distance calculation algorithm
    // For simplicity, just assign to least loaded personnel
    const bestPersonnel = availablePersonnel.sort(
      (a, b) => (a.subscriberCount || 0) - (b.subscriberCount || 0),
    )[0];

    await SubscriberEntities.assignDeliveryPersonnel(subscriberId, bestPersonnel._id.toString());

    return {
      success: true,
      personnelId: bestPersonnel._id,
      personnelName: `${bestPersonnel.firstName} ${bestPersonnel.lastName}`,
    };
  }

  /**
   * Create deliveries for manually selected subscribers on a specific date
   * @param adminId The admin creating the deliveries
   * @param subscriberIds Array of subscriber IDs to create deliveries for
   * @param date The date for the deliveries
   * @param assignToPersonnel Whether to automatically assign delivery personnel
   */
  public async createDeliveriesForSelectedSubscribers(
    adminId: string,
    subscriberIds: string[],
    date: Date = new Date(),
    assignToPersonnel: boolean = true,
  ) {
    if (!subscriberIds || subscriberIds.length === 0) {
      return {
        success: false,
        message: 'No subscribers selected',
        created: 0,
      };
    }

    const subscriberObjectIds = subscriberIds.map(id => toObjectId(id));

    // Check existing deliveries for today to avoid duplicates
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingDeliveries = await this.find({
      subscriberId: { $in: subscriberObjectIds },
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // Get IDs of subscribers who already have deliveries for today
    const subscribersWithDeliveries: any = existingDeliveries.map((delivery: any) =>
      delivery.subscriberId.toString(),
    );

    // Filter out subscribers who already have deliveries
    const subscribersToProcess = subscriberIds.filter(
      id => !subscribersWithDeliveries.includes(id),
    );

    if (subscribersToProcess.length === 0) {
      return {
        success: true,
        message: 'All selected subscribers already have deliveries scheduled for today',
        created: 0,
        skipped: subscriberIds.length,
      };
    }

    // Fetch subscriber details for the remaining subscribers
    const subscribers: any = await SubscriberEntities.find({
      _id: { $in: subscribersToProcess.map(id => toObjectId(id)) },
      isActive: true,
    });

    if (subscribers.length === 0) {
      return {
        success: false,
        message: 'No active subscribers found among selected IDs',
        created: 0,
        skipped: subscriberIds.length,
      };
    }

    const deliveriesToCreate = [];
    const assignmentPromises = [];

    // Create delivery entries for each subscriber
    for (const subscriber of subscribers) {
      // Get active subscriptions
      const activeSubscriptions: any = Array.isArray(subscriber.activeSubscriptions)
        ? subscriber.activeSubscriptions.map((sub: any) => ({
            subscriptionId: sub._id || sub,
            fulfilled: false,
          }))
        : [];

      // Calculate containers based on subscriptions
      const containersToDeliver = activeSubscriptions.length > 0 ? activeSubscriptions.length : 1;
      const containersToReturn = subscriber.pendingContainers || 0;

      // Determine personnel assignment
      const personnelId = subscriber.assignedTo || null;

      // Create delivery object
      const delivery = {
        subscriberId: subscriber._id,
        adminId: toObjectId(adminId),
        ...(personnelId && { personnelId: toObjectId(personnelId) }),
        date: new Date(date),
        scheduledTime: subscriber.preferredTimeSlot || null,
        status: 'scheduled',
        zone: subscriber.zone || null,
        subscriptions: activeSubscriptions,
        containersToDeliver,
        containersToReturn,
        containersDelivered: 0,
        containersReturned: 0,
        deliveryInstructions: subscriber.deliveryInstructions || '',
        containerDetails: {
          delivered: [],
          returned: [],
        },
        address: subscriber.address,
        fullAddress: subscriber.fullAddress,
        createdBy: adminId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      deliveriesToCreate.push(delivery);

      // If no personnel is assigned and assignToPersonnel is true, assign one
      if (assignToPersonnel && !personnelId) {
        assignmentPromises.push(this.assignOptimalDeliveryPersonnel(subscriber._id.toString()));
      }
    }

    // Create all deliveries in bulk
    let result: any;
    if (deliveriesToCreate.length > 0) {
      result = await this.bulkCreateDeliveries(deliveriesToCreate);
      console.log('result', result);
    } else {
      return {
        success: true,
        message: 'No new deliveries created',
        created: 0,
        skipped: subscribersWithDeliveries.length,
      };
    }

    // Resolve personnel assignments if any
    if (assignmentPromises.length > 0) {
      await Promise.all(assignmentPromises);
    }

    // Get newly created deliveries to return with details
    const createdDeliveries = await this.find({
      subscriberId: { $in: subscribersToProcess.map(id => toObjectId(id)) },
      date: { $gte: startOfDay, $lte: endOfDay },
      adminId: toObjectId(adminId),
    });

    return {
      success: true,
      message: `Created ${deliveriesToCreate.length} new deliveries`,
      created: deliveriesToCreate.length,
      skipped: subscribersWithDeliveries.length,
      deliveries: createdDeliveries,
    };
  }

  /**
   * Get subscribers eligible for manual delivery creation on a specific date,
   * considering their schedule and excluding those already having a delivery.
   * NOTE: This method interacts with Subscriber data, consider if it truly belongs in DeliveryEntity.
   */
  public async getEligibleSubscribersForDelivery(
    adminId: string,
    date: Date = new Date(),
    filter: { zone?: string; subscriptionType?: string; search?: string } = {},
  ): Promise<any[]> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const targetDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
      targetDate.getDay()
    ] as DeliveryDay;

    const startOfDay = new Date(targetDate);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const matchConditions: Record<string, any> = {
      isActive: true,
      $or: [{ primaryAdmin: toObjectId(adminId) }, { relatedAdmins: toObjectId(adminId) }],
    };
    if (filter.zone) {
      matchConditions.zone = filter.zone;
    }
    if (filter.subscriptionType) {
      matchConditions.subscriptionType = filter.subscriptionType;
    }
    if (filter.search) {
      const searchRegex = new RegExp(filter.search, 'i');
      matchConditions.$and = [
        { $or: matchConditions.$or },
        {
          $or: [
            { name: { $regex: searchRegex } },
            { mobile: { $regex: searchRegex } },
            { address: { $regex: searchRegex } },
            { 'fullAddress.street': { $regex: searchRegex } },
            { 'fullAddress.city': { $regex: searchRegex } },
          ],
        },
      ];
      delete matchConditions.$or;
    }

    // The type of this array now implicitly uses mongoose.PipelineStage
    const pipeline: PipelineStage[] = [
      { $match: matchConditions },
      {
        $addFields: {
          nextDeliveryDate: {
            $cond: {
              if: {
                $and: [{ $eq: ['$isCustomFrequency', true] }, { $ne: ['$lastDeliveryDate', null] }],
              },
              then: {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ['$customFrequencyIntervalUnit', 'days'] },
                      then: {
                        $add: [
                          '$lastDeliveryDate',
                          { $multiply: ['$customFrequencyInterval', 86400000] },
                        ],
                      },
                    },
                    {
                      case: { $eq: ['$customFrequencyIntervalUnit', 'weeks'] },
                      then: {
                        $add: [
                          '$lastDeliveryDate',
                          { $multiply: ['$customFrequencyInterval', 604800000] },
                        ],
                      },
                    },
                    {
                      case: { $eq: ['$customFrequencyIntervalUnit', 'months'] },
                      then: {
                        $add: [
                          '$lastDeliveryDate',
                          { $multiply: ['$customFrequencyInterval', 2592000000] },
                        ],
                      },
                    },
                  ],
                  default: null,
                },
              },
              else: {
                $cond: { if: { $eq: ['$isCustomFrequency', true] }, then: new Date(0), else: null },
              },
            },
          },
        },
      },
      {
        $match: {
          $or: [
            { subscriptionType: 'daily' },
            { $and: [{ subscriptionType: 'weekly' }, { deliveryDays: targetDay }] },
            { $and: [{ isCustomFrequency: true }, { nextDeliveryDate: { $lte: targetDate } }] },
          ],
        },
      },
      {
        $lookup: {
          from: 'deliveries',
          let: { subscriberId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$subscriberId', '$$subscriberId'] },
                    { $gte: ['$date', startOfDay] },
                    { $lte: ['$date', endOfDay] },
                    { $ne: ['$status', 'cancelled'] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: 'todaysDeliveries',
        },
      },
      { $match: { todaysDeliveries: { $size: 0 } } },
      { $project: { todaysDeliveries: 0, nextDeliveryDate: 0 } },
    ];

    // Call aggregate on the Mongoose Model
    const eligibleSubscribers = await SubscriberModel.aggregate(pipeline);

    return eligibleSubscribers;
  }

  /**
   * Create deliveries for multiple subscribers with container tracking
   */
  public async createDeliveriesWithContainers(
    adminId: string,
    deliveryData: Array<{
      subscriberId: string;
      personnelId?: string;
      date: Date;
      containersToDeliver: number;
      containersToReturn: number;
      scheduledTime?: string;
      notes?: string;
    }>,
  ) {
    if (!deliveryData || deliveryData.length === 0) {
      return {
        success: false,
        message: 'No delivery data provided',
        created: 0,
      };
    }

    // Check for existing deliveries to avoid duplicates
    const subscriberIds = deliveryData.map(d => d.subscriberId);
    const dates = [...new Set(deliveryData.map(d => d.date.toISOString().split('T')[0]))];

    const existingDeliveries: any[] = [];

    for (const dateStr of dates) {
      const date = new Date(dateStr);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const deliveries = await this.find({
        subscriberId: { $in: subscriberIds.map(id => toObjectId(id)) },
        date: { $gte: startOfDay, $lte: endOfDay },
      });

      existingDeliveries.push(...deliveries);
    }

    // Map of subscriberId_dateStr to existing delivery
    const existingDeliveryMap = new Map();
    existingDeliveries.forEach(delivery => {
      const dateStr = delivery.date.toISOString().split('T')[0];
      const key = `${delivery.subscriberId.toString()}_${dateStr}`;
      existingDeliveryMap.set(key, delivery);
    });

    // Filter out deliveries that already exist
    const newDeliveries = deliveryData.filter(data => {
      const dateStr = data.date.toISOString().split('T')[0];
      const key = `${data.subscriberId}_${dateStr}`;
      return !existingDeliveryMap.has(key);
    });

    if (newDeliveries.length === 0) {
      return {
        success: true,
        message: 'All deliveries already exist for the selected dates',
        created: 0,
        skipped: deliveryData.length,
        existingDeliveries,
      };
    }

    // Get subscriber details for the new deliveries
    const subscribersToFetch = [...new Set(newDeliveries.map(d => d.subscriberId))];
    const subscribers = await SubscriberEntities.find({
      _id: { $in: subscribersToFetch.map(id => toObjectId(id)) },
    });

    // Map subscriberId to subscriber details
    const subscriberMap = new Map();
    subscribers.forEach((sub: any) => {
      subscriberMap.set(sub._id.toString(), sub);
    });

    // Create delivery documents
    const deliveriesToCreate = newDeliveries.map(data => {
      const subscriber = subscriberMap.get(data.subscriberId);

      // Get active subscriptions if available
      let subscriptions = [];
      if (
        subscriber &&
        subscriber.activeSubscriptions &&
        Array.isArray(subscriber.activeSubscriptions)
      ) {
        subscriptions = subscriber.activeSubscriptions.map((sub: any) => ({
          subscriptionId: typeof sub === 'object' ? sub._id : sub,
          fulfilled: false,
        }));
      }

      // Personnel assignment
      const personnelId =
        data.personnelId || (subscriber && subscriber.assignedTo ? subscriber.assignedTo : null);

      return {
        subscriberId: toObjectId(data.subscriberId),
        adminId: toObjectId(adminId),
        ...(personnelId && { personnelId: toObjectId(personnelId) }),
        date: new Date(data.date),
        scheduledTime:
          data.scheduledTime || (subscriber ? subscriber.preferredTimeSlot : null) || null,
        status: 'scheduled',
        zone: subscriber ? subscriber.zone : null,
        subscriptions,
        containersToDeliver: data.containersToDeliver || 0,
        containersToReturn: data.containersToReturn || 0,
        containersDelivered: 0,
        containersReturned: 0,
        notes: data.notes || '',
        deliveryInstructions: subscriber ? subscriber.deliveryInstructions : '',
        containerDetails: {
          delivered: [],
          returned: [],
        },
        address: subscriber ? subscriber.address : '',
        fullAddress: subscriber ? subscriber.fullAddress : null,
        createdBy: adminId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    // Create deliveries in bulk
    const result: any = await this.bulkCreateDeliveries(deliveriesToCreate);

    // Get the newly created deliveries
    const createdDeliveryIds: any = Object.values(result.insertedIds || {}).map((id: any) =>
      id.toString(),
    );
    const createdDeliveries = await this.find({
      _id: { $in: createdDeliveryIds.map((id: any) => toObjectId(id)) },
    });

    return {
      success: true,
      message: `Created ${deliveriesToCreate.length} new deliveries`,
      created: deliveriesToCreate.length,
      skipped: deliveryData.length - deliveriesToCreate.length,
      existingDeliveries,
      createdDeliveries,
    };
  }

  /**
   * Get unassigned subscribers who don't have a delivery personnel
   */
  public async getUnassignedSubscribers(filters: {
    adminId?: string;
    zone?: string;
    search?: string;
  }) {
    const query: any = {
      isActive: true,
      assignedTo: { $exists: false }, // No delivery personnel assigned
    };

    // Admin filter
    if (filters.adminId) {
      query.$or = [
        { primaryAdmin: toObjectId(filters.adminId) },
        { relatedAdmins: toObjectId(filters.adminId) },
      ];
    }

    // Zone filter
    if (filters.zone) {
      query.zone = filters.zone;
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
      ];
    }

    return SubscriberEntities.find(query);
  }

  /**
   * Get delivery personnel with their assigned subscriber counts
   */
  public async getDeliveryPersonnelWithCounts() {
    const personnelCollection: any = this.model.db.collection('deliverypersonnel');
    const personnel: any = await personnelCollection.find({ isActive: true }).toArray();

    // Get subscriber counts for each personnel
    const counts: any = await SubscriberEntities.basicAggregate([
      { $match: { assignedTo: { $exists: true } } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
    ]);

    // Map counts to personnel
    const countMap = new Map();
    counts.forEach((item: any) => countMap.set(item._id.toString(), item.count));

    // Add subscriber count to each personnel
    return personnel.map((p: any) => ({
      ...p,
      subscriberCount: countMap.get(p._id.toString()) || 0,
    }));
  }

  // DEDEDEDEDEDEDEDEDEDEDEDE
  /**
   * Gets a list of subscribers who need delivery for a specific personnel on a given date
   * @param personnelId - The ID of the delivery personnel
   * @param date - The date to check for deliveries (defaults to today)
   * @param options - Additional options for filtering and sorting
   * @returns Array of subscribers who need delivery with additional delivery details
   */
  public async getDeliveryScheduleForPersonnel(
    personnelId: string,
    date: Date = new Date(),
    options: {
      includeExisting?: boolean;
      timeSlot?: string;
      maxDeliveries?: number;
      sortBy?: 'preferredTimeSlot' | 'zone' | 'address';
    } = {},
  ) {
    try {
      // Format the date to start and end of day for queries
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Get the day of week for the specified date
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayOfWeek = days[date.getDay()];

      // Get the personnel details first to validate and get their constraints
      const personnel = await this.model.db.collection('deliverypersonnel').findOne({
        _id: toObjectId(personnelId),
      });

      if (!personnel) {
        throw new Error(`Delivery personnel with ID ${personnelId} not found`);
      }

      if (!personnel.isActive) {
        throw new Error(`Delivery personnel ${personnel.name} is not active`);
      }

      // Check if the personnel works on this day
      if (
        personnel.availableDays &&
        personnel.availableDays.length > 0 &&
        !personnel.availableDays.includes(dayOfWeek)
      ) {
        return {
          success: false,
          message: `${personnel.name} is not scheduled to work on ${dayOfWeek}`,
          subscribers: [],
        };
      }

      // Get maximum deliveries allowed (use personnel setting or option parameter)
      const maxDeliveries = options.maxDeliveries || personnel.maxDeliveriesPerDay || Infinity;

      // Get all subscribers assigned to this personnel
      const assignedSubscribers: any = await SubscriberEntities.find({
        _id: { $in: personnel.assignedSubscribers.map((id: any) => toObjectId(id)) },
        isActive: true,
      });

      if (!assignedSubscribers || assignedSubscribers.length === 0) {
        return {
          success: true,
          message: 'No active subscribers assigned to this personnel',
          subscribers: [],
        };
      }

      // Check existing deliveries for this date to avoid duplicates
      const existingDeliveries = await this.find({
        personnelId: toObjectId(personnelId),
        date: { $gte: startOfDay, $lte: endOfDay },
      });

      const existingSubscriberIds = new Set(
        existingDeliveries.map((delivery: any) => delivery.subscriberId.toString()),
      );

      // Count of existing deliveries
      const existingDeliveryCount = existingDeliveries.length;

      // If we've already reached max deliveries and not including existing, return early
      if (!options.includeExisting && existingDeliveryCount >= maxDeliveries) {
        return {
          success: false,
          message: `Maximum deliveries (${maxDeliveries}) already scheduled for this personnel on this date`,
          subscribers: [],
          existingDeliveries,
        };
      }

      // Array to store subscribers who need delivery today with additional details
      const subscribersNeedingDelivery = [];

      // Process each subscriber to determine eligibility for delivery
      for (const subscriber of assignedSubscribers) {
        // Skip if delivery already exists and we're not including existing
        if (!options.includeExisting && existingSubscriberIds.has(subscriber._id.toString())) {
          continue;
        }

        // Get existing delivery for this subscriber if it exists
        const existingDelivery: any = existingDeliveries.find(
          (d: any) => d.subscriberId.toString() === subscriber._id.toString(),
        );

        // If there's an existing delivery and we want to include it
        if (existingDelivery && options.includeExisting) {
          subscribersNeedingDelivery.push({
            ...subscriber.toObject(),
            deliveryExists: true,
            deliveryId: existingDelivery._id,
            scheduledTime: existingDelivery.scheduledTime || subscriber.preferredTimeSlot,
            containersToDeliver: existingDelivery.containersToDeliver || 0,
            containersToReturn: existingDelivery.containersToReturn || 0,
          });
          continue;
        }

        // Skip if we've already reached max deliveries for the day
        if (subscribersNeedingDelivery.length >= maxDeliveries) {
          break;
        }

        // Check if this subscriber needs delivery today
        let needsDelivery = false;
        let deliveryReason = '';
        let containersToDeliver = 0;
        let containersToReturn = 0;
        let nextDeliveryDate = null;

        // Case 1: Daily subscription
        if (subscriber.subscriptionType === 'daily') {
          needsDelivery = true;
          deliveryReason = 'Daily subscription';
          containersToDeliver = subscriber.containerCount > 0 ? 1 : 0;
        }

        // Case 2: Weekly subscription - check if today is a delivery day
        else if (
          subscriber.subscriptionType === 'weekly' &&
          subscriber.deliveryDays &&
          subscriber.deliveryDays.includes(dayOfWeek)
        ) {
          needsDelivery = true;
          deliveryReason = 'Weekly subscription (scheduled day)';
          containersToDeliver = subscriber.containerCount > 0 ? 1 : 0;
        }

        // Case 3: Custom frequency
        else if (subscriber.isCustomFrequency && subscriber.lastDeliveryDate) {
          const lastDelivery = new Date(subscriber.lastDeliveryDate);
          const interval = subscriber.customFrequencyInterval || 1;

          switch (subscriber.customFrequencyIntervalUnit) {
            case 'days':
              nextDeliveryDate = new Date(lastDelivery);
              nextDeliveryDate.setDate(lastDelivery.getDate() + interval);
              break;
            case 'weeks':
              nextDeliveryDate = new Date(lastDelivery);
              nextDeliveryDate.setDate(lastDelivery.getDate() + interval * 7);
              break;
            case 'months':
              nextDeliveryDate = new Date(lastDelivery);
              nextDeliveryDate.setMonth(lastDelivery.getMonth() + interval);
              break;
            default:
              nextDeliveryDate = new Date(lastDelivery);
              nextDeliveryDate.setDate(lastDelivery.getDate() + interval);
          }

          // Check if today is the next delivery date or past it
          if (date >= nextDeliveryDate) {
            needsDelivery = true;
            deliveryReason = `Custom schedule (every ${interval} ${subscriber.customFrequencyIntervalUnit})`;
            containersToDeliver = subscriber.containerCount > 0 ? 1 : 0;
          }
        }

        // Calculate containers to return (based on pending containers)
        if (subscriber.pendingContainers > 0) {
          containersToReturn = subscriber.pendingContainers;
        }

        // If this subscriber needs delivery, add to our array with enhanced details
        if (needsDelivery) {
          // Skip if we're filtering by time slot and this subscriber doesn't match
          if (options.timeSlot && subscriber.preferredTimeSlot !== options.timeSlot) {
            continue;
          }

          // Add subscriber with delivery details
          subscribersNeedingDelivery.push({
            ...subscriber.toObject(),
            deliveryExists: false,
            nextDeliveryDate,
            deliveryReason,
            scheduledTime: subscriber.preferredTimeSlot || 'Any time',
            containersToDeliver,
            containersToReturn,
            hasDeliveryInstructions: !!subscriber.deliveryInstructions,
            hasActiveSubscriptions:
              subscriber.activeSubscriptions && subscriber.activeSubscriptions.length > 0,
          });
        }
      }

      // Sort subscribers if requested
      if (options.sortBy) {
        subscribersNeedingDelivery.sort((a, b) => {
          switch (options.sortBy) {
            case 'preferredTimeSlot':
              return (a.preferredTimeSlot || '').localeCompare(b.preferredTimeSlot || '');
            case 'zone':
              return (a.zone || '').localeCompare(b.zone || '');
            case 'address':
              return (a.address || '').localeCompare(b.address || '');
            default:
              return 0;
          }
        });
      }

      return {
        success: true,
        message: `Found ${subscribersNeedingDelivery.length} subscribers needing delivery`,
        personnel: {
          id: personnel._id,
          name: personnel.name,
          maxDeliveriesPerDay: personnel.maxDeliveriesPerDay,
          availableTimeSlots: personnel.availableTimeSlots,
          zones: personnel.primaryZones || [],
        },
        date: {
          date: date,
          dayOfWeek,
          isToday: new Date().toDateString() === date.toDateString(),
        },
        subscribers: subscribersNeedingDelivery,
        existingDeliveryCount,
        remainingCapacity: Math.max(0, maxDeliveries - subscribersNeedingDelivery.length),
      };
    } catch (error) {
      console.error('Error in getDeliveryScheduleForPersonnel:', error);
      return {
        success: false,
        message: error.message || 'Failed to get delivery schedule',
        subscribers: [],
      };
    }
  }

  /**
   * Generates delivery entries for subscribers needing delivery on a specific date
   * @param personnelId - The ID of the delivery personnel
   * @param date - The date to create deliveries for
   * @param options - Additional options for delivery creation
   * @returns Created delivery records and summary
   */
  public async generateDeliveriesForPersonnel(
    personnelId: string,
    date: Date = new Date(),
    options: {
      adminId?: string;
      skipExisting?: boolean;
      timeSlot?: string;
      maxDeliveries?: number;
      notes?: string;
    } = {},
  ) {
    try {
      // Get subscribers who need delivery
      const scheduleResult: any = await this.getDeliveryScheduleForPersonnel(personnelId, date, {
        includeExisting: false,
        timeSlot: options.timeSlot,
        maxDeliveries: options.maxDeliveries,
      });

      if (!scheduleResult.success) {
        return scheduleResult;
      }

      const { subscribers } = scheduleResult;

      if (subscribers.length === 0) {
        return {
          success: true,
          message: 'No new deliveries needed for this date',
          created: 0,
          deliveries: [],
        };
      }

      // Prepare delivery documents
      const deliveriesToCreate: any = subscribers.map((subscriber: any) => {
        // Get active subscriptions if available
        let subscriptions = [];
        if (subscriber.activeSubscriptions && Array.isArray(subscriber.activeSubscriptions)) {
          subscriptions = subscriber.activeSubscriptions.map((sub: any) => ({
            subscriptionId: typeof sub === 'object' ? sub._id : sub,
            fulfilled: false,
          }));
        }

        return {
          subscriberId: toObjectId(subscriber._id),
          adminId: options.adminId ? toObjectId(options.adminId) : null,
          personnelId: toObjectId(personnelId),
          date: new Date(date),
          scheduledTime: subscriber.preferredTimeSlot || null,
          status: 'scheduled',
          zone: subscriber.zone,
          subscriptions,
          containersToDeliver: subscriber.containersToDeliver || 0,
          containersToReturn: subscriber.containersToReturn || 0,
          containersDelivered: 0,
          containersReturned: 0,
          notes: options.notes || '',
          deliveryInstructions: subscriber.deliveryInstructions || '',
          containerDetails: {
            delivered: [],
            returned: [],
          },
          address: subscriber.address,
          fullAddress: subscriber.fullAddress,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      // Create the deliveries
      const result: any = await this.bulkCreateDeliveries(deliveriesToCreate);

      // Update lastDeliveryDate for these subscribers
      const subscriberIds: any = subscribers.map((s: any) => s._id);
      await SubscriberEntities.updateMany(
        { _id: { $in: subscriberIds.map((id: any) => toObjectId(id)) } },
        { $set: { lastDeliveryDate: new Date(date), updatedAt: new Date() } },
      );

      // Get the created deliveries
      const createdDeliveryIds: any = Object.values(result.insertedIds).map(id => id);
      const createdDeliveries = await this.find({
        _id: { $in: createdDeliveryIds },
      });

      return {
        success: true,
        message: `Created ${deliveriesToCreate.length} deliveries for ${scheduleResult.personnel.name}`,
        created: deliveriesToCreate.length,
        deliveries: createdDeliveries,
        date: scheduleResult.date,
      };
    } catch (error) {
      console.error('Error in generateDeliveriesForPersonnel:', error);
      return {
        success: false,
        message: error.message || 'Failed to generate deliveries',
        created: 0,
        deliveries: [],
      };
    }
  }

  /**
   * Gets deliveries grouped by time slot for a personnel on a specific date
   * @param personnelId - The ID of the delivery personnel
   * @param date - The date to check
   * @returns Deliveries grouped by time slot
   */
  public async getDeliveriesByTimeSlot(personnelId: string, date: Date = new Date()) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Get all deliveries for this personnel on this date
      const deliveries: any = await this.find({
        personnelId: toObjectId(personnelId),
        date: { $gte: startOfDay, $lte: endOfDay },
      });

      // Group by time slot
      const timeSlots = {
        morning: [],
        afternoon: [],
        evening: [],
        custom: [],
      };

      for (const delivery of deliveries) {
        // Get subscriber details
        const subscriber: any = await SubscriberEntities.findOne({
          _id: delivery.subscriberId,
        });

        const enhancedDelivery: any = {
          ...delivery.toObject(),
          subscriberName: subscriber ? subscriber.name : 'Unknown',
          subscriberPhone: subscriber ? subscriber.mobile : 'Unknown',
          address: subscriber ? subscriber.address : delivery.address,
          zone: subscriber ? subscriber.zone : delivery.zone,
        };

        // Add to appropriate time slot
        const timeSlot: any = delivery.scheduledTime ? delivery.scheduledTime.toLowerCase() : '';

        if (timeSlot.includes('morning')) {
          (timeSlots.morning as any[]).push(enhancedDelivery);
        } else if (timeSlot.includes('afternoon')) {
          (timeSlots.afternoon as any[]).push(enhancedDelivery);
        } else if (timeSlot.includes('evening')) {
          (timeSlots.evening as any[]).push(enhancedDelivery);
        } else {
          (timeSlots.custom as any[]).push(enhancedDelivery);
        }
      }

      return {
        success: true,
        date: {
          date: date,
          dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
          formatted: format(date, 'yyyy-MM-dd'),
        },
        timeSlots,
        totalDeliveries: deliveries.length,
        morningCount: timeSlots.morning.length,
        afternoonCount: timeSlots.afternoon.length,
        eveningCount: timeSlots.evening.length,
        customCount: timeSlots.custom.length,
      };
    } catch (error) {
      console.error('Error in getDeliveriesByTimeSlot:', error);
      return {
        success: false,
        message: error.message || 'Failed to get deliveries by time slot',
        timeSlots: { morning: [], afternoon: [], evening: [], custom: [] },
        totalDeliveries: 0,
      };
    }
  }

  /**
   * Gets statistics for a personnel's deliveries on a specific date
   * @param personnelId - The ID of the delivery personnel
   * @param date - The date to check
   * @returns Delivery statistics
   */
  public async getPersonnelDailyStats(personnelId: string, date: Date = new Date()) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Get all deliveries for this personnel on this date
      const deliveries = await this.find({
        personnelId: toObjectId(personnelId),
        date: { $gte: startOfDay, $lte: endOfDay },
      });

      // Get the personnel details
      const personnel: any = await this.model.db.collection('deliverypersonnel').findOne({
        _id: toObjectId(personnelId),
      });

      if (!personnel) {
        throw new Error(`Delivery personnel with ID ${personnelId} not found`);
      }

      // Calculate statistics
      const totalDeliveries = deliveries.length;
      const completedDeliveries = deliveries.filter((d: any) => d.status === 'completed').length;
      const pendingDeliveries = deliveries.filter((d: any) => d.status === 'scheduled').length;
      const cancelledDeliveries = deliveries.filter((d: any) => d.status === 'cancelled').length;

      // Calculate container statistics
      let containersDelivered = 0;
      let containersReturned = 0;
      let containersToDeliver = 0;
      let containersToReturn = 0;

      deliveries.forEach((delivery: any) => {
        containersDelivered += delivery.containersDelivered || 0;
        containersReturned += delivery.containersReturned || 0;
        containersToDeliver += delivery.containersToDeliver || 0;
        containersToReturn += delivery.containersToReturn || 0;
      });

      // Calculate time-based metrics
      const timeSlotCounts = {
        morning: deliveries.filter((d: any) =>
          (d.scheduledTime || '').toLowerCase().includes('morning'),
        ).length,
        afternoon: deliveries.filter((d: any) =>
          (d.scheduledTime || '').toLowerCase().includes('afternoon'),
        ).length,
        evening: deliveries.filter((d: any) =>
          (d.scheduledTime || '').toLowerCase().includes('evening'),
        ).length,
        other: deliveries.filter(
          (d: any) => !(d.scheduledTime || '').toLowerCase().match(/(morning|afternoon|evening)/),
        ).length,
      };

      return {
        success: true,
        date: {
          date: date,
          dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
          formatted: format(date, 'yyyy-MM-dd'),
        },
        personnel: {
          id: personnel._id,
          name: personnel.name,
          maxDeliveriesPerDay: personnel.maxDeliveriesPerDay || 0,
        },
        deliveryStats: {
          totalDeliveries,
          completedDeliveries,
          pendingDeliveries,
          cancelledDeliveries,
          completionRate: totalDeliveries > 0 ? (completedDeliveries / totalDeliveries) * 100 : 0,
        },
        containerStats: {
          containersDelivered,
          containersReturned,
          containersToDeliver,
          containersToReturn,
          deliveryCompletionRate:
            containersToDeliver > 0 ? (containersDelivered / containersToDeliver) * 100 : 0,
          returnCompletionRate:
            containersToReturn > 0 ? (containersReturned / containersToReturn) * 100 : 0,
        },
        timeSlotBreakdown: timeSlotCounts,
      };
    } catch (error) {
      console.error('Error in getPersonnelDailyStats:', error);
      return {
        success: false,
        message: error.message || 'Failed to get personnel daily stats',
      };
    }
  }
}

export const DeliveryEntities = new DeliveryEntity(DeliveryModel);
