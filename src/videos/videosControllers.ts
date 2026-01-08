import { Request, Response } from 'express';
import { CreateInputVideoType, UpdateInputVideoType, VideoParamsId, VideoType } from './types';
import { videosRepoitory } from './videosRepository';
import { HttpStatus } from '../core/commonTypes/HttpStatus';
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from '../core/commonTypes/RequestTypes';
import { APIErrorResult } from '../core/commonTypes/APIErrorResult';

const videosControllers = {
  getAllVideos(req: Request, res: Response<VideoType[]>) {
    const videos = videosRepoitory.findAll();
    res.status(HttpStatus.Ok).json(videos);
  },
  getVideoById(req: RequestWithParams<VideoParamsId>, res: Response<VideoType>) {
    const neededVideoId = Number(req.params.id);
    const foundVideo = videosRepoitory.findById(neededVideoId);

    if (!foundVideo) {
      res.sendStatus(HttpStatus.Not_Found);
      return;
    }

    res.status(HttpStatus.Ok).json(foundVideo);
  },
  createVideo(
    req: RequestWithBody<CreateInputVideoType>,
    res: Response<VideoType | APIErrorResult>
  ) {
    const newVideo: VideoType = videosRepoitory.create(req.body);
    res.status(HttpStatus.Created).json(newVideo);
  },
  updateVideo(
    req: RequestWithParamsAndBody<VideoParamsId, UpdateInputVideoType>,
    res: Response<VideoType | APIErrorResult>
  ) {
    const neededVideoId = Number(req.params.id);

    const isUpdated = videosRepoitory.update(neededVideoId, req.body);
    res.sendStatus(isUpdated ? HttpStatus.No_Content : HttpStatus.Not_Found);
  },
  deleteVideo(req: RequestWithParams<VideoParamsId>, res: Response) {
    const neededVideoId = Number(req.params.id);
    const isDeleted = videosRepoitory.delete(neededVideoId);
    res.sendStatus(isDeleted ? HttpStatus.No_Content : HttpStatus.Not_Found);
  },
};

export { videosControllers };
