import { NextFunction, Request, Response } from 'express';
import builder from '@builders';
import { DeliveryEntities, SubscriberEntities } from '@entity';
import { RESPONSE } from '@response';
import BaseController from './base.controller';
import { toObjectId } from '@utils';

class DeliveryControllerClass extends BaseController {
  constructor() {
    super();
  }

  // *** Basic CRUD operations ***

  // Create a new delivery
  public async createDelivery(req: Request, res: Response, next: NextFunction) {
    try {
      const delivery = await DeliveryEntities.addDelivery(req.body);
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Delivery created'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get delivery by ID
  public async getDeliveryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const delivery = await DeliveryEntities.getDeliveryById(deliveryId);
      return delivery
        ? this.sendResponse(res, delivery, RESPONSE.DELIVERY('Delivery found'))
        : this.notFound(res, 'Delivery not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Delete delivery
  public async removeDelivery(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const result = await DeliveryEntities.removeDeliveryById(deliveryId);
      return result.success
        ? this.sendResponse(res, { deleted: true }, RESPONSE.DELIVERY('Delivery deleted'))
        : this.notFound(res, 'Delivery not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get deliveries for a specific subscriber
  public async getDeliveriesBySubscriberId(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const deliveries = await DeliveryEntities.getDeliveriesBySubscriberId(subscriberId);
      return this.sendResponse(res, deliveries, RESPONSE.DELIVERY('Deliveries retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get deliveries for a specific personnel
  public async getDeliveriesByPersonnelId(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const deliveries = await DeliveryEntities.getDeliveriesByPersonnelId(personnelId);
      return this.sendResponse(res, deliveries, RESPONSE.DELIVERY('Deliveries retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Admin-related methods ***

  // Get deliveries by admin ID
  public async getDeliveriesByAdminId(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const deliveries = await DeliveryEntities.getDeliveriesByAdminId(adminId);
      return this.sendResponse(res, deliveries, RESPONSE.DELIVERY('Deliveries retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get deliveries by admin and date
  public async getDeliveriesByAdminAndDate(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const { date } = req.query;

      if (!date) {
        return this.badRequest(res, 'Date is required');
      }

      const dateObj = new Date(date as string);
      if (isNaN(dateObj.getTime())) {
        return this.badRequest(res, 'Invalid date format');
      }

      const deliveries = await DeliveryEntities.getDeliveriesByAdminAndDate(adminId, dateObj);
      return this.sendResponse(res, deliveries, RESPONSE.DELIVERY('Deliveries retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get admin delivery statistics
  public async getAdminDeliveryStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const { startDate, endDate } = req.query;
      let startDateObj: Date;
      let endDateObj: Date;

      if (!startDate || !endDate) {
        // if not set then current month start and end date
        const currentDate = new Date();
        startDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      } else {
        startDateObj = new Date(startDate as string);
        endDateObj = new Date(endDate as string);
      }

      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        return this.badRequest(res, 'Invalid date format');
      }

      // if start date is greater than end date then return error
      if (startDateObj > endDateObj) {
        return this.badRequest(res, 'Start date cannot be greater than end date');
      }

      const statistics = await DeliveryEntities.getAdminDeliveryStatistics(
        adminId,
        startDateObj,
        endDateObj,
      );

      return this.sendResponse(
        res,
        statistics,
        RESPONSE.DELIVERY('Admin delivery statistics retrieved'),
      );
    } catch (error) {
      next(error);
      return this.sendError(res, error);
    }
  }

  // *** Subscription-related methods ***

  // Get deliveries by subscription ID
  public async getDeliveriesBySubscriptionId(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriptionId } = req.params;
      const deliveries = await DeliveryEntities.getDeliveriesBySubscriptionId(subscriptionId);
      return this.sendResponse(res, deliveries, RESPONSE.DELIVERY('Deliveries retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Add subscription to delivery
  public async addSubscriptionToDelivery(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const subscriptionData = req.body;

      if (!subscriptionData || !subscriptionData.subscriptionId) {
        return this.badRequest(res, 'Valid subscription data is required');
      }

      const delivery = await DeliveryEntities.addSubscriptionToDelivery(
        deliveryId,
        subscriptionData,
      );
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Subscription added to delivery'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update subscription fulfillment
  public async updateSubscriptionFulfillment(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId, subscriptionId } = req.params;
      const { fulfilled } = req.body;

      if (fulfilled === undefined) {
        return this.badRequest(res, 'Fulfilled status is required');
      }

      const delivery = await DeliveryEntities.updateSubscriptionFulfillment(
        deliveryId,
        subscriptionId,
        fulfilled,
      );
      return this.sendResponse(
        res,
        delivery,
        RESPONSE.DELIVERY('Subscription fulfillment updated'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Container detailed tracking ***

  // Add delivered container
  public async addDeliveredContainer(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { containerId, condition, verified } = req.body;

      if (!containerId) {
        return this.badRequest(res, 'Container ID is required');
      }

      const delivery = await DeliveryEntities.addDeliveredContainer(
        deliveryId,
        containerId,
        condition,
        verified,
      );
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Delivered container added'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Add returned container
  public async addReturnedContainer(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { containerId, condition, verified } = req.body;

      if (!containerId) {
        return this.badRequest(res, 'Container ID is required');
      }

      const delivery = await DeliveryEntities.addReturnedContainer(
        deliveryId,
        containerId,
        condition,
        verified,
      );
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Returned container added'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update container condition
  public async updateContainerCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId, containerId } = req.params;
      const { isDelivered, condition } = req.body;

      if (isDelivered === undefined || !condition) {
        return this.badRequest(res, 'isDelivered flag and condition are required');
      }

      const delivery = await DeliveryEntities.updateContainerCondition(
        deliveryId,
        containerId,
        isDelivered,
        condition,
      );
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Container condition updated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Verify container
  public async verifyContainer(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId, containerId } = req.params;
      const { isDelivered, verified } = req.body;

      if (isDelivered === undefined) {
        return this.badRequest(res, 'isDelivered flag is required');
      }

      const delivery = await DeliveryEntities.verifyContainer(
        deliveryId,
        containerId,
        isDelivered,
        verified,
      );
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Container verification updated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get delivered containers
  public async getDeliveredContainers(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const containers = await DeliveryEntities.getDeliveredContainers(deliveryId);
      return this.sendResponse(
        res,
        containers,
        RESPONSE.DELIVERY('Delivered containers retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get returned containers
  public async getReturnedContainers(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const containers = await DeliveryEntities.getReturnedContainers(deliveryId);
      return this.sendResponse(res, containers, RESPONSE.DELIVERY('Returned containers retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Enhanced status tracking ***

  // Update delivery status
  public async updateDeliveryStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { status } = req.body;

      if (!status) {
        return this.badRequest(res, 'Status is required');
      }

      const validStatuses = [
        'scheduled',
        'in-transit',
        'delivered',
        'completed',
        'partial',
        'missed',
        'cancelled',
      ];

      if (!validStatuses.includes(status)) {
        return this.badRequest(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      const delivery = await DeliveryEntities.updateDeliveryStatus(deliveryId, status);
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Delivery status updated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Mark as in transit
  public async markAsInTransit(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { estimatedArrival } = req.body;

      let estimatedArrivalDate;
      if (estimatedArrival) {
        estimatedArrivalDate = new Date(estimatedArrival);
        if (isNaN(estimatedArrivalDate.getTime())) {
          return this.badRequest(res, 'Invalid estimated arrival date format');
        }
      }

      const delivery = await DeliveryEntities.markAsInTransit(deliveryId, estimatedArrivalDate);
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Delivery marked as in transit'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Mark as delivered
  public async markAsDelivered(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { actualDeliveryTime, notes } = req.body;

      let deliveryTime;
      if (actualDeliveryTime) {
        deliveryTime = new Date(actualDeliveryTime);
        if (isNaN(deliveryTime.getTime())) {
          return this.badRequest(res, 'Invalid delivery time format');
        }
      }

      const delivery = await DeliveryEntities.markAsDelivered(deliveryId, deliveryTime, notes);
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Delivery marked as delivered'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Mark as partial
  public async markAsPartial(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { containersDelivered, containersReturned, notes } = req.body;

      if (
        typeof containersDelivered !== 'number' ||
        containersDelivered < 0 ||
        typeof containersReturned !== 'number' ||
        containersReturned < 0
      ) {
        return this.badRequest(res, 'Valid container counts are required');
      }

      const delivery = await DeliveryEntities.markAsPartial(
        deliveryId,
        containersDelivered,
        containersReturned,
        notes,
      );
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Delivery marked as partial'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Cancel delivery
  public async cancelDelivery(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { notes } = req.body;

      const delivery = await DeliveryEntities.cancelDelivery(deliveryId, notes);
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Delivery cancelled'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Verification methods ***

  // Update verification method
  public async updateVerificationMethod(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { method } = req.body;

      if (!method || !['signature', 'photo', 'code', 'none'].includes(method)) {
        return this.badRequest(
          res,
          'Valid verification method is required (signature, photo, code, none)',
        );
      }

      const delivery = await DeliveryEntities.updateVerificationMethod(
        deliveryId,
        method as 'signature' | 'photo' | 'code' | 'none',
      );
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Verification method updated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Set verification data
  public async setVerificationData(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { data } = req.body;

      if (!data) {
        return this.badRequest(res, 'Verification data is required');
      }

      const delivery = await DeliveryEntities.setVerificationData(deliveryId, data);
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Verification data set'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Verify with signature
  public async verifyWithSignature(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { signatureImageUrl } = req.body;

      if (!signatureImageUrl) {
        return this.badRequest(res, 'Signature image URL is required');
      }

      const delivery = await DeliveryEntities.verifyWithSignature(deliveryId, signatureImageUrl);
      return this.sendResponse(
        res,
        delivery,
        RESPONSE.DELIVERY('Delivery verified with signature'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Verify with photo
  public async verifyWithPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { photoUrl } = req.body;

      if (!photoUrl) {
        return this.badRequest(res, 'Photo URL is required');
      }

      const delivery = await DeliveryEntities.verifyWithPhoto(deliveryId, photoUrl);
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Delivery verified with photo'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Verify with code
  public async verifyWithCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { code, providedCode } = req.body;

      if (!code || !providedCode) {
        return this.badRequest(res, 'Both expected code and provided code are required');
      }

      try {
        const delivery = await DeliveryEntities.verifyWithCode(deliveryId, code, providedCode);
        return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Delivery verified with code'));
      } catch (error) {
        return this.badRequest(res, error.message);
      }
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Notes management ***

  // Update subscriber notes
  public async updateSubscriberNotes(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { notes } = req.body;

      if (!notes) {
        return this.badRequest(res, 'Notes are required');
      }

      const delivery = await DeliveryEntities.updateSubscriberNotes(deliveryId, notes);
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Subscriber notes updated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update personnel notes
  public async updatePersonnelNotes(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { notes } = req.body;

      if (!notes) {
        return this.badRequest(res, 'Notes are required');
      }

      const delivery = await DeliveryEntities.updatePersonnelNotes(deliveryId, notes);
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Personnel notes updated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Route management ***

  // Update route order
  public async updateRouteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { routeOrder } = req.body;

      if (typeof routeOrder !== 'number' || routeOrder < 0) {
        return this.badRequest(res, 'Valid route order number is required');
      }

      const delivery = await DeliveryEntities.updateRouteOrder(deliveryId, routeOrder);
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Route order updated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update delivery distance
  public async updateDeliveryDistance(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { distanceKm } = req.body;

      if (typeof distanceKm !== 'number' || distanceKm < 0) {
        return this.badRequest(res, 'Valid distance in km is required');
      }

      const delivery = await DeliveryEntities.updateDeliveryDistance(deliveryId, distanceKm);
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Delivery distance updated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Optimize route order
  public async optimizeRouteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { date } = req.body;

      if (!date) {
        return this.badRequest(res, 'Date is required');
      }

      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return this.badRequest(res, 'Invalid date format');
      }

      const result = await DeliveryEntities.optimizeRouteOrder(personnelId, dateObj);
      return this.sendResponse(res, result, RESPONSE.DELIVERY('Route order optimized'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Payment tracking ***

  // Update payment status
  public async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { collected, amount } = req.body;

      if (collected === undefined) {
        return this.badRequest(res, 'Payment collected status is required');
      }

      const delivery = await DeliveryEntities.updatePaymentStatus(
        deliveryId,
        collected,
        amount || 0,
      );
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Payment status updated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get payment collection report
  public async getPaymentCollectionReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { date } = req.query;

      if (!date) {
        return this.badRequest(res, 'Date is required');
      }

      const dateObj = new Date(date as string);
      if (isNaN(dateObj.getTime())) {
        return this.badRequest(res, 'Invalid date format');
      }

      const report = await DeliveryEntities.getPaymentCollectionReport(personnelId, dateObj);
      return this.sendResponse(
        res,
        report,
        RESPONSE.DELIVERY('Payment collection report retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Advanced queries and analytics methods ***

  // Get delivery efficiency by personnel
  public async getDeliveryEfficiencyByPersonnel(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;
      let startDateObj: Date;
      let endDateObj: Date;

      if (!startDate || !endDate) {
        // if not set then current month start and end date
        const currentDate = new Date();
        startDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDateObj = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      } else {
        startDateObj = new Date(startDate as string);
        endDateObj = new Date(endDate as string);
      }

      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        return this.badRequest(res, 'Invalid date format');
      }

      const efficiency = await DeliveryEntities.getDeliveryEfficiencyByPersonnel(
        startDateObj,
        endDateObj,
      );

      return this.sendResponse(
        res,
        efficiency,
        RESPONSE.DELIVERY('Delivery efficiency report retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get subscriber delivery summary
  public async getSubscriberDeliverySummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const { months } = req.query;

      const monthsNumber = months ? parseInt(months as string) : 3;
      if (isNaN(monthsNumber) || monthsNumber <= 0) {
        return this.badRequest(res, 'Months must be a positive number');
      }

      const summary = await DeliveryEntities.getSubscriberDeliverySummary(
        subscriberId,
        monthsNumber,
      );

      return this.sendResponse(
        res,
        summary,
        RESPONSE.DELIVERY('Subscriber delivery summary retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Existing methods with updates ***

  // Update containers delivered
  public async updateContainersDelivered(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { containersDelivered } = req.body;

      if (typeof containersDelivered !== 'number' || containersDelivered < 0) {
        return this.badRequest(res, 'Valid containers delivered count is required');
      }

      const delivery = await DeliveryEntities.updateContainersDelivered(
        deliveryId,
        containersDelivered,
      );
      return this.sendResponse(
        res,
        delivery,
        RESPONSE.DELIVERY('Containers delivered count updated'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update containers returned
  public async updateContainersReturned(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { containersReturned } = req.body;

      if (typeof containersReturned !== 'number' || containersReturned < 0) {
        return this.badRequest(res, 'Valid containers returned count is required');
      }

      const delivery = await DeliveryEntities.updateContainersReturned(
        deliveryId,
        containersReturned,
      );
      return this.sendResponse(
        res,
        delivery,
        RESPONSE.DELIVERY('Containers returned count updated'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update delivery notes
  public async updateDeliveryNotes(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const { notes } = req.body;

      if (!notes) {
        return this.badRequest(res, 'Notes are required');
      }

      const delivery = await DeliveryEntities.updateDeliveryNotes(deliveryId, notes);
      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Delivery notes updated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // bulkCreateDeliveries
  public async bulkCreateDeliveries(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveries } = req.body;

      const delivery = await DeliveryEntities.bulkCreateDeliveries(deliveries);

      return this.sendResponse(res, delivery, RESPONSE.DELIVERY('Deliveries created'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Aggregate deliveries
  public async aggregateDeliveries(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const body = req.body;

      const pipline = builder.DELIVERY.buildDeliveryQuery({
        ...body,
        adminId,
      });

      const options = {
        page: 1,
        limit: 10,
        getCount: true,
      };

      const result = await DeliveryEntities.paginateAggregate(pipline, options);

      return this.sendResponse(res, result, RESPONSE.DELIVERY('Deliveries aggregated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  /**
   * Get list of subscribers who need delivery for a specific personnel on a date
   */
  public async getDeliveryScheduleForPersonnel(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { date } = req.query;

      if (!personnelId) {
        return this.badRequest(res, 'Personnel ID is required');
      }

      let deliveryDate = new Date();
      if (date) {
        deliveryDate = new Date(date as string);
        if (isNaN(deliveryDate.getTime())) {
          return this.badRequest(res, 'Invalid date format');
        }
      }

      const subscribersForDelivery = await DeliveryEntities.getDeliveryScheduleForPersonnel(
        personnelId,
        deliveryDate,
      );

      return this.sendResponse(
        res,
        subscribersForDelivery,
        RESPONSE.SUCCESS_MESSAGE('Retrieved subscribers who need delivery'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  /**
   * Generate delivery entries for all subscribers who need delivery for a personnel
   */
  public async generateDeliveriesForPersonnel(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { date } = req.body;

      if (!personnelId) {
        return this.badRequest(res, 'Personnel ID is required');
      }

      let deliveryDate = new Date();
      if (date) {
        deliveryDate = new Date(date);
        if (isNaN(deliveryDate.getTime())) {
          return this.badRequest(res, 'Invalid date format');
        }
      }

      const result = await DeliveryEntities.generateDeliveriesForPersonnel(
        personnelId,
        deliveryDate,
      );

      return this.sendResponse(res, result, RESPONSE.DELIVERY('Deliveries generated successfully'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  /**
   * Get deliveries grouped by time slot for a personnel on a specific date
   */
  public async getDeliveriesByTimeSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { date } = req.query;

      if (!personnelId) {
        return this.badRequest(res, 'Personnel ID is required');
      }

      let deliveryDate = new Date();
      if (date) {
        deliveryDate = new Date(date as string);
        if (isNaN(deliveryDate.getTime())) {
          return this.badRequest(res, 'Invalid date format');
        }
      }

      const deliveriesByTimeSlot = await DeliveryEntities.getDeliveriesByTimeSlot(
        personnelId,
        deliveryDate,
      );

      return this.sendResponse(
        res,
        deliveriesByTimeSlot,
        RESPONSE.DELIVERY('Deliveries retrieved by time slot'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  /**
   * Get daily delivery statistics for a personnel
   */
  public async getPersonnelDailyStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { date } = req.query;

      if (!personnelId) {
        return this.badRequest(res, 'Personnel ID is required');
      }

      let statsDate = new Date();
      if (date) {
        statsDate = new Date(date as string);
        if (isNaN(statsDate.getTime())) {
          return this.badRequest(res, 'Invalid date format');
        }
      }

      const dailyStats = await DeliveryEntities.getPersonnelDailyStats(personnelId, statsDate);

      return this.sendResponse(
        res,
        dailyStats,
        RESPONSE.SUCCESS_MESSAGE('Personnel daily statistics retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  /**
   * Auto-generate deliveries for all personnel for a specific date
   */
  public async autoGenerateAllDeliveriesForDate(req: Request, res: Response, next: NextFunction) {
    try {
      const { date } = req.body;
      const adminId = req.params.adminId;

      let generationDate = new Date();
      if (date) {
        generationDate = new Date(date);
        if (isNaN(generationDate.getTime())) {
          return this.badRequest(res, 'Invalid date format');
        }
      }

      const results = await DeliveryEntities.autoGenerateAllDeliveriesForDate(
        generationDate,
        adminId,
      );

      return this.sendResponse(
        res,
        results,
        RESPONSE.DELIVERY('Deliveries generated for all personnel'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  /**
   * Get list of subscribers who should receive deliveries on a specific day of the week
   */
  public async getSubscribersByDeliveryDay(req: Request, res: Response, next: NextFunction) {
    try {
      const { day } = req.params;

      if (!day) {
        return this.badRequest(res, 'Day parameter is required');
      }

      // Validate day format
      const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      if (!validDays.includes(day)) {
        return this.badRequest(res, 'Invalid day format. Use Mon, Tue, Wed, Thu, Fri, Sat, or Sun');
      }

      const subscribers = await DeliveryEntities.getSubscribersByDeliveryDay(day);

      return this.sendResponse(
        res,
        subscribers,
        RESPONSE.SUCCESS_MESSAGE(`Subscribers for ${day} retrieved`),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  /**
   * Assign optimal delivery personnel to a subscriber based on location and workload
   */
  public async assignOptimalDeliveryPersonnel(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;

      if (!subscriberId) {
        return this.badRequest(res, 'Subscriber ID is required');
      }

      const result = await DeliveryEntities.assignOptimalDeliveryPersonnel(subscriberId);

      if (!result.success) {
        return this.badRequest(res, result.message);
      }

      return this.sendResponse(
        res,
        result,
        RESPONSE.SUCCESS_MESSAGE('Delivery personnel assigned successfully'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  /**
   * Get pending deliveries count for a personnel on a specific date
   */
  public async getPendingDeliveriesCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { date } = req.query;

      if (!personnelId) {
        return this.badRequest(res, 'Personnel ID is required');
      }

      let deliveryDate = new Date();
      if (date) {
        deliveryDate = new Date(date as string);
        if (isNaN(deliveryDate.getTime())) {
          return this.badRequest(res, 'Invalid date format');
        }
      }

      // Set time to beginning and end of day
      const startDate = new Date(deliveryDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(deliveryDate);
      endDate.setHours(23, 59, 59, 999);

      const deliveries = await DeliveryEntities.find({
        personnelId: toObjectId(personnelId),
        date: { $gte: startDate, $lte: endDate },
        status: { $in: ['scheduled', 'in-transit'] },
      });

      return this.sendResponse(
        res,
        {
          count: deliveries.length,
          deliveries: deliveries,
        },
        RESPONSE.DELIVERY('Pending deliveries count retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  /**
   * Check delivery eligibility for subscribers on a specific day
   */
  public async checkDailyDeliveryEligibility(req: Request, res: Response, next: NextFunction) {
    try {
      const { date } = req.query;

      let checkDate = new Date();
      if (date) {
        checkDate = new Date(date as string);
        if (isNaN(checkDate.getTime())) {
          return this.badRequest(res, 'Invalid date format');
        }
      }

      // Get the day of week
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayOfWeek = days[checkDate.getDay()];

      // Get all subscribers for this day
      const weeklySubscribers = await DeliveryEntities.getSubscribersByDeliveryDay(dayOfWeek);

      // Get daily subscribers
      const dailySubscribers = await SubscriberEntities.find({
        subscriptionType: 'daily',
        isActive: true,
      });

      // Get custom frequency subscribers
      const customFrequencySubscribers = await SubscriberEntities.find({
        isCustomFrequency: true,
        isActive: true,
      });

      // Filter custom frequency subscribers who are due today
      const dueCustomSubscribers = customFrequencySubscribers.filter((sub: any) => {
        if (!sub.lastDeliveryDate) return true; // If no last delivery, include them

        const lastDelivery = new Date(sub.lastDeliveryDate);
        const interval = sub.customFrequencyInterval || 1;
        let nextDeliveryDate;

        switch (sub.customFrequencyIntervalUnit) {
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

        return checkDate >= nextDeliveryDate;
      });

      return this.sendResponse(
        res,
        {
          date: checkDate.toISOString().split('T')[0],
          dayOfWeek,
          eligibleSubscribers: {
            daily: dailySubscribers,
            weekly: weeklySubscribers,
            customFrequency: dueCustomSubscribers,
            total: dailySubscribers.length + weeklySubscribers.length + dueCustomSubscribers.length,
          },
        },
        RESPONSE.SUCCESS_MESSAGE('Delivery eligibility checked successfully'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  /**
   * Get subscribers eligible for manual delivery creation
   * This endpoint helps admins to see which subscribers they can create deliveries for
   */
  public getEligibleSubscribersForDelivery = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { adminId } = req.params;
      const { date, zone, subscriptionType, search } = req.query;

      if (!adminId) {
        return this.badRequest(res, 'Admin ID is required');
      }

      let deliveryDate = new Date();
      if (date) {
        deliveryDate = new Date(date as string);
        if (isNaN(deliveryDate.getTime())) {
          return this.badRequest(res, 'Invalid date format');
        }
      }

      // Build filter object from query params
      const filter: any = {};
      if (zone) filter.zone = zone;
      if (subscriptionType) filter.subscriptionType = subscriptionType;
      if (search) filter.search = search;

      const eligibleSubscribers = await DeliveryEntities.getEligibleSubscribersForDelivery(
        adminId,
        deliveryDate,
        filter,
      );

      return this.sendResponse(
        res,
        eligibleSubscribers,
        RESPONSE.DELIVERY('Retrieved eligible subscribers for delivery creation'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  /**
   * Create deliveries for manually selected subscribers by admin
   * This endpoint allows admins to create deliveries for specific subscribers
   */
  public async createDeliveriesForSelectedSubscribers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { adminId } = req.params;
      const { subscriberIds, date, assignToPersonnel = true } = req.body;

      if (!adminId) {
        return this.badRequest(res, 'Admin ID is required');
      }

      if (!subscriberIds || !Array.isArray(subscriberIds) || subscriberIds.length === 0) {
        return this.badRequest(res, 'At least one subscriber ID is required');
      }

      // Process date if provided
      let deliveryDate = new Date();
      if (date) {
        deliveryDate = new Date(date);
        if (isNaN(deliveryDate.getTime())) {
          return this.badRequest(res, 'Invalid date format');
        }
      }

      const result = await DeliveryEntities.createDeliveriesForSelectedSubscribers(
        adminId,
        subscriberIds,
        deliveryDate,
        assignToPersonnel,
      );

      if (!result.success) {
        return this.badRequest(res, result.message);
      }

      return this.sendResponse(res, result, RESPONSE.DELIVERY(result.message));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  /**
   * Create deliveries for multiple subscribers with container tracking
   */
  public async createDeliveriesWithContainers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { adminId } = req.params;
      const { deliveries } = req.body;

      if (!adminId) {
        return this.badRequest(res, 'Admin ID is required');
      }

      if (!deliveries || !Array.isArray(deliveries) || deliveries.length === 0) {
        return this.badRequest(res, 'Delivery data is required');
      }

      // Validate delivery data
      for (const delivery of deliveries) {
        if (!delivery.subscriberId) {
          return this.badRequest(res, 'Each delivery must have a subscriber ID');
        }

        if (!delivery.date) {
          return this.badRequest(res, 'Each delivery must have a date');
        }

        // Convert date string to Date object if needed
        if (typeof delivery.date === 'string') {
          delivery.date = new Date(delivery.date);
          if (isNaN(delivery.date.getTime())) {
            return this.badRequest(res, 'Invalid date format');
          }
        }

        // Ensure container counts are numbers
        delivery.containersToDeliver = Number(delivery.containersToDeliver) || 0;
        delivery.containersToReturn = Number(delivery.containersToReturn) || 0;
      }

      const result = await DeliveryEntities.createDeliveriesWithContainers(adminId, deliveries);

      if (!result.success) {
        return this.badRequest(res, result.message);
      }

      return this.sendResponse(res, result, RESPONSE.DELIVERY(result.message));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  /**
   * Get unassigned subscribers
   */
  public async getUnassignedSubscribers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { adminId } = req.params;
      const { zone, search } = req.query;

      const filters: any = {};
      if (adminId) filters.adminId = adminId;
      if (zone) filters.zone = zone as string;
      if (search) filters.search = search as string;

      const subscribers = await DeliveryEntities.getUnassignedSubscribers(filters);

      return this.sendResponse(
        res,
        subscribers,
        RESPONSE.SUCCESS_MESSAGE('Retrieved unassigned subscribers'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  /**
   * Get delivery personnel with their subscriber counts
   */
  public async getDeliveryPersonnelWithCounts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const personnel = await DeliveryEntities.getDeliveryPersonnelWithCounts();

      return this.sendResponse(
        res,
        personnel,
        RESPONSE.SUCCESS_MESSAGE('Retrieved delivery personnel with counts'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }
}

export const DeliveryController = new DeliveryControllerClass();
