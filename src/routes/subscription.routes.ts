import { NextFunction, Request, Response, Router } from 'express';
import { subscriptionController } from '@controllers';

import { userVerifyJWT } from '../middleware/user.verifyJWT.middleware';
import BaseRoute from './base.routes';

class SubscriptionRoute extends BaseRoute {
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

    // *** Bulk Operations ***

    // Get subscription listing
    this.router.get('/listing', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.aggregateSubscriptions(req, res, next);
    });
    // Bulk update status
    this.router.put('/bulk/status', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.bulkUpdateStatus(req, res);
    });

    // Bulk process billing
    this.router.post('/bulk/billing', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.bulkProcessBilling(req, res);
    });

    // get subscriber subscription details
    this.router.get(
      '/:subscriberId/subscription',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.getSubscriberSubscriptionDetails(req, res, next);
      },
    );

    // Link subscription to subscriber
    this.router.post(
      '/:subscriberId/link',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.linkSubscriptionToSubscriber(req, res, next);
      },
    );

    // Unlink subscription from subscriber
    this.router.post(
      '/:subscriberId/unlink',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.unlinkSubscriptionFromSubscriber(req, res, next);
      },
    );

    // *** Query Operations ***

    // Get subscriptions due for billing
    this.router.get('/due-for-billing', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.getSubscriptionsDueForBilling(req, res);
    });

    // Search subscriptions
    this.router.get('/search', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.searchSubscriptions(req, res);
    });

    // Get subscriptions by subscriber
    this.router.get(
      '/subscriber/:subscriberId',
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.getSubscriptionsBySubscriber(req, res);
      },
    );

    // Get active subscriptions by subscriber
    this.router.get(
      '/subscriber/:subscriberId/active',
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.getActiveSubscriptionsBySubscriber(req, res);
      },
    );

    // Get subscriptions by admin
    this.router.get('/admin/:adminId', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.getSubscriptionsByAdmin(req, res);
    });

    // Count subscriptions by admin
    this.router.get('/admin/:adminId/count', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.countSubscriptionsByAdmin(req, res);
    });

    // Count active subscriptions by admin
    this.router.get(
      '/admin/:adminId/count/active',
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.countActiveSubscriptionsByAdmin(req, res);
      },
    );

    // Get subscriptions by item
    this.router.get('/item/:itemId', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.getSubscriptionsByItem(req, res);
    });

    // Get subscriptions by status
    this.router.get('/status/:status', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.getSubscriptionsByStatus(req, res);
    });

    // Get subscriptions by delivery day
    this.router.get('/delivery-day/:day', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.getSubscriptionsByDeliveryDay(req, res);
    });

    // *** Analytics and Reporting ***

    // Get subscription stats by admin
    this.router.get('/stats/admin/:adminId', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.getSubscriptionStatsByAdmin(req, res);
    });

    // Get subscription stats by item
    this.router.get('/stats/item/:itemId', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.getSubscriptionStatsByItem(req, res);
    });

    // Get subscription growth
    this.router.get('/stats/growth/:adminId', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.getSubscriptionGrowth(req, res);
    });

    // Get revenue by frequency
    this.router.get(
      '/stats/revenue/:adminId',
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.getRevenueByFrequency(req, res);
      },
    );

    // Get top subscribers
    this.router.get(
      '/stats/top-subscribers/:adminId',
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.getTopSubscribers(req, res);
      },
    );

    // Get subscription count by day
    this.router.get(
      '/stats/count-by-day/:adminId',
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.getSubscriptionCountByDay(req, res);
      },
    );

    // Get container deposit summary
    this.router.get(
      '/stats/container-deposit/:adminId',
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.getContainerDepositSummary(req, res);
      },
    );

    // *** CRUD Operations ***

    // Create a subscription
    this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.createSubscription(req, res);
    });

    // *** Status Management for specific subscriptions ***

    // Activate subscription
    this.router.put('/:id/activate', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.activateSubscription(req, res);
    });

    // Pause subscription
    this.router.put('/:id/pause', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.pauseSubscription(req, res);
    });

    // Resume subscription
    this.router.put('/:id/resume', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.resumeSubscription(req, res);
    });

    // Cancel subscription
    this.router.put('/:id/cancel', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.cancelSubscription(req, res);
    });

    // Complete subscription
    this.router.put('/:id/complete', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.completeSubscription(req, res);
    });

    // Update status
    this.router.put('/:id/status', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.updateStatus(req, res);
    });

    // Get pause history
    this.router.get('/:id/pause-history', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.getPauseHistory(req, res);
    });

    // *** Schedule Management ***

    // Update delivery days
    this.router.put('/:id/delivery-days', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.updateDeliveryDays(req, res);
    });

    // Update time slot
    this.router.put('/:id/time-slot', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.updateTimeSlot(req, res);
    });

    // Update date range
    this.router.put('/:id/date-range', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.updateDateRange(req, res);
    });

    // Extend subscription
    this.router.put('/:id/extend', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.extendSubscription(req, res);
    });

    // *** Billing Operations ***

    // Update price
    this.router.put('/:id/price', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.updatePrice(req, res);
    });

    // Update billing cycle
    this.router.put('/:id/billing-cycle', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.updateBillingCycle(req, res);
    });

    // Update next billing date
    this.router.put('/:id/next-billing-date', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.updateNextBillingDate(req, res);
    });

    // Record payment
    this.router.post('/:id/payment', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.recordPayment(req, res);
    });

    // Get payment history
    this.router.get('/:id/payment-history', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.getPaymentHistory(req, res);
    });

    // Calculate next billing date
    this.router.post(
      '/:id/calculate-next-billing',
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.calculateNextBillingDate(req, res);
      },
    );

    // *** Container Management ***

    // Assign container
    this.router.post('/:id/container', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.assignContainer(req, res);
    });

    // Remove container
    this.router.delete(
      '/:id/container/:containerId',
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.removeContainer(req, res);
      },
    );

    // Get assigned containers
    this.router.get('/:id/containers', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.getAssignedContainers(req, res);
    });

    // Update pending container returns
    this.router.put(
      '/:id/pending-containers',
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.updatePendingContainerReturns(req, res);
      },
    );

    // Increment pending container returns
    this.router.put(
      '/:id/pending-containers/increment',
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.incrementPendingContainerReturns(req, res);
      },
    );

    // Decrement pending container returns
    this.router.put(
      '/:id/pending-containers/decrement',
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.decrementPendingContainerReturns(req, res);
      },
    );

    // Update deposit paid
    this.router.put('/:id/deposit', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.updateDepositPaid(req, res);
    });

    // *** Special Instructions ***

    // Update delivery instructions
    this.router.put(
      '/:id/delivery-instructions',
      (req: Request, res: Response, next: NextFunction) => {
        subscriptionController.updateDeliveryInstructions(req, res);
      },
    );

    // *** Basic subscription operations ***

    // Get subscription details
    this.router.get('/:id/details', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.getSubscriptionDetails(req, res);
    });

    // Get subscription by ID
    this.router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.getSubscriptionById(req, res);
    });

    // Update subscription
    this.router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.updateSubscription(req, res);
    });

    // Delete subscription
    this.router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
      subscriptionController.deleteSubscription(req, res);
    });

    ///////
    // Digital Referrals
    // Enhanced query routes
    this.router.get(
      '/subscriber/:subscriberId/filter',
      userVerifyJWT,
      subscriptionController.getSubscriptionsBySubscriberWithFilter,
    );
    this.router.get(
      '/subscriber/:subscriberId/active/filter',
      userVerifyJWT,
      subscriptionController.getActiveSubscriptionsBySubscriberWithFilter,
    );
    this.router.get(
      '/admin/:adminId/filter',
      userVerifyJWT,
      subscriptionController.getSubscriptionsByAdminWithFilter,
    );
    this.router.get(
      '/platform/:platform',
      userVerifyJWT,
      subscriptionController.getSubscriptionsByPlatform,
    );
    this.router.get(
      '/upcoming-renewals',
      userVerifyJWT,
      subscriptionController.getUpcomingRenewals,
    );
    this.router.get(
      '/upcoming-payments',
      userVerifyJWT,
      subscriptionController.getUpcomingPayments,
    );
    this.router.get(
      '/search/enhanced',
      userVerifyJWT,
      subscriptionController.enhancedSearchSubscriptions,
    );

    // Digital subscription management
    this.router.put(
      '/:id/digital-details',
      userVerifyJWT,
      subscriptionController.updateDigitalSubscriptionDetails,
    );
    this.router.post('/:id/shared-user', userVerifyJWT, subscriptionController.addSharedUser);
    this.router.delete(
      '/:id/shared-user/:userId',
      userVerifyJWT,
      subscriptionController.removeSharedUser,
    );
    this.router.get(
      '/shared-with/:userId',
      userVerifyJWT,
      subscriptionController.getSubscriptionsSharedWithUser,
    );

    // Enhanced billing operations
    this.router.put('/:id/pricing', userVerifyJWT, subscriptionController.updatePricing);
    this.router.post(
      '/:id/payment-details',
      userVerifyJWT,
      subscriptionController.recordPaymentWithDetails,
    );

    // Enhanced cancellation
    this.router.put(
      '/:id/cancel-details',
      userVerifyJWT,
      subscriptionController.cancelSubscriptionWithDetails,
    );

    // Trial management
    this.router.post(
      '/:id/start-trial',
      userVerifyJWT,
      subscriptionController.startTrialSubscription,
    );
    this.router.post(
      '/:id/convert-trial',
      userVerifyJWT,
      subscriptionController.convertTrialToPaid,
    );

    // Analytics and reporting
    this.router.get(
      '/subscriber/:subscriberId/analytics',
      userVerifyJWT,
      subscriptionController.getSubscriberSubscriptionAnalytics,
    );
    this.router.get(
      '/category-analysis',
      userVerifyJWT,
      subscriptionController.getSubscriptionsByCategory,
    );
    this.router.get(
      '/subscriber/:subscriberId/monthly-costs',
      userVerifyJWT,
      subscriptionController.getMonthlySubscriptionCosts,
    );
  }
}

export default new SubscriptionRoute('/subscriptions');
