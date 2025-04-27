import { NextFunction, Request, Response, Router } from 'express';
import { ReportController } from '@controllers';
import { userVerifyJWT } from '@middleware';
import BaseRoute from './base.routes';

class ReportRoute extends BaseRoute {
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

    // Create a new report
    this.router.post('/', userVerifyJWT, (req: Request, res: Response, next: NextFunction) => {
      ReportController.createReport(req, res, next);
    });

    // Get report listing
    this.router.get('/listing', (req: Request, res: Response, next: NextFunction) => {
      ReportController.aggregateReports(req, res, next);
    });

    // Get report by type and date (query parameters)
    this.router.get('/', userVerifyJWT, (req: Request, res: Response, next: NextFunction) => {
      ReportController.getReportByTypeAndDate(req, res, next);
    });

    // Get reports by date range
    this.router.get('/range', userVerifyJWT, (req: Request, res: Response, next: NextFunction) => {
      ReportController.getReportsWithinDateRange(req, res, next);
    });

    // Get reports with pending containers
    this.router.get(
      '/pending-containers',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        ReportController.getReportsWithPendingContainers(req, res, next);
      },
    );

    // *** Report generation endpoints ***

    // Generate daily report
    this.router.post(
      '/generate/daily',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        ReportController.generateDailyReport(req, res, next);
      },
    );

    // Generate weekly report
    this.router.post(
      '/generate/weekly',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        ReportController.generateWeeklyReport(req, res, next);
      },
    );

    // Generate monthly report
    this.router.post(
      '/generate/monthly',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        ReportController.generateMonthlyReport(req, res, next);
      },
    );

    // *** Type-specific routes ***

    // Get reports by type
    this.router.get(
      '/type/:type',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        ReportController.getReportsByType(req, res, next);
      },
    );

    // *** Analysis endpoints ***

    // Get container return efficiency
    this.router.get(
      '/:reportId/efficiency',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        ReportController.getContainerReturnEfficiency(req, res, next);
      },
    );

    // Get subscriber report
    this.router.get(
      '/subscriber/:subscriberId',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        ReportController.getSubscriberReport(req, res, next);
      },
    );

    // *** Subscriber management endpoints ***

    // Add subscriber to report
    this.router.post(
      '/:reportId/subscribers',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        ReportController.addSubscriberToReport(req, res, next);
      },
    );

    // Update subscriber detail in report
    this.router.put(
      '/:reportId/subscribers/:subscriberId',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        ReportController.updateSubscriberDetail(req, res, next);
      },
    );

    // Remove subscriber from report
    this.router.delete(
      '/:reportId/subscribers/:subscriberId',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        ReportController.removeSubscriberFromReport(req, res, next);
      },
    );

    // *** Report operations by ID ***

    // Get report by ID
    this.router.get(
      '/:reportId',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        ReportController.getReportById(req, res, next);
      },
    );

    // Update report by ID
    this.router.put(
      '/:reportId',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        ReportController.updateReportById(req, res, next);
      },
    );

    // Delete report by ID
    this.router.delete(
      '/:reportId',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        ReportController.removeReportById(req, res, next);
      },
    );

    // *** Report operations by type and date ***

    // Update report by type and date
    this.router.put(
      '/update/:type/:date',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        ReportController.modifyReportByTypeAndDate(req, res, next);
      },
    );

    // Delete report by type and date
    this.router.delete(
      '/delete/:type/:date',
      userVerifyJWT,
      (req: Request, res: Response, next: NextFunction) => {
        ReportController.removeReportByTypeAndDate(req, res, next);
      },
    );
  }
}

export default new ReportRoute('/reports');
