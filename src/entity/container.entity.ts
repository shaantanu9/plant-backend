// import { Model } from "mongoose";
// import BaseEntity from "./base.entity";
// import ContainerModel from "@models/container.model";
// import { toObjectId } from "@utils";

// class ContainerEntity extends BaseEntity {
//   constructor(model: Model<any>) {
//     super(model);
//   }

//   // Existing functions
//   public async addContainer(data: any) {
//     return this.create(data);
//   }

//   public async getContainerById(containerId: string) {
//     return this.findOne({ _id: toObjectId(containerId) });
//   }

//   public async getContainersBySubscriberId(subscriberId: string) {
//     return this.find({ subscriberId: toObjectId(subscriberId) });
//   }

//   public async modifyContainerStatusById(containerId: string, status: string) {
//     return this.updateOne({ _id: toObjectId(containerId) }, { status });
//   }

//   public async removeContainerById(containerId: string) {
//     return this.deleteOne({ _id: toObjectId(containerId) });
//   }

//   // New functions

//   // Bulk create multiple containers for a subscriber
//   public async bulkCreateContainers(subscriberId: string, deliveryId: string, count: number) {
//     const containers :any= [];
//     const bulkOps = [];

//     for (let i = 0; i < count; i++) {
//       bulkOps.push({
//         insertOne: {
//           document: {
//             subscriberId: toObjectId(subscriberId),
//             deliveryId: toObjectId(deliveryId),
//             status: 'with-subscriber'
//           }
//         }
//       });
//     }

//     if (bulkOps.length > 0) {
//       await this.model.bulkWrite(bulkOps);
//       return this.getContainersByDeliveryId(deliveryId);
//     }
//     return containers;
//   }

//   // Get containers by delivery ID
//   public async getContainersByDeliveryId(deliveryId: string) {
//     return this.find({ deliveryId: toObjectId(deliveryId) });
//   }

//   // Get containers by return delivery ID
//   public async getContainersByReturnDeliveryId(returnDeliveryId: string) {
//     return this.find({ returnDeliveryId: toObjectId(returnDeliveryId) });
//   }

//   // Get containers by status
//   public async getContainersByStatus(status: string) {
//     return this.find({ status });
//   }

//   // Get containers by subscriber ID and status
//   public async getContainersBySubscriberIdAndStatus(subscriberId: string, status: string) {
//     return this.find({
//       subscriberId: toObjectId(subscriberId),
//       status
//     });
//   }

//   // Count containers by subscriber and status
//   public async countContainersBySubscriberAndStatus(subscriberId: string, status: string) {
//     return this.model.countDocuments({
//       subscriberId: toObjectId(subscriberId),
//       status
//     });
//   }

//   // Update container return delivery
//   public async updateContainerReturnDelivery(containerId: string, returnDeliveryId: string) {
//     return this.updateOne(
//       { _id: toObjectId(containerId) },
//       {
//         returnDeliveryId: toObjectId(returnDeliveryId),
//         status: 'returned',
//         updatedAt: new Date()
//       }
//     );
//   }

//   // Bulk update containers (mark as returned)
//   public async bulkUpdateContainersAsReturned(containerIds: string[], returnDeliveryId: string) {
//     const objectIds = containerIds.map(id => toObjectId(id));

//     return this.model.updateMany(
//       { _id: { $in: objectIds } },
//       {
//         status: 'returned',
//         returnDeliveryId: toObjectId(returnDeliveryId),
//         updatedAt: new Date()
//       }
//     );
//   }

//   // Bulk update containers as lost
//   public async bulkMarkContainersAsLost(containerIds: string[]) {
//     const objectIds = containerIds.map(id => toObjectId(id));

//     return this.model.updateMany(
//       { _id: { $in: objectIds } },
//       {
//         status: 'lost',
//         updatedAt: new Date()
//       }
//     );
//   }

//   // Get container statistics for a subscriber
//   public async getContainerStatsBySubscriber(subscriberId: string) {
//     const pipeline = [
//       { $match: { subscriberId: toObjectId(subscriberId) } },
//       { $group: {
//           _id: '$status',
//           count: { $sum: 1 }
//         }
//       },
//       { $project: {
//           _id: 0,
//           status: '$_id',
//           count: 1
//         }
//       }
//     ];

//     return this.model.aggregate(pipeline);
//   }

//   // Get all containers created after a specific date
//   public async getContainersCreatedAfterDate(date: Date) {
//     return this.find({
//       createdAt: { $gte: date }
//     });
//   }

//   // Find containers that haven't been returned after a certain number of days
//   public async findOverdueContainers(daysThreshold: number) {
//     const thresholdDate = new Date();
//     thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

//     return this.find({
//       status: 'with-subscriber',
//       createdAt: { $lte: thresholdDate }
//     });
//   }

//   // Get summary of container status by delivery
//   public async getContainerSummaryByDelivery(deliveryId: string) {
//     const pipeline = [
//       { $match: { deliveryId: toObjectId(deliveryId) } },
//       { $group: {
//           _id: '$status',
//           count: { $sum: 1 }
//         }
//       },
//       { $project: {
//           _id: 0,
//           status: '$_id',
//           count: 1
//         }
//       }
//     ];

//     return this.model.aggregate(pipeline);
//   }
// }

// export const ContainerEntities = new ContainerEntity(ContainerModel);

import { Model } from 'mongoose';
import ContainerModel from '@models/container.model';
import { toObjectId } from '@utils';
import BaseEntity from './base.entity';

class ContainerEntity extends BaseEntity {
  constructor(model: Model<any>) {
    super(model);
  }

  // *** Basic CRUD operations ***

  public async addContainer(data: any) {
    return this.create(data);
  }

  public async getContainerById(containerId: string) {
    return this.findOne({ _id: toObjectId(containerId) });
  }

  public async getContainersBySubscriberId(subscriberId: string) {
    return this.find({ subscriberId: toObjectId(subscriberId) });
  }

  public async modifyContainerStatusById(containerId: string, status: string) {
    return this.updateOne({ _id: toObjectId(containerId) }, { status });
  }

  public async removeContainerById(containerId: string) {
    return this.deleteOne({ _id: toObjectId(containerId) });
  }

  // *** Bulk operations ***

  public async bulkCreateContainers(
    adminId: string,
    containerType: string,
    count: number,
    baseProps: any = {},
  ) {
    const bulkOps = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
      const containerNumber = await this.getNextContainerNumber(adminId, containerType);
      const serialNumber = `${containerType
        .substring(0, 3)
        .toUpperCase()}-${containerNumber.toString().padStart(6, '0')}`;

      bulkOps.push({
        insertOne: {
          document: {
            name: `${containerType} #${containerNumber}`,
            description: `${containerType} container created in batch`,
            containerType,
            adminId: toObjectId(adminId),
            serialNumber,
            status: 'in-inventory',
            createdAt: now,
            updatedAt: now,
            statusHistory: [
              {
                status: 'in-inventory',
                date: now,
                updatedBy: toObjectId(adminId),
                notes: 'Initial creation',
              },
            ],
            ...baseProps,
          },
        },
      });
    }

    if (bulkOps.length > 0) {
      return this.model.bulkWrite(bulkOps);
    }
    return { insertedCount: 0 };
  }

  private async getNextContainerNumber(adminId: string, containerType: string) {
    const lastContainer = await this.model
      .findOne({
        adminId: toObjectId(adminId),
        containerType,
      })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!lastContainer || !lastContainer.serialNumber) {
      return 1;
    }

    const match = lastContainer.serialNumber.match(/\d+$/);
    if (match) {
      return parseInt(match[0], 10) + 1;
    }
    return 1;
  }

  public async bulkUpdateContainersAsReturned(
    containerIds: string[],
    returnDeliveryId: string,
    userId: string,
  ) {
    const objectIds = containerIds.map(id => toObjectId(id));
    const now = new Date();

    // First get the containers to update their status history properly
    const containers: any = await this.find({ _id: { $in: objectIds } });
    const bulkOps = containers.map((container: any) => ({
      updateOne: {
        filter: { _id: container._id },
        update: {
          $set: {
            status: 'returned',
            returnDeliveryId: toObjectId(returnDeliveryId),
            updatedAt: now,
          },
          $push: {
            statusHistory: {
              status: 'returned',
              date: now,
              updatedBy: toObjectId(userId),
              notes: 'Bulk return operation',
            },
          },
        },
      },
    }));

    if (bulkOps.length > 0) {
      return this.model.bulkWrite(bulkOps);
    }
    return { modifiedCount: 0 };
  }

  public async bulkMarkContainersAsLost(
    containerIds: string[],
    userId: string,
    notes: string = '',
  ) {
    const objectIds = containerIds.map(id => toObjectId(id));
    const now = new Date();

    // First get the containers to update their status history properly
    const containers: any = await this.find({ _id: { $in: objectIds } });
    const bulkOps = containers.map((container: any) => ({
      updateOne: {
        filter: { _id: container._id },
        update: {
          $set: {
            status: 'lost',
            updatedAt: now,
          },
          $push: {
            statusHistory: {
              status: 'lost',
              date: now,
              updatedBy: toObjectId(userId),
              notes,
            },
          },
        },
      },
    }));

    if (bulkOps.length > 0) {
      return this.model.bulkWrite(bulkOps);
    }
    return { modifiedCount: 0 };
  }

  // *** Status management ***

  public async updateContainerStatus(
    containerId: string,
    status: string,
    userId: string,
    notes: string = '',
  ) {
    const container: any = await this.model.findById(toObjectId(containerId));
    if (!container) {
      return null;
    }
    return container.updateStatus(status, toObjectId(userId), notes);
  }

  public async getStatusHistory(containerId: string) {
    const container: any = await this.findOne(
      { _id: toObjectId(containerId) },
      { statusHistory: 1 },
    );
    return container?.statusHistory || [];
  }

  // *** Assignment operations ***

  public async assignToSubscriber(
    containerId: string,
    subscriberId: string,
    subscriptionId: string,
    userId: string,
  ) {
    const now = new Date();
    return this.findOneAndUpdate(
      { _id: toObjectId(containerId) },
      {
        subscriberId: toObjectId(subscriberId),
        subscriptionId: subscriptionId ? toObjectId(subscriptionId) : undefined,
        status: 'assigned',
        updatedAt: now,
        $push: {
          statusHistory: {
            status: 'assigned',
            date: now,
            updatedBy: toObjectId(userId),
            notes: `Assigned to subscriber ${subscriberId}`,
          },
        },
      },
      { new: true },
    );
  }

  public async markInTransitToSubscriber(containerId: string, deliveryId: string, userId: string) {
    const now = new Date();
    return this.findOneAndUpdate(
      { _id: toObjectId(containerId) },
      {
        deliveryId: toObjectId(deliveryId),
        deliveryDate: now,
        status: 'in-transit-to-subscriber',
        updatedAt: now,
        $push: {
          statusHistory: {
            status: 'in-transit-to-subscriber',
            date: now,
            updatedBy: toObjectId(userId),
            notes: `In transit via delivery ${deliveryId}`,
          },
        },
      },
      { new: true },
    );
  }

  public async markWithSubscriber(containerId: string, userId: string, expectedReturnDate?: Date) {
    const now = new Date();
    return this.findOneAndUpdate(
      { _id: toObjectId(containerId) },
      {
        status: 'with-subscriber',
        expectedReturnDate,
        updatedAt: now,
        $push: {
          statusHistory: {
            status: 'with-subscriber',
            date: now,
            updatedBy: toObjectId(userId),
            notes: expectedReturnDate
              ? `Expected return by ${expectedReturnDate.toISOString().split('T')[0]}`
              : '',
          },
        },
      },
      { new: true },
    );
  }

  public async markInTransitToWarehouse(
    containerId: string,
    returnDeliveryId: string,
    userId: string,
  ) {
    const now = new Date();
    return this.findOneAndUpdate(
      { _id: toObjectId(containerId) },
      {
        returnDeliveryId: toObjectId(returnDeliveryId),
        status: 'in-transit-to-warehouse',
        updatedAt: now,
        $push: {
          statusHistory: {
            status: 'in-transit-to-warehouse',
            date: now,
            updatedBy: toObjectId(userId),
            notes: `In transit back via delivery ${returnDeliveryId}`,
          },
        },
      },
      { new: true },
    );
  }

  public async markReturned(containerId: string, userId: string) {
    const now = new Date();
    return this.findOneAndUpdate(
      { _id: toObjectId(containerId) },
      {
        status: 'returned',
        actualReturnDate: now,
        subscriberId: null,
        subscriptionId: null,
        updatedAt: now,
        $push: {
          statusHistory: {
            status: 'returned',
            date: now,
            updatedBy: toObjectId(userId),
            notes: 'Container returned to inventory',
          },
        },
      },
      { new: true },
    );
  }

  // *** Maintenance operations ***

  public async recordMaintenance(
    containerId: string,
    type: string,
    userId: string,
    notes: string = '',
  ) {
    const now = new Date();
    return this.findOneAndUpdate(
      { _id: toObjectId(containerId) },
      {
        $push: {
          maintenanceHistory: {
            date: now,
            type,
            notes,
            performedBy: toObjectId(userId),
          },
        },
        updatedAt: now,
      },
      { new: true },
    );
  }

  public async markCleaned(containerId: string, userId: string) {
    const now = new Date();
    return this.findOneAndUpdate(
      { _id: toObjectId(containerId) },
      {
        lastCleanedAt: now,
        cleanedBy: toObjectId(userId),
        status: 'being-cleaned',
        updatedAt: now,
        $push: {
          maintenanceHistory: {
            date: now,
            type: 'cleaning',
            performedBy: toObjectId(userId),
          },
          statusHistory: {
            status: 'being-cleaned',
            date: now,
            updatedBy: toObjectId(userId),
            notes: 'Container cleaned',
          },
        },
      },
      { new: true },
    );
  }

  public async updateCondition(
    containerId: string,
    condition: string,
    userId: string,
    notes: string = '',
  ) {
    const now = new Date();
    return this.findOneAndUpdate(
      { _id: toObjectId(containerId) },
      {
        condition,
        updatedAt: now,
        $push: {
          maintenanceHistory: {
            date: now,
            type: 'inspection',
            notes: `Condition updated to ${condition}: ${notes}`,
            performedBy: toObjectId(userId),
          },
        },
      },
      { new: true },
    );
  }

  public async markUnderMaintenance(containerId: string, userId: string, notes: string = '') {
    const now = new Date();
    return this.findOneAndUpdate(
      { _id: toObjectId(containerId) },
      {
        status: 'under-maintenance',
        updatedAt: now,
        $push: {
          statusHistory: {
            status: 'under-maintenance',
            date: now,
            updatedBy: toObjectId(userId),
            notes,
          },
          maintenanceHistory: {
            date: now,
            type: 'repair',
            notes,
            performedBy: toObjectId(userId),
          },
        },
      },
      { new: true },
    );
  }

  public async markBackInInventory(containerId: string, userId: string) {
    const now = new Date();
    return this.findOneAndUpdate(
      { _id: toObjectId(containerId) },
      {
        status: 'in-inventory',
        updatedAt: now,
        $push: {
          statusHistory: {
            status: 'in-inventory',
            date: now,
            updatedBy: toObjectId(userId),
            notes: 'Container returned to inventory',
          },
        },
      },
      { new: true },
    );
  }

  // *** Deposit management ***

  public async markDepositCollected(containerId: string, depositAmount: number) {
    return this.updateOne(
      { _id: toObjectId(containerId) },
      {
        depositAmount,
        depositCollected: true,
        depositRefunded: false,
        updatedAt: new Date(),
      },
    );
  }

  public async markDepositRefunded(containerId: string) {
    return this.updateOne(
      { _id: toObjectId(containerId) },
      {
        depositRefunded: true,
        updatedAt: new Date(),
      },
    );
  }

  // *** Queries and filters ***

  public async getContainersByDeliveryId(deliveryId: string) {
    return this.find({ deliveryId: toObjectId(deliveryId) });
  }

  public async getContainersByReturnDeliveryId(returnDeliveryId: string) {
    return this.find({ returnDeliveryId: toObjectId(returnDeliveryId) });
  }

  public async getContainersByStatus(status: string, adminId?: string) {
    const query: any = { status };
    if (adminId) {
      query.adminId = toObjectId(adminId);
    }
    return this.find(query);
  }

  public async getContainersBySubscriberIdAndStatus(subscriberId: string, status: string) {
    return this.find({
      subscriberId: toObjectId(subscriberId),
      status,
    });
  }

  public async getContainersByItemId(itemId: string) {
    return this.find({ itemId: toObjectId(itemId) });
  }

  public async getContainersByCondition(condition: string, adminId?: string) {
    const query: any = { condition };
    if (adminId) {
      query.adminId = toObjectId(adminId);
    }
    return this.find(query);
  }

  public async getContainersBySubscriptionId(subscriptionId: string) {
    return this.find({ subscriptionId: toObjectId(subscriptionId) });
  }

  public async getContainersBySerialNumber(serialNumber: string) {
    return this.findOne({ serialNumber });
  }

  public async getContainersByQrCode(qrCode: string) {
    return this.findOne({ qrCode });
  }

  public async searchContainers(searchTerm: string, adminId?: string) {
    const query: any = {
      $or: [
        { name: new RegExp(searchTerm, 'i') },
        { serialNumber: new RegExp(searchTerm, 'i') },
        { qrCode: new RegExp(searchTerm, 'i') },
      ],
    };

    if (adminId) {
      query.adminId = toObjectId(adminId);
    }

    return this.find(query);
  }

  // *** Statistics and analytics ***

  public async countContainersBySubscriberAndStatus(subscriberId: string, status: string) {
    return this.model.countDocuments({
      subscriberId: toObjectId(subscriberId),
      status,
    });
  }

  public async getContainerStatsBySubscriber(subscriberId: string) {
    const pipeline = [
      { $match: { subscriberId: toObjectId(subscriberId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
    ];

    return this.model.aggregate(pipeline);
  }

  public async getContainerStatsByAdmin(adminId: string) {
    const pipeline = [
      { $match: { adminId: toObjectId(adminId) } },
      {
        $group: {
          _id: {
            status: '$status',
            type: '$containerType',
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id.status',
          containerType: '$_id.type',
          count: 1,
        },
      },
      // { $sort: { containerType: 1 as 1 | -1, status: 1 } }
      { $sort: { containerType: 1 as 1 | -1, condition: 1 as 1 | -1 } },
    ];

    return this.model.aggregate(pipeline);
  }

  public async getContainerStatsByCondition(adminId: string) {
    const pipeline = [
      { $match: { adminId: toObjectId(adminId) } },
      {
        $group: {
          _id: {
            condition: '$condition',
            type: '$containerType',
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          condition: '$_id.condition',
          containerType: '$_id.type',
          count: 1,
        },
      },
      { $sort: { containerType: 1 as 1 | -1, condition: 1 as 1 | -1 } },
    ];

    return this.model.aggregate(pipeline);
  }

  public async getContainersCreatedAfterDate(date: Date, adminId?: string) {
    const query: any = {
      createdAt: { $gte: date },
    };

    if (adminId) {
      query.adminId = toObjectId(adminId);
    }

    return this.find(query);
  }

  public async findOverdueContainers(daysThreshold: number, adminId?: string) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

    const query: any = {
      status: 'with-subscriber',
      deliveryDate: { $lte: thresholdDate },
    };

    if (adminId) {
      query.adminId = toObjectId(adminId);
    }

    return this.find(query);
  }

  public async getContainerInventorySummary(adminId: string) {
    const pipeline = [
      { $match: { adminId: toObjectId(adminId) } },
      {
        $group: {
          _id: {
            type: '$containerType',
            status: '$status',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.type',
          total: { $sum: '$count' },
          statuses: {
            $push: {
              status: '$_id.status',
              count: '$count',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          containerType: '$_id',
          total: 1,
          statuses: 1,
        },
      },
      // { $sort: { containerType: 1 } }
    ];

    return this.model.aggregate(pipeline);
  }

  public async getDepositStatistics(adminId: string) {
    const pipeline = [
      {
        $match: {
          adminId: toObjectId(adminId),
          depositAmount: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: {
            collected: '$depositCollected',
            refunded: '$depositRefunded',
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$depositAmount' },
        },
      },
      {
        $project: {
          _id: 0,
          depositCollected: '$_id.collected',
          depositRefunded: '$_id.refunded',
          count: 1,
          totalAmount: 1,
        },
      },
    ];

    return this.model.aggregate(pipeline);
  }
}

export const ContainerEntities = new ContainerEntity(ContainerModel);
