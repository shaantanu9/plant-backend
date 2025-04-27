// import { ContainerEntities } from "@entity";
// import BaseController from "./base.controller";
// import { Request, Response, NextFunction } from "express";
// import { RESPONSE } from "@response";

// class ContainerControllerClass extends BaseController {
//   constructor() {
//     super();
//   }

//   // Create a new container
//   public async createContainer(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const container = await ContainerEntities.addContainer(req.body);
//       return this.sendResponse(
//         res,
//         container,
//         RESPONSE.CONTAINER("Container created")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get container by ID
//   public async getContainerById(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { containerId } = req.params;
//       const container = await ContainerEntities.getContainerById(containerId);
//       return container
//         ? this.sendResponse(
//             res,
//             container,
//             RESPONSE.CONTAINER("Container found")
//           )
//         : this.notFound(res, "Container not found");
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get containers by subscriber ID
//   public async getContainersBySubscriberId(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { subscriberId } = req.params;
//       const containers = await ContainerEntities.getContainersBySubscriberId(
//         subscriberId
//       );
//       return this.sendResponse(
//         res,
//         containers,
//         RESPONSE.CONTAINER("Containers retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Update container status
//   public async updateContainerStatus(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { containerId } = req.params;
//       const { status } = req.body;

//       if (!["with-subscriber", "returned", "lost"].includes(status)) {
//         return this.badRequest(res, "Invalid status value");
//       }

//       const container = await ContainerEntities.modifyContainerStatusById(
//         containerId,
//         status
//       );
//       return container
//         ? this.sendResponse(
//             res,
//             container,
//             RESPONSE.CONTAINER("Container status updated")
//           )
//         : this.notFound(res, "Container not found");
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Delete container
//   public async deleteContainer(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { containerId } = req.params;
//       const result = await ContainerEntities.removeContainerById(containerId);
//       return result?.success
//         ? this.sendResponse(
//             res,
//             { deleted: true },
//             RESPONSE.CONTAINER("Container deleted")
//           )
//         : this.notFound(res, "Container not found");
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Bulk create containers
//   public async bulkCreateContainers(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { subscriberId, deliveryId, count } = req.body;

//       if (!subscriberId || !deliveryId || !count || count <= 0) {
//         return this.badRequest(res, "Missing or invalid required parameters");
//       }

//       const containers = await ContainerEntities.bulkCreateContainers(
//         subscriberId,
//         deliveryId,
//         count
//       );
//       return this.sendResponse(
//         res,
//         containers,
//         RESPONSE.CONTAINER(`${containers.length} containers created`)
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get containers by delivery ID
//   public async getContainersByDeliveryId(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { deliveryId } = req.params;
//       const containers = await ContainerEntities.getContainersByDeliveryId(
//         deliveryId
//       );
//       return this.sendResponse(
//         res,
//         containers,
//         RESPONSE.CONTAINER("Containers retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get containers by return delivery ID
//   public async getContainersByReturnDeliveryId(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { returnDeliveryId } = req.params;
//       const containers =
//         await ContainerEntities.getContainersByReturnDeliveryId(
//           returnDeliveryId
//         );
//       return this.sendResponse(
//         res,
//         containers,
//         RESPONSE.CONTAINER("Containers retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get containers by status
//   public async getContainersByStatus(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { status } = req.params;

//       if (!["with-subscriber", "returned", "lost"].includes(status)) {
//         return this.badRequest(res, "Invalid status value");
//       }

//       const containers = await ContainerEntities.getContainersByStatus(status);
//       return this.sendResponse(
//         res,
//         containers,
//         RESPONSE.CONTAINER("Containers retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get containers by subscriber ID and status
//   public async getContainersBySubscriberIdAndStatus(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { subscriberId, status } = req.params;

//       if (!["with-subscriber", "returned", "lost"].includes(status)) {
//         return this.badRequest(res, "Invalid status value");
//       }

//       const containers =
//         await ContainerEntities.getContainersBySubscriberIdAndStatus(
//           subscriberId,
//           status
//         );
//       return this.sendResponse(
//         res,
//         containers,
//         RESPONSE.CONTAINER("Containers retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Count containers by subscriber and status
//   public async countContainersBySubscriberAndStatus(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { subscriberId, status } = req.params;

//       if (!["with-subscriber", "returned", "lost"].includes(status)) {
//         return this.badRequest(res, "Invalid status value");
//       }

//       const count =
//         await ContainerEntities.countContainersBySubscriberAndStatus(
//           subscriberId,
//           status
//         );
//       return this.sendResponse(
//         res,
//         { count },
//         RESPONSE.CONTAINER("Container count retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Update container return delivery
//   public async updateContainerReturnDelivery(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { containerId } = req.params;
//       const { returnDeliveryId } = req.body;

//       if (!returnDeliveryId) {
//         return this.badRequest(res, "Return delivery ID is required");
//       }

//       const container = await ContainerEntities.updateContainerReturnDelivery(
//         containerId,
//         returnDeliveryId
//       );
//       return container
//         ? this.sendResponse(
//             res,
//             container,
//             RESPONSE.CONTAINER("Container return delivery updated")
//           )
//         : this.notFound(res, "Container not found");
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Bulk update containers as returned
//   public async bulkUpdateContainersAsReturned(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { containerIds, returnDeliveryId } = req.body;

//       if (
//         !containerIds ||
//         !Array.isArray(containerIds) ||
//         containerIds.length === 0 ||
//         !returnDeliveryId
//       ) {
//         return this.badRequest(
//           res,
//           "Valid container IDs array and return delivery ID are required"
//         );
//       }

//       const result = await ContainerEntities.bulkUpdateContainersAsReturned(
//         containerIds,
//         returnDeliveryId
//       );
//       return this.sendResponse(
//         res,
//         { modifiedCount: result.modifiedCount },
//         RESPONSE.CONTAINER(
//           `${result.modifiedCount} containers marked as returned`
//         )
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Bulk mark containers as lost
//   public async bulkMarkContainersAsLost(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { containerIds } = req.body;

//       if (
//         !containerIds ||
//         !Array.isArray(containerIds) ||
//         containerIds.length === 0
//       ) {
//         return this.badRequest(res, "Valid container IDs array is required");
//       }

//       const result = await ContainerEntities.bulkMarkContainersAsLost(
//         containerIds
//       );
//       return this.sendResponse(
//         res,
//         { modifiedCount: result.modifiedCount },
//         RESPONSE.CONTAINER(`${result.modifiedCount} containers marked as lost`)
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get container statistics for a subscriber
//   public async getContainerStatsBySubscriber(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { subscriberId } = req.params;
//       const stats = await ContainerEntities.getContainerStatsBySubscriber(
//         subscriberId
//       );
//       return this.sendResponse(
//         res,
//         stats,
//         RESPONSE.CONTAINER("Container statistics retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get containers created after a specific date
//   public async getContainersCreatedAfterDate(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { date } = req.params;

//       if (!date) {
//         return this.badRequest(res, "Date parameter is required");
//       }

//       const dateObj = new Date(date);
//       if (isNaN(dateObj.getTime())) {
//         return this.badRequest(res, "Invalid date format");
//       }

//       const containers = await ContainerEntities.getContainersCreatedAfterDate(
//         dateObj
//       );
//       return this.sendResponse(
//         res,
//         containers,
//         RESPONSE.CONTAINER("Containers retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Find overdue containers
//   public async findOverdueContainers(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { days } = req.params;
//       const daysNumber = parseInt(days);

//       if (isNaN(daysNumber) || daysNumber <= 0) {
//         return this.badRequest(res, "Valid days parameter is required");
//       }

//       const containers = await ContainerEntities.findOverdueContainers(
//         daysNumber
//       );
//       return this.sendResponse(
//         res,
//         containers,
//         RESPONSE.CONTAINER("Overdue containers retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get container summary by delivery
//   public async getContainerSummaryByDelivery(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { deliveryId } = req.params;
//       const summary = await ContainerEntities.getContainerSummaryByDelivery(
//         deliveryId
//       );
//       return this.sendResponse(
//         res,
//         summary,
//         RESPONSE.CONTAINER("Container summary retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }
// }

// export const ContainerController = new ContainerControllerClass();

import { NextFunction, Request, Response } from 'express';
import builder from '@builders';
import { ContainerEntities } from '@entity';
import { RESPONSE } from '@response';
import BaseController from './base.controller';

class ContainerControllerClass extends BaseController {
  constructor() {
    super();
  }

  // *** Basic CRUD operations ***

  // Create a new container
  public async createContainer(req: Request, res: Response, next: NextFunction) {
    try {
      const container = await ContainerEntities.addContainer(req.body);
      return this.sendResponse(res, container, RESPONSE.CONTAINER('Container created'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get container by ID
  public async getContainerById(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerId } = req.params;
      const container = await ContainerEntities.getContainerById(containerId);
      return container
        ? this.sendResponse(res, container, RESPONSE.CONTAINER('Container found'))
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Delete container
  public async deleteContainer(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerId } = req.params;
      const result = await ContainerEntities.removeContainerById(containerId);
      return result?.success
        ? this.sendResponse(res, { deleted: true }, RESPONSE.CONTAINER('Container deleted'))
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Bulk operations ***

  // Bulk create containers
  public async bulkCreateContainers(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId, containerType, count, baseProps } = req.body;

      if (!adminId || !containerType || !count || count <= 0) {
        return this.badRequest(res, 'Missing or invalid required parameters');
      }

      const result = await ContainerEntities.bulkCreateContainers(
        adminId,
        containerType,
        count,
        baseProps || {},
      );

      return this.sendResponse(
        res,
        result,
        RESPONSE.CONTAINER(`${result.insertedCount} containers created`),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Bulk update containers as returned
  public async bulkUpdateContainersAsReturned(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerIds, returnDeliveryId, userId } = req.body;

      if (
        !containerIds ||
        !Array.isArray(containerIds) ||
        containerIds.length === 0 ||
        !returnDeliveryId ||
        !userId
      ) {
        return this.badRequest(
          res,
          'Valid container IDs array, return delivery ID, and user ID are required',
        );
      }

      const result = await ContainerEntities.bulkUpdateContainersAsReturned(
        containerIds,
        returnDeliveryId,
        userId,
      );

      return this.sendResponse(
        res,
        { modifiedCount: result.modifiedCount },
        RESPONSE.CONTAINER(`${result.modifiedCount} containers marked as returned`),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Bulk mark containers as lost
  public async bulkMarkContainersAsLost(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerIds, userId, notes } = req.body;

      if (!containerIds || !Array.isArray(containerIds) || containerIds.length === 0 || !userId) {
        return this.badRequest(res, 'Valid container IDs array and user ID are required');
      }

      const result = await ContainerEntities.bulkMarkContainersAsLost(
        containerIds,
        userId,
        notes || '',
      );

      return this.sendResponse(
        res,
        { modifiedCount: result.modifiedCount },
        RESPONSE.CONTAINER(`${result.modifiedCount} containers marked as lost`),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Status management ***

  // Update container status with history
  public async updateContainerStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerId } = req.params;
      const { status, userId, notes } = req.body;

      if (!status || !userId) {
        return this.badRequest(res, 'Status and user ID are required');
      }

      const container = await ContainerEntities.updateContainerStatus(
        containerId,
        status,
        userId,
        notes || '',
      );

      return container
        ? this.sendResponse(res, container, RESPONSE.CONTAINER('Container status updated'))
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get container status history
  public async getStatusHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerId } = req.params;
      const history = await ContainerEntities.getStatusHistory(containerId);

      return this.sendResponse(res, history, RESPONSE.CONTAINER('Status history retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Assignment operations ***

  // Assign container to subscriber
  public async assignToSubscriber(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerId } = req.params;
      const { subscriberId, subscriptionId, userId } = req.body;

      if (!subscriberId || !userId) {
        return this.badRequest(res, 'Subscriber ID and user ID are required');
      }

      const container = await ContainerEntities.assignToSubscriber(
        containerId,
        subscriberId,
        subscriptionId,
        userId,
      );

      return container
        ? this.sendResponse(res, container, RESPONSE.CONTAINER('Container assigned to subscriber'))
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Mark container as in transit to subscriber
  public async markInTransitToSubscriber(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerId } = req.params;
      const { deliveryId, userId } = req.body;

      if (!deliveryId || !userId) {
        return this.badRequest(res, 'Delivery ID and user ID are required');
      }

      const container = await ContainerEntities.markInTransitToSubscriber(
        containerId,
        deliveryId,
        userId,
      );

      return container
        ? this.sendResponse(
            res,
            container,
            RESPONSE.CONTAINER('Container marked as in transit to subscriber'),
          )
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Mark container as with subscriber
  public async markWithSubscriber(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerId } = req.params;
      const { userId, expectedReturnDate } = req.body;

      if (!userId) {
        return this.badRequest(res, 'User ID is required');
      }

      const container = await ContainerEntities.markWithSubscriber(
        containerId,
        userId,
        expectedReturnDate ? new Date(expectedReturnDate) : undefined,
      );

      return container
        ? this.sendResponse(
            res,
            container,
            RESPONSE.CONTAINER('Container marked as with subscriber'),
          )
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Mark container as in transit to warehouse
  public async markInTransitToWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerId } = req.params;
      const { returnDeliveryId, userId } = req.body;

      if (!returnDeliveryId || !userId) {
        return this.badRequest(res, 'Return delivery ID and user ID are required');
      }

      const container = await ContainerEntities.markInTransitToWarehouse(
        containerId,
        returnDeliveryId,
        userId,
      );

      return container
        ? this.sendResponse(
            res,
            container,
            RESPONSE.CONTAINER('Container marked as in transit to warehouse'),
          )
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Mark container as returned
  public async markReturned(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return this.badRequest(res, 'User ID is required');
      }

      const container = await ContainerEntities.markReturned(containerId, userId);

      return container
        ? this.sendResponse(res, container, RESPONSE.CONTAINER('Container marked as returned'))
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Maintenance operations ***

  // Record container maintenance
  public async recordMaintenance(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerId } = req.params;
      const { type, userId, notes } = req.body;

      if (!type || !userId) {
        return this.badRequest(res, 'Maintenance type and user ID are required');
      }

      const container = await ContainerEntities.recordMaintenance(
        containerId,
        type,
        userId,
        notes || '',
      );

      return container
        ? this.sendResponse(res, container, RESPONSE.CONTAINER('Maintenance recorded'))
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Mark container as cleaned
  public async markCleaned(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return this.badRequest(res, 'User ID is required');
      }

      const container = await ContainerEntities.markCleaned(containerId, userId);

      return container
        ? this.sendResponse(res, container, RESPONSE.CONTAINER('Container marked as cleaned'))
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update container condition
  public async updateCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerId } = req.params;
      const { condition, userId, notes } = req.body;

      if (!condition || !userId) {
        return this.badRequest(res, 'Condition and user ID are required');
      }

      const container = await ContainerEntities.updateCondition(
        containerId,
        condition,
        userId,
        notes || '',
      );

      return container
        ? this.sendResponse(res, container, RESPONSE.CONTAINER('Container condition updated'))
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Mark container as under maintenance
  public async markUnderMaintenance(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerId } = req.params;
      const { userId, notes } = req.body;

      if (!userId) {
        return this.badRequest(res, 'User ID is required');
      }

      const container = await ContainerEntities.markUnderMaintenance(
        containerId,
        userId,
        notes || '',
      );

      return container
        ? this.sendResponse(
            res,
            container,
            RESPONSE.CONTAINER('Container marked as under maintenance'),
          )
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Mark container as back in inventory
  public async markBackInInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return this.badRequest(res, 'User ID is required');
      }

      const container = await ContainerEntities.markBackInInventory(containerId, userId);

      return container
        ? this.sendResponse(
            res,
            container,
            RESPONSE.CONTAINER('Container marked as back in inventory'),
          )
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Deposit management ***

  // Mark container deposit as collected
  public async markDepositCollected(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerId } = req.params;
      const { depositAmount } = req.body;

      if (!depositAmount || isNaN(depositAmount)) {
        return this.badRequest(res, 'Valid deposit amount is required');
      }

      const result = await ContainerEntities.markDepositCollected(containerId, depositAmount);

      return result
        ? this.sendResponse(res, result, RESPONSE.CONTAINER('Deposit marked as collected'))
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Mark container deposit as refunded
  public async markDepositRefunded(req: Request, res: Response, next: NextFunction) {
    try {
      const { containerId } = req.params;
      const result = await ContainerEntities.markDepositRefunded(containerId);

      return result
        ? this.sendResponse(res, result, RESPONSE.CONTAINER('Deposit marked as refunded'))
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Query operations ***

  // Get containers by subscriber ID
  public async getContainersBySubscriberId(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const containers = await ContainerEntities.getContainersBySubscriberId(subscriberId);

      return this.sendResponse(res, containers, RESPONSE.CONTAINER('Containers retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get containers by delivery ID
  public async getContainersByDeliveryId(req: Request, res: Response, next: NextFunction) {
    try {
      const { deliveryId } = req.params;
      const containers = await ContainerEntities.getContainersByDeliveryId(deliveryId);

      return this.sendResponse(res, containers, RESPONSE.CONTAINER('Containers retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get containers by return delivery ID
  public async getContainersByReturnDeliveryId(req: Request, res: Response, next: NextFunction) {
    try {
      const { returnDeliveryId } = req.params;
      const containers = await ContainerEntities.getContainersByReturnDeliveryId(returnDeliveryId);

      return this.sendResponse(res, containers, RESPONSE.CONTAINER('Containers retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get containers by status
  public async getContainersByStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.params;
      const { adminId } = req.query;

      const containers = await ContainerEntities.getContainersByStatus(status, adminId as string);

      return this.sendResponse(res, containers, RESPONSE.CONTAINER('Containers retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get containers by subscriber ID and status
  public async getContainersBySubscriberIdAndStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { subscriberId, status } = req.params;
      const containers = await ContainerEntities.getContainersBySubscriberIdAndStatus(
        subscriberId,
        status,
      );

      return this.sendResponse(res, containers, RESPONSE.CONTAINER('Containers retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get containers by item ID
  public async getContainersByItemId(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params;
      const containers = await ContainerEntities.getContainersByItemId(itemId);

      return this.sendResponse(res, containers, RESPONSE.CONTAINER('Containers retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get containers by condition
  public async getContainersByCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const { condition } = req.params;
      const { adminId } = req.query;

      const containers = await ContainerEntities.getContainersByCondition(
        condition,
        adminId as string,
      );

      return this.sendResponse(res, containers, RESPONSE.CONTAINER('Containers retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get containers by subscription ID
  public async getContainersBySubscriptionId(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriptionId } = req.params;
      const containers = await ContainerEntities.getContainersBySubscriptionId(subscriptionId);

      return this.sendResponse(res, containers, RESPONSE.CONTAINER('Containers retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get containers by serial number
  public async getContainersBySerialNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const { serialNumber } = req.params;
      const container = await ContainerEntities.getContainersBySerialNumber(serialNumber);

      return container
        ? this.sendResponse(res, container, RESPONSE.CONTAINER('Container found'))
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get containers by QR code
  public async getContainersByQrCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { qrCode } = req.params;
      const container = await ContainerEntities.getContainersByQrCode(qrCode);

      return container
        ? this.sendResponse(res, container, RESPONSE.CONTAINER('Container found'))
        : this.notFound(res, 'Container not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Search containers
  public async searchContainers(req: Request, res: Response, next: NextFunction) {
    try {
      const { searchTerm } = req.body;
      const { adminId } = req.query;

      if (!searchTerm) {
        return this.badRequest(res, 'Search term is required');
      }

      const containers = await ContainerEntities.searchContainers(searchTerm, adminId as string);

      return this.sendResponse(res, containers, RESPONSE.CONTAINER('Containers found'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Statistics and analytics ***

  // Count containers by subscriber and status
  public async countContainersBySubscriberAndStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { subscriberId, status } = req.params;
      const count = await ContainerEntities.countContainersBySubscriberAndStatus(
        subscriberId,
        status,
      );

      return this.sendResponse(res, { count }, RESPONSE.CONTAINER('Container count retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get container statistics for a subscriber
  public async getContainerStatsBySubscriber(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const stats = await ContainerEntities.getContainerStatsBySubscriber(subscriberId);

      return this.sendResponse(res, stats, RESPONSE.CONTAINER('Container statistics retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get container statistics by admin
  public async getContainerStatsByAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const stats = await ContainerEntities.getContainerStatsByAdmin(adminId);

      return this.sendResponse(res, stats, RESPONSE.CONTAINER('Container statistics retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get container statistics by condition
  public async getContainerStatsByCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const stats = await ContainerEntities.getContainerStatsByCondition(adminId);

      return this.sendResponse(
        res,
        stats,
        RESPONSE.CONTAINER('Container condition statistics retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get containers created after a specific date
  public async getContainersCreatedAfterDate(req: Request, res: Response, next: NextFunction) {
    try {
      const { date } = req.params;
      const { adminId } = req.query;

      if (!date) {
        return this.badRequest(res, 'Date parameter is required');
      }

      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return this.badRequest(res, 'Invalid date format');
      }

      const containers = await ContainerEntities.getContainersCreatedAfterDate(
        dateObj,
        adminId as string,
      );

      return this.sendResponse(res, containers, RESPONSE.CONTAINER('Containers retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Find overdue containers
  public async findOverdueContainers(req: Request, res: Response, next: NextFunction) {
    try {
      const { days } = req.params;
      const { adminId } = req.query;
      const daysNumber = parseInt(days);

      if (isNaN(daysNumber) || daysNumber <= 0) {
        return this.badRequest(res, 'Valid days parameter is required');
      }

      const containers = await ContainerEntities.findOverdueContainers(
        daysNumber,
        adminId as string,
      );

      return this.sendResponse(res, containers, RESPONSE.CONTAINER('Overdue containers retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get container inventory summary
  public async getContainerInventorySummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const summary = await ContainerEntities.getContainerInventorySummary(adminId);

      return this.sendResponse(
        res,
        summary,
        RESPONSE.CONTAINER('Container inventory summary retrieved'),
        // .CONTAINER_INVENTORY_SUMMARY_RETRIEVED
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get deposit statistics
  public async getDepositStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const stats = await ContainerEntities.getDepositStatistics(adminId);

      return this.sendResponse(
        res,
        stats,
        RESPONSE.CONTAINER('Deposit statistics retrieved').DEPOSIT_STATISTICS_RETRIEVED,
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Aggregate containers
  public async aggregateContainers(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const body = req.body;

      const pipline = builder.CONTAINER.buildContainerQuery({
        ...body,
        adminId,
      });

      const options = {
        page: 1,
        limit: 10,
        getCount: true,
      };

      const result = await ContainerEntities.paginateAggregate(pipline, options);

      return this.sendResponse(res, result, RESPONSE.CONTAINER('Containers aggregated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }
}

export const ContainerController = new ContainerControllerClass();
