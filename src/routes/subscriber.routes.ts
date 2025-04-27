import { NextFunction, Request, Response, Router } from 'express';
import { SubscriberController } from '@controllers';
import { userVerifyJWT, validator } from '@middleware';
import BaseRoute from './base.routes';
import { CreateSubscriberSchema } from '../schemas/subscriber.schema';

// import { subscriberSchema } from "@schemas";

class SubscriberRoute extends BaseRoute {
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
    // *** IMPORTANT: Specific routes must come before parameter routes to avoid conflicts ***

    // *** Basic CRUD operations ***

    // Get subscriber listing
    this.router.get('/listing', (req: Request, res: Response, next: NextFunction) => {
      SubscriberController.aggregateSubscribers(req, res, next);
    });
    // Create a new subscriber
    this.router.post(
      '/',
      // userVerifyJWT,
      validator(CreateSubscriberSchema, 'body'),
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.createSubscriber(req, res, next);
      },
    );

    // get subscribers subscription details
    this.router.get(
      '/:subscriberId/subscription',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.getSubscriberSubscriptionDetails(req, res, next);
      },
    );

    // Get all subscribers with optional filtering
    this.router.get('/', userVerifyJWT, (req: Request, res: Response, next: NextFunction) => {
      SubscriberController.getAllSubscribers(req, res, next);
    });

    // *** Advanced Query operations ***

    // Get active subscribers
    this.router.get('/active', userVerifyJWT, (req: Request, res: Response, next: NextFunction) => {
      SubscriberController.getActiveSubscribers(req, res, next);
    });

    // Get subscribers by subscription type
    this.router.get(
      '/type/:subscriptionType',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.getSubscribersByType(req, res, next);
      },
    );

    // Get subscribers by zone
    this.router.get(
      '/zone/:zone',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.getSubscribersByZone(req, res, next);
      },
    );

    // Get subscribers by delivery personnel
    this.router.get(
      '/personnel/:personnelId',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.getSubscribersByDeliveryPersonnel(req, res, next);
      },
    );

    // Get subscribers by delivery day
    this.router.get(
      '/day/:day',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.getSubscribersByDeliveryDay(req, res, next);
      },
    );

    // Get subscribers without assigned delivery personnel
    this.router.get(
      '/unassigned',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.getSubscribersWithoutPersonnel(req, res, next);
      },
    );

    // Get subscribers with pending containers
    this.router.get(
      '/pending-containers',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.getSubscribersWithPendingContainers(req, res, next);
      },
    );

    // *** Geographic operations ***

    // // Get nearby subscribers
    // this.router.get(
    //   "/nearby",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.getNearbySubscribers(req, res, next);
    //   }
    // );

    // // Get subscribers by radius
    // this.router.get(
    //   "/radius",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.getSubscribersByRadius(req, res, next);
    //   }
    // );

    // *** Search operations ***

    // Search subscribers
    this.router.get('/search', userVerifyJWT, (req: Request, res: Response, next: NextFunction) => {
      SubscriberController.searchSubscribers(req, res, next);
    });

    // *** Analytics operations ***

    // Count subscribers by zone
    this.router.get(
      '/counts/zone',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.countSubscribersByZone(req, res, next);
      },
    );

    // Count subscribers by subscription type
    this.router.get(
      '/counts/type',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.countSubscribersByType(req, res, next);
      },
    );

    // // Count subscribers by day
    // this.router.get(
    //   "/counts/day",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.countSubscribersByDay(req, res, next);
    //   }
    // );

    // Count subscribers by admin
    this.router.get(
      '/counts/admin',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.countSubscribersByAdmin(req, res, next);
      },
    );

    // Get container statistics
    this.router.get(
      '/stats/containers',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.getContainerStatistics(req, res, next);
      },
    );

    // Get container statistics by admin
    this.router.get(
      '/stats/containers/:adminId',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.getContainerStatisticsByAdmin(req, res, next);
      },
    );

    // Get top subscribers by pending containers
    this.router.get(
      '/top/pending-containers',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.getTopSubscribersByPendingContainers(req, res, next);
      },
    );

    // Get subscriber growth by join date
    // this.router.get(
    //   "/stats/growth",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.getSubscribersByJoinDate(req, res, next);
    //   }
    // );

    // // Get overall subscriber stats
    // this.router.get(
    //   "/stats",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.getSubscriberStats(req, res, next);
    //   }
    // );

    // // *** Admin-related operations ***

    // // Get subscribers by admin
    // this.router.get(
    //   "/admin/:adminId",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.getSubscribersByAdmin(req, res, next);
    //   }
    // );

    // // Get primary subscribers for admin
    // this.router.get(
    //   "/primary/:adminId",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.getPrimarySubscribers(req, res, next);
    //   }
    // );

    // // *** Delivery operations ***

    // // Get subscribers for today's deliveries
    // this.router.get(
    //   "/deliveries/today",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.findDeliveriesForToday(req, res, next);
    //   }
    // );

    // // Get unassigned subscribers by zone
    // this.router.get(
    //   "/unassigned/zone/:zone",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.getUnassignedSubscribersByZone(req, res, next);
    //   }
    // );

    // // *** Bulk operations ***

    // // Bulk add subscribers
    // this.router.post(
    //   "/bulk",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.bulkAddSubscribers(req, res, next);
    //   }
    // );

    // // Bulk update zones
    // this.router.post(
    //   "/bulk/zones",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.bulkUpdateZones(req, res, next);
    //   }
    // );

    // // Bulk assign delivery personnel
    // this.router.post(
    //   "/bulk/assign/:personnelId",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.bulkAssignDeliveryPersonnel(req, res, next);
    //   }
    // );

    // // Redistribute subscribers between personnel
    // this.router.post(
    //   "/redistribute",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.redistributeSubscribers(req, res, next);
    //   }
    // );

    // *** User-specific operations ***

    // Get subscriber by user ID
    this.router.get(
      '/user/:userId',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.getSubscriberByUserId(req, res, next);
      },
    );

    // Update subscriber by user ID
    this.router.put(
      '/user/:userId',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.updateSubscriber(req, res, next);
      },
    );

    // Delete subscriber by user ID
    this.router.delete(
      '/user/:userId',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.deleteSubscriber(req, res, next);
      },
    );

    // *** Subscriber operations by ID ***

    // Get subscriber by ID
    this.router.get(
      '/:subscriberId',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.getSubscriberById(req, res, next);
      },
    );

    // // Get subscriber with detailed information
    // this.router.get(
    //   "/:subscriberId/details",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.getSubscriberWithDetails(req, res, next);
    //   }
    // );

    // Update subscriber by ID
    this.router.put(
      '/:subscriberId',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.updateSubscriberById(req, res, next);
      },
    );

    // Delete subscriber by ID
    this.router.delete(
      '/:subscriberId',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.deleteSubscriberById(req, res, next);
      },
    );

    // // *** Address management ***

    // // Update address
    // this.router.put(
    //   "/:subscriberId/address",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.updateAddress(req, res, next);
    //   }
    // );

    // // Update coordinates
    // this.router.put(
    //   "/:subscriberId/coordinates",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.updateCoordinates(req, res, next);
    //   }
    // );

    // // *** Delivery preferences ***

    // // Update preferred time slot
    // this.router.put(
    //   "/:subscriberId/time-slot",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.updatePreferredTimeSlot(req, res, next);
    //   }
    // );

    // // Update alternate recipient
    // this.router.put(
    //   "/:subscriberId/alternate-recipient",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.updateAlternateRecipient(req, res, next);
    //   }
    // );

    // // Update delivery instructions
    // this.router.put(
    //   "/:subscriberId/delivery-instructions",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.updateDeliveryInstructions(req, res, next);
    //   }
    // );

    // *** Container management ***

    // Update container count
    this.router.put(
      '/:subscriberId/containers',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.updateContainerCount(req, res, next);
      },
    );

    // Increment container count
    this.router.post(
      '/:subscriberId/containers/increment',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.incrementContainerCount(req, res, next);
      },
    );

    // Decrement pending containers
    this.router.post(
      '/:subscriberId/containers/decrement',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.decrementPendingContainers(req, res, next);
      },
    );

    // // Update deposit balance
    // this.router.put(
    //   "/:subscriberId/deposit",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.updateDepositBalance(req, res, next);
    //   }
    // );

    // // Add to deposit balance
    // this.router.post(
    //   "/:subscriberId/deposit/add",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.addToDepositBalance(req, res, next);
    //   }
    // );

    // // Subtract from deposit balance
    // this.router.post(
    //   "/:subscriberId/deposit/subtract",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.subtractFromDepositBalance(req, res, next);
    //   }
    // );

    // // *** Subscription references ***

    // // Add active subscription
    // this.router.post(
    //   "/:subscriberId/subscriptions",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.addActiveSubscription(req, res, next);
    //   }
    // );

    // // Remove active subscription
    // this.router.delete(
    //   "/:subscriberId/subscriptions/:subscriptionId",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.removeActiveSubscription(req, res, next);
    //   }
    // );

    // // Get active subscriptions
    // this.router.get(
    //   "/:subscriberId/subscriptions",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.getActiveSubscriptions(req, res, next);
    //   }
    // );

    // // *** Admin relationship management ***

    // // Set primary admin
    // this.router.put(
    //   "/:subscriberId/admin/primary",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.setPrimaryAdmin(req, res, next);
    //   }
    // );

    // // Add related admin
    // this.router.post(
    //   "/:subscriberId/admin/related",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.addRelatedAdmin(req, res, next);
    //   }
    // );

    // // Remove related admin
    // this.router.delete(
    //   "/:subscriberId/admin/related/:adminId",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.removeRelatedAdmin(req, res, next);
    //   }
    // );

    // *** Delivery personnel assignment ***

    // Assign delivery personnel
    this.router.put(
      '/:subscriberId/personnel',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.assignDeliveryPersonnel(req, res, next);
      },
    );

    // Remove delivery personnel assignment
    this.router.delete(
      '/:subscriberId/personnel',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.removeDeliveryPersonnel(req, res, next);
      },
    );

    // // *** Notification preferences ***

    // // Update reminder enabled
    // this.router.put(
    //   "/:subscriberId/reminders",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.updateReminderEnabled(req, res, next);
    //   }
    // );

    // // Update notification preferences
    // this.router.put(
    //   "/:subscriberId/notifications",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.updateNotificationPreferences(req, res, next);
    //   }
    // );

    // Get subscribers for specific reminders
    // this.router.get(
    //   "/reminders/:reminderType",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.getSubscribersForReminders(req, res, next);
    //   }
    // );

    // *** Status management ***

    // Toggle active status
    this.router.put(
      '/:subscriberId/status/active',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.toggleActiveStatus(req, res, next);
      },
    );

    // Toggle swap enabled
    this.router.put(
      '/:subscriberId/status/swap',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.toggleSwapEnabled(req, res, next);
      },
    );

    // Update delivery days
    this.router.put(
      '/:subscriberId/days',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.updateDeliveryDays(req, res, next);
      },
    );

    // Update subscription type
    this.router.put(
      '/:subscriberId/subscription-type',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        SubscriberController.updateSubscriptionType(req, res, next);
      },
    );

    // Update last delivery date
    // this.router.put(
    //   "/:subscriberId/last-delivery",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.updateLastDeliveryDate(req, res, next);
    //   }
    // );

    // *** Payment information ***

    // // Update payment method
    // this.router.put(
    //   "/:subscriberId/payment-method",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.updatePaymentMethod(req, res, next);
    //   }
    // );

    // // Update billing address
    // this.router.put(
    //   "/:subscriberId/billing-address",
    //   userVerifyJWT,
    //   (req: Request, res: Response, next: NextFunction) => {
    //     SubscriberController.updateBillingAddress(req, res, next);
    //   }
    // );

    // Digital Referrals
    /**
     * @route GET /api/v1/subscribers/filter
     * @desc Get subscribers with filtering capabilities
     * @access Private (Admin)
     */
    this.router.get('/filter', userVerifyJWT, SubscriberController.getSubscribersWithFilters);

    /**
     * @route POST /api/v1/subscribers/bulk-assign
     * @desc Bulk assign delivery personnel to subscribers
     * @access Private (Admin)
     */
    this.router.post(
      '/bulk-assign',
      userVerifyJWT,
      SubscriberController.bulkAssignDeliveryPersonnel,
    );

    /**
     * @route GET /api/v1/subscribers/filter
     * @desc Get subscribers with filtering capabilities
     * @access Private (Admin)
     */
    this.router.get('/filter', userVerifyJWT, SubscriberController.getSubscribersWithFilters);

    /**
     * @route POST /api/v1/subscribers/bulk-assign
     * @desc Bulk assign delivery personnel to subscribers
     * @access Private (Admin)
     */
    this.router.post(
      '/bulk-assign',
      userVerifyJWT,
      SubscriberController.bulkAssignDeliveryPersonnel,
    );
  }
}

export default new SubscriberRoute('/subscribers');
