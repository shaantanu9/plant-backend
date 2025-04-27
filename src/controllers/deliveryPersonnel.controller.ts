import { NextFunction, Request, Response } from 'express';
import builder from '@builders';
import { DeliveryPersonnelEntities, UserEntities } from '@entity';
import { RESPONSE } from '@response';
import BaseController from './base.controller';

import { logger } from '../middleware/logger.middleware';
import { toObjectId } from '@utils';
// import loggerMiddleware from 'middleware/logger.middleware';

class DeliveryPersonnelControllerClass extends BaseController {
  constructor() {
    super();
  }

  // *** Basic CRUD operations ***

  // Create a new delivery personnel
  public async createDeliveryPersonnel(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = res.locals.userData?._id;

      console.log(req.body, 'req.body');
      logger.info('req.body', { req: req.body });
      // check if user with same number or email exists
      const userExists: any = await UserEntities.checkUserExists(req?.body?.email);

      console.log('userExists', { userExists, request: req.body });

      let userId = '';
      if (!userExists) {
        // create user if not exists

        const user: any = await UserEntities.create({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          role: 'delivery',
          password: 'password123',
        });
        userId = user._id;
        
      } else {
        // delivery personnel exists
        const deliveryPersonnelExists: any = await DeliveryPersonnelEntities.findOne({
          userId: toObjectId(req.body.userId),
          adminId: toObjectId(adminId),
        });
        logger.info('deliveryPersonnelExists', { deliveryPersonnelExists });
        if (deliveryPersonnelExists) {
          return this.sendResponse(
            res,
            deliveryPersonnelExists,
            RESPONSE.DELIVERY_PERSONNEL('Delivery personnel already exists'),
          );
        }
        // update user
        await UserEntities.updateUser(userExists._id, {
          ...req.body,
          roles: ['delivery'],
        });
        userId = userExists?._id;
      }

      const personnel = await DeliveryPersonnelEntities.addDeliveryPersonnel({
        ...req.body,
        userId,
        adminId,
      });
      return this.sendResponse(
        res,
        personnel,
        RESPONSE.DELIVERY_PERSONNEL('Delivery personnel created'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get delivery personnel by ID
  public async getDeliveryPersonnelById(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const personnel = await DeliveryPersonnelEntities.getDeliveryPersonnelById(personnelId);
      return personnel
        ? this.sendResponse(res, personnel, RESPONSE.DELIVERY_PERSONNEL('Delivery personnel found'))
        : this.notFound(res, 'Delivery personnel not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get delivery personnel by user ID
  public async getDeliveryPersonnelByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const personnel = await DeliveryPersonnelEntities.getDeliveryPersonnelByUserId(userId);
      return personnel
        ? this.sendResponse(res, personnel, RESPONSE.DELIVERY_PERSONNEL('Delivery personnel found'))
        : this.notFound(res, 'Delivery personnel not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Delete delivery personnel
  public async removeDeliveryPersonnel(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const result = await DeliveryPersonnelEntities.removeDeliveryPersonnelById(personnelId);
      return result
        ? this.sendResponse(
            res,
            { deleted: true },
            RESPONSE.DELIVERY_PERSONNEL('Delivery personnel deleted'),
          )
        : this.notFound(res, 'Delivery personnel not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Query operations ***

  // Get delivery personnel by zone
  public async getDeliveryPersonnelByZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { zone } = req.params;
      const personnel = await DeliveryPersonnelEntities.getDeliveryPersonnelByZone(zone);
      return this.sendResponse(
        res,
        personnel,
        RESPONSE.DELIVERY_PERSONNEL('Delivery personnel retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get active delivery personnel
  public async getActiveDeliveryPersonnel(req: Request, res: Response, next: NextFunction) {
    try {
      const personnel = await DeliveryPersonnelEntities.getActiveDeliveryPersonnel();
      return this.sendResponse(
        res,
        personnel,
        RESPONSE.DELIVERY_PERSONNEL('Active delivery personnel retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get active delivery personnel by zone
  public async getActiveDeliveryPersonnelByZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { zone } = req.params;
      const personnel = await DeliveryPersonnelEntities.getActiveDeliveryPersonnelByZone(zone);
      return this.sendResponse(
        res,
        personnel,
        RESPONSE.DELIVERY_PERSONNEL('Active delivery personnel retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get delivery personnel by subscriber ID
  public async getDeliveryPersonnelBySubscriberId(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const personnel =
        await DeliveryPersonnelEntities.getDeliveryPersonnelsBySubscriberId(subscriberId);
      return this.sendResponse(
        res,
        personnel,
        RESPONSE.DELIVERY_PERSONNEL('Delivery personnel retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get personnel by primary zone
  public async getPersonnelByPrimaryZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { zone } = req.params;
      const personnel = await DeliveryPersonnelEntities.getPersonnelByPrimaryZone(zone);
      return this.sendResponse(res, personnel, RESPONSE.DELIVERY_PERSONNEL('Personnel retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get personnel by secondary zone
  public async getPersonnelBySecondaryZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { zone } = req.params;
      const personnel = await DeliveryPersonnelEntities.getPersonnelBySecondaryZone(zone);
      return this.sendResponse(res, personnel, RESPONSE.DELIVERY_PERSONNEL('Personnel retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get personnel by vehicle type
  public async getPersonnelByVehicleType(req: Request, res: Response, next: NextFunction) {
    try {
      const { vehicleType } = req.params;
      const personnel = await DeliveryPersonnelEntities.getPersonnelByVehicleType(vehicleType);
      return this.sendResponse(res, personnel, RESPONSE.DELIVERY_PERSONNEL('Personnel retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get personnel within radius
  public async getPersonnelWithinRadius(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lng, radiusKm } = req.query;

      if (!lat || !lng || !radiusKm) {
        return this.badRequest(res, 'Latitude, longitude, and radius are required');
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);
      const radius = parseFloat(radiusKm as string);

      if (isNaN(latitude) || isNaN(longitude) || isNaN(radius)) {
        return this.badRequest(res, 'Invalid coordinates or radius');
      }

      const personnel = await DeliveryPersonnelEntities.getPersonnelWithinRadius(
        latitude,
        longitude,
        radius,
      );

      return this.sendResponse(
        res,
        personnel,
        RESPONSE.DELIVERY_PERSONNEL('Personnel within radius retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get available personnel by day
  public async getAvailablePersonnelByDay(req: Request, res: Response, next: NextFunction) {
    try {
      const { day } = req.params;
      const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      if (!validDays.includes(day)) {
        return this.badRequest(res, 'Invalid day format. Use Mon, Tue, etc.');
      }

      const personnel = await DeliveryPersonnelEntities.getAvailablePersonnelByDay(day);
      return this.sendResponse(
        res,
        personnel,
        RESPONSE.DELIVERY_PERSONNEL('Available personnel retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get personnel for time slot
  public async getPersonnelForTimeSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const { start, end } = req.query;

      if (!start || !end) {
        return this.badRequest(res, 'Start and end times are required');
      }

      const personnel = await DeliveryPersonnelEntities.getPersonnelForTimeSlot(
        start as string,
        end as string,
      );

      return this.sendResponse(
        res,
        personnel,
        RESPONSE.DELIVERY_PERSONNEL('Personnel for time slot retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Admin relationship management ***

  // Assign admin to personnel
  public async assignAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { adminId, isPrimary } = req.body;

      if (!adminId) {
        return this.badRequest(res, 'Admin ID is required');
      }

      const result = await DeliveryPersonnelEntities.assignAdmin(
        personnelId,
        adminId,
        isPrimary || false,
      );

      return result
        ? this.sendResponse(res, result, RESPONSE.DELIVERY_PERSONNEL('Admin assigned successfully'))
        : this.notFound(res, 'Delivery personnel not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Remove admin from personnel
  public async removeAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId, adminId } = req.params;

      const result = await DeliveryPersonnelEntities.removeAdmin(personnelId, adminId);

      return result
        ? this.sendResponse(res, result, RESPONSE.DELIVERY_PERSONNEL('Admin removed successfully'))
        : this.notFound(res, 'Delivery personnel or admin not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Set admin as primary
  public async setAdminAsPrimary(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId, adminId } = req.params;

      const result = await DeliveryPersonnelEntities.setAdminAsPrimary(personnelId, adminId);

      return result
        ? this.sendResponse(
            res,
            result,
            RESPONSE.DELIVERY_PERSONNEL('Admin set as primary successfully'),
          )
        : this.notFound(res, 'Delivery personnel or admin not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get personnel by admin ID
  public async getPersonnelByAdminId(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;

      const personnel = await DeliveryPersonnelEntities.getPersonnelByAdminId(adminId);

      return this.sendResponse(res, personnel, RESPONSE.DELIVERY_PERSONNEL('Personnel retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get primary personnel for admin
  public async getPrimaryPersonnelForAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;

      const personnel = await DeliveryPersonnelEntities.getPrimaryPersonnelForAdmin(adminId);

      return this.sendResponse(
        res,
        personnel,
        RESPONSE.DELIVERY_PERSONNEL('Primary personnel retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Subscriber assignment management ***

  // Assign subscriber to delivery personnel
  public async assignSubscriber(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { subscriberId } = req.body;

      if (!subscriberId) {
        return this.badRequest(res, 'Subscriber ID is required');
      }

      const personnel = await DeliveryPersonnelEntities.assignSubscriber(personnelId, subscriberId);
      return personnel
        ? this.sendResponse(
            res,
            personnel,
            RESPONSE.DELIVERY_PERSONNEL('Subscriber assigned successfully'),
          )
        : this.notFound(res, 'Delivery personnel not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Assign multiple subscribers to delivery personnel
  public async assignSubscribers(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { subscriberIds } = req.body;

      if (!Array.isArray(subscriberIds) || subscriberIds.length === 0) {
        return this.badRequest(res, 'Valid subscriber IDs array is required');
      }

      const personnel = await DeliveryPersonnelEntities.assignSubscribers(
        personnelId,
        subscriberIds,
      );
      return personnel
        ? this.sendResponse(
            res,
            personnel,
            RESPONSE.DELIVERY_PERSONNEL('Subscribers assigned successfully'),
          )
        : this.notFound(res, 'Delivery personnel not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Remove subscriber assignment from delivery personnel
  public async removeSubscriber(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId, subscriberId } = req.params;

      const personnel = await DeliveryPersonnelEntities.removeSubscriber(personnelId, subscriberId);
      return personnel
        ? this.sendResponse(
            res,
            personnel,
            RESPONSE.DELIVERY_PERSONNEL('Subscriber removed successfully'),
          )
        : this.notFound(res, 'Delivery personnel or subscriber not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get assigned subscribers for a delivery personnel
  public async getAssignedSubscribers(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const subscribers = await DeliveryPersonnelEntities.getAssignedSubscribers(personnelId);
      return this.sendResponse(
        res,
        subscribers,
        RESPONSE.DELIVERY_PERSONNEL('Assigned subscribers retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Check if personnel is assigned to a specific subscriber
  public async checkPersonnelAssignedToSubscriber(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId, subscriberId } = req.params;
      const isAssigned = await DeliveryPersonnelEntities.isPersonnelAssignedToSubscriber(
        personnelId,
        subscriberId,
      );
      return this.sendResponse(
        res,
        { isAssigned },
        RESPONSE.DELIVERY_PERSONNEL('Assignment check completed'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Transfer subscribers between personnel
  public async transferSubscribers(req: Request, res: Response, next: NextFunction) {
    try {
      const { fromPersonnelId, toPersonnelId } = req.params;
      const { subscriberIds } = req.body;

      if (!Array.isArray(subscriberIds) || subscriberIds.length === 0) {
        return this.badRequest(res, 'Valid subscriber IDs array is required');
      }

      const result = await DeliveryPersonnelEntities.transferSubscribers(
        fromPersonnelId,
        toPersonnelId,
        subscriberIds,
      );
      return result
        ? this.sendResponse(
            res,
            result,
            RESPONSE.DELIVERY_PERSONNEL('Subscribers transferred successfully'),
          )
        : this.notFound(res, 'Source or target personnel not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Status and zone management ***

  // Toggle delivery personnel active status
  public async toggleActiveStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { isActive } = req.body;

      if (isActive === undefined) {
        return this.badRequest(res, 'Active status is required');
      }

      const result = await DeliveryPersonnelEntities.toggleActiveStatus(personnelId, isActive);
      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.DELIVERY_PERSONNEL('Delivery personnel active status updated'),
          )
        : this.notFound(res, 'Delivery personnel not found or status unchanged');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update delivery personnel zone
  public async updateDeliveryPersonnelZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { zone } = req.body;

      if (!zone) {
        return this.badRequest(res, 'Zone is required');
      }

      const result = await DeliveryPersonnelEntities.updateDeliveryPersonnelZone(personnelId, zone);
      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.DELIVERY_PERSONNEL('Delivery personnel zone updated'),
          )
        : this.notFound(res, 'Delivery personnel not found or zone unchanged');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update primary zones
  public async updatePrimaryZones(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { zones } = req.body;

      if (!Array.isArray(zones)) {
        return this.badRequest(res, 'Zones must be an array');
      }

      const result = await DeliveryPersonnelEntities.updatePrimaryZones(personnelId, zones);
      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.DELIVERY_PERSONNEL('Primary zones updated'),
          )
        : this.notFound(res, 'Delivery personnel not found or zones unchanged');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update secondary zones
  public async updateSecondaryZones(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { zones } = req.body;

      if (!Array.isArray(zones)) {
        return this.badRequest(res, 'Zones must be an array');
      }

      const result = await DeliveryPersonnelEntities.updateSecondaryZones(personnelId, zones);
      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.DELIVERY_PERSONNEL('Secondary zones updated'),
          )
        : this.notFound(res, 'Delivery personnel not found or zones unchanged');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Add primary zone
  public async addPrimaryZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { zone } = req.body;

      if (!zone) {
        return this.badRequest(res, 'Zone is required');
      }

      const result = await DeliveryPersonnelEntities.addPrimaryZone(personnelId, zone);
      return result
        ? this.sendResponse(res, result, RESPONSE.DELIVERY_PERSONNEL('Primary zone added'))
        : this.notFound(res, 'Delivery personnel not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Add secondary zone
  public async addSecondaryZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { zone } = req.body;

      if (!zone) {
        return this.badRequest(res, 'Zone is required');
      }

      const result = await DeliveryPersonnelEntities.addSecondaryZone(personnelId, zone);
      return result
        ? this.sendResponse(res, result, RESPONSE.DELIVERY_PERSONNEL('Secondary zone added'))
        : this.notFound(res, 'Delivery personnel not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Remove primary zone
  public async removePrimaryZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId, zone } = req.params;

      const result = await DeliveryPersonnelEntities.removePrimaryZone(personnelId, zone);
      return result
        ? this.sendResponse(res, result, RESPONSE.DELIVERY_PERSONNEL('Primary zone removed'))
        : this.notFound(res, 'Delivery personnel or zone not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Remove secondary zone
  public async removeSecondaryZone(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId, zone } = req.params;

      const result = await DeliveryPersonnelEntities.removeSecondaryZone(personnelId, zone);
      return result
        ? this.sendResponse(res, result, RESPONSE.DELIVERY_PERSONNEL('Secondary zone removed'))
        : this.notFound(res, 'Delivery personnel or zone not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Vehicle information management ***

  // Update vehicle info
  public async updateVehicleInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { vehicleType, vehicleNumber } = req.body;

      if (!vehicleType) {
        return this.badRequest(res, 'Vehicle type is required');
      }

      const result = await DeliveryPersonnelEntities.updateVehicleInfo(
        personnelId,
        vehicleType,
        vehicleNumber,
      );
      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.DELIVERY_PERSONNEL('Vehicle information updated'),
          )
        : this.notFound(res, 'Delivery personnel not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Availability management ***

  // Update available days
  public async updateAvailableDays(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { days } = req.body;

      if (!Array.isArray(days)) {
        return this.badRequest(res, 'Days must be an array');
      }

      const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const allValid = days.every(day => validDays.includes(day));

      if (!allValid) {
        return this.badRequest(res, 'Invalid day format. Use Mon, Tue, etc.');
      }

      const result = await DeliveryPersonnelEntities.updateAvailableDays(personnelId, days);
      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.DELIVERY_PERSONNEL('Available days updated'),
          )
        : this.notFound(res, 'Delivery personnel not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update time slots
  public async updateTimeSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { timeSlots } = req.body;

      if (!Array.isArray(timeSlots)) {
        return this.badRequest(res, 'Time slots must be an array');
      }

      const validTimeSlots = timeSlots.every(slot => slot.start && slot.end);

      if (!validTimeSlots) {
        return this.badRequest(res, 'Each time slot must have start and end times');
      }

      const result = await DeliveryPersonnelEntities.updateTimeSlots(personnelId, timeSlots);
      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.DELIVERY_PERSONNEL('Time slots updated'),
          )
        : this.notFound(res, 'Delivery personnel not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Add time slot
  public async addTimeSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { start, end } = req.body;

      if (!start || !end) {
        return this.badRequest(res, 'Start and end times are required');
      }

      const result = await DeliveryPersonnelEntities.addTimeSlot(personnelId, start, end);
      return result
        ? this.sendResponse(res, result, RESPONSE.DELIVERY_PERSONNEL('Time slot added'))
        : this.notFound(res, 'Delivery personnel not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Remove time slot
  public async removeTimeSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { start, end } = req.body;

      if (!start || !end) {
        return this.badRequest(res, 'Start and end times are required');
      }

      const result = await DeliveryPersonnelEntities.removeTimeSlot(personnelId, start, end);
      return result
        ? this.sendResponse(res, result, RESPONSE.DELIVERY_PERSONNEL('Time slot removed'))
        : this.notFound(res, 'Delivery personnel or time slot not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Capacity management ***

  // Update max deliveries per day
  public async updateMaxDeliveriesPerDay(req: Request, res: Response, next: NextFunction) {
    try {
      const { personnelId } = req.params;
      const { maxDeliveries } = req.body;

      if (!maxDeliveries || isNaN(maxDeliveries) || maxDeliveries <= 0) {
        return this.badRequest(res, 'Valid max deliveries value is required');
      }

      const result = await DeliveryPersonnelEntities.updateMaxDeliveriesPerDay(
        personnelId,
        parseInt(maxDeliveries),
      );
      return result.modifiedCount > 0
        ? this.sendResponse(
            res,
            { updated: true },
            RESPONSE.DELIVERY_PERSONNEL('Max deliveries updated'),
          )
        : this.notFound(res, 'Delivery personnel not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Aggregate delivery personnel
  public async aggregateDeliveryPersonnel(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const body = req.body;

      const pipline = builder.DELIVERY_PERSONNEL.buildDeliveryPersonnelQuery({
        ...body,
        adminId,
      });

      const options = {
        page: 1,
        limit: 10,
        getCount: true,
      };

      const result = await DeliveryPersonnelEntities.paginateAggregate(pipline, options);

      return this.sendResponse(
        res,
        result,
        RESPONSE.DELIVERY_PERSONNEL('Delivery personnel aggregated'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }
  //   /**
  //  * Find personnel that have capacity for additional deliveries
  //  */
  // public async findPersonnelWithCapacity(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { adminId, day, limit } = req.query;
  //     const minCapacity = req.query.minCapacity ? parseInt(req.query.minCapacity as string) : 1;

  //     if (minCapacity < 1) {
  //       return this.badRequest(res, "Minimum capacity must be at least 1");
  //     }

  //     const personnel = await DeliveryPersonnelEntities.findPersonnelWithCapacity(
  //       adminId as string,
  //       day as string,
  //       minCapacity,
  //       limit ? parseInt(limit as string) : undefined
  //     );

  //     return this.sendResponse(
  //       res,
  //       personnel,
  //       RESPONSE.DELIVERY_PERSONNEL("Personnel with capacity retrieved")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // /**
  //  * Get statistics about personnel workload
  //  */
  // public async getPersonnelWorkloadStats(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { adminId, date } = req.query;

  //     const dateObj = date ? new Date(date as string) : new Date();

  //     if (date && isNaN(dateObj.getTime())) {
  //       return this.badRequest(res, "Invalid date format");
  //     }

  //     const stats = await DeliveryPersonnelEntities.getPersonnelWorkloadStats(
  //       adminId as string,
  //       dateObj
  //     );

  //     return this.sendResponse(
  //       res,
  //       stats,
  //       RESPONSE.DELIVERY_PERSONNEL("Personnel workload statistics retrieved")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // /**
  //  * Count the number of delivery personnel assigned to a zone
  //  */
  // public async countPersonnelByZone(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { zone } = req.params;
  //     const { adminId, activeOnly } = req.query;

  //     if (!zone) {
  //       return this.badRequest(res, "Zone is required");
  //     }

  //     const count = await DeliveryPersonnelEntities.countPersonnelByZone(
  //       zone,
  //       adminId as string,
  //       activeOnly === 'true'
  //     );

  //     return this.sendResponse(
  //       res,
  //       { zone, count },
  //       RESPONSE.DELIVERY_PERSONNEL("Personnel count retrieved")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // /**
  //  * Get personnel with the least number of subscribers in a zone
  //  */
  // public async getPersonnelWithLeastSubscribersInZone(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { zone } = req.params;
  //     const { adminId, activeOnly, limit } = req.query;

  //     if (!zone) {
  //       return this.badRequest(res, "Zone is required");
  //     }

  //     const personnel = await DeliveryPersonnelEntities.getPersonnelWithLeastSubscribersInZone(
  //       zone,
  //       adminId as string,
  //       activeOnly === 'true',
  //       limit ? parseInt(limit as string) : 1
  //     );

  //     if (!personnel || personnel.length === 0) {
  //       return this.notFound(res, "No personnel found in this zone");
  //     }

  //     return this.sendResponse(
  //       res,
  //       personnel,
  //       RESPONSE.DELIVERY_PERSONNEL("Personnel with least subscribers retrieved")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // /**
  //  * Redistribute subscribers among personnel in a zone to balance workload
  //  */
  // public async redistributeSubscribersInZone(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { zone } = req.params;
  //     const { adminId, maxDifference, balanceStrategy } = req.body;

  //     if (!zone) {
  //       return this.badRequest(res, "Zone is required");
  //     }

  //     if (!adminId) {
  //       return this.badRequest(res, "Admin ID is required");
  //     }

  //     // Default to 5 as maximum subscriber difference between personnel if not specified
  //     const maxDiff = maxDifference || 5;

  //     // Default strategy to "even" if not specified
  //     // Options could be: "even", "proportional", "capacity-based"
  //     const strategy = balanceStrategy || "even";

  //     const result = await DeliveryPersonnelEntities.redistributeSubscribersInZone(
  //       zone,
  //       adminId,
  //       maxDiff,
  //       strategy
  //     );

  //     if (!result.success) {
  //       return this.badRequest(res, result.message || "Failed to redistribute subscribers");
  //     }

  //     return this.sendResponse(
  //       res,
  //       result,
  //       RESPONSE.DELIVERY_PERSONNEL("Subscribers redistributed successfully")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // /**
  //  * Update delivery personnel information
  //  */
  // public async updateDeliveryPersonnel(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { personnelId } = req.params;
  //     const updateData = req.body;

  //     if (!personnelId) {
  //       return this.badRequest(res, "Personnel ID is required");
  //     }

  //     if (Object.keys(updateData).length === 0) {
  //       return this.badRequest(res, "No update data provided");
  //     }

  //     const updatedPersonnel = await DeliveryPersonnelEntities.updateDeliveryPersonnel(
  //       personnelId,
  //       updateData
  //     );

  //     if (!updatedPersonnel) {
  //       return this.notFound(res, "Delivery personnel not found");
  //     }

  //     return this.sendResponse(
  //       res,
  //       updatedPersonnel,
  //       RESPONSE.DELIVERY_PERSONNEL("Delivery personnel updated")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // /**
  //  * Update delivery personnel status
  //  */
  // public async updateDeliveryPersonnelStatus(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { personnelId } = req.params;
  //     const { status } = req.body;

  //     if (!personnelId) {
  //       return this.badRequest(res, "Personnel ID is required");
  //     }

  //     if (!status) {
  //       return this.badRequest(res, "Status is required");
  //     }

  //     // Validate status value
  //     const validStatuses = ["active", "inactive", "on-leave", "terminated"];
  //     if (!validStatuses.includes(status)) {
  //       return this.badRequest(res, `Status must be one of: ${validStatuses.join(", ")}`);
  //     }

  //     const updatedPersonnel = await DeliveryPersonnelEntities.updateDeliveryPersonnelStatus(
  //       personnelId,
  //       status
  //     );

  //     if (!updatedPersonnel) {
  //       return this.notFound(res, "Delivery personnel not found");
  //     }

  //     return this.sendResponse(
  //       res,
  //       updatedPersonnel,
  //       RESPONSE.DELIVERY_PERSONNEL(`Delivery personnel status updated to ${status}`)
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }
}

export const DeliveryPersonnelController = new DeliveryPersonnelControllerClass();
