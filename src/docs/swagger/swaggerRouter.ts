import swaggerJsdoc, { Options, Schema } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const VideosSchema: Schema = {};

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Videos API',
      version: '1.0.0',
      description: 'Videos API application',
    },
  },
  apis: ['./src/**/*.swagger.yml'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
const swaggerRouter = Router();
swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { swaggerRouter };
