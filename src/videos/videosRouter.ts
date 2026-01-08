import { Request, Response, Router } from 'express';
import { CreateInputVideoType, UpdateInputVideoType, VideoParamsId, VideoType } from './types';
import { HttpStatus } from '../core/commonTypes/HttpStatus';
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../core/commonTypes/RequestTypes';
import { createVideoValidation, updateVideoValidation } from './videosValidation';
import { APIErrorResult } from '../core/commonTypes/APIErrorResult';
import { videosRepoitory } from './videosRepository';

const videosRouter = Router();

videosRouter.get('/', (req: Request, res: Response<VideoType[]>) => {
  const videos = videosRepoitory.findAll();
  res.status(HttpStatus.Ok).json(videos);
});

videosRouter.get('/:id', (req: RequestWithParams<VideoParamsId>, res: Response<VideoType>) => {
  const neededVideoId = Number(req.params.id);
  const foundVideo = videosRepoitory.findById(neededVideoId);

  if (!foundVideo) {
    res.sendStatus(HttpStatus.Not_Found);
    return;
  }

  res.status(HttpStatus.Ok).json(foundVideo);
});

videosRouter.post(
  '/',
  (req: RequestWithBody<CreateInputVideoType>, res: Response<VideoType | APIErrorResult>) => {
    const { cleanData, errors } = createVideoValidation(req.body);

    if (errors.length !== 0) {
      res.status(HttpStatus.Bad_Request).json({ errorsMessages: errors });
      return;
    }

    const newVideo: VideoType = videosRepoitory.create(cleanData);
    res.status(HttpStatus.Created).json(newVideo);
  }
);

videosRouter.put(
  '/:id',
  (
    req: RequestWithParamsAndBody<VideoParamsId, UpdateInputVideoType>,
    res: Response<VideoType | APIErrorResult>
  ) => {
    const neededVideoId = Number(req.params.id);
    const { cleanData, errors } = updateVideoValidation(req.body);

    if (errors.length !== 0) {
      res.status(HttpStatus.Bad_Request).json({ errorsMessages: errors });
      return;
    }

    const isUpdated = videosRepoitory.update(neededVideoId, cleanData);
    res.sendStatus(isUpdated ? HttpStatus.No_Content : HttpStatus.Not_Found);
  }
);

videosRouter.delete('/:id', (req: RequestWithParams<VideoParamsId>, res: Response) => {
  const neededVideoId = Number(req.params.id);
  const isDeleted = videosRepoitory.delete(neededVideoId);
  res.sendStatus(isDeleted ? HttpStatus.No_Content : HttpStatus.Not_Found);
});

export { videosRouter };
