import { NextFunction, Request, Response } from 'express';
import builder from '@builders';
import { SubscriptionEntities } from '@entity';
import { RESPONSE } from '@response';
import BaseController from './base.controller';
// import { toObjectId } from "@utils";

export default class SubscriptionController extends BaseController {
  constructor() {
    super();
  }

  // Aggregate subscriptions
  public async aggregateSubscriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const body = req.body;

      const pipline = builder.SUBSCRIPTION.buildSubscriptionQuery({
        ...body,
        adminId,
      });

      const options = {
        page: 1,
        limit: 10,
        getCount: true,
      };

      const result = await SubscriptionEntities.paginateAggregate(pipline, options);

      return this.sendResponse(res, result, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // *** CRUD Operations ***
  public async createSubscription(req: Request, res: Response) {
    try {
      const data = req.body;
      const subscription = await SubscriptionEntities.createSubscription(data);
      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').CREATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getSubscriptionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const subscription = await SubscriptionEntities.getSubscriptionById(id);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getSubscriptionDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const subscription = await SubscriptionEntities.getSubscriptionDetails(id);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async updateSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const subscription = await SubscriptionEntities.updateSubscription(id, data);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async deleteSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await SubscriptionEntities.removeSubscription(id);

      if (result?.success) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, { deleted: true }, RESPONSE.SUBSCRIPTION('').DELETE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // *** Query Operations ***

  public async getSubscriptionsBySubscriber(req: Request, res: Response) {
    try {
      const { subscriberId } = req.params;
      const subscriptions = await SubscriptionEntities.getSubscriptionsBySubscriberId(subscriberId);
      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getActiveSubscriptionsBySubscriber(req: Request, res: Response) {
    try {
      const { subscriberId } = req.params;
      const subscriptions =
        await SubscriptionEntities.getActiveSubscriptionsBySubscriberId(subscriberId);
      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getSubscriptionsByAdmin(req: Request, res: Response) {
    try {
      const { adminId } = req.params;
      const { status } = req.query;
      const subscriptions = await SubscriptionEntities.getSubscriptionsByAdminId(adminId, {
        status: status as string,
      });
      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getSubscriptionsByItem(req: Request, res: Response) {
    try {
      const { itemId } = req.params;
      const subscriptions = await SubscriptionEntities.getSubscriptionsByItemId(itemId);
      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getSubscriptionsByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const subscriptions = await SubscriptionEntities.getSubscriptionsByStatus(status);
      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getSubscriptionsByDeliveryDay(req: Request, res: Response) {
    try {
      const { day } = req.params;
      const subscriptions = await SubscriptionEntities.getSubscriptionsByDeliveryDay(day);
      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async searchSubscriptions(req: Request, res: Response) {
    try {
      const { query, adminId } = req.query;
      const filters = {
        status: req.query.status as string,
        startDateFrom: req.query.startDateFrom as string,
        startDateTo: req.query.startDateTo as string,
        frequency: req.query.frequency as string,
        deliveryDay: req.query.deliveryDay as string,
      };

      const subscriptions = await SubscriptionEntities.searchSubscriptions(
        query as string,
        filters,
        adminId as string,
      );

      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async countSubscriptionsByAdmin(req: Request, res: Response) {
    try {
      const { adminId } = req.params;
      const count = await SubscriptionEntities.countSubscriptionsByAdmin(adminId);
      return this.sendResponse(res, { count }, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async countActiveSubscriptionsByAdmin(req: Request, res: Response) {
    try {
      const { adminId } = req.params;
      const count = await SubscriptionEntities.countActiveSubscriptionsByAdmin(adminId);
      return this.sendResponse(res, { count }, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // *** Status Management ***

  public async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return this.badRequest(res, 'Status is required');
      }

      const subscription = await SubscriptionEntities.updateStatus(id, status);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async activateSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const subscription = await SubscriptionEntities.activateSubscription(id);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async pauseSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { startDate, reason } = req.body;

      const subscription = await SubscriptionEntities.pauseSubscription(
        id,
        startDate ? new Date(startDate) : undefined,
        reason,
      );

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async resumeSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const subscription = await SubscriptionEntities.resumeSubscription(id);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async cancelSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const subscription = await SubscriptionEntities.cancelSubscription(id);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async completeSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const subscription = await SubscriptionEntities.completeSubscription(id);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getPauseHistory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pauseHistory = await SubscriptionEntities.getPauseHistory(id);
      return this.sendResponse(res, pauseHistory, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // *** Schedule Management ***

  public async updateDeliveryDays(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { days } = req.body;

      if (!days || !Array.isArray(days)) {
        return this.badRequest(res, 'Days array is required');
      }

      const subscription = await SubscriptionEntities.updateDeliveryDays(id, days);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async updateTimeSlot(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { from, to } = req.body;

      if (!from || !to) {
        return this.badRequest(res, 'From and to times are required');
      }

      const subscription = await SubscriptionEntities.updateTimeSlot(id, from, to);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async updateDateRange(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.body;

      const subscription = await SubscriptionEntities.updateDateRange(
        id,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
      );

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async extendSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { days } = req.body;

      if (!days || typeof days !== 'number') {
        return this.badRequest(res, 'Valid days number is required');
      }

      const subscription = await SubscriptionEntities.extendSubscription(id, days);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // *** Billing Operations ***

  public async updatePrice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { pricePerUnit } = req.body;

      if (typeof pricePerUnit !== 'number' || pricePerUnit < 0) {
        return this.badRequest(res, 'Valid price is required');
      }

      const subscription = await SubscriptionEntities.updatePrice(id, pricePerUnit);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async updateBillingCycle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { billingCycle } = req.body;

      if (!billingCycle) {
        return this.badRequest(res, 'Billing cycle is required');
      }

      const subscription = await SubscriptionEntities.updateBillingCycle(id, billingCycle);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async updateNextBillingDate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { date } = req.body;

      if (!date) {
        return this.badRequest(res, 'Date is required');
      }

      const subscription = await SubscriptionEntities.updateNextBillingDate(id, new Date(date));

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async recordPayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { amount, status, transactionId } = req.body;

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return this.badRequest(res, 'Valid amount is required');
      }

      const subscription = await SubscriptionEntities.recordPayment(id, {
        amount,
        status: status || 'completed',
        transactionId,
      });

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getPaymentHistory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const paymentHistory = await SubscriptionEntities.getPaymentHistory(id);
      return this.sendResponse(res, paymentHistory, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async calculateNextBillingDate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const nextDate = await SubscriptionEntities.calculateNextBillingDate(id);

      if (!nextDate) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(
        res,
        { nextBillingDate: nextDate },
        RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS,
      );
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getSubscriptionsDueForBilling(req: Request, res: Response) {
    try {
      const { date } = req.query;
      const billingDate = date ? new Date(date as string) : new Date();

      const subscriptions = await SubscriptionEntities.getSubscriptionsDueForBilling(billingDate);
      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // *** Container Management ***

  public async assignContainer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { containerId } = req.body;

      if (!containerId) {
        return this.badRequest(res, 'Container ID is required');
      }

      const subscription = await SubscriptionEntities.assignContainer(id, containerId);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async removeContainer(req: Request, res: Response) {
    try {
      const { id, containerId } = req.params;

      const subscription = await SubscriptionEntities.removeContainer(id, containerId);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getAssignedContainers(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const containers = await SubscriptionEntities.getAssignedContainers(id);
      return this.sendResponse(res, containers, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async updatePendingContainerReturns(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { count } = req.body;

      if (typeof count !== 'number' || count < 0) {
        return this.badRequest(res, 'Valid count is required');
      }

      const subscription = await SubscriptionEntities.updatePendingContainerReturns(id, count);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async incrementPendingContainerReturns(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { amount = 1 } = req.body;

      const subscription = await SubscriptionEntities.incrementPendingContainerReturns(id, amount);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async decrementPendingContainerReturns(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { amount = 1 } = req.body;

      const subscription = await SubscriptionEntities.decrementPendingContainerReturns(id, amount);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async updateDepositPaid(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      if (typeof amount !== 'number') {
        return this.badRequest(res, 'Valid amount is required');
      }

      const subscription = await SubscriptionEntities.updateDepositPaid(id, amount);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // *** Special Instructions ***

  public async updateDeliveryInstructions(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { instructions } = req.body;

      if (typeof instructions !== 'string') {
        return this.badRequest(res, 'Instructions must be a string');
      }

      const subscription = await SubscriptionEntities.updateDeliveryInstructions(id, instructions);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, subscription, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // *** Bulk Operations ***

  public async bulkUpdateStatus(req: Request, res: Response) {
    try {
      const { subscriptionIds, status } = req.body;

      if (!subscriptionIds || !Array.isArray(subscriptionIds) || !status) {
        return this.badRequest(res, 'Subscription IDs array and status are required');
      }

      const result = await SubscriptionEntities.bulkUpdateStatus(subscriptionIds, status);
      return this.sendResponse(res, result, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async bulkProcessBilling(req: Request, res: Response) {
    try {
      const { subscriptionIds } = req.body;

      if (!subscriptionIds || !Array.isArray(subscriptionIds)) {
        return this.badRequest(res, 'Subscription IDs array is required');
      }

      const result = await SubscriptionEntities.bulkProcessBilling(subscriptionIds);
      return this.sendResponse(res, result, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // *** Analytics and Reporting ***

  public async getSubscriptionStatsByAdmin(req: Request, res: Response) {
    try {
      const { adminId } = req.params;
      const stats = await SubscriptionEntities.getSubscriptionStatsByAdmin(adminId);
      return this.sendResponse(res, stats, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getSubscriptionStatsByItem(req: Request, res: Response) {
    try {
      const { itemId } = req.params;
      const stats = await SubscriptionEntities.getSubscriptionStatsByItem(itemId);
      return this.sendResponse(res, stats, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getSubscriptionGrowth(req: Request, res: Response) {
    try {
      const { adminId } = req.params;
      const { months } = req.query;

      const growth = await SubscriptionEntities.getSubscriptionGrowth(
        adminId,
        months ? parseInt(months as string) : undefined,
      );

      return this.sendResponse(res, growth, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getRevenueByFrequency(req: Request, res: Response) {
    try {
      const { adminId } = req.params;
      const revenue = await SubscriptionEntities.getRevenueByFrequency(adminId);
      return this.sendResponse(res, revenue, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getTopSubscribers(req: Request, res: Response) {
    try {
      const { adminId } = req.params;
      const { limit } = req.query;

      const subscribers = await SubscriptionEntities.getTopSubscribers(
        adminId,
        limit ? parseInt(limit as string) : undefined,
      );

      return this.sendResponse(res, subscribers, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getSubscriptionCountByDay(req: Request, res: Response) {
    try {
      const { adminId } = req.params;
      const countByDay = await SubscriptionEntities.getSubscriptionCountByDay(adminId);
      return this.sendResponse(res, countByDay, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getContainerDepositSummary(req: Request, res: Response) {
    try {
      const { adminId } = req.params;
      const summary = await SubscriptionEntities.getContainerDepositSummary(adminId);
      return this.sendResponse(res, summary, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  //
  public async getSubscriptionsBySubscriberWithFilter(req: Request, res: Response) {
    try {
      const { subscriberId } = req.params;
      const { type, category } = req.query;

      const filter = {
        type: type as string,
        category: category as string,
      };

      const subscriptions = await SubscriptionEntities.getSubscriptionsBySubscriberId(
        subscriberId,
        filter,
      );

      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getActiveSubscriptionsBySubscriberWithFilter(req: Request, res: Response) {
    try {
      const { subscriberId } = req.params;
      const { type, category } = req.query;

      const filter = {
        type: type as string,
        category: category as string,
      };

      const subscriptions = await SubscriptionEntities.getActiveSubscriptionsBySubscriberId(
        subscriberId,
        filter,
      );

      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getSubscriptionsByAdminWithFilter(req: Request, res: Response) {
    try {
      const { adminId } = req.params;
      const { status, type, category } = req.query;

      const filter = {
        status: status as string,
        type: type as string,
        category: category as string,
      };

      const subscriptions = await SubscriptionEntities.getSubscriptionsByAdminId(adminId, filter);

      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getSubscriptionsByPlatform(req: Request, res: Response) {
    try {
      const { platform } = req.params;

      const subscriptions = await SubscriptionEntities.getSubscriptionsByPlatform(platform);

      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getUpcomingRenewals(req: Request, res: Response) {
    try {
      const { days } = req.query;

      const subscriptions = await SubscriptionEntities.getUpcomingRenewals(
        days ? parseInt(days as string) : undefined,
      );

      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getUpcomingPayments(req: Request, res: Response) {
    try {
      const { days } = req.query;

      const subscriptions = await SubscriptionEntities.getUpcomingPayments(
        days ? parseInt(days as string) : undefined,
      );

      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async updateDigitalSubscriptionDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const details = req.body;

      // Validate that this is a digital subscription
      const subscription: any = await SubscriptionEntities.getSubscriptionById(id);

      if (!subscription) {
        return this.notFound(res, 'Subscription not found');
      }

      if (subscription.subscriptionType !== 'digital') {
        return this.badRequest(res, 'This operation is only valid for digital subscriptions');
      }

      const result = await SubscriptionEntities.updateDigitalSubscriptionDetails(id, details);

      return this.sendResponse(res, result, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async addSharedUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return this.badRequest(res, 'User ID is required');
      }

      const result = await SubscriptionEntities.addSharedUser(id, userId);

      if (!result) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, result, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async removeSharedUser(req: Request, res: Response) {
    try {
      const { id, userId } = req.params;

      const result = await SubscriptionEntities.removeSharedUser(id, userId);

      if (!result) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, result, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getSubscriptionsSharedWithUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const subscriptions = await SubscriptionEntities.getSubscriptionsSharedWithUser(userId);

      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // *** Enhanced Billing Methods ***

  public async updatePricing(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { amount, currency, isPerUnit } = req.body;

      if (typeof amount !== 'number' || amount < 0) {
        return this.badRequest(res, 'Valid amount is required');
      }

      const pricing = {
        amount,
        currency,
        isPerUnit,
      };

      const result = await SubscriptionEntities.updatePricing(id, pricing);

      if (!result) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, result, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async recordPaymentWithDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { amount, status, transactionId, date } = req.body;

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return this.badRequest(res, 'Valid amount is required');
      }

      const paymentDetails = {
        amount,
        status: status || 'completed',
        transactionId,
        date: date ? new Date(date) : undefined,
      };

      const result = await SubscriptionEntities.recordPayment(id, paymentDetails);

      if (!result) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, result, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // *** Enhanced Cancellation Methods ***

  public async cancelSubscriptionWithDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason, refundAmount, refundStatus, feedback } = req.body;

      const cancelDetails = {
        reason,
        refundAmount: refundAmount ? Number(refundAmount) : undefined,
        refundStatus,
        feedback,
      };

      const result = await SubscriptionEntities.cancelSubscriptionWithDetails(id, cancelDetails);

      if (!result) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, result, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // *** Trial Management Methods ***

  public async startTrialSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { trialDays } = req.body;

      const result = await SubscriptionEntities.startTrialSubscription(
        id,
        trialDays ? parseInt(trialDays) : undefined,
      );

      if (!result) {
        return this.notFound(res, 'Subscription not found');
      }

      return this.sendResponse(res, result, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async convertTrialToPaid(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return this.badRequest(res, 'Valid amount is required');
      }

      const result = await SubscriptionEntities.convertTrialToPaid(id, amount);

      if (!result) {
        return this.notFound(res, 'Subscription not found or not in trial');
      }

      return this.sendResponse(res, result, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // *** Enhanced Search Method ***

  public async enhancedSearchSubscriptions(req: Request, res: Response) {
    try {
      const {
        query,
        adminId,
        subscriberId,
        status,
        subscriptionType,
        category,
        platform,
        startDateFrom,
        startDateTo,
        frequency,
        deliveryDay,
      } = req.query;

      const filters = {
        status: status as string,
        subscriptionType: subscriptionType as string,
        category: category as string,
        platform: platform as string,
        startDateFrom: startDateFrom as string,
        startDateTo: startDateTo as string,
        frequency: frequency as string,
        deliveryDay: deliveryDay as string,
      };

      const subscriptions = await SubscriptionEntities.searchSubscriptions(
        query as string,
        filters,
        adminId as string,
        subscriberId as string,
      );

      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // *** Enhanced Analytics and Reporting Methods ***

  public async getSubscriberSubscriptionAnalytics(req: Request, res: Response) {
    try {
      const { subscriberId } = req.params;

      const analytics = await SubscriptionEntities.getSubscriberSubscriptionAnalytics(subscriberId);

      return this.sendResponse(res, analytics, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getSubscriptionsByCategory(req: Request, res: Response) {
    try {
      const { adminId, subscriberId } = req.query;

      const subscriptions = await SubscriptionEntities.getSubscriptionsByCategory(
        adminId as string,
        subscriberId as string,
      );

      return this.sendResponse(res, subscriptions, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  public async getMonthlySubscriptionCosts(req: Request, res: Response) {
    try {
      const { subscriberId } = req.params;

      const costs = await SubscriptionEntities.getMonthlySubscriptionCosts(subscriberId);

      return this.sendResponse(res, costs, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // Link subscription to subscriber
  public async linkSubscriptionToSubscriber(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const { subscriptionId } = req.body;

      const result = await SubscriptionEntities.linkSubscriptionToSubscriber(
        subscriberId,
        subscriptionId,
      );

      return this.sendResponse(res, result, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // Unlink subscription from subscriber
  public async unlinkSubscriptionFromSubscriber(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const { subscriptionId } = req.body;

      const result = await SubscriptionEntities.unlinkSubscriptionFromSubscriber(
        subscriberId,
        subscriptionId,
      );

      return this.sendResponse(res, result, RESPONSE.SUBSCRIPTION('').UPDATE_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }

  // get subscriber subscription details
  public async getSubscriberSubscriptionDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;

      const result = await SubscriptionEntities.getSubscriberSubscriptionDetails(subscriberId);

      return this.sendResponse(res, result, RESPONSE.SUBSCRIPTION('').FETCH_SUCCESS);
    } catch (error: any) {
      return this.sendError(res, error);
    }
  }
}

export const subscriptionController = new SubscriptionController();
