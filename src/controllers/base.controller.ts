import { Response } from 'express';

export default class BaseController {
  constructor() {}

  // *** Response Handlers *** //

  // Success Response
  async sendResponse(res: Response, data: any, msg: any) {
    return res.status(msg.httpCode).json({
      message: msg.message,
      data,
      statusCode: msg.httpCode,
    });
  }

  // Error Response
  async sendError(res: Response, error: any, status: number = 500) {
    console.log('SendError: ');
    return res.status(status).json({
      message: error.message,
      error,
    });
  }

  //   // Not Found Response
  async notFound(res: Response, message: string = 'Not Found') {
    console.log('Not Found: ');
    return res.status(404).json({
      message,
    });
  }

  //   // Bad Request Response
  async badRequest(res: Response, message: string = 'Bad Request') {
    console.log('Bad Request: ');
    return res.status(400).json({
      message,
    });
  }

  //   // Forbidden Response
  async forbidden(res: Response, message: string = 'Forbidden') {
    console.log('Forbidden: ');
    return res.status(403).json({
      message,
    });
  }

  //   // Unauthorized Response
  async unauthorized(res: Response, message: string = 'Unauthorized') {
    console.log('Unauthorized: ');
    return res.status(401).json({
      message,
    });
  }

  //   // Conflict Response (409) means that the request could not be processed because of conflict in the current state of the resource, such as an edit conflict between multiple simultaneous updates.
  //   (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409)
  async conflict(res: Response, message: string = 'Conflict') {
    console.log('Conflict: ');
    return res.status(409).json({
      message,
    });
  }

  // // HTML Response
  async html(res: Response, html: any) {
    return res.status(200).send(html);
  }
}
