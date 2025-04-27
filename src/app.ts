import express, { Request, Response } from 'express';
import 'module-alias/register';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import {
  ErrorHandler as ErrorHandlerMiddleware,
  InvalidRoute as InvalidRouteMiddleware,
  // userVerifySoketJWT,
} from './middleware';
import routes from './routes';
import { mongoDatabase } from './services';
import swaggerRoutes from './swagger';
import http from 'http'; // Import http for creating server
// import { requestLogger, errorLogger } from './middleware/logger.middleware';
// import swaggerDocument from '@/api-docs/swagger.json';

class App {
  public app: express.Application;

  public server: http.Server;
  public io: SocketIOServer;
  constructor() {
    this.app = express();
    this.app.get('/', (req: Request, res: Response) => {
      res.send('' + process.env.NODE_ENV + ' server from second brain after github actions');
    });

    this.server = http.createServer(this.app); // Create HTTP server
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    }); // Initialize Socket.IO

    this.start();
  }

  get instance(): express.Application {
    return this.app;
  }
  get ioInstance(): SocketIOServer {
    return this.io;
  }

  //
  async start() {
    try {
      // Connect to MongoDB
      await mongoDatabase.connect();

      // Configure middlewares
      this.useMiddlewares();

      // Configure routes
      this.useRoutes();

      // monitor changes in location collection

      // Configure Socket.IO events
      this.useSocketIO();
    } catch (err) {
      console.log('Error starting server: ', err);
    }
  }

  useMiddlewares() {
    console.log('Using middlewares');
    this.app.use(morgan('dev'));
    this.app.use(
      express.json({
        limit: '50mb',
      }),
    );
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    // this.app.use(cors());
    this.app.use(cors({ origin: '*' }));
    // this.app.use(requestLogger);
  }

  private useRoutes() {
    this.app.use(routes.path, routes.instance);
    this.app.use('/api-docs', swaggerRoutes);
    this.app.use('/uploads', express.static('uploads'));
    // Invalid route handler must be the last middleware
    this.app.use(InvalidRouteMiddleware);
    // Error handler must be the last middleware
    // this.app.use(errors());

    this.app.use(ErrorHandlerMiddleware);
    // this.app.use(errorLogger);

    // API Documentation - Use one of these approaches, not both
    // Option 1: Use the existing swagger routes
    this.app.use('/swagger', swaggerRoutes);

    // Option 2: Or use the direct setup with our new swagger document
    // this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    //   explorer: true,
    //   customCss: '.swagger-ui .topbar { display: none }',
    //   customSiteTitle: 'Cooding-Soyar API Documentation',
    // }));
  }

  private useSocketIO() {
    console.log('Using Socket.IO');
    this.io.use((socket, next) => {
      console.log('94 app socket.handshake.headers', socket.handshake.headers);
      // userVerifySoketJWT(socket, next);
    });

    this.io.on('connection', socket => {
      console.log('a user connected', socket.data.user);
      console.log('a user connected', socket.data.user);
      // const userId = socket.data?.user?._id;

      socket.on('bookmark-ai-chat', async data => {
        try {
          // const response = await BookmarkEntities.bookmarkAIChat(data, userId);
          // console.log("--------")
          // console.log("--------")
          // console.log("--------")
          // console.log("--------")
          // console.log("--------")
          // console.log("--------")
          // console.log("--------")
          // console.log({response}, "response")
          // console.log("--------")
          // console.log("--------")
          // console.log("--------")
          // console.log("--------")
          // console.log("--------")
          // console.log("--------")
          // console.log("--------")
          // console.log("--------")
          // socket.emit("ai-chat-response", { response });
        } catch (error) {
          socket.emit('ai-chat-error', { error: error.message });
        }
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }
}

export default new App();
