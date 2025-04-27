// // controllers/ReportController.ts
// import { Request, Response, NextFunction } from "express";
// import { ReportEntities } from "@entity";
// import BaseController from "./base.controller";
// import { RESPONSE } from "@response";

// class ReportControllerClass extends BaseController {
//   constructor() {
//     super();
//   }

//   // Basic CRUD operations

//   // Create a new report
//   public async createReport(req: Request, res: Response, next: NextFunction) {
//     try {
//       const report = await ReportEntities.addReport(req.body);
//       return this.sendResponse(res, report, RESPONSE.REPORT("Report created"));
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get report by type and date
//   public async getReportByTypeAndDate(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { type, date } = req.query;

//       if (!type || !date) {
//         return this.badRequest(res, "Report type and date are required");
//       }

//       const dateObj = new Date(date as string);

//       if (isNaN(dateObj.getTime())) {
//         return this.badRequest(res, "Invalid date format");
//       }

//       const report = await ReportEntities.getReportByTypeAndDate(
//         type as string,
//         dateObj
//       );
//       return report
//         ? this.sendResponse(res, report, RESPONSE.REPORT("Report found"))
//         : this.notFound(res, "Report not found");
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get reports by type
//   public async getReportsByType(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { type } = req.params;

//       if (!type) {
//         return this.badRequest(res, "Report type is required");
//       }

//       const reports = await ReportEntities.getReportsByType(type);
//       return this.sendResponse(
//         res,
//         reports,
//         RESPONSE.REPORT("Reports retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get reports within a date range
//   public async getReportsWithinDateRange(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { startDate, endDate } = req.query;

//       if (!startDate || !endDate) {
//         return this.badRequest(res, "Start date and end date are required");
//       }

//       const startDateObj = new Date(startDate as string);
//       const endDateObj = new Date(endDate as string);

//       if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
//         return this.badRequest(res, "Invalid date format");
//       }

//       const reports = await ReportEntities.getReportsWithinDateRange(
//         startDateObj,
//         endDateObj
//       );
//       return this.sendResponse(
//         res,
//         reports,
//         RESPONSE.REPORT("Reports retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get reports with pending containers
//   public async getReportsWithPendingContainers(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const reports = await ReportEntities.getReportsWithPendingContainers();
//       return this.sendResponse(
//         res,
//         reports,
//         RESPONSE.REPORT("Reports with pending containers retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Update report by type and date
//   public async modifyReportByTypeAndDate(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { type, date } = req.params;
//       const updates = req.body;

//       if (!type || !date) {
//         return this.badRequest(res, "Report type and date are required");
//       }

//       const dateObj = new Date(date);

//       if (isNaN(dateObj.getTime())) {
//         return this.badRequest(res, "Invalid date format");
//       }

//       const result = await ReportEntities.modifyReportByTypeAndDate(
//         type,
//         dateObj,
//         updates
//       );
//       return result.modifiedCount > 0
//         ? this.sendResponse(
//             res,
//             { updated: true },
//             RESPONSE.REPORT("Report updated")
//           )
//         : this.notFound(res, "Report not found or no changes made");
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Delete report by type and date
//   public async removeReportByTypeAndDate(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { type, date } = req.params;

//       if (!type || !date) {
//         return this.badRequest(res, "Report type and date are required");
//       }

//       const dateObj = new Date(date);

//       if (isNaN(dateObj.getTime())) {
//         return this.badRequest(res, "Invalid date format");
//       }

//       const result = await ReportEntities.removeReportByTypeAndDate(
//         type,
//         dateObj
//       );
//       return result.success
//         ? this.sendResponse(
//             res,
//             { deleted: true },
//             RESPONSE.REPORT("Report deleted")
//           )
//         : this.notFound(res, "Report not found");
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Report generation endpoints

//   // Generate daily report
//   public async generateDailyReport(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { date, deliveryData, containerData } = req.body;

//       if (
//         !date ||
//         !Array.isArray(deliveryData) ||
//         !Array.isArray(containerData)
//       ) {
//         return this.badRequest(
//           res,
//           "Date, delivery data array, and container data array are required"
//         );
//       }

//       const dateObj = new Date(date);

//       if (isNaN(dateObj.getTime())) {
//         return this.badRequest(res, "Invalid date format");
//       }

//       const report = await ReportEntities.generateDailyReport(
//         dateObj,
//         deliveryData,
//         containerData
//       );
//       return this.sendResponse(
//         res,
//         report,
//         RESPONSE.REPORT("Daily report generated")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Generate weekly report
//   public async generateWeeklyReport(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { startDate, endDate } = req.body;

//       if (!startDate || !endDate) {
//         return this.badRequest(res, "Start date and end date are required");
//       }

//       const startDateObj = new Date(startDate);
//       const endDateObj = new Date(endDate);

//       if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
//         return this.badRequest(res, "Invalid date format");
//       }

//       const report = await ReportEntities.generateWeeklyReport(
//         startDateObj,
//         endDateObj
//       );

//       if (!report) {
//         return this.badRequest(
//           res,
//           "No data available to generate weekly report"
//         );
//       }

//       return this.sendResponse(
//         res,
//         report,
//         RESPONSE.REPORT("Weekly report generated")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Generate monthly report
//   public async generateMonthlyReport(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { year, month } = req.body;

//       if (!year || !month || isNaN(Number(year)) || isNaN(Number(month))) {
//         return this.badRequest(res, "Valid year and month are required");
//       }

//       const yearNum = parseInt(year);
//       const monthNum = parseInt(month);

//       if (monthNum < 1 || monthNum > 12) {
//         return this.badRequest(res, "Month must be between 1 and 12");
//       }

//       const report = await ReportEntities.generateMonthlyReport(
//         yearNum,
//         monthNum
//       );

//       if (!report) {
//         return this.badRequest(
//           res,
//           "No data available to generate monthly report"
//         );
//       }

//       return this.sendResponse(
//         res,
//         report,
//         RESPONSE.REPORT("Monthly report generated")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Analysis endpoints

//   // Get container return efficiency
//   public async getContainerReturnEfficiency(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { reportId } = req.params;

//       if (!reportId) {
//         return this.badRequest(res, "Report ID is required");
//       }

//       const efficiency = await ReportEntities.getContainerReturnEfficiency(
//         reportId
//       );

//       if (!efficiency) {
//         return this.notFound(res, "Report not found");
//       }

//       return this.sendResponse(
//         res,
//         efficiency,
//         RESPONSE.REPORT("Container return efficiency retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get subscriber report
//   public async getSubscriberReport(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { subscriberId } = req.params;
//       const { startDate, endDate } = req.query;

//       if (!subscriberId || !startDate || !endDate) {
//         return this.badRequest(
//           res,
//           "Subscriber ID, start date, and end date are required"
//         );
//       }

//       const startDateObj = new Date(startDate as string);
//       const endDateObj = new Date(endDate as string);

//       if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
//         return this.badRequest(res, "Invalid date format");
//       }

//       const report = await ReportEntities.getSubscriberReport(
//         subscriberId,
//         startDateObj,
//         endDateObj
//       );

//       if (!report) {
//         return this.notFound(res, "No reports found for this subscriber");
//       }

//       return this.sendResponse(
//         res,
//         report,
//         RESPONSE.REPORT("Subscriber report retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get performance by zone
//   public async getPerformanceByZone(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { type, date } = req.query;
//       const { zones } = req.body;

//       if (!type || !date || !zones || !Array.isArray(zones)) {
//         return this.badRequest(
//           res,
//           "Report type, date, and zones array are required"
//         );
//       }

//       const dateObj = new Date(date as string);

//       if (isNaN(dateObj.getTime())) {
//         return this.badRequest(res, "Invalid date format");
//       }

//       const performance = await ReportEntities.getPerformanceByZone(
//         type as string,
//         dateObj,
//         zones
//       );

//       if (!performance) {
//         return this.notFound(res, "Report not found");
//       }

//       return this.sendResponse(
//         res,
//         performance,
//         RESPONSE.REPORT("Zone performance retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get trend analysis
//   public async getTrendAnalysis(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { type } = req.params;
//       const { startDate, endDate } = req.query;

//       if (!type || !startDate || !endDate) {
//         return this.badRequest(
//           res,
//           "Report type, start date, and end date are required"
//         );
//       }

//       const startDateObj = new Date(startDate as string);
//       const endDateObj = new Date(endDate as string);

//       if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
//         return this.badRequest(res, "Invalid date format");
//       }

//       const trends = await ReportEntities.getTrendAnalysis(
//         type,
//         startDateObj,
//         endDateObj
//       );
//       return this.sendResponse(
//         res,
//         trends,
//         RESPONSE.REPORT("Trend analysis retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get top performing subscribers
//   public async getTopPerformingSubscribers(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { type, date } = req.query;
//       const { limit } = req.query;

//       if (!type || !date) {
//         return this.badRequest(res, "Report type and date are required");
//       }

//       const dateObj = new Date(date as string);

//       if (isNaN(dateObj.getTime())) {
//         return this.badRequest(res, "Invalid date format");
//       }

//       const limitNum = limit ? parseInt(limit as string) : 10;

//       if (isNaN(limitNum) || limitNum <= 0) {
//         return this.badRequest(res, "Limit must be a positive number");
//       }

//       const subscribers = await ReportEntities.getTopPerformingSubscribers(
//         type as string,
//         dateObj,
//         limitNum
//       );
//       return this.sendResponse(
//         res,
//         subscribers,
//         RESPONSE.REPORT("Top performing subscribers retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Get worst performing subscribers
//   public async getWorstPerformingSubscribers(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { type, date } = req.query;
//       const { limit } = req.query;

//       if (!type || !date) {
//         return this.badRequest(res, "Report type and date are required");
//       }

//       const dateObj = new Date(date as string);

//       if (isNaN(dateObj.getTime())) {
//         return this.badRequest(res, "Invalid date format");
//       }

//       const limitNum = limit ? parseInt(limit as string) : 10;

//       if (isNaN(limitNum) || limitNum <= 0) {
//         return this.badRequest(res, "Limit must be a positive number");
//       }

//       const subscribers = await ReportEntities.getWorstPerformingSubscribers(
//         type as string,
//         dateObj,
//         limitNum
//       );
//       return this.sendResponse(
//         res,
//         subscribers,
//         RESPONSE.REPORT("Worst performing subscribers retrieved")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Subscriber management endpoints

//   // Update subscriber detail
//   public async updateSubscriberDetail(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { reportId, subscriberId } = req.params;
//       const updates = req.body;

//       if (!reportId || !subscriberId || !updates) {
//         return this.badRequest(
//           res,
//           "Report ID, subscriber ID, and update data are required"
//         );
//       }

//       const report = await ReportEntities.updateSubscriberDetail(
//         reportId,
//         subscriberId,
//         updates
//       );

//       if (!report) {
//         return this.notFound(res, "Report or subscriber not found");
//       }

//       return this.sendResponse(
//         res,
//         report,
//         RESPONSE.REPORT("Subscriber detail updated")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Add subscriber to report
//   public async addSubscriberToReport(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { reportId } = req.params;
//       const subscriberDetail = req.body;

//       if (!reportId || !subscriberDetail || !subscriberDetail.subscriberId) {
//         return this.badRequest(
//           res,
//           "Report ID and valid subscriber details are required"
//         );
//       }

//       const report = await ReportEntities.addSubscriberToReport(
//         reportId,
//         subscriberDetail
//       );

//       if (!report) {
//         return this.notFound(res, "Report not found");
//       }

//       return this.sendResponse(
//         res,
//         report,
//         RESPONSE.REPORT("Subscriber added to report")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Remove subscriber from report
//   public async removeSubscriberFromReport(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { reportId, subscriberId } = req.params;

//       if (!reportId || !subscriberId) {
//         return this.badRequest(res, "Report ID and subscriber ID are required");
//       }

//       const report = await ReportEntities.removeSubscriberFromReport(
//         reportId,
//         subscriberId
//       );

//       if (!report) {
//         return this.notFound(res, "Report or subscriber not found");
//       }

//       return this.sendResponse(
//         res,
//         report,
//         RESPONSE.REPORT("Subscriber removed from report")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }

//   // Dashboard endpoints

//   // Generate dashboard summary
//   public async generateDashboardSummary(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const { period } = req.query;

//       const validPeriods = ["last7days", "last30days", "last90days"];
//       const selectedPeriod =
//         period && validPeriods.includes(period as string)
//           ? (period as string)
//           : "last30days";

//       const summary = await ReportEntities.generateDashboardSummary(
//         selectedPeriod
//       );

//       if (!summary) {
//         return this.notFound(res, "No report data available for this period");
//       }

//       return this.sendResponse(
//         res,
//         summary,
//         RESPONSE.REPORT("Dashboard summary generated")
//       );
//     } catch (error) {
//       return this.sendError(res, error);
//     }
//   }
// }

// export const ReportController = new ReportControllerClass();

import { NextFunction, Request, Response } from 'express';
import builder from '@builders';
import { ReportEntities } from '@entity';
import { RESPONSE } from '@response';
import BaseController from './base.controller';

class ReportControllerClass extends BaseController {
  constructor() {
    super();
  }

  // *** Basic CRUD operations ***

  // Create a new report
  public async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      const report = await ReportEntities.addReport(req.body);
      return this.sendResponse(res, report, RESPONSE.REPORT('Report created'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get report by type and date
  public async getReportByTypeAndDate(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, date } = req.query;

      if (!type || !date) {
        return this.badRequest(res, 'Report type and date are required');
      }

      const dateObj = new Date(date as string);

      if (isNaN(dateObj.getTime())) {
        return this.badRequest(res, 'Invalid date format');
      }

      const report = await ReportEntities.getReportByTypeAndDate(type as string, dateObj);
      return report
        ? this.sendResponse(res, report, RESPONSE.REPORT('Report found'))
        : this.notFound(res, 'Report not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get report by ID
  public async getReportById(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportId } = req.params;

      if (!reportId) {
        return this.badRequest(res, 'Report ID is required');
      }

      const report = await ReportEntities.getReportById(reportId);
      return report
        ? this.sendResponse(res, report, RESPONSE.REPORT('Report found'))
        : this.notFound(res, 'Report not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get reports by type
  public async getReportsByType(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.params;

      if (!type) {
        return this.badRequest(res, 'Report type is required');
      }

      const reports = await ReportEntities.getReportsByType(type);
      return this.sendResponse(res, reports, RESPONSE.REPORT('Reports retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get reports within a date range
  public async getReportsWithinDateRange(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, type } = req.query;
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

      // if start date is greater than end date then return error and set end date to start date
      if (startDateObj > endDateObj) {
        endDateObj = startDateObj;
      }

      // if date is invalid then return error
      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        return this.badRequest(res, 'Invalid date format');
      }

      const reports = await ReportEntities.getReportsWithinDateRange(
        startDateObj,
        endDateObj,
        type as string,
      );
      return this.sendResponse(res, reports, RESPONSE.REPORT('Reports retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get reports with pending containers
  public async getReportsWithPendingContainers(req: Request, res: Response, next: NextFunction) {
    try {
      const { threshold } = req.query;
      const thresholdNum = threshold ? parseInt(threshold as string) : 0;

      const reports = await ReportEntities.getReportsWithPendingContainers(thresholdNum);
      return this.sendResponse(
        res,
        reports,
        RESPONSE.REPORT('Reports with pending containers retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update report by type and date
  public async modifyReportByTypeAndDate(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, date } = req.params;
      const updates = req.body;

      if (!type || !date) {
        return this.badRequest(res, 'Report type and date are required');
      }

      const dateObj = new Date(date);

      if (isNaN(dateObj.getTime())) {
        return this.badRequest(res, 'Invalid date format');
      }

      const result = await ReportEntities.modifyReportByTypeAndDate(type, dateObj, updates);
      return result.modifiedCount > 0
        ? this.sendResponse(res, { updated: true }, RESPONSE.REPORT('Report updated'))
        : this.notFound(res, 'Report not found or no changes made');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Update report by ID
  public async updateReportById(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportId } = req.params;
      const updates = req.body;

      if (!reportId) {
        return this.badRequest(res, 'Report ID is required');
      }

      const result = await ReportEntities.updateReportById(reportId, updates);
      return result?.modifiedCount > 0
        ? this.sendResponse(res, { updated: true }, RESPONSE.REPORT('Report updated'))
        : this.notFound(res, 'Report not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Delete report by type and date
  public async removeReportByTypeAndDate(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, date } = req.params;

      if (!type || !date) {
        return this.badRequest(res, 'Report type and date are required');
      }

      const dateObj = new Date(date);

      if (isNaN(dateObj.getTime())) {
        return this.badRequest(res, 'Invalid date format');
      }

      const result = await ReportEntities.removeReportByTypeAndDate(type, dateObj);
      return result.success
        ? this.sendResponse(res, { deleted: true }, RESPONSE.REPORT('Report deleted'))
        : this.notFound(res, 'Report not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Delete report by ID
  public async removeReportById(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportId } = req.params;

      if (!reportId) {
        return this.badRequest(res, 'Report ID is required');
      }

      const result = await ReportEntities.removeReportById(reportId);
      return result.success
        ? this.sendResponse(res, { deleted: true }, RESPONSE.REPORT('Report deleted'))
        : this.notFound(res, 'Report not found');
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // *** Report generation endpoints ***

  // Generate daily report
  public async generateDailyReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, deliveryData, containerData, adminId } = req.body;

      if (!date || !Array.isArray(deliveryData) || !Array.isArray(containerData)) {
        return this.badRequest(
          res,
          'Date, delivery data array, and container data array are required',
        );
      }

      const dateObj = new Date(date);

      if (isNaN(dateObj.getTime())) {
        return this.badRequest(res, 'Invalid date format');
      }

      const report = await ReportEntities.generateDailyReport(
        dateObj,
        deliveryData,
        containerData,
        adminId,
      );
      return this.sendResponse(res, report, RESPONSE.REPORT('Daily report generated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Generate weekly report
  public async generateWeeklyReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate, adminId } = req.body;
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

      // if start date is greater than end date then return error and set end date to start date
      if (startDateObj > endDateObj) {
        endDateObj = startDateObj;
      }

      // if date is invalid then return error
      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        return this.badRequest(res, 'Invalid date format');
      }

      const report = await ReportEntities.generateWeeklyReport(startDateObj, endDateObj, adminId);

      if (!report) {
        return this.badRequest(res, 'No data available to generate weekly report');
      }

      return this.sendResponse(res, report, RESPONSE.REPORT('Weekly report generated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Generate monthly report
  public async generateMonthlyReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { year, month, adminId } = req.body;

      if (!year || !month || isNaN(Number(year)) || isNaN(Number(month))) {
        return this.badRequest(res, 'Valid year and month are required');
      }

      const yearNum = parseInt(year);
      const monthNum = parseInt(month);

      if (monthNum < 1 || monthNum > 12) {
        return this.badRequest(res, 'Month must be between 1 and 12');
      }

      const report = await ReportEntities.generateMonthlyReport(yearNum, monthNum, adminId);

      if (!report) {
        return this.badRequest(res, 'No data available to generate monthly report');
      }

      return this.sendResponse(res, report, RESPONSE.REPORT('Monthly report generated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // // Generate quarterly report
  // public async generateQuarterlyReport(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { year, quarter, adminId } = req.body;

  //     if (!year || !quarter || isNaN(Number(year)) || isNaN(Number(quarter))) {
  //       return this.badRequest(res, "Valid year and quarter are required");
  //     }

  //     const yearNum = parseInt(year);
  //     const quarterNum = parseInt(quarter);

  //     if (quarterNum < 1 || quarterNum > 4) {
  //       return this.badRequest(res, "Quarter must be between 1 and 4");
  //     }

  //     const report = await ReportEntities.generateQuarterlyReport(
  //       yearNum,
  //       quarterNum,
  //       adminId
  //     );

  //     if (!report) {
  //       return this.badRequest(
  //         res,
  //         "No data available to generate quarterly report"
  //       );
  //     }

  //     return this.sendResponse(
  //       res,
  //       report,
  //       RESPONSE.REPORT("Quarterly report generated")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // // Generate annual report
  // public async generateAnnualReport(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { year, adminId } = req.body;

  //     if (!year || isNaN(Number(year))) {
  //       return this.badRequest(res, "Valid year is required");
  //     }

  //     const yearNum = parseInt(year);

  //     const report = await ReportEntities.generateAnnualReport(
  //       yearNum,
  //       adminId
  //     );

  //     if (!report) {
  //       return this.badRequest(
  //         res,
  //         "No data available to generate annual report"
  //       );
  //     }

  //     return this.sendResponse(
  //       res,
  //       report,
  //       RESPONSE.REPORT("Annual report generated")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // // Generate custom date range report
  // public async generateCustomReport(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { startDate, endDate, title, adminId, reportType } = req.body;

  //     if (!startDate || !endDate || !title || !reportType) {
  //       return this.badRequest(
  //         res,
  //         "Start date, end date, title, and report type are required"
  //       );
  //     }

  //     const startDateObj = new Date(startDate);
  //     const endDateObj = new Date(endDate);

  //     if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
  //       return this.badRequest(res, "Invalid date format");
  //     }

  //     const report = await ReportEntities.generateCustomReport(
  //       startDateObj,
  //       endDateObj,
  //       title,
  //       reportType,
  //       adminId
  //     );

  //     if (!report) {
  //       return this.badRequest(
  //         res,
  //         "No data available to generate custom report"
  //       );
  //     }

  //     return this.sendResponse(
  //       res,
  //       report,
  //       RESPONSE.REPORT("Custom report generated")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // *** Analysis endpoints ***

  // Get container return efficiency
  public async getContainerReturnEfficiency(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportId } = req.params;

      if (!reportId) {
        return this.badRequest(res, 'Report ID is required');
      }

      const efficiency = await ReportEntities.getContainerReturnEfficiency(reportId);

      if (!efficiency) {
        return this.notFound(res, 'Report not found');
      }

      return this.sendResponse(
        res,
        efficiency,
        RESPONSE.REPORT('Container return efficiency retrieved'),
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get subscriber report
  public async getSubscriberReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriberId } = req.params;
      const { startDate, endDate } = req.query;

      if (!subscriberId || !startDate || !endDate) {
        return this.badRequest(res, 'Subscriber ID, start date, and end date are required');
      }

      const startDateObj = new Date(startDate as string);
      const endDateObj = new Date(endDate as string);

      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        return this.badRequest(res, 'Invalid date format');
      }

      const report = await ReportEntities.getSubscriberReport(
        subscriberId,
        startDateObj,
        endDateObj,
      );

      if (!report) {
        return this.notFound(res, 'No reports found for this subscriber');
      }

      return this.sendResponse(res, report, RESPONSE.REPORT('Subscriber report retrieved'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // // Get performance by zone
  // public async getPerformanceByZone(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { reportId } = req.params;
  //     const { zones } = req.body;

  //     if (!reportId || !zones || !Array.isArray(zones)) {
  //       return this.badRequest(res, "Report ID and zones array are required");
  //     }

  //     const performance = await ReportEntities.getPerformanceByZone(
  //       reportId,
  //       zones
  //     );

  //     if (!performance) {
  //       return this.notFound(res, "Report not found");
  //     }

  //     return this.sendResponse(
  //       res,
  //       performance,
  //       RESPONSE.REPORT("Zone performance retrieved")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // Get trend analysis
  // public async getTrendAnalysis(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { type } = req.params;
  //     const { startDate, endDate, adminId } = req.query;

  //     if (!type || !startDate || !endDate) {
  //       return this.badRequest(
  //         res,
  //         "Report type, start date, and end date are required"
  //       );
  //     }

  //     const startDateObj = new Date(startDate as string);
  //     const endDateObj = new Date(endDate as string);

  //     if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
  //       return this.badRequest(res, "Invalid date format");
  //     }

  //     const trends = await ReportEntities.getTrendAnalysis(
  //       type,
  //       startDateObj,
  //       endDateObj,
  //       adminId as string
  //     );

  //     return this.sendResponse(
  //       res,
  //       trends,
  //       RESPONSE.REPORT("Trend analysis retrieved")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // Get top performing subscribers
  // public async getTopPerformingSubscribers(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { reportId } = req.params;
  //     const { limit, metric } = req.query;

  //     if (!reportId) {
  //       return this.badRequest(res, "Report ID is required");
  //     }

  //     const limitNum = limit ? parseInt(limit as string) : 10;
  //     const metricType = (metric as string) || "returnRate";

  //     if (isNaN(limitNum) || limitNum <= 0) {
  //       return this.badRequest(res, "Limit must be a positive number");
  //     }

  //     const subscribers = await ReportEntities.getTopPerformingSubscribers(
  //       reportId,
  //       limitNum,
  //       metricType
  //     );

  //     return this.sendResponse(
  //       res,
  //       subscribers,
  //       RESPONSE.REPORT("Top performing subscribers retrieved")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // Get worst performing subscribers
  // public async getWorstPerformingSubscribers(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { reportId } = req.params;
  //     const { limit, metric } = req.query;

  //     if (!reportId) {
  //       return this.badRequest(res, "Report ID is required");
  //     }

  //     const limitNum = limit ? parseInt(limit as string) : 10;
  //     const metricType = (metric as string) || "returnRate";

  //     if (isNaN(limitNum) || limitNum <= 0) {
  //       return this.badRequest(res, "Limit must be a positive number");
  //     }

  //     const subscribers = await ReportEntities.getWorstPerformingSubscribers(
  //       reportId,
  //       limitNum,
  //       metricType
  //     );

  //     return this.sendResponse(
  //       res,
  //       subscribers,
  //       RESPONSE.REPORT("Worst performing subscribers retrieved")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // Get delivery personnel performance
  // public async getDeliveryPersonnelPerformance(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { reportId } = req.params;

  //     if (!reportId) {
  //       return this.badRequest(res, "Report ID is required");
  //     }

  //     const performance = await ReportEntities.getDeliveryPersonnelPerformance(
  //       reportId
  //     );

  //     if (!performance) {
  //       return this.notFound(res, "Report not found");
  //     }

  //     return this.sendResponse(
  //       res,
  //       performance,
  //       RESPONSE.REPORT("Delivery personnel performance retrieved")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // Get container type analysis
  // public async getContainerTypeAnalysis(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { reportId } = req.params;

  //     if (!reportId) {
  //       return this.badRequest(res, "Report ID is required");
  //     }

  //     const analysis = await ReportEntities.getContainerTypeAnalysis(reportId);

  //     if (!analysis) {
  //       return this.notFound(res, "Report not found");
  //     }

  //     return this.sendResponse(
  //       res,
  //       analysis,
  //       RESPONSE.REPORT("Container type analysis retrieved")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // *** Subscriber management endpoints ***

  // Update subscriber detail
  public async updateSubscriberDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportId, subscriberId } = req.params;
      const updates = req.body;

      if (!reportId || !subscriberId || !updates) {
        return this.badRequest(res, 'Report ID, subscriber ID, and update data are required');
      }

      const report = await ReportEntities.updateSubscriberDetail(reportId, subscriberId, updates);

      if (!report) {
        return this.notFound(res, 'Report or subscriber not found');
      }

      return this.sendResponse(res, report, RESPONSE.REPORT('Subscriber detail updated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Add subscriber to report
  public async addSubscriberToReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportId } = req.params;
      const subscriberDetail = req.body;

      if (!reportId || !subscriberDetail || !subscriberDetail.subscriberId) {
        return this.badRequest(res, 'Report ID and valid subscriber details are required');
      }

      const report = await ReportEntities.addSubscriberToReport(reportId, subscriberDetail);

      if (!report) {
        return this.notFound(res, 'Report not found');
      }

      return this.sendResponse(res, report, RESPONSE.REPORT('Subscriber added to report'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Remove subscriber from report
  public async removeSubscriberFromReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportId, subscriberId } = req.params;

      if (!reportId || !subscriberId) {
        return this.badRequest(res, 'Report ID and subscriber ID are required');
      }

      const report = await ReportEntities.removeSubscriberFromReport(reportId, subscriberId);

      if (!report) {
        return this.notFound(res, 'Report or subscriber not found');
      }

      return this.sendResponse(res, report, RESPONSE.REPORT('Subscriber removed from report'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  // Get subscribers with high pending containers
  // public async getSubscribersWithHighPendingContainers(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { reportId } = req.params;
  //     const { threshold, limit } = req.query;

  //     if (!reportId) {
  //       return this.badRequest(res, "Report ID is required");
  //     }

  //     const thresholdNum = threshold ? parseInt(threshold as string) : 3;
  //     const limitNum = limit ? parseInt(limit as string) : 10;

  //     const subscribers =
  //       await ReportEntities.getSubscribersWithHighPendingContainers(
  //         reportId,
  //         thresholdNum,
  //         limitNum
  //       );

  //     return this.sendResponse(
  //       res,
  //       subscribers,
  //       RESPONSE.REPORT("Subscribers with high pending containers retrieved")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // *** Dashboard endpoints ***

  // Generate dashboard summary
  // public async generateDashboardSummary(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { period } = req.query;
  //     const { adminId } = req.query;

  //     const validPeriods = ["last7days", "last30days", "last90days", "custom"];
  //     const selectedPeriod =
  //       period && validPeriods.includes(period as string)
  //         ? (period as string)
  //         : "last30days";

  //     let startDate: Date | undefined;
  //     let endDate: Date | undefined;

  //     if (selectedPeriod === "custom") {
  //       const { startDateStr, endDateStr } = req.query;

  //       if (!startDateStr || !endDateStr) {
  //         return this.badRequest(
  //           res,
  //           "Custom period requires start date and end date"
  //         );
  //       }

  //       startDate = new Date(startDateStr as string);
  //       endDate = new Date(endDateStr as string);

  //       if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
  //         return this.badRequest(res, "Invalid date format");
  //       }
  //     }

  //     const summary = await ReportEntities.generateDashboardSummary(
  //       selectedPeriod,
  //       adminId as string,
  //       startDate,
  //       endDate
  //     );

  //     if (!summary) {
  //       return this.notFound(res, "No report data available for this period");
  //     }

  //     return this.sendResponse(
  //       res,
  //       summary,
  //       RESPONSE.REPORT("Dashboard summary generated")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // Get admin dashboard KPIs
  // public async getAdminDashboardKPIs(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { adminId } = req.params;
  //     const { period } = req.query;

  //     if (!adminId) {
  //       return this.badRequest(res, "Admin ID is required");
  //     }

  //     const validPeriods = ["daily", "weekly", "monthly"];
  //     const selectedPeriod =
  //       period && validPeriods.includes(period as string)
  //         ? (period as string)
  //         : "daily";

  //     const kpis = await ReportEntities.getAdminDashboardKPIs(
  //       adminId,
  //       selectedPeriod
  //     );

  //     return this.sendResponse(
  //       res,
  //       kpis,
  //       RESPONSE.REPORT("Admin dashboard KPIs retrieved")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // Get recent reports
  // public async getRecentReports(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { limit, type, adminId } = req.query;

  //     const limitNum = limit ? parseInt(limit as string) : 5;

  //     if (isNaN(limitNum) || limitNum <= 0) {
  //       return this.badRequest(res, "Limit must be a positive number");
  //     }

  //     const reports = await ReportEntities.getRecentReports(
  //       limitNum,
  //       type as string,
  //       adminId as string
  //     );

  //     return this.sendResponse(
  //       res,
  //       reports,
  //       RESPONSE.REPORT("Recent reports retrieved")
  //     );
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // *** Export/import operations ***

  // Export report to CSV
  // public async exportReportToCSV(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { reportId } = req.params;

  //     if (!reportId) {
  //       return this.badRequest(res, "Report ID is required");
  //     }

  //     const csvData = await ReportEntities.exportReportToCSV(reportId);

  //     if (!csvData) {
  //       return this.notFound(res, "Report not found");
  //     }

  //     // Set response headers for CSV download
  //     res.setHeader("Content-Type", "text/csv");
  //     res.setHeader("Content-Disposition", "attachment; filename=report.csv");

  //     return res.send(csvData);
  //   } catch (error) {
  //     return this.sendError(res, error);
  //   }
  // }

  // Aggregate reports
  public async aggregateReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params;
      const body = req.body;

      const pipline = builder.REPORT.buildReportQuery({
        ...body,
        adminId,
      });

      const options = {
        page: 1,
        limit: 10,
        getCount: true,
      };

      const result = await ReportEntities.paginateAggregate(pipline, options);

      return this.sendResponse(res, result, RESPONSE.REPORT('Reports aggregated'));
    } catch (error) {
      return this.sendError(res, error);
    }
  }
}

export const ReportController = new ReportControllerClass();
