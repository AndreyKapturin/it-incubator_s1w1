export enum AvailableResolutions {
  P144 = 'P144',
  P240 = 'P240',
  P360 = 'P360',
  P480 = 'P480',
  P720 = 'P720',
  P1080 = 'P1080',
  P1440 = 'P1440',
  P2160 = 'P2160',
}

type MinAgeRestrictionType = number | null;

export type VideoType = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: MinAgeRestrictionType;
  createdAt: string;
  publicationDate: string;
  availableResolutions: AvailableResolutions[];
};

export type CreateInputVideoType = {
  title: string;
  author: string;
  availableResolutions: AvailableResolutions[];
};

export type UpdateInputVideoType = {
  title: string;
  author: string;
  availableResolutions: AvailableResolutions[];
  canBeDownloaded: boolean;
  minAgeRestriction: MinAgeRestrictionType;
  publicationDate: string;
};

export type VideoParamsId = {
  id: string;
};
