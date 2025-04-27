import { NextFunction, Request, Response, Router } from 'express';
import { DeliveryPersonnelController } from '@controllers';
import { userVerifyJWT } from '../middleware/user.verifyJWT.middleware';
import BaseRoute from './base.routes';

class DeliveryPersonnelRoute extends BaseRoute {
  public path: string;

  constructor(path: string) {
    super();
    this.path = path;
    this.init();
  }

  get instance(): Router {
    return this.router;
  }

  init() {
    // Apply JWT authentication to all routes
    this.router.use(userVerifyJWT);

    // *** IMPORTANT: Specific routes must come before parameter routes to avoid conflicts ***

    // *** Query operations ***

    // Get all active delivery personnel
    this.router.get('/active', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.getActiveDeliveryPersonnel(req, res, next);
    });

    // Get delivery personnel listing
    this.router.get('/listing', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.aggregateDeliveryPersonnel(req, res, next);
    });

    // // Find personnel with capacity
    // this.router.get(
    //   "/with-capacity",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryPersonnelController.findPersonnelWithCapacity(req, res, next);
    //   }
    // );

    // // Get personnel workload statistics
    // this.router.get(
    //   "/workload-stats",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryPersonnelController.getPersonnelWorkloadStats(req, res, next);
    //   }
    // );

    // Get personnel within radius
    this.router.get('/within-radius', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.getPersonnelWithinRadius(req, res, next);
    });

    // Get personnel for time slot
    this.router.get('/time-slot', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.getPersonnelForTimeSlot(req, res, next);
    });

    // *** Zone-specific operations ***

    // Get delivery personnel by zone
    this.router.get('/zone/:zone', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.getDeliveryPersonnelByZone(req, res, next);
    });

    // Get active delivery personnel by zone
    this.router.get('/zone/:zone/active', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.getActiveDeliveryPersonnelByZone(req, res, next);
    });

    // // Count personnel by zone
    // this.router.get(
    //   "/zone/:zone/count",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryPersonnelController.countPersonnelByZone(req, res, next);
    //   }
    // );

    // // Get personnel with least subscribers in zone
    // this.router.get(
    //   "/zone/:zone/least-subscribers",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryPersonnelController.getPersonnelWithLeastSubscribersInZone(req, res, next);
    //   }
    // );

    // // Redistribute subscribers in zone
    // this.router.post(
    //   "/zone/:zone/redistribute",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryPersonnelController.redistributeSubscribersInZone(req, res, next);
    //   }
    // );

    // Get personnel by primary zone
    this.router.get('/primary-zone/:zone', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.getPersonnelByPrimaryZone(req, res, next);
    });

    // Get personnel by secondary zone
    this.router.get('/secondary-zone/:zone', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.getPersonnelBySecondaryZone(req, res, next);
    });

    // *** Vehicle-specific operations ***

    // Get personnel by vehicle type
    this.router.get('/vehicle/:vehicleType', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.getPersonnelByVehicleType(req, res, next);
    });

    // *** Availability operations ***

    // Get available personnel by day
    this.router.get('/available/:day', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.getAvailablePersonnelByDay(req, res, next);
    });

    // *** User-related operations ***

    // Get delivery personnel by user ID
    this.router.get('/user/:userId', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.getDeliveryPersonnelByUserId(req, res, next);
    });

    // *** Subscriber-related operations ***

    // Get delivery personnel by subscriber ID
    this.router.get(
      '/subscriber/:subscriberId',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.getDeliveryPersonnelBySubscriberId(req, res, next);
      },
    );

    // *** Admin-related operations ***

    // Get personnel by admin ID
    this.router.get('/admin/:adminId', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.getPersonnelByAdminId(req, res, next);
    });

    // Get primary personnel for admin
    this.router.get(
      '/admin/:adminId/primary',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.getPrimaryPersonnelForAdmin(req, res, next);
      },
    );

    // *** Transfer operations ***

    // Transfer subscribers between personnel
    this.router.post(
      '/:fromPersonnelId/transfer/:toPersonnelId',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.transferSubscribers(req, res, next);
      },
    );

    // *** CRUD operations ***

    // Create a new delivery personnel
    this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.createDeliveryPersonnel(req, res, next);
    });

    // *** Personnel-specific operations with parameters ***

    // Get delivery personnel by ID
    this.router.get('/:personnelId', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.getDeliveryPersonnelById(req, res, next);
    });

    // // Update delivery personnel
    // this.router.put(
    //   "/:personnelId",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryPersonnelController.updateDeliveryPersonnel(req, res, next);
    //   }
    // );

    // Delete delivery personnel
    this.router.delete('/:personnelId', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.removeDeliveryPersonnel(req, res, next);
    });

    // *** Status management ***

    // Update delivery personnel status
    // this.router.put(
    //   "/:personnelId/status",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryPersonnelController.updateDeliveryPersonnelStatus(req, res, next);
    //   }
    // );

    // Toggle delivery personnel active status
    this.router.put(
      '/:personnelId/toggle-active',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.toggleActiveStatus(req, res, next);
      },
    );

    // *** Zone management ***

    // Update delivery personnel zone
    this.router.put('/:personnelId/zone', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.updateDeliveryPersonnelZone(req, res, next);
    });

    // Update primary zones
    this.router.put(
      '/:personnelId/primary-zones',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.updatePrimaryZones(req, res, next);
      },
    );

    // Update secondary zones
    this.router.put(
      '/:personnelId/secondary-zones',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.updateSecondaryZones(req, res, next);
      },
    );

    // Add primary zone
    this.router.post(
      '/:personnelId/primary-zone',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.addPrimaryZone(req, res, next);
      },
    );

    // Add secondary zone
    this.router.post(
      '/:personnelId/secondary-zone',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.addSecondaryZone(req, res, next);
      },
    );

    // Remove primary zone
    this.router.delete(
      '/:personnelId/primary-zone/:zone',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.removePrimaryZone(req, res, next);
      },
    );

    // Remove secondary zone
    this.router.delete(
      '/:personnelId/secondary-zone/:zone',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.removeSecondaryZone(req, res, next);
      },
    );

    // *** Vehicle information management ***

    // Update vehicle info
    this.router.put('/:personnelId/vehicle', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.updateVehicleInfo(req, res, next);
    });

    // *** Availability management ***

    // Update available days
    this.router.put(
      '/:personnelId/available-days',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.updateAvailableDays(req, res, next);
      },
    );

    // Update time slots
    this.router.put(
      '/:personnelId/time-slots',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.updateTimeSlots(req, res, next);
      },
    );

    // Add time slot
    this.router.post(
      '/:personnelId/time-slot',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.addTimeSlot(req, res, next);
      },
    );

    // Remove time slot
    this.router.delete(
      '/:personnelId/time-slot',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.removeTimeSlot(req, res, next);
      },
    );

    // *** Capacity management ***

    // Update max deliveries per day
    this.router.put(
      '/:personnelId/max-deliveries',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.updateMaxDeliveriesPerDay(req, res, next);
      },
    );

    // *** Admin relationship management ***

    // Assign admin to personnel
    this.router.post('/:personnelId/admin', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.assignAdmin(req, res, next);
    });

    // Remove admin from personnel
    this.router.delete(
      '/:personnelId/admin/:adminId',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.removeAdmin(req, res, next);
      },
    );

    // Set admin as primary
    this.router.put(
      '/:personnelId/admin/:adminId/primary',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.setAdminAsPrimary(req, res, next);
      },
    );

    // *** Subscriber assignment operations ***

    // Assign a single subscriber to personnel
    this.router.post('/:personnelId/assign', (req: Request, res: Response, next: NextFunction) => {
      DeliveryPersonnelController.assignSubscriber(req, res, next);
    });

    // Assign multiple subscribers to personnel
    this.router.post(
      '/:personnelId/assign-multiple',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.assignSubscribers(req, res, next);
      },
    );

    // Get assigned subscribers for a personnel
    this.router.get(
      '/:personnelId/subscribers',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.getAssignedSubscribers(req, res, next);
      },
    );

    // Remove subscriber assignment from personnel
    this.router.delete(
      '/:personnelId/subscriber/:subscriberId',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.removeSubscriber(req, res, next);
      },
    );

    // Check if personnel is assigned to specific subscriber
    this.router.get(
      '/:personnelId/check-subscriber/:subscriberId',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryPersonnelController.checkPersonnelAssignedToSubscriber(req, res, next);
      },
    );
  }
}

export default new DeliveryPersonnelRoute('/delivery-personnel');
