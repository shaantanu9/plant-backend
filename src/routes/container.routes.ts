import { NextFunction, Request, Response, Router } from 'express';
import { ContainerController } from '@controllers';
import { userVerifyJWT } from '../middleware/user.verifyJWT.middleware';
import BaseRoute from './base.routes';

class ContainerRoute extends BaseRoute {
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
    // Get Admin Container
    this.router.get('/listing', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.aggregateContainers(req, res, next);
    });

    // Bulk create containers
    this.router.post('/bulk', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.bulkCreateContainers(req, res, next);
    });

    // Bulk update containers as returned
    this.router.put('/bulk/return', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.bulkUpdateContainersAsReturned(req, res, next);
    });

    // Bulk mark containers as lost
    this.router.put('/bulk/lost', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.bulkMarkContainersAsLost(req, res, next);
    });

    // *** Search operations ***

    // Search containers
    this.router.post('/search', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.searchContainers(req, res, next);
    });

    // *** Query operations - by subscriber ***

    // Get containers by subscriber ID
    this.router.get(
      '/subscriber/:subscriberId',
      (req: Request, res: Response, next: NextFunction) => {
        ContainerController.getContainersBySubscriberId(req, res, next);
      },
    );

    // Get container statistics for a subscriber
    this.router.get(
      '/subscriber/:subscriberId/stats',
      (req: Request, res: Response, next: NextFunction) => {
        ContainerController.getContainerStatsBySubscriber(req, res, next);
      },
    );

    // Get containers by subscriber ID and status
    this.router.get(
      '/subscriber/:subscriberId/status/:status',
      (req: Request, res: Response, next: NextFunction) => {
        ContainerController.getContainersBySubscriberIdAndStatus(req, res, next);
      },
    );

    // Count containers by subscriber and status
    this.router.get(
      '/subscriber/:subscriberId/status/:status/count',
      (req: Request, res: Response, next: NextFunction) => {
        ContainerController.countContainersBySubscriberAndStatus(req, res, next);
      },
    );

    // *** Query operations - by delivery ***

    // Get containers by delivery ID
    this.router.get('/delivery/:deliveryId', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.getContainersByDeliveryId(req, res, next);
    });

    // Get containers by return delivery ID
    this.router.get(
      '/return-delivery/:returnDeliveryId',
      (req: Request, res: Response, next: NextFunction) => {
        ContainerController.getContainersByReturnDeliveryId(req, res, next);
      },
    );

    // *** Query operations - by subscription ***

    // Get containers by subscription ID
    this.router.get(
      '/subscription/:subscriptionId',
      (req: Request, res: Response, next: NextFunction) => {
        ContainerController.getContainersBySubscriptionId(req, res, next);
      },
    );

    // *** Query operations - by item ***

    // Get containers by item ID
    this.router.get('/item/:itemId', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.getContainersByItemId(req, res, next);
    });

    // *** Query operations - by identifiers ***

    // Get container by serial number
    this.router.get('/serial/:serialNumber', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.getContainersBySerialNumber(req, res, next);
    });

    // Get container by QR code
    this.router.get('/qr/:qrCode', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.getContainersByQrCode(req, res, next);
    });

    // *** Query operations - by status/condition ***

    // Get containers by status
    this.router.get('/status/:status', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.getContainersByStatus(req, res, next);
    });

    // Get containers by condition
    this.router.get('/condition/:condition', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.getContainersByCondition(req, res, next);
    });

    // *** Analytics and reporting ***

    // Get containers created after a specific date
    this.router.get('/created-after/:date', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.getContainersCreatedAfterDate(req, res, next);
    });

    // Find overdue containers
    this.router.get('/overdue/:days', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.findOverdueContainers(req, res, next);
    });

    // Get container statistics by admin
    this.router.get('/stats/admin/:adminId', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.getContainerStatsByAdmin(req, res, next);
    });

    // Get container statistics by condition
    this.router.get(
      '/stats/condition/:adminId',
      (req: Request, res: Response, next: NextFunction) => {
        ContainerController.getContainerStatsByCondition(req, res, next);
      },
    );

    // Get container inventory summary
    this.router.get('/inventory/:adminId', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.getContainerInventorySummary(req, res, next);
    });

    // Get deposit statistics
    this.router.get('/deposits/:adminId', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.getDepositStatistics(req, res, next);
    });

    // *** Basic CRUD operations ***

    // Create a new container
    this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.createContainer(req, res, next);
    });

    // *** Container status management ***

    // Get container status history
    this.router.get('/:containerId/history', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.getStatusHistory(req, res, next);
    });

    // Update container status
    this.router.put('/:containerId/status', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.updateContainerStatus(req, res, next);
    });

    // *** Assignment operations ***

    // Assign container to subscriber
    this.router.put('/:containerId/assign', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.assignToSubscriber(req, res, next);
    });

    // Mark container as in transit to subscriber
    this.router.put(
      '/:containerId/transit-out',
      (req: Request, res: Response, next: NextFunction) => {
        ContainerController.markInTransitToSubscriber(req, res, next);
      },
    );

    // Mark container as with subscriber
    this.router.put(
      '/:containerId/with-subscriber',
      (req: Request, res: Response, next: NextFunction) => {
        ContainerController.markWithSubscriber(req, res, next);
      },
    );

    // Mark container as in transit to warehouse
    this.router.put(
      '/:containerId/transit-in',
      (req: Request, res: Response, next: NextFunction) => {
        ContainerController.markInTransitToWarehouse(req, res, next);
      },
    );

    // Mark container as returned
    this.router.put('/:containerId/returned', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.markReturned(req, res, next);
    });

    // *** Maintenance operations ***

    // Record container maintenance
    this.router.post(
      '/:containerId/maintenance',
      (req: Request, res: Response, next: NextFunction) => {
        ContainerController.recordMaintenance(req, res, next);
      },
    );

    // Mark container as cleaned
    this.router.put('/:containerId/cleaned', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.markCleaned(req, res, next);
    });

    // Update container condition
    this.router.put(
      '/:containerId/condition',
      (req: Request, res: Response, next: NextFunction) => {
        ContainerController.updateCondition(req, res, next);
      },
    );

    // Mark container as under maintenance
    this.router.put(
      '/:containerId/under-maintenance',
      (req: Request, res: Response, next: NextFunction) => {
        ContainerController.markUnderMaintenance(req, res, next);
      },
    );

    // Mark container as back in inventory
    this.router.put(
      '/:containerId/inventory',
      (req: Request, res: Response, next: NextFunction) => {
        ContainerController.markBackInInventory(req, res, next);
      },
    );

    // *** Deposit management ***

    // Mark container deposit as collected
    this.router.put(
      '/:containerId/deposit/collect',
      (req: Request, res: Response, next: NextFunction) => {
        ContainerController.markDepositCollected(req, res, next);
      },
    );

    // Mark container deposit as refunded
    this.router.put(
      '/:containerId/deposit/refund',
      (req: Request, res: Response, next: NextFunction) => {
        ContainerController.markDepositRefunded(req, res, next);
      },
    );

    // *** Basic operations ***

    // Get container by ID
    this.router.get('/:containerId', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.getContainerById(req, res, next);
    });

    // Delete container
    this.router.delete('/:containerId', (req: Request, res: Response, next: NextFunction) => {
      ContainerController.deleteContainer(req, res, next);
    });
  }
}

export default new ContainerRoute('/containers');
