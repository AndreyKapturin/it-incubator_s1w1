import { AvailableResolutions, VideoType } from '../videos/types';

type db = {
  videos: VideoType[];
};

const database: db = {
  videos: [
    {
      id: 1,
      author: 'Andrey',
      title: 'Happy New Year',
      canBeDownloaded: false,
      createdAt: new Date(2025, 11, 30).toISOString(),
      publicationDate: new Date(2025, 11, 31).toISOString(),
      availableResolutions: [
        AvailableResolutions.P480,
        AvailableResolutions.P720,
        AvailableResolutions.P1080,
      ],
      minAgeRestriction: null,
    },
    {
      id: 2,
      author: 'IT-INCUBATOR',
      title: 'How deploy to Vercel?',
      canBeDownloaded: false,
      createdAt: new Date(2025, 11, 25).toISOString(),
      publicationDate: new Date(2025, 11, 27).toISOString(),
      availableResolutions: [
        AvailableResolutions.P720,
        AvailableResolutions.P1080,
        AvailableResolutions.P1440,
      ],
      minAgeRestriction: null,
    },
  ],
};

const cleanDatabase = (): void => {
  database.videos = [];
};

export { database, cleanDatabase };
