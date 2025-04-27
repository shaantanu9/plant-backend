import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './api-docs/swagger.json';

const router = express.Router();

router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Cooding-Soyar API Documentation',
  }),
);

export default router;
