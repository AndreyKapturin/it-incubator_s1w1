import { database } from '../database';
import { UpdateInputVideoType, VideoType } from './types';

const videosRepoitory = {
  findAll(): VideoType[] {
    return database.videos;
  },
  findById(id: number): VideoType | null {
    return database.videos.find((v) => v.id === id) ?? null;
  },
  create(newVideo: VideoType): VideoType {
    database.videos.push(newVideo);
    return newVideo;
  },
  update(id: number, updateInputVideo: UpdateInputVideoType): boolean {
    const foundVideo = this.findById(id);
    if (!foundVideo) return false;
    foundVideo.title = updateInputVideo.title;
    foundVideo.author = updateInputVideo.author;
    foundVideo.availableResolutions = updateInputVideo.availableResolutions;
    foundVideo.canBeDownloaded = updateInputVideo.canBeDownloaded;
    foundVideo.minAgeRestriction = updateInputVideo.minAgeRestriction;
    foundVideo.publicationDate = updateInputVideo.publicationDate;
    return true;
  },
  delete(id: number): boolean {
    let isDeleted = false;
    database.videos = database.videos.filter((v) => {
      if (v.id === id) {
        isDeleted = true;
        return false;
      }
      return true;
    });
    return isDeleted;
  },
};

export { videosRepoitory };
