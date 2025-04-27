import { Model, Types } from 'mongoose';
import IApp from '../typings/app.typings';

// import { ENUM_ARRAY } from "@common";

export default class BaseEntity {
  constructor(protected model: Model<any>) {
    this.model = model;
  }

  /**
   * finds a single user based on payload condition
   * @params payload (condition), projection  (fields to be fetched)
   */

  public async find<T>(
    query: any = {},
    projection: any = {},
    options: any = {},
    populateOptions: any = {},
  ): Promise<T[]> {
    if (Object.keys(populateOptions).length > 0)
      return this.model.find(query, projection, options).populate(populateOptions).lean().exec();
    else return this.model.find(query, projection, options).lean().exec();
  }

  async findOne<T>(
    condition: IApp.DataKeys,
    project: IApp.DataKeys = {},
    options: any = {},
    lean: boolean = true,
    populateOptions: any = {},
  ): Promise<T> {
    let query = this.model.findOne(condition, project, options);
    if (Object.keys(populateOptions).length > 0) {
      query = query.populate(populateOptions);
    }
    if (lean) {
      const user: any = query.lean().exec();
      return user;
    } else {
      const user: any = query.exec();
      return user;
    }
  }

  async findDistinct<T>(criteria: string, options: any): Promise<any[]> {
    return await this.model.distinct(criteria, options);
  }

  /**
   * finds a single user based on payload condition
   * @params payload (condition), projection
   */

  async insertMany<T>(data: T[]): Promise<T[]> {
    return this.model.insertMany(data);
  }
  async insertManyIgonore<T>(data: T[]): Promise<T[]> {
    return this.model.insertMany(data, { ordered: false });
  }

  async create<T>(data: any): Promise<T> {
    const dataToCreate = { ...data, isActive: true, isDeleted: false, roles: [data.role] };
    return this.model.create(dataToCreate);
  }

  /**
   * finds multiple records based on condition
   * @params payload, projection
   */
  async findMany<T>(
    condition: IApp.DataKeys,
    project: IApp.DataKeys = {},
    sort?: any,
  ): Promise<T[]> {
    if (sort) return await this.model.find(condition, project).sort(sort).lean().exec();
    return await this.model.find(condition, project).lean().exec();
  }

  /**
   * counts the documents based on query
   * @params condition
   */
  async count(condition: IApp.DataKeys): Promise<number> {
    return this.model.countDocuments(condition).lean().exec();
  }

  /**
   * distinct documents
   * @params condition
   */
  async distinct(key: string, condition: IApp.DataKeys): Promise<any> {
    return this.model.distinct(key, condition).lean().exec();
  }

  /**
   * updates the entity record with the payload
   * @params condition, payload, options { multi: [boolean] }
   */
  async editEntity<T>(
    condition: IApp.DataKeys,
    payload: IApp.DataKeys,
    options: any = {},
  ): Promise<IApp.Entity<T>> {
    if (options.multi) {
      await this.model.updateMany(condition, payload, options).exec();
      return { type: 'MULTI' };
    } else {
      if (typeof options.new === 'undefined') options.new = true;
      const updatedData: any = await this.model
        .findOneAndUpdate(condition, payload, options)
        .lean()
        .exec();
      if (updatedData) return { type: 'SINGLE', data: updatedData };
      else return { type: 'SINGLE' };
    }
  }

  /**
   * updates and sets the user fields record with the payload fields
   * @params condition, payload
   * @param options.multi - updates multiple records
   */
  async updateEntity<T>(
    condition: IApp.DataKeys,
    payload: IApp.DataKeys,
    options: any = {},
    unset?: boolean,
  ): Promise<IApp.Entity<T>> {
    if (options.multi) {
      await this.model.updateMany(condition, { $set: payload }, options).exec();
      return { type: 'MULTI' };
    } else {
      if (typeof options.new === 'undefined') options.new = true;
      const updatedData: any = await this.model
        .findOneAndUpdate(condition, { $set: payload }, options)
        .lean()
        .exec();
      if (updatedData) return { type: 'SINGLE', data: updatedData };
      else return { type: 'SINGLE' };
    }
  }

  async removeMultipleFields<T>(
    condition: IApp.DataKeys,
    payload: IApp.DataKeys,
    options: any = {},
  ): Promise<any> {
    return await this.model.updateMany(condition, payload, options).exec();
  }

  async updateCronJob<T>(
    condition: IApp.DataKeys,
    payload: IApp.DataKeys,
    options: any = {},
  ): Promise<any> {
    if (options.multi) {
      return await this.model.updateMany(condition, { $set: payload }, options).exec();
    } else {
      if (typeof options.new === 'undefined') options.new = true;
      const updatedData: any = await this.model
        .findOneAndUpdate(condition, { $set: payload }, options)
        .lean()
        .exec();
      if (updatedData) return { type: 'SINGLE', data: updatedData };
      else return { type: 'SINGLE' };
    }
  }
  /**
   * updates record with the payload fields
   * @params condition, payload
   * @param options.multi - updates multiple records
   */
  async update<T>(
    condition: IApp.DataKeys,
    payload: IApp.DataKeys,
    options: any = {},
  ): Promise<any> {
    const updateRes = await this.model.updateMany(condition, payload, options);
    return updateRes;
  }

  /**
   * updates and sets the user fields record with the payload fields
   * @params condition, payload
   * @param options.multi - updates multiple records
   */
  async updateEntityWithoutIsDelete<T>(
    condition: IApp.DataKeys,
    payload: IApp.DataKeys,
    options: any = {},
  ): Promise<IApp.Entity<T>> {
    if (options.multi) {
      await this.model.updateMany(condition, { $set: payload }, options).exec();
      return { type: 'MULTI' };
    } else {
      if (typeof options.new === 'undefined') options.new = true;
      const updatedData: any = await this.model
        .findOneAndUpdate(condition, { $set: payload }, options)
        .lean()
        .exec();
      if (updatedData) return { type: 'SINGLE', data: updatedData };
      else return { type: 'SINGLE' };
    }
  }

  async findOneAndUpdate(condition: any, payload: any, options?: any, lean = true) {
    try {
      if (lean) {
        const data = await this.model
          .findOneAndUpdate(condition, { $set: payload }, options)
          .lean()
          .exec();
        return data;
      } else {
        const data = await this.model.findOneAndUpdate(condition, { $set: payload }, options);
        return data;
      }
    } catch (error) {
      console.error(`we have an error in updateDocument mongo ==> ${error}`);
      return Promise.reject(error);
    }
  }

  async findOneAndUpdate2(condition: any, payload: any, options?: any) {
    try {
      const data = await this.model.findOneAndUpdate(condition, payload, options).exec();
      return data;
    } catch (error) {
      console.error(`we have an error in updateDocument mongo ==> ${error}`);
      return Promise.reject(error);
    }
  }

  async updateMany(condition: any, payload: any, options?: any) {
    try {
      const data = await this.model.updateMany(condition, { $set: payload }, options).lean().exec();
      return data;
    } catch (error) {
      console.error(`we have an error in updateDocument mongo ==> ${error}`);
      return Promise.reject(error);
    }
  }

  // async updateWithMulti(condition: any, payload: any) {
  //     try {
  //         let data = await this.model.update(condition, { $set: payload }, {multi: true}).lean().exec();
  //         return data;
  //     } catch (error) {
  //         console.error(`we have an error in updateDocument mongo ==> ${error}`);
  //         return Promise.reject(error);
  //     }
  // }

  async updateOne(condition: any, payload: any, options?: any) {
    const data = await this.model.updateOne(condition, payload, options);
    return data;
  }

  async updatewithIncrementDecrement(condition: any, payload: any, options?: any) {
    const data = await this.model
      .findOneAndUpdate(condition, { $inc: payload }, options)
      .lean()
      .exec();
    return data;
  }

  async updateWithDeleteDocument(condition: any, payload: any, removePayload: any, options?: any) {
    try {
      const data = await this.model
        .findOneAndUpdate(condition, { $set: payload, $unset: removePayload }, options)
        .lean()
        .exec();
      return data;
    } catch (error) {
      console.error(`we have an error updateWithDeleteDocument ==> ${error}`);
      return Promise.reject(error);
    }
  }

  /**
   * basic aggregate function
   * @param
   */
  async basicAggregate(pipeline: any[]) {
    return this.model.aggregate(pipeline).collation({ locale: 'en', strength: 1 }).exec();
  }

  /**
   * cursor aggregate function
   * @param
   */
  async cursorAggregate(pipeline: any[], option: any) {
    return this.model.aggregate(pipeline).cursor(option);
  }

  /**
   * aggregates data from the pipeline
   * @param pipeline
   * @param options.page - current page number
   * @param options.limit - fetch limit for records
   * @param options.getCount - (optional) gets the result with total record count
   * @param options.ranged - (optional) ranged based pagination
   */

  // async paginateAggregate(payload: any, options: any = {}): Promise<any> {
  //   if (!options?.page) {
  //     options.page = 1;
  //   }

  //   if (!options?.limit) {
  //     options.limit = 10;
  //   }

  //   if (options.getCount) {
  //     if (options.isCoworker === true)
  //       payload.push({ $match: { isCoworker: { $eq: true } } });
  //     else {
  //       payload.push({
  //         $facet: {
  //           total: [{ $count: "count" }],
  //           result: [
  //             { $skip: (options.page - 1) * options.limit },
  //             { $limit: options.limit },
  //           ],
  //         },
  //       });
  //     }
  //   } else {
  //     if (options.range) {
  //       payload.push({ $match: options.range });
  //     } else {
  //       payload.push({ $skip: (options.page - 1) * options.limit });
  //       payload.push({ $limit: options.limit + 1 });
  //     }
  //   }

  //   payload.push({
  //     $project: {
  //       result: 1,
  //       total: 1,
  //     },
  //   });

  //   const aggregateData = await this.model.aggregate(payload);
  //   // const aggregateData = await this.model.aggregate(payload);

  //   if (options.getCount) {
  //     if (aggregateData.length) {
  //       const result = aggregateData[0].result;
  //       const total = aggregateData[0].total[0]?.count || 0;

  //       const paginationResult = {
  //         next: options.limit * options.page < total,
  //         result,
  //         page: options.page,
  //         total,
  //       };

  //       return paginationResult;
  //     } else {
  //       throw new Error("Error in paginate aggregation pipeline");
  //     }
  //   } else {
  //     if (aggregateData?.length) {
  //       const result = aggregateData[0]?.result?.slice(0, options.limit);

  //       const next = aggregateData[0]?.result.length > options.limit;

  //       const paginationResult = { next, result, page: options.page };

  //       return paginationResult;
  //     } else {
  //       return { next: false, result: [], page: options.page };
  //     }
  //   }
  // }

  async paginateAggregate(
    payload: any,
    options: {
      page: number;
      limit: number;
      getCount?: boolean;
    },
  ): Promise<any> {
    if (!options?.page) {
      options.page = 1;
    }

    if (!options?.limit) {
      options.limit = 10;
    }

    const skip = (options.page - 1) * options.limit;
    const limit = options.limit;

    // Push skip and limit to payload if getCount is true
    if (options.getCount) {
      payload.push({
        $facet: {
          data: [...payload, { $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        },
      });
    } else {
      payload.push({ $skip: skip });
      payload.push({ $limit: limit + 1 });
    }

    const aggregateData = await this.model.aggregate(payload);

    if (options.getCount) {
      if (aggregateData.length) {
        const result = aggregateData[0].data;
        const total = aggregateData[0].totalCount[0] ? aggregateData[0].totalCount[0].count : 0;

        const paginationResult = {
          next: options.limit * options.page < total,
          result,
          page: options.page,
          total,
        };

        return paginationResult;
      } else {
        throw new Error('Error in paginate aggregation pipeline');
      }
    } else {
      if (aggregateData?.length) {
        const result = aggregateData.slice(0, options.limit);
        const next = aggregateData.length > options.limit;

        const paginationResult = { next, result, page: options.page };

        return paginationResult;
      } else {
        return { next: false, result: [], page: options.page };
      }
    }
  }

  // End of pagination
  // End of pagination

  /**
   * removes data from collection
   * @param condition
   */
  async deleteOne(condition: any): Promise<IApp.Entity<boolean>> {
    const removedData = await this.model.deleteOne(condition).exec();
    // if (removedData.ok && removedData.n) return { success: true };
    // else return { success: false };
    if (removedData.deletedCount && removedData.deletedCount > 0) {
      return { success: true };
    } else {
      return { success: false };
    }
  }

  async deleteMany(condition: any): Promise<IApp.Entity<boolean>> {
    const removedData = await this.model.deleteMany(condition).exec();
    // if (removedData.ok && removedData.n) return { success: true };
    // else return { success: false };
    if (removedData.deletedCount && removedData.deletedCount > 0) {
      return { success: true };
    } else {
      return { success: false };
    }
  }

  /**
   * performs bulk write operations
   * @param operations
   */
  async bulkWrite(operations: any[], options: any) {
    return this.model.bulkWrite(operations, options);
  }
  /**
   * @description fetch device token for sending push
   * @param userId
   */
  async fetchDeviceToken(userId: string): Promise<any> {
    try {
      return this.model.distinct('deviceDetails.deviceToken', {
        // update this line
        userId: new Types.ObjectId(userId),
        // userId:  Types.ObjectId(userId),
        // notificationEnabled: ENUM_ARRAY.NOTIFICATION.ENABLE,
        isActive: true,
      });
    } catch (error) {
      console.error(`we have an error while fetching device tokens ==> ${error}`);
    }
  }

  async updateDocument(condition: any, payload: any, options?: any) {
    try {
      const data = await this.model
        .findOneAndUpdate(condition, { $set: payload }, options)
        .lean()
        .exec();
      return data;
    } catch (error) {
      console.error(`we have an error in updateDocument mongo ==> ${error}`);
      return Promise.reject(error);
    }
  }
}
