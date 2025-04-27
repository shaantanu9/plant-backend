import { NextFunction, Request, Response, Router } from 'express';
import { DeliveryController } from '@controllers';
import { userVerifyJWT } from '../middleware/user.verifyJWT.middleware';
import BaseRoute from './base.routes';

class DeliveryRoute extends BaseRoute {
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

    // *** Bulk operations ***

    // // Bulk create deliveries
    // this.router.post(
    //   "/bulk",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryController.bulkCreateDeliveries(req, res, next);
    //   }
    // );

    // // *** Statistics and reports ***

    // // Get delivery statistics
    this; //   "/statistics", // this.router.get(
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryController.getDeliveryStatistics(req, res, next);
    //   }
    // );

    // // Get container return efficiency
    // this.router.get(
    //   "/containers/efficiency",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryController.getContainerReturnEfficiency(req, res, next);
    //   }
    // );

    // Get delivery listing
    this.router.get('/listing', (req: Request, res: Response, next: NextFunction) => {
      DeliveryController.aggregateDeliveries(req, res, next);
    });

    // Get delivery efficiency by personnel
    this.router.get('/efficiency/personnel', (req: Request, res: Response, next: NextFunction) => {
      DeliveryController.getDeliveryEfficiencyByPersonnel(req, res, next);
    });

    // *** Admin-related routes ***

    // Get deliveries by admin ID
    this.router.get('/admin/:adminId', (req: Request, res: Response, next: NextFunction) => {
      DeliveryController.getDeliveriesByAdminId(req, res, next);
    });

    // Get deliveries by admin and date
    this.router.get('/admin/:adminId/date', (req: Request, res: Response, next: NextFunction) => {
      DeliveryController.getDeliveriesByAdminAndDate(req, res, next);
    });

    // Get admin delivery statistics
    this.router.get(
      '/admin/:adminId/statistics',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.getAdminDeliveryStatistics(req, res, next);
      },
    );

    // *** Filtered queries ***

    // // Get deliveries by date
    // this.router.get(
    //   "/date",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryController.getDeliveriesByDate(req, res, next);
    //   }
    // );

    // // Get deliveries by date range
    // this.router.get(
    //   "/range",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryController.getDeliveriesByDateRange(req, res, next);
    //   }
    // );

    // // Get deliveries by status
    // this.router.get(
    //   "/status/:status",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryController.getDeliveriesByStatus(req, res, next);
    //   }
    // );

    // // Get deliveries by date and status
    // this.router.get(
    //   "/status/:status/date",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryController.getDeliveriesByDateAndStatus(req, res, next);
    //   }
    // );

    // *** Subscription-related routes ***

    // Get deliveries by subscription ID
    this.router.get(
      '/subscription/:subscriptionId',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.getDeliveriesBySubscriptionId(req, res, next);
      },
    );

    // *** Subscriber-related routes ***

    // Get deliveries by subscriber
    this.router.get(
      '/subscriber/:subscriberId',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.getDeliveriesBySubscriberId(req, res, next);
      },
    );

    // // Get upcoming deliveries for subscriber
    // this.router.get(
    //   "/subscriber/:subscriberId/upcoming",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryController.getUpcomingDeliveriesForSubscriber(req, res, next);
    //   }
    // );

    // // Count deliveries by subscriber
    // this.router.get(
    //   "/subscriber/:subscriberId/count",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryController.countDeliveriesBySubscriber(req, res, next);
    //   }
    // );

    // Get subscriber delivery summary
    this.router.get(
      '/subscriber/:subscriberId/summary',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.getSubscriberDeliverySummary(req, res, next);
      },
    );

    // *** Personnel-related routes ***

    // Get deliveries by personnel
    this.router.get(
      '/personnel/:personnelId',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.getDeliveriesByPersonnelId(req, res, next);
      },
    );

    // // Get upcoming deliveries for personnel
    // this.router.get(
    //   "/personnel/:personnelId/upcoming",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryController.getUpcomingDeliveriesForPersonnel(req, res, next);
    //   }
    // );

    // // Get delivery statistics by personnel
    // this.router.get(
    //   "/personnel/:personnelId/statistics",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryController.getDeliveryStatisticsByPersonnel(req, res, next);
    //   }
    // );

    // // Get personnel performance report
    // this.router.get(
    //   "/personnel/:personnelId/performance",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryController.getPersonnelPerformanceReport(req, res, next);
    //   }
    // );

    // Get payment collection report for personnel
    this.router.get(
      '/personnel/:personnelId/payment-report',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.getPaymentCollectionReport(req, res, next);
      },
    );

    // Optimize route order for personnel
    this.router.post(
      '/personnel/:personnelId/optimize-route',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.optimizeRouteOrder(req, res, next);
      },
    );

    // *** Basic CRUD operations ***

    // Create a new delivery
    this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
      DeliveryController.createDelivery(req, res, next);
    });

    // *** Single delivery operations ***

    // Add subscription to delivery
    this.router.post(
      '/:deliveryId/subscription',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.addSubscriptionToDelivery(req, res, next);
      },
    );

    // Update subscription fulfillment
    this.router.put(
      '/:deliveryId/subscription/:subscriptionId/fulfillment',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.updateSubscriptionFulfillment(req, res, next);
      },
    );

    // *** Container tracking ***

    // Add delivered container
    this.router.post(
      '/:deliveryId/container/delivered',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.addDeliveredContainer(req, res, next);
      },
    );

    // Add returned container
    this.router.post(
      '/:deliveryId/container/returned',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.addReturnedContainer(req, res, next);
      },
    );

    // Update container condition
    this.router.put(
      '/:deliveryId/container/:containerId/condition',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.updateContainerCondition(req, res, next);
      },
    );

    // Verify container
    this.router.put(
      '/:deliveryId/container/:containerId/verify',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.verifyContainer(req, res, next);
      },
    );

    // Get delivered containers
    this.router.get(
      '/:deliveryId/containers/delivered',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.getDeliveredContainers(req, res, next);
      },
    );

    // Get returned containers
    this.router.get(
      '/:deliveryId/containers/returned',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.getReturnedContainers(req, res, next);
      },
    );

    // *** Status management ***

    // Update delivery status
    this.router.put('/:deliveryId/status', (req: Request, res: Response, next: NextFunction) => {
      DeliveryController.updateDeliveryStatus(req, res, next);
    });

    // Mark as in transit
    this.router.put(
      '/:deliveryId/in-transit',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.markAsInTransit(req, res, next);
      },
    );

    // Mark as delivered
    this.router.put('/:deliveryId/delivered', (req: Request, res: Response, next: NextFunction) => {
      DeliveryController.markAsDelivered(req, res, next);
    });

    // Mark as partial
    this.router.put('/:deliveryId/partial', (req: Request, res: Response, next: NextFunction) => {
      DeliveryController.markAsPartial(req, res, next);
    });

    // // Complete a delivery
    // this.router.put(
    //   "/:deliveryId/complete",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryController.completeDelivery(req, res, next);
    //   }
    // );

    // // Mark delivery as missed
    // this.router.put(
    //   "/:deliveryId/missed",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryController.markDeliveryAsMissed(req, res, next);
    //   }
    // );

    // Cancel delivery
    this.router.put('/:deliveryId/cancel', (req: Request, res: Response, next: NextFunction) => {
      DeliveryController.cancelDelivery(req, res, next);
    });

    // // Reschedule a delivery
    // this.router.put(
    //   "/:deliveryId/reschedule",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryController.rescheduleDelivery(req, res, next);
    //   }
    // );

    // *** Verification methods ***

    // Update verification method
    this.router.put(
      '/:deliveryId/verification/method',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.updateVerificationMethod(req, res, next);
      },
    );

    // Set verification data
    this.router.put(
      '/:deliveryId/verification/data',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.setVerificationData(req, res, next);
      },
    );

    // Verify with signature
    this.router.put(
      '/:deliveryId/verification/signature',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.verifyWithSignature(req, res, next);
      },
    );

    // Verify with photo
    this.router.put(
      '/:deliveryId/verification/photo',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.verifyWithPhoto(req, res, next);
      },
    );

    // Verify with code
    this.router.put(
      '/:deliveryId/verification/code',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.verifyWithCode(req, res, next);
      },
    );

    // *** Payment tracking ***

    // Update payment status
    this.router.put('/:deliveryId/payment', (req: Request, res: Response, next: NextFunction) => {
      DeliveryController.updatePaymentStatus(req, res, next);
    });

    // *** Notes management ***

    // Update subscriber notes
    this.router.put(
      '/:deliveryId/notes/subscriber',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.updateSubscriberNotes(req, res, next);
      },
    );

    // Update personnel notes
    this.router.put(
      '/:deliveryId/notes/personnel',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.updatePersonnelNotes(req, res, next);
      },
    );

    // Update delivery notes
    this.router.put('/:deliveryId/notes', (req: Request, res: Response, next: NextFunction) => {
      DeliveryController.updateDeliveryNotes(req, res, next);
    });

    // *** Container operations ***

    // Update delivered container count
    this.router.put(
      '/:deliveryId/containers/delivered',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.updateContainersDelivered(req, res, next);
      },
    );

    // Update returned container count
    this.router.put(
      '/:deliveryId/containers/returned',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.updateContainersReturned(req, res, next);
      },
    );

    // *** Route management ***

    // Update route order
    this.router.put(
      '/:deliveryId/route-order',
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.updateRouteOrder(req, res, next);
      },
    );

    // Update delivery distance
    this.router.put('/:deliveryId/distance', (req: Request, res: Response, next: NextFunction) => {
      DeliveryController.updateDeliveryDistance(req, res, next);
    });

    // // Update scheduled time
    // this.router.put(
    //   "/:deliveryId/scheduled-time",
    //   (req: Request, res: Response, next: NextFunction) => {
    //     DeliveryController.updateScheduledTime(req, res, next);
    //   }
    // );

    // *** Basic operations ***

    // Get delivery by ID
    this.router.get('/:deliveryId', (req: Request, res: Response, next: NextFunction) => {
      DeliveryController.getDeliveryById(req, res, next);
    });

    // Delete a delivery
    this.router.delete('/:deliveryId', (req: Request, res: Response, next: NextFunction) => {
      DeliveryController.removeDelivery(req, res, next);
    });

    // Delivery personnel scheduling routes
    this.router.get(
      '/personnel/:personnelId/schedule',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.getDeliveryScheduleForPersonnel(req, res, next);
      },
    );

    this.router.post(
      '/personnel/:personnelId/generate',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.generateDeliveriesForPersonnel(req, res, next);
      },
    );

    this.router.get(
      '/personnel/:personnelId/time-slots',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.getDeliveriesByTimeSlot(req, res, next);
      },
    );

    this.router.get(
      '/personnel/:personnelId/stats',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.getPersonnelDailyStats(req, res, next);
      },
    );

    this.router.post(
      '/generate-all',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.autoGenerateAllDeliveriesForDate(req, res, next);
      },
    );

    this.router.get(
      '/subscribers/by-day/:day',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.getSubscribersByDeliveryDay(req, res, next);
      },
    );

    this.router.post(
      '/subscribers/:subscriberId/assign-personnel',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.assignOptimalDeliveryPersonnel(req, res, next);
      },
    );

    this.router.get(
      '/personnel/:personnelId/pending',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.getPendingDeliveriesCount(req, res, next);
      },
    );

    this.router.get(
      '/eligibility',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        DeliveryController.checkDailyDeliveryEligibility(req, res, next);
      },
    );

    /**
     * @route GET /api/v1/delivery/admin/:adminId/eligible-subscribers
     * @desc Get subscribers eligible for manual delivery creation
     * @access Private (Admin)
     */
    this.router.get(
      '/admin/:adminId/eligible-subscribers',
      userVerifyJWT,
      DeliveryController.getEligibleSubscribersForDelivery,
    );

    /**
     * @route POST /api/v1/delivery/admin/:adminId/create-selected
     * @desc Create deliveries for manually selected subscribers
     * @access Private (Admin)
     */
    this.router.post(
      '/admin/:adminId/create-selected',
      userVerifyJWT,
      DeliveryController.createDeliveriesForSelectedSubscribers,
    );
    /**
     * @route POST /api/v1/delivery/admin/:adminId/create-with-containers
     * @desc Create deliveries for multiple subscribers with container tracking
     * @access Private (Admin)
     */
    this.router.post(
      '/admin/:adminId/create-with-containers',
      userVerifyJWT,
      DeliveryController.createDeliveriesWithContainers,
    );

    /**
     * @route GET /api/v1/delivery/admin/:adminId/unassigned-subscribers
     * @desc Get subscribers without assigned delivery personnel
     * @access Private (Admin)
     */
    this.router.get(
      '/admin/:adminId/unassigned-subscribers',
      userVerifyJWT,
      DeliveryController.getUnassignedSubscribers,
    );

    /**
     * @route GET /api/v1/delivery/personnel/with-counts
     * @desc Get delivery personnel with their subscriber counts
     * @access Private (Admin)
     */
    this.router.get(
      '/personnel/with-counts',
      userVerifyJWT,
      DeliveryController.getDeliveryPersonnelWithCounts,
    );
  }
}

export default new DeliveryRoute('/deliveries');
