import express from 'express';
import { videosRouter } from '../videos/videosRouter';
import { Routes } from './routes';
import { testingRouter } from '../testing/testingRouter';
import { swaggerRouter } from '../docs/swagger/swaggerRouter';

const app = express();
const jsonBodyMiddleware = express.json();

app.use(jsonBodyMiddleware);
app.use(Routes.Videos, videosRouter);
app.use(Routes.Testing, testingRouter);
app.use(Routes.Docs, swaggerRouter);

export { app };
