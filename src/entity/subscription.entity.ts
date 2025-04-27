import { Model } from 'mongoose';
import SubscriptionModel from '@models/subscription.model';
import { toObjectId } from '@utils';
import BaseEntity from './base.entity';

class SubscriptionEntity extends BaseEntity {
  constructor(model: Model<any>) {
    super(model);
  }

  // *** Basic CRUD operations ***

  // public async createSubscription(data: any) {
  //   // Calculate next billing date based on start date and billing cycle
  //   if (data.startDate && data.billingCycle && !data.nextBillingDate) {
  //     const startDate = new Date(data.startDate);
  //     const nextBillingDate = new Date(startDate);

  //     switch (data.billingCycle) {
  //       case 'daily':
  //         nextBillingDate.setDate(nextBillingDate.getDate() + 1);
  //         break;
  //       case 'weekly':
  //         nextBillingDate.setDate(nextBillingDate.getDate() + 7);
  //         break;
  //       case 'monthly':
  //         nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  //         break;
  //     }

  //     data.nextBillingDate = nextBillingDate;
  //   }

  //   return this.create(data);
  // }

  // public async getSubscriptionById(subscriptionId: string) {
  //   return this.findOne({ _id: toObjectId(subscriptionId) });
  // }

  // public async getSubscriptionDetails(subscriptionId: string) {
  //   return this.findOne({ _id: toObjectId(subscriptionId) }, {}, {}, true, {
  //     path: 'itemId subscriberId adminId',
  //     select: 'name email phone address containerType price description',
  //   });
  // }

  // public async updateSubscription(subscriptionId: string, data: any) {
  //   return this.findOneAndUpdate({ _id: toObjectId(subscriptionId) }, data, { new: true });
  // }

  // public async removeSubscription(subscriptionId: string) {
  //   return this.deleteOne({ _id: toObjectId(subscriptionId) });
  // }

  // // *** Query operations ***

  // public async getSubscriptionsBySubscriberId(subscriberId: string) {
  //   return this.find({ subscriberId: toObjectId(subscriberId) }, {}, { sort: { createdAt: -1 } });
  // }

  // public async getActiveSubscriptionsBySubscriberId(subscriberId: string) {
  //   return this.find(
  //     {
  //       subscriberId: toObjectId(subscriberId),
  //       status: 'active',
  //     },
  //     {},
  //     { sort: { createdAt: -1 } },
  //   );
  // }

  // public async getSubscriptionsByAdminId(adminId: string, status?: string) {
  //   const query: any = { adminId: toObjectId(adminId) };

  //   if (status) {
  //     query.status = status;
  //   }

  //   return this.find(query);
  // }

  public async getSubscriptionsByItemId(itemId: string) {
    return this.find({ itemId: toObjectId(itemId) });
  }

  public async getSubscriptionsByStatus(status: string) {
    return this.find({ status });
  }

  public async getSubscriptionsByDeliveryDay(day: string) {
    return this.find({
      deliveryDays: day,
      status: 'active',
    });
  }

  // public async searchSubscriptions(query: string, filters: any = {}, adminId?: string) {
  //   // Build search query
  //   const searchCondition: any = {};

  //   // Add text search if provided
  //   if (query) {
  //     searchCondition.$or = [{ name: new RegExp(query, 'i') }];
  //   }

  //   // Add admin filter
  //   if (adminId) {
  //     searchCondition.adminId = toObjectId(adminId);
  //   }

  //   // Add status filter
  //   if (filters.status) {
  //     searchCondition.status = filters.status;
  //   }

  //   // Add date range filter
  //   if (filters.startDateFrom || filters.startDateTo) {
  //     searchCondition.startDate = {};

  //     if (filters.startDateFrom) {
  //       searchCondition.startDate.$gte = new Date(filters.startDateFrom);
  //     }

  //     if (filters.startDateTo) {
  //       searchCondition.startDate.$lte = new Date(filters.startDateTo);
  //     }
  //   }

  //   // Add frequency filter
  //   if (filters.frequency) {
  //     searchCondition.frequency = filters.frequency;
  //   }

  //   // Add delivery day filter
  //   if (filters.deliveryDay) {
  //     searchCondition.deliveryDays = filters.deliveryDay;
  //   }

  //   return this.find(searchCondition);
  // }

  public async countSubscriptionsByAdmin(adminId: string) {
    return this.model.countDocuments({
      adminId: toObjectId(adminId),
    });
  }

  public async countActiveSubscriptionsByAdmin(adminId: string) {
    return this.model.countDocuments({
      adminId: toObjectId(adminId),
      status: 'active',
    });
  }

  // *** Status management ***

  // public async updateStatus(subscriptionId: string, status: string) {
  //   const now = new Date();
  //   return this.findOneAndUpdate({ _id: toObjectId(subscriptionId) }, { status, updatedAt: now });
  // }

  public async activateSubscription(subscriptionId: string) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        status: 'active',
        updatedAt: new Date(),
      },
    );
  }

  public async pauseSubscription(
    subscriptionId: string,
    startDate: Date = new Date(),
    reason: string = '',
  ) {
    const pauseEntry = {
      startDate,
      reason,
    };

    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        status: 'paused',
        $push: { pauseHistory: pauseEntry },
        updatedAt: new Date(),
      },
    );
  }

  public async resumeSubscription(subscriptionId: string) {
    // First get the subscription to update the latest pause history entry
    const subscription: any = await this.findOne(
      { _id: toObjectId(subscriptionId) },
      { pauseHistory: 1 },
    );

    if (!subscription?.pauseHistory?.length) {
      return this.updateStatus(subscriptionId, 'active');
    }

    // Update the end date of the most recent pause entry
    const now = new Date();

    // Clone the pause history
    const updatedPauseHistory = [...subscription.pauseHistory];
    // Update the latest entry
    const latestIndex = updatedPauseHistory.length - 1;
    updatedPauseHistory[latestIndex].endDate = now;

    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        status: 'active',
        pauseHistory: updatedPauseHistory,
        updatedAt: now,
      },
    );
  }

  public async cancelSubscription(subscriptionId: string) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        status: 'cancelled',
        updatedAt: new Date(),
      },
    );
  }

  public async completeSubscription(subscriptionId: string) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        status: 'completed',
        updatedAt: new Date(),
      },
    );
  }

  public async getPauseHistory(subscriptionId: string) {
    const subscription: any = await this.findOne(
      { _id: toObjectId(subscriptionId) },
      { pauseHistory: 1 },
    );

    return subscription?.pauseHistory || [];
  }

  // *** Schedule management ***

  public async updateDeliveryDays(subscriptionId: string, days: string[]) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        deliveryDays: days,
        updatedAt: new Date(),
      },
    );
  }

  public async updateTimeSlot(subscriptionId: string, from: string, to: string) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        deliveryTimeSlot: { from, to },
        updatedAt: new Date(),
      },
    );
  }

  public async updateDateRange(subscriptionId: string, startDate?: Date, endDate?: Date) {
    const updateData: any = { updatedAt: new Date() };

    if (startDate) {
      updateData.startDate = startDate;
    }

    if (endDate) {
      updateData.endDate = endDate;
    }

    return this.findOneAndUpdate({ _id: toObjectId(subscriptionId) }, updateData);
  }

  public async extendSubscription(subscriptionId: string, days: number) {
    // First get the subscription
    const subscription: any = await this.findOne(
      { _id: toObjectId(subscriptionId) },
      { endDate: 1 },
    );

    if (!subscription) return null;

    // Calculate new end date
    let newEndDate: Date;
    if (subscription.endDate) {
      newEndDate = new Date(subscription.endDate);
    } else {
      newEndDate = new Date();
    }

    newEndDate.setDate(newEndDate.getDate() + days);

    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        endDate: newEndDate,
        updatedAt: new Date(),
      },
    );
  }

  // *** Billing operations ***

  public async updatePrice(subscriptionId: string, pricePerUnit: number) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        pricePerUnit,
        updatedAt: new Date(),
      },
    );
  }

  public async updateBillingCycle(subscriptionId: string, billingCycle: string) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        billingCycle,
        updatedAt: new Date(),
      },
    );
  }

  public async updateNextBillingDate(subscriptionId: string, date: Date) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        nextBillingDate: date,
        updatedAt: new Date(),
      },
    );
  }

  // public async recordPayment(
  //   subscriptionId: string,
  //   amount: number,
  //   status: string = 'completed',
  //   transactionId?: string,
  // ) {
  //   const paymentEntry = {
  //     amount,
  //     date: new Date(),
  //     status,
  //     transactionId,
  //   };

  //   return this.findOneAndUpdate(
  //     { _id: toObjectId(subscriptionId) },
  //     {
  //       $push: { paymentHistory: paymentEntry },
  //       updatedAt: new Date(),
  //     },
  //   );
  // }

  public async getPaymentHistory(subscriptionId: string) {
    const subscription: any = await this.findOne(
      { _id: toObjectId(subscriptionId) },
      { paymentHistory: 1 },
    );

    return subscription?.paymentHistory || [];
  }

  public async calculateNextBillingDate(subscriptionId: string) {
    const subscription: any = await this.findOne(
      { _id: toObjectId(subscriptionId) },
      { billingCycle: 1, nextBillingDate: 1 },
    );

    if (!subscription) return null;

    const nextBillingDate = new Date(subscription.nextBillingDate || new Date());

    switch (subscription.billingCycle) {
      case 'daily':
        nextBillingDate.setDate(nextBillingDate.getDate() + 1);
        break;
      case 'weekly':
        nextBillingDate.setDate(nextBillingDate.getDate() + 7);
        break;
      case 'monthly':
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        break;
    }

    // Update the subscription
    await this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        nextBillingDate,
        updatedAt: new Date(),
      },
    );

    return nextBillingDate;
  }

  public async getSubscriptionsDueForBilling(date: Date = new Date()) {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.find({
      nextBillingDate: { $lte: endOfDay },
      status: 'active',
    });
  }

  // *** Container management ***

  public async assignContainer(subscriptionId: string, containerId: string) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        $addToSet: { assignedContainers: toObjectId(containerId) },
        updatedAt: new Date(),
      },
    );
  }

  public async removeContainer(subscriptionId: string, containerId: string) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        $pull: { assignedContainers: toObjectId(containerId) },
        updatedAt: new Date(),
      },
    );
  }

  public async getAssignedContainers(subscriptionId: string) {
    const subscription: any = await this.findOne(
      { _id: toObjectId(subscriptionId) },
      { assignedContainers: 1 },
    );

    return subscription?.assignedContainers || [];
  }

  public async updatePendingContainerReturns(subscriptionId: string, count: number) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        pendingContainerReturns: count,
        updatedAt: new Date(),
      },
    );
  }

  public async incrementPendingContainerReturns(subscriptionId: string, amount: number = 1) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        $inc: { pendingContainerReturns: amount },
        updatedAt: new Date(),
      },
    );
  }

  public async decrementPendingContainerReturns(subscriptionId: string, amount: number = 1) {
    // First check current count to avoid negative values
    const subscription: any = await this.findOne(
      { _id: toObjectId(subscriptionId) },
      { pendingContainerReturns: 1 },
    );

    if (!subscription) return null;

    const currentPending = subscription.pendingContainerReturns || 0;
    const newPending = Math.max(0, currentPending - amount);

    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        pendingContainerReturns: newPending,
        updatedAt: new Date(),
      },
    );
  }

  public async updateDepositPaid(subscriptionId: string, amount: number) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        depositPaid: amount,
        updatedAt: new Date(),
      },
    );
  }

  // *** Special instructions ***

  public async updateDeliveryInstructions(subscriptionId: string, instructions: string) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        deliveryInstructions: instructions,
        updatedAt: new Date(),
      },
    );
  }

  // *** Bulk operations ***

  public async bulkUpdateStatus(subscriptionIds: string[], status: string) {
    const objectIds = subscriptionIds.map(id => toObjectId(id));

    return this.updateMany(
      { _id: { $in: objectIds } },
      {
        status,
        updatedAt: new Date(),
      },
    );
  }

  public async bulkProcessBilling(subscriptionIds: string[]) {
    const objectIds = subscriptionIds.map(id => toObjectId(id));
    const now = new Date();

    // First get all subscriptions to process
    const subscriptions: any = await this.find({ _id: { $in: objectIds } });

    // Process each subscription
    const operations = subscriptions.map((subscription: any) => {
      // Calculate next billing date
      const nextBillingDate = new Date(subscription.nextBillingDate || now);

      switch (subscription.billingCycle) {
        case 'daily':
          nextBillingDate.setDate(nextBillingDate.getDate() + 1);
          break;
        case 'weekly':
          nextBillingDate.setDate(nextBillingDate.getDate() + 7);
          break;
        case 'monthly':
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
          break;
      }

      // Create payment record
      const paymentAmount = subscription.pricePerUnit * subscription.quantity;
      const paymentEntry = {
        amount: paymentAmount,
        date: now,
        status: 'completed',
      };

      // Return update operation
      return {
        updateOne: {
          filter: { _id: subscription._id },
          update: {
            $set: {
              nextBillingDate,
              updatedAt: now,
            },
            $push: {
              paymentHistory: paymentEntry,
            },
          },
        },
      };
    });

    // Execute bulk operations if any
    if (operations.length > 0) {
      return this.model.bulkWrite(operations);
    }

    return { modifiedCount: 0 };
  }

  // *** Analytics and reporting ***

  public async getSubscriptionStatsByAdmin(adminId: string) {
    return this.model.aggregate([
      { $match: { adminId: toObjectId(adminId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$pricePerUnit', '$quantity'] } },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
          totalValue: 1,
        },
      },
    ]);
  }

  public async getSubscriptionStatsByItem(itemId: string) {
    return this.model.aggregate([
      { $match: { itemId: toObjectId(itemId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
          totalQuantity: 1,
        },
      },
    ]);
  }

  public async getSubscriptionGrowth(adminId: string, months: number = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    return this.model.aggregate([
      {
        $match: {
          adminId: toObjectId(adminId),
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
          activeCount: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
          activeCount: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);
  }

  public async getRevenueByFrequency(adminId: string) {
    return this.model.aggregate([
      {
        $match: {
          adminId: toObjectId(adminId),
          status: 'active',
        },
      },
      {
        $group: {
          _id: '$frequency',
          count: { $sum: 1 },
          revenue: { $sum: { $multiply: ['$pricePerUnit', '$quantity'] } },
        },
      },
      {
        $project: {
          _id: 0,
          frequency: '$_id',
          count: 1,
          revenue: 1,
        },
      },
      { $sort: { revenue: -1 } },
    ]);
  }

  public async getTopSubscribers(adminId: string, limit: number = 5) {
    return this.model.aggregate([
      {
        $match: {
          adminId: toObjectId(adminId),
          status: 'active',
        },
      },
      {
        $group: {
          _id: '$subscriberId',
          subscriptionCount: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$pricePerUnit', '$quantity'] } },
        },
      },
      { $sort: { totalValue: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'subscribers',
          localField: '_id',
          foreignField: '_id',
          as: 'subscriber',
        },
      },
      { $unwind: { path: '$subscriber', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          subscriberId: '$_id',
          name: '$subscriber.name',
          email: '$subscriber.email',
          phone: '$subscriber.phone',
          subscriptionCount: 1,
          totalValue: 1,
        },
      },
    ]);
  }

  public async getSubscriptionCountByDay(adminId: string) {
    return this.model.aggregate([
      {
        $match: {
          adminId: toObjectId(adminId),
          status: 'active',
        },
      },
      { $unwind: '$deliveryDays' },
      {
        $group: {
          _id: '$deliveryDays',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $project: {
          _id: 0,
          day: '$_id',
          count: 1,
          totalQuantity: 1,
        },
      },
      { $sort: { day: 1 } },
    ]);
  }

  public async getContainerDepositSummary(adminId: string) {
    return this.model.aggregate([
      {
        $match: {
          adminId: toObjectId(adminId),
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalDeposit: { $sum: '$depositPaid' },
          pendingContainers: { $sum: '$pendingContainerReturns' },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
          totalDeposit: 1,
          pendingContainers: 1,
        },
      },
    ]);
  }

  public async createSubscription(data: any) {
    // Handle specific subscription types
    if (data.subscriptionType === 'digital') {
      // Set default platform if not provided
      if (!data.platform) {
        data.platform = 'web';
      }

      // Calculate renewal date from frequency if not provided
      if (!data.renewalDate && data.startDate && data.frequency) {
        data.renewalDate = this.calculateNextDate(
          new Date(data.startDate),
          data.frequency,
          data.customFrequency,
        );
      }
    }

    // Calculate next billing date based on start date and billing cycle
    if (data.startDate && data.billingCycle && !data.nextBillingDate) {
      data.nextBillingDate = this.calculateNextDate(new Date(data.startDate), data.billingCycle);
    }

    // Ensure pricing structure is consistent
    if (data.pricePerUnit && !data.pricing) {
      data.pricing = {
        amount: data.pricePerUnit,
        currency: data.currency || 'USD',
        isPerUnit: true,
      };
    }

    return this.create(data);
  }

  /**
   * Helper method to calculate next date based on frequency
   */
  private calculateNextDate(baseDate: Date, frequency: string, customFrequency?: any): Date {
    const nextDate = new Date(baseDate);

    if (customFrequency && customFrequency.interval && customFrequency.intervalUnit) {
      const { interval, intervalUnit } = customFrequency;

      switch (intervalUnit) {
        case 'days':
          nextDate.setDate(nextDate.getDate() + interval);
          break;
        case 'weeks':
          nextDate.setDate(nextDate.getDate() + interval * 7);
          break;
        case 'months':
          nextDate.setMonth(nextDate.getMonth() + interval);
          break;
      }

      return nextDate;
    }

    switch (frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'alternate-days':
        nextDate.setDate(nextDate.getDate() + 2);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
    }

    return nextDate;
  }

  public async getSubscriptionById(subscriptionId: string) {
    return this.findOne({ _id: toObjectId(subscriptionId) });
  }

  /**
   * Get subscription details with populated references
   */
  public async getSubscriptionDetails(subscriptionId: string) {
    return this.findOne({ _id: toObjectId(subscriptionId) }, {}, {}, true, {
      path: 'itemId subscriberId adminId sharedWith',
      select: 'name email phone address containerType price description avatar',
    });
  }

  public async updateSubscription(subscriptionId: string, data: any) {
    // Handle pricing field updates
    if (data.pricePerUnit && !data.pricing) {
      const subscription: any = await this.findOne({ _id: toObjectId(subscriptionId) });

      if (subscription) {
        data.pricing = {
          amount: data.pricePerUnit,
          currency: data.currency || subscription.pricing?.currency || 'USD',
          isPerUnit: true,
        };
      }
    }

    return this.findOneAndUpdate({ _id: toObjectId(subscriptionId) }, data, { new: true });
  }

  public async removeSubscription(subscriptionId: string) {
    return this.deleteOne({ _id: toObjectId(subscriptionId) });
  }

  // *** Enhanced Query operations ***

  /**
   * Get all subscriptions for a subscriber (both admin-managed and user-created)
   */
  public async getSubscriptionsBySubscriberId(
    subscriberId: string,
    filter?: { type?: string; category?: string },
  ) {
    const query: any = { subscriberId: toObjectId(subscriberId) };

    if (filter?.type) {
      query.subscriptionType = filter.type;
    }

    if (filter?.category) {
      query.category = filter.category;
    }

    return this.find(query, {}, { sort: { createdAt: -1 } });
  }

  /**
   * Get active subscriptions for a subscriber with optional filtering
   */
  public async getActiveSubscriptionsBySubscriberId(
    subscriberId: string,
    filter?: { type?: string; category?: string },
  ) {
    const query: any = {
      subscriberId: toObjectId(subscriberId),
      status: 'active',
    };

    if (filter?.type) {
      query.subscriptionType = filter.type;
    }

    if (filter?.category) {
      query.category = filter.category;
    }

    return this.find(query, {}, { sort: { createdAt: -1 } });
  }

  /**
   * Get subscriptions managed by an admin with flexible filtering
   */
  public async getSubscriptionsByAdminId(
    adminId: string,
    filter?: {
      status?: string;
      type?: string;
      category?: string;
    },
  ) {
    const query: any = { adminId: toObjectId(adminId) };

    if (filter?.status) {
      query.status = filter.status;
    }

    if (filter?.type) {
      query.subscriptionType = filter.type;
    }

    if (filter?.category) {
      query.category = filter.category;
    }

    return this.find(query);
  }

  /**
   * Get subscribers with digital subscriptions by platform
   */
  public async getSubscriptionsByPlatform(platform: string) {
    return this.find({
      subscriptionType: 'digital',
      platform,
    });
  }

  /**
   * Get subscriptions approaching renewal
   */
  public async getUpcomingRenewals(days: number = 7) {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);

    return this.find({
      status: 'active',
      $or: [
        { renewalDate: { $gte: today, $lte: futureDate } },
        { nextBillingDate: { $gte: today, $lte: futureDate } },
      ],
    });
  }

  /**
   * Enhanced search with additional filter options for digital subscriptions
   */
  public async searchSubscriptions(
    query: string,
    filters: any = {},
    adminId?: string,
    subscriberId?: string,
  ) {
    // Build search query
    const searchCondition: any = {};

    // Add text search if provided
    if (query) {
      searchCondition.$or = [
        { name: new RegExp(query, 'i') },
        { platform: new RegExp(query, 'i') },
        { planName: new RegExp(query, 'i') },
      ];
    }

    // Add admin filter
    if (adminId) {
      searchCondition.adminId = toObjectId(adminId);
    }

    // Add subscriber filter
    if (subscriberId) {
      searchCondition.subscriberId = toObjectId(subscriberId);
    }

    // Add subscription type filter
    if (filters.subscriptionType) {
      searchCondition.subscriptionType = filters.subscriptionType;
    }

    // Add status filter
    if (filters.status) {
      searchCondition.status = filters.status;
    }

    // Add category filter
    if (filters.category) {
      searchCondition.category = filters.category;
    }

    // Add platform filter (for digital subscriptions)
    if (filters.platform) {
      searchCondition.platform = filters.platform;
    }

    // Add date range filter
    if (filters.startDateFrom || filters.startDateTo) {
      searchCondition.startDate = {};

      if (filters.startDateFrom) {
        searchCondition.startDate.$gte = new Date(filters.startDateFrom);
      }

      if (filters.startDateTo) {
        searchCondition.startDate.$lte = new Date(filters.startDateTo);
      }
    }

    // Add frequency filter
    if (filters.frequency) {
      searchCondition.frequency = filters.frequency;
    }

    // Add delivery day filter
    if (filters.deliveryDay) {
      searchCondition.deliveryDays = filters.deliveryDay;
    }

    return this.find(searchCondition);
  }

  // *** Enhanced status management ***

  /**
   * Update the status of a subscription
   */
  public async updateStatus(subscriptionId: string, status: string) {
    const now = new Date();
    return this.findOneAndUpdate({ _id: toObjectId(subscriptionId) }, { status, updatedAt: now });
  }

  /**
   * Cancel a subscription with reason and refund details
   */
  public async cancelSubscriptionWithDetails(
    subscriptionId: string,
    cancelDetails: {
      reason?: string;
      refundAmount?: number;
      refundStatus?: string;
      feedback?: string;
    } = {},
  ) {
    const now = new Date();

    const cancellation = {
      date: now,
      ...cancelDetails,
    };

    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        status: 'cancelled',
        cancalleation: cancellation,
        updatedAt: now,
      },
    );
  }

  // *** Trial management ***

  /**
   * Start a trial subscription
   */
  public async startTrialSubscription(subscriptionId: string, trialDays: number = 14) {
    const now = new Date();
    const trialEndDate = new Date(now);
    trialEndDate.setDate(now.getDate() + trialDays);

    const trialPeriod = {
      isTrial: true,
      trialStartDate: now,
      trialEndDate,
      convertedToPaid: false,
    };

    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        trialPeriod,
        status: 'active',
        updatedAt: now,
      },
    );
  }

  /**
   * Convert trial to paid subscription
   */
  public async convertTrialToPaid(subscriptionId: string, amount: number) {
    const now = new Date();

    // Get the current subscription to update trial data
    const subscription: any = await this.findOne(
      { _id: toObjectId(subscriptionId) },
      { trialPeriod: 1 },
    );

    if (!subscription?.trialPeriod) {
      return null;
    }

    // Update trial period data
    const trialPeriod = {
      ...subscription.trialPeriod,
      convertedToPaid: true,
      convertedDate: now,
      convertedAmount: amount,
    };

    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        trialPeriod,
        updatedAt: now,
      },
    );
  }

  // *** Digital subscription specific methods ***

  /**
   * Update digital subscription details
   */
  public async updateDigitalSubscriptionDetails(
    subscriptionId: string,
    details: {
      platform?: string;
      accessLink?: string;
      planName?: string;
      accountEmail?: string;
      userName?: string;
      renewalDate?: Date;
      expiryDate?: Date;
    },
  ) {
    return this.findOneAndUpdate(
      {
        _id: toObjectId(subscriptionId),
        subscriptionType: 'digital',
      },
      {
        ...details,
        updatedAt: new Date(),
      },
    );
  }

  /**
   * Add shared user to a digital subscription
   */
  public async addSharedUser(subscriptionId: string, userId: string) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        $addToSet: { sharedWith: toObjectId(userId) },
        updatedAt: new Date(),
      },
    );
  }

  /**
   * Remove shared user from a digital subscription
   */
  public async removeSharedUser(subscriptionId: string, userId: string) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        $pull: { sharedWith: toObjectId(userId) },
        updatedAt: new Date(),
      },
    );
  }

  /**
   * Get subscriptions shared with a user
   */
  public async getSubscriptionsSharedWithUser(userId: string) {
    return this.find({ sharedWith: toObjectId(userId) });
  }

  // *** Enhanced billing operations ***

  /**
   * Update pricing details
   */
  public async updatePricing(
    subscriptionId: string,
    pricing: {
      amount: number;
      currency?: string;
      isPerUnit?: boolean;
    },
  ) {
    // Get existing subscription to maintain any missing fields
    const subscription: any = await this.findOne(
      { _id: toObjectId(subscriptionId) },
      { pricing: 1 },
    );

    const updatedPricing = {
      ...subscription?.pricing,
      ...pricing,
    };

    // Also update pricePerUnit for backward compatibility
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        pricing: updatedPricing,
        pricePerUnit: pricing.amount,
        updatedAt: new Date(),
      },
    );
  }

  /**
   * Record a payment with enhanced details
   */
  public async recordPayment(
    subscriptionId: string,
    paymentDetails: {
      amount: number;
      status?: string;
      transactionId?: string;
      date?: Date;
    },
  ) {
    const paymentEntry = {
      amount: paymentDetails.amount,
      date: paymentDetails.date || new Date(),
      status: paymentDetails.status || 'completed',
      transactionId: paymentDetails.transactionId,
    };

    return this.findOneAndUpdate(
      { _id: toObjectId(subscriptionId) },
      {
        $push: { paymentHistory: paymentEntry },
        updatedAt: new Date(),
      },
    );
  }

  /**
   * Get upcoming payments
   */
  public async getUpcomingPayments(days: number = 30) {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);

    return this.find({
      status: 'active',
      nextBillingDate: { $gte: today, $lte: futureDate },
    });
  }

  // *** Enhanced analytics and reporting ***

  /**
   * Get subscription analytics by subscriber
   */
  public async getSubscriberSubscriptionAnalytics(subscriberId: string) {
    return this.model.aggregate([
      { $match: { subscriberId: toObjectId(subscriberId) } },
      {
        $group: {
          _id: {
            subscriptionType: '$subscriptionType',
            category: '$category',
          },
          count: { $sum: 1 },
          totalValue: {
            $sum: {
              $cond: [
                { $eq: ['$pricing.isPerUnit', true] },
                { $multiply: ['$pricing.amount', '$quantity'] },
                '$pricing.amount',
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          subscriptionType: '$_id.subscriptionType',
          category: '$_id.category',
          count: 1,
          totalValue: 1,
        },
      },
    ]);
  }

  /**
   * Get subscription analytics by category
   */
  public async getSubscriptionsByCategory(adminId?: string, subscriberId?: string) {
    const match: any = {};

    if (adminId) {
      match.adminId = toObjectId(adminId);
    }

    if (subscriberId) {
      match.subscriberId = toObjectId(subscriberId);
    }

    return this.model.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          totalValue: {
            $sum: {
              $cond: [
                { $eq: ['$pricing.isPerUnit', true] },
                { $multiply: ['$pricing.amount', '$quantity'] },
                '$pricing.amount',
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
          active: 1,
          totalValue: 1,
        },
      },
      { $sort: { totalValue: -1 } },
    ]);
  }

  /**
   * Get monthly subscription costs for budget analysis
   */
  public async getMonthlySubscriptionCosts(subscriberId: string) {
    return this.model.aggregate([
      {
        $match: {
          subscriberId: toObjectId(subscriberId),
          status: 'active',
        },
      },
      {
        $project: {
          name: 1,
          category: 1,
          monthlyAmount: {
            $cond: [
              { $eq: ['$billingCycle', 'monthly'] },
              // If monthly, use direct amount
              {
                $cond: [
                  { $eq: ['$pricing.isPerUnit', true] },
                  { $multiply: ['$pricing.amount', '$quantity'] },
                  '$pricing.amount',
                ],
              },
              // If not monthly, calculate equivalent
              {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ['$billingCycle', 'daily'] },
                      then: {
                        $multiply: [
                          30,
                          {
                            $cond: [
                              { $eq: ['$pricing.isPerUnit', true] },
                              { $multiply: ['$pricing.amount', '$quantity'] },
                              '$pricing.amount',
                            ],
                          },
                        ],
                      },
                    },
                    {
                      case: { $eq: ['$billingCycle', 'weekly'] },
                      then: {
                        $multiply: [
                          4.35,
                          {
                            $cond: [
                              { $eq: ['$pricing.isPerUnit', true] },
                              { $multiply: ['$pricing.amount', '$quantity'] },
                              '$pricing.amount',
                            ],
                          },
                        ],
                      },
                    },
                  ],
                  default: {
                    $cond: [
                      { $eq: ['$pricing.isPerUnit', true] },
                      { $multiply: ['$pricing.amount', '$quantity'] },
                      '$pricing.amount',
                    ],
                  },
                },
              },
            ],
          },
        },
      },
      { $sort: { monthlyAmount: -1 } },
    ]);
  }

  // Link subscription to subscriber
  public async linkSubscriptionToSubscriber(subscriberId: string, subscriptionId: string) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriberId) },
      { $push: { subscriptions: toObjectId(subscriptionId) } },
    );
  }

  // Unlink subscription from subscriber
  public async unlinkSubscriptionFromSubscriber(subscriberId: string, subscriptionId: string) {
    return this.findOneAndUpdate(
      { _id: toObjectId(subscriberId) },
      { $pull: { subscriptions: toObjectId(subscriptionId) } },
    );
  }

  // getSubscriberSubscriptionDetails
  public async getSubscriberSubscriptionDetails(subscriberId: string) {
    return this.findOne(
      { _id: toObjectId(subscriberId) },
      {
        subscriptions: 1,
        status: 1,
        billingCycle: 1,
        pricing: 1,
        quantity: 1,
      },
    );
  }
}

export const SubscriptionEntities = new SubscriptionEntity(SubscriptionModel);
