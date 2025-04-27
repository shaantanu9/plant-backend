import { NextFunction, Request, Response, Router } from 'express';
import { logger } from '../services/utils';
import BaseRoute from './base.routes';

// Import all route files
// import activityRoutes from "./activity.routes";
import containerRoutes from './container.routes';
import deliveryRoutes from './delivery.routes';
import deliveryPersonnelRoutes from './deliveryPersonnel.routes';
import reportRoutes from './report.routes';
import subscriberRoutes from './subscriber.routes';
import subscriptionRoutes from './subscription.routes';
import userRoutes from './user.routes';

class Routes extends BaseRoute {
  public path = '/api';

  constructor() {
    super();
    this.init();
  }

  get instance(): Router {
    return this.router;
  }

  private routeMiddlewares() {
    this.router.use((req: Request, res: Response, next: NextFunction) => {
      res.locals.lang = req.headers.lang || 'en';

      logger(`\n 👉👉 New request ==> ${req.method} ${req.originalUrl} 🆕🆕`);
      logger(`\n req.headers ==> 👇👇`, req.headers);
      logger(`\n req.params ==> 👇👇`, req.query);
      logger(`\n req.body  ==> 👇👇`, req.body);

      logger(`\n ✔️✔️ api console done ✔️✔️ \n\n`);

      return next();
    });
  }

  private init() {
    this.routeMiddlewares();

    // User and authentication routes
    this.router.use(userRoutes.path, userRoutes.instance);

    // Activity logging
    // this.router.use(activityRoutes.path, activityRoutes.instance);

    // Plant app specific routes
    this.router.use(deliveryRoutes.path, deliveryRoutes.instance);
    this.router.use(deliveryPersonnelRoutes.path, deliveryPersonnelRoutes.instance);
    this.router.use(containerRoutes.path, containerRoutes.instance);
    this.router.use(reportRoutes.path, reportRoutes.instance);
    this.router.use(subscriberRoutes.path, subscriberRoutes.instance);
    this.router.use(subscriptionRoutes.path, subscriptionRoutes.instance);
  }
}

export default new Routes();
