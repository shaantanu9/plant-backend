import { Router } from 'express';

export default class BaseRoute {
  protected router = Router();
  constructor() {}
}
