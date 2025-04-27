// controllers/SubscriberController.ts
import { NextFunction, Request, Response } from 'express';
import builder from '@builders';
import { SubscriberEntities, UserEntities } from '@entity';
import { RESPONSE } from '@response';
import BaseController from './base.controller';

class SubscriberControllerClass extends BaseController {
  constructor() {
    super();
  }

  // Basic CRUD operations

  // Create a new subscriber
  public async createSubscriber(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('18', req.body);
      const primaryAdmin = res?.locals?.userData?._id;
      // check if user with same number or email exists
      const userExists: any = await UserEntities.checkUserExists(req?.body?.email);
      console.log('20', { userExists });
      if (userExists) {
        console.log('22', { userExists });
        UserEntities.updateUser(userExists._id, {
          ...req.body,
          roles: ['subscriber'],
        });
        console.log('25');
        const subscriber = await SubscriberEntities.createSubscriber({
          ...req.body,
          userId: userExists._id,
          primaryAdmin,
        });
        console.log('28', { subscriber });
        return this.sendResponse(
          res,
          subscriber,
          RESPONSE.SUBSCRIBER('Subscriber created'),
          // .SUBSCRIBER_CREATED
        );
      } else {
        console.log('31');
        // create user
        const user: any = await UserEntities.createUser({
          ...req.body,
          roles: ['subscriber'],
        });
        console.log('33', { user });
        const subscriber = await SubscriberEntities.createSubscriber({
          ...req.body,
          userId: user._id,
          primaryAdmin,
        });
        console.log('36', { subscriber });
        return this.sendResponse(
          res,
          subscriber,
          RESPONSE.SUBSCRIBER('Subscriber created'),
          // .SUBSCRIBER_CREATED
        );
      }
    } catch (error) {
      console.log('40', { error });
      return this.sendError(res, error);
    }
  }

  // Get subscriber by ID
  public async getSubscriberById(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const subscriber = await SubscriberEntities.findSubscriberById(subscriberId);
      return subscriber
        ? this.sendResponse(res, subscriber, RESPONSE.SUBSCRIBER('Subscriber found'))
        : this.notFound(res, 'Subscriber not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get subscriber by user ID
  public async getSubscriberByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const subscriber = await SubscriberEntities.findSubscriberByUserId(userId);
      return subscriber
        ? this.sendResponse(res, subscriber, RESPONSE.SUBSCRIBER('Subscriber found'))
        : this.notFound(res, 'Subscriber not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get all subscribers with optional filtering
  public async getAllSubscribers(req: Request, res: Response, next: NextFunction) {
    try {
      const options = req.query;
      const subscribers = await SubscriberEntities.getAllSubscribers(options);
      return this.sendResponse(
        res,
        subscribers,
        RESPONSE.SUBSCRIBER('Subscribers retrieved'),
        // .SUBSCRIBERS_RETRIEVED
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update subscriber by ID
  public async updateSubscriberById(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const updates = req.body;
      const result = await SubscriberEntities.updateSubscriberById(subscriberId, updates);
      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.SUBSCRIBER('Subscriber updated'),
            // .SUBSCRIBER_UPDATED
          )
        : this.notFound(res, 'Subscriber not found or no changes made');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update subscriber by user ID
  public async updateSubscriber(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const updates = req.body;
      const result = await SubscriberEntities.updateSubscriber(userId, updates);
      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.SUBSCRIBER(''),
            // .SUBSCRIBER_UPDATED
          )
        : this.notFound(res, 'Subscriber not found or no changes made');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Delete subscriber by ID
  public async deleteSubscriberById(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const result = await SubscriberEntities.deleteSubscriberById(subscriberId);
      return result.success
        ? this.sendResponse(
            res,
            { deleted: true },
            RESPONSE.SUBSCRIBER('Subscriber deleted'),
            // .SUBSCRIBER_DELETED
          )
        : this.notFound(res, 'Subscriber not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Delete subscriber by user ID
  public async deleteSubscriber(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const result = await SubscriberEntities.deleteSubscriber(userId);
      return result.success
        ? this.sendResponse(
            res,
            { deleted: true },
            RESPONSE.SUBSCRIBER('Subscriber deleted'),
            // .SUBSCRIBER_DELETED
          )
        : this.notFound(res, 'Subscriber not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Advanced query operations

  // Get active subscribers
  public async getActiveSubscribers(req: Request, res: Response, next: NextFunction) {
    try {
      const subscribers = await SubscriberEntities.findActiveSubscribers();
      return this.sendResponse(
        res,
        subscribers,
        RESPONSE.SUBSCRIBER('Active subscribers retrieved'),
        // .ACTIVE_SUBSCRIBERS_RETRIEVED
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get subscribers by subscription type
  public async getSubscribersByType(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriptionType } = req.params;

      if (!['daily', 'weekly'].includes(subscriptionType)) {
        return this.badRequest(res, 'Invalid subscription type');
      }

      const subscribers = await SubscriberEntities.findSubscribersByType(subscriptionType);
      return this.sendResponse(
        res,
        subscribers,
        RESPONSE.SUBSCRIBER('Subscribers retrieved'),
        // .SEARCH_RESULTS_RETRIEVED
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get subscribers by zone
  public async getSubscribersByZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { zone } = req.params;
      const subscribers = await SubscriberEntities.findSubscribersByZone(zone);
      return this.sendResponse(
        res,
        subscribers,
        RESPONSE.SUBSCRIBER('Subscribers retrieved'),
        // .SEARCH_RESULTS_RETRIEVED
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get subscribers by delivery personnel
  public async getSubscribersByDeliveryPersonnel(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const subscribers = await SubscriberEntities.findSubscribersByDeliveryPersonnel(personnelId);
      return this.sendResponse(
        res,
        subscribers,
        RESPONSE.SUBSCRIBER('Subscribers retrieved'),
        // .SEARCH_RESULTS_RETRIEVED
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get subscribers by delivery day
  public async getSubscribersByDeliveryDay(req: Request, res: Response, next: NextFunction) {
    try {
      const { day } = req.params;
      const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      if (!validDays.includes(day)) {
        return this.badRequest(res, 'Invalid day. Must be one of: ' + validDays.join(', '));
      }

      const subscribers = await SubscriberEntities.findSubscribersByDeliveryDay(day);
      return this.sendResponse(
        res,
        subscribers,
        RESPONSE.SUBSCRIBER('Subscribers retrieved'),
        // .SEARCH_RESULTS_RETRIEVED
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get subscribers without assigned delivery personnel
  public async getSubscribersWithoutPersonnel(req: Request, res: Response, next: NextFunction) {
    try {
      const subscribers = await SubscriberEntities.findSubscribersWithoutPersonnel();
      return this.sendResponse(
        res,
        subscribers,
        RESPONSE.SUBSCRIBER('Subscribers without personnel retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get subscribers with pending containers
  public async getSubscribersWithPendingContainers(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const subscribers = await SubscriberEntities.findSubscribersWithPendingContainers();
      return this.sendResponse(
        res,
        subscribers,
        RESPONSE.SUBSCRIBER('Subscribers with pending containers retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Subscription management

  // Assign delivery personnel to subscriber
  public async assignDeliveryPersonnel(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const { personnelId } = req.body;

      if (!personnelId) {
        return this.badRequest(res, 'Personnel ID is required');
      }

      const result = await SubscriberEntities.assignDeliveryPersonnel(subscriberId, personnelId);
      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.SUBSCRIBER('Delivery personnel assigned'),
          )
        : this.notFound(res, 'Subscriber not found or personnel already assigned');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Remove delivery personnel assignment
  public async removeDeliveryPersonnel(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const result = await SubscriberEntities.removeDeliveryPersonnel(subscriberId);
      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.SUBSCRIBER('Delivery personnel removed'),
          )
        : this.notFound(res, 'Subscriber not found or no personnel assigned');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update container count
  public async updateContainerCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const { containerCount, pendingContainers } = req.body;

      if (typeof containerCount !== 'number' || typeof pendingContainers !== 'number') {
        return this.badRequest(res, 'Container count and pending containers must be numbers');
      }

      const result = await SubscriberEntities.updateContainerCount(
        subscriberId,
        containerCount,
        pendingContainers,
      );
      return result.modifiedCount > 0
        ? this.sendResponse(res, { updated: true }, RESPONSE.SUBSCRIBER('Container counts updated'))
        : this.notFound(res, 'Subscriber not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Increment container count
  public async incrementContainerCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const { increment } = req.body;

      const incrementValue = increment ? Number(increment) : 1;

      if (isNaN(incrementValue) || incrementValue <= 0) {
        return this.badRequest(res, 'Increment must be a positive number');
      }

      const subscriber = await SubscriberEntities.incrementContainerCount(
        subscriberId,
        incrementValue,
      );
      return subscriber
        ? this.sendResponse(res, subscriber, RESPONSE.SUBSCRIBER('Container count incremented'))
        : this.notFound(res, 'Subscriber not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Decrement pending containers
  public async decrementPendingContainers(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const { decrement } = req.body;

      const decrementValue = decrement ? Number(decrement) : 1;

      if (isNaN(decrementValue) || decrementValue <= 0) {
        return this.badRequest(res, 'Decrement must be a positive number');
      }

      const subscriber = await SubscriberEntities.decrementPendingContainers(
        subscriberId,
        decrementValue,
      );
      return subscriber
        ? this.sendResponse(res, subscriber, RESPONSE.SUBSCRIBER('Pending containers decremented'))
        : this.notFound(res, 'Subscriber not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Toggle active status
  public async toggleActiveStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return this.badRequest(res, 'isActive must be a boolean value');
      }

      const result = await SubscriberEntities.toggleActiveStatus(subscriberId, isActive);
      return result.modifiedCount > 0
        ? this.sendResponse(res, { updated: true }, RESPONSE.SUBSCRIBER('Active status updated'))
        : this.notFound(res, 'Subscriber not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Toggle swap enabled
  public async toggleSwapEnabled(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const { swapEnabled } = req.body;

      if (typeof swapEnabled !== 'boolean') {
        return this.badRequest(res, 'swapEnabled must be a boolean value');
      }

      const result = await SubscriberEntities.toggleSwapEnabled(subscriberId, swapEnabled);
      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.SUBSCRIBER('Swap enabled status updated'),
          )
        : this.notFound(res, 'Subscriber not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update delivery days
  public async updateDeliveryDays(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const { deliveryDays } = req.body;

      if (!Array.isArray(deliveryDays)) {
        return this.badRequest(res, 'deliveryDays must be an array');
      }

      const result = await SubscriberEntities.updateDeliveryDays(subscriberId, deliveryDays);
      return result.modifiedCount > 0
        ? this.sendResponse(res, { updated: true }, RESPONSE.SUBSCRIBER('Delivery days updated'))
        : this.notFound(res, 'Subscriber not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update subscription type
  public async updateSubscriptionType(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const { subscriptionType } = req.body;

      if (!['daily', 'weekly'].includes(subscriptionType)) {
        return this.badRequest(res, "Invalid subscription type. Must be 'daily' or 'weekly'");
      }

      const result = await SubscriberEntities.updateSubscriptionType(
        subscriberId,
        subscriptionType,
      );
      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.SUBSCRIBER('Subscription type updated'),
          )
        : this.notFound(res, 'Subscriber not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Search and analytics

  // Search subscribers
  public async searchSubscribers(req: Request, res: Response, next: NextFunction) {
    try {
      const { term } = req.query;

      if (!term) {
        return this.badRequest(res, 'Search term is required');
      }

      const subscribers = await SubscriberEntities.searchSubscribers(term as string);
      return this.sendResponse(res, subscribers, RESPONSE.SUBSCRIBER('Search results retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Count subscribers by zone
  public async countSubscribersByZone(req: Request, res: Response, next: NextFunction) {
    try {
      const counts = await SubscriberEntities.countSubscribersByZone();
      return this.sendResponse(
        res,
        counts,
        RESPONSE.SUBSCRIBER('This is message'),
        // .SUBSCRIBER_COUNTS_BY_ZONE_SUCCESS
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Count subscribers by subscription type
  public async countSubscribersByType(req: Request, res: Response, next: NextFunction) {
    try {
      const counts = await SubscriberEntities.countSubscribersByType();
      return this.sendResponse(
        res,
        counts,
        RESPONSE.SUBSCRIBER('Subscriber counts by type retrieved'),
        // .SUBSCRIBER_COUNTS_BY_TYPE_SUCCESS
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get container statistics
  public async getContainerStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const statistics = await SubscriberEntities.getContainerStatistics();
      return this.sendResponse(
        res,
        statistics.length > 0 ? statistics[0] : {},
        RESPONSE.SUBSCRIBER('Container statistics retrieved'),
        // .CONTAINER_STATISTICS_RETRIEVED
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get subscribers with highest pending containers
  public async getTopSubscribersByPendingContainers(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { limit } = req.query;
      const limitValue = limit ? parseInt(limit as string) : 10;

      if (isNaN(limitValue) || limitValue <= 0) {
        return this.badRequest(res, 'Limit must be a positive number');
      }

      const subscribers = await SubscriberEntities.getTopSubscribersByPendingContainers(limitValue);
      return this.sendResponse(res, subscribers, RESPONSE.SUBSCRIBER('Top subscribers retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // getContainerStatisticsByAdmin
  public async getContainerStatisticsByAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const statistics = await SubscriberEntities.getContainerStatisticsByAdmin(req.params.adminId);
      return this.sendResponse(
        res,
        statistics,
        RESPONSE.SUBSCRIBER('Container statistics retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // countSubscribersByAdmin
  public async countSubscribersByAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const counts = await SubscriberEntities.countSubscribersByAdmin(req.params.adminId);
      return this.sendResponse(
        res,
        counts,
        RESPONSE.SUBSCRIBER('Subscriber counts by admin retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Aggregate subscribers
  public async aggregateSubscribers(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const body = req.body;

      const pipline = builder.SUBSCRIBER.buildSubscriberQuery({
        ...body,
        adminId,
      });

      const options = {
        page: 1,
        limit: 10,
        getCount: true,
      };

      const result = await SubscriberEntities.paginateAggregate(pipline, options);

      return this.sendResponse(res, result, RESPONSE.SUBSCRIBER('Subscribers aggregated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // get subscriber subscription details
  public async getSubscriberSubscriptionDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const subscriber = await SubscriberEntities.getSubscriberSubscriptionDetails(subscriberId);
      return this.sendResponse(
        res,
        subscriber,
        RESPONSE.SUBSCRIBER('Subscriber subscription details retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  /**
   * Get subscribers with filtering capabilities
   */
  public async getSubscribersWithFilters(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { search, zone, isActive, assignedTo, adminId, subscriptionType, hasDeliveryToday } =
        req.query;

      const filters: any = {};

      if (search) filters.search = search;
      if (zone) filters.zone = zone;
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      if (assignedTo) filters.assignedTo = assignedTo;
      if (adminId) filters.adminId = adminId;
      if (subscriptionType) filters.subscriptionType = subscriptionType;
      if (hasDeliveryToday !== undefined) filters.hasDeliveryToday = hasDeliveryToday === 'true';

      const subscribers = await SubscriberEntities.getSubscribersWithFilters(filters);

      return this.sendResponse(
        res,
        subscribers,
        RESPONSE.SUCCESS_MESSAGE('Retrieved subscribers with filters'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  /**
   * Bulk assign delivery personnel to subscribers
   */
  public async bulkAssignDeliveryPersonnel(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { subscriberIds, personnelId } = req.body;

      if (!subscriberIds || !Array.isArray(subscriberIds) || subscriberIds.length === 0) {
        return this.badRequest(res, 'At least one subscriber ID is required');
      }

      if (!personnelId) {
        return this.badRequest(res, 'Delivery personnel ID is required');
      }

      const result = await SubscriberEntities.bulkAssignDeliveryPersonnel(
        subscriberIds,
        personnelId,
      );

      if (!result.success) {
        return this.badRequest(res, result.message);
      }

      return this.sendResponse(res, result, RESPONSE.SUCCESS_MESSAGE(result.message));
    } catch (error) {
      return this.sendError(res, error);
    }
  }
}

export const SubscriberController = new SubscriberControllerClass();
