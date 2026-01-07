import { Request, Response, Router } from 'express';
import { database } from '../database';
import { CreateInputVideoType, UpdateInputVideoType, VideoParamsId, VideoType } from './types';
import { HttpStatus } from '../core/commonTypes/HttpStatus';
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../core/commonTypes/RequestTypes';
import { createVideoValidation, updateVideoValidation } from './videosValidation';
import { APIErrorResult } from '../core/commonTypes/APIErrorResult';
import { generateId } from '../core/utils/generateId';

const videosRouter = Router();

videosRouter.get('/', (req: Request, res: Response<VideoType[]>) => {
  const videos = database.videos;
  res.status(HttpStatus.Ok).json(videos);
});

videosRouter.get('/:id', (req: RequestWithParams<VideoParamsId>, res: Response<VideoType>) => {
  const neededVideoId = Number(req.params.id);
  const foundVideo = database.videos.find((v) => v.id === neededVideoId);

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

    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(publicationDate.getDate() + 1);

    const newVideo: VideoType = {
      id: generateId(database.videos),
      title: cleanData.title,
      author: cleanData.author,
      availableResolutions: cleanData.availableResolutions,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: createdAt.toISOString(),
      publicationDate: publicationDate.toISOString(),
    };

    database.videos.push(newVideo);
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
    const foundVideo = database.videos.find((v) => v.id === neededVideoId);

    if (!foundVideo) {
      res.sendStatus(HttpStatus.Not_Found);
      return;
    }

    const { cleanData, errors } = updateVideoValidation(req.body);

    if (errors.length !== 0) {
      res.status(HttpStatus.Bad_Request).json({ errorsMessages: errors });
      return;
    }

    foundVideo.title = cleanData.title;
    foundVideo.author = cleanData.author;
    foundVideo.availableResolutions = cleanData.availableResolutions;
    foundVideo.canBeDownloaded = cleanData.canBeDownloaded;
    foundVideo.minAgeRestriction = cleanData.minAgeRestriction;
    foundVideo.publicationDate = cleanData.publicationDate;

    res.sendStatus(HttpStatus.No_Content);
  }
);

videosRouter.delete('/:id', (req: RequestWithParams<VideoParamsId>, res: Response) => {
  const neededVideoId = Number(req.params.id);
  let videoFounded = false;

  database.videos = database.videos.filter((v) => {
    if (v.id === neededVideoId) {
      videoFounded = true;
      return false;
    }
    return true;
  });

  if (!videoFounded) {
    res.sendStatus(HttpStatus.Not_Found);
    return;
  }

  res.sendStatus(HttpStatus.No_Content);
});

export { videosRouter };
