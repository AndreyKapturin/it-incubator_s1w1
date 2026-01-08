import { Router } from 'express';
import { CreateInputVideoType, UpdateInputVideoType } from './types';
import { createVideoValidation, updateVideoValidation } from './videosValidation';
import { bodyValidationMiddleware } from '../core/utils/validationMiddleware';
import { videosControllers } from './videosControllers';

const videosRouter = Router();

videosRouter.get('/', videosControllers.getAllVideos);
videosRouter.get('/:id', videosControllers.getVideoById);

videosRouter.post(
  '/',
  bodyValidationMiddleware<CreateInputVideoType>(createVideoValidation),
  videosControllers.createVideo
);

videosRouter.put(
  '/:id',
  bodyValidationMiddleware<UpdateInputVideoType>(updateVideoValidation),
  videosControllers.updateVideo
);

videosRouter.delete('/:id', videosControllers.deleteVideo);

export { videosRouter };
