import { Routes } from '../src/app/routes';
import { HttpStatus } from '../src/core/commonTypes/HttpStatus';
import {
  AvailableResolutions,
  CreateInputVideoType,
  UpdateInputVideoType,
  VideoType,
} from '../src/videos/types';
import request from 'supertest';
import { app } from '../src/app';
import { validationErrorBuilder } from '../src/core/utils/validationErrorBuilder';
import {
  MAX_AGE_RESTRICTION,
  MAX_AUTHOR_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_AGE_RESTRICTION,
} from '../src/core/constants';
import { ISODateStringRegExp } from '../src/core/utils/dateUtils';
import { numbersUtils } from '../src/core/utils/numbersUtils';
import { objectsUtils } from '../src/core/utils/objectsUtils';
import { ValidationFieldError } from '../src/core/commonTypes/validationError';
import { APIErrorResult } from '../src/core/commonTypes/APIErrorResult';

const api = {
  get(url: string) {
    return request(app).get(url);
  },
  post(url: string) {
    return request(app).post(url);
  },
  put(url: string) {
    return request(app).put(url);
  },
  delete(url: string) {
    return request(app).delete(url);
  },
};

const correctCreateInputVideo: CreateInputVideoType = {
  author: 'Andrey',
  title: 'How create Node JS app?',
  availableResolutions: [AvailableResolutions.P1080],
};

const succesCreateResult: VideoType = {
  id: expect.any(Number),
  title: correctCreateInputVideo.title,
  author: correctCreateInputVideo.author,
  canBeDownloaded: false,
  createdAt: expect.stringMatching(ISODateStringRegExp),
  publicationDate: expect.stringMatching(ISODateStringRegExp),
  availableResolutions: correctCreateInputVideo.availableResolutions,
  minAgeRestriction: null,
};

const correctUpdareInputVideo: UpdateInputVideoType = {
  author: 'Andrey',
  title: 'How update data in database?',
  availableResolutions: [AvailableResolutions.P2160],
  canBeDownloaded: false,
  minAgeRestriction: 10,
  publicationDate: new Date().toISOString(),
};

const createTestCase = (testDescribe: string, requestBody: object, expectedBody: object = {}) => {
  return { testDescribe, requestBody, expectedBody };
};

const packErrors = (...errors: ValidationFieldError[]): APIErrorResult => {
  return {
    errorsMessages: errors,
  };
};

const badCreateCases = [
  // for author
  createTestCase(
    'author not passed',
    objectsUtils.skipField(correctCreateInputVideo, 'author'),
    packErrors(validationErrorBuilder('author').notExist())
  ),
  createTestCase(
    'author type not string',
    { ...correctCreateInputVideo, author: 10 },
    packErrors(validationErrorBuilder('author').notString())
  ),
  createTestCase(
    'author length more than max',
    { ...correctCreateInputVideo, author: 'a'.repeat(MAX_AUTHOR_LENGTH + 1) },
    packErrors(validationErrorBuilder('author').maxLength(MAX_AUTHOR_LENGTH))
  ),

  // for title
  createTestCase(
    'title not passed',
    objectsUtils.skipField(correctCreateInputVideo, 'title'),
    packErrors(validationErrorBuilder('title').notExist())
  ),
  createTestCase(
    'title type not string',
    { ...correctCreateInputVideo, title: 10 },
    packErrors(validationErrorBuilder('title').notString())
  ),
  createTestCase(
    'title length more than max',
    { ...correctCreateInputVideo, title: 'a'.repeat(MAX_TITLE_LENGTH + 1) },
    packErrors(validationErrorBuilder('title').maxLength(MAX_TITLE_LENGTH))
  ),

  // for availableResolutions
  createTestCase(
    'availableResolutions not exist',
    objectsUtils.skipField(correctCreateInputVideo, 'availableResolutions'),
    packErrors(validationErrorBuilder('availableResolutions').notExist())
  ),
  createTestCase(
    'availableResolutions is empty',
    { ...correctCreateInputVideo, availableResolutions: [] },
    packErrors(validationErrorBuilder('availableResolutions').empty())
  ),
  createTestCase(
    'availableResolutions has incorrect value',
    { ...correctCreateInputVideo, availableResolutions: ['bla-bla'] },
    packErrors(validationErrorBuilder('availableResolutions').hasIncorrectValue())
  ),

  // for all
  createTestCase(
    'all data incorrect',
    {
      title: 10,
      author: 'p'.repeat(MAX_AUTHOR_LENGTH + 1),
      availableResolutions: [1440],
    },
    packErrors(
      validationErrorBuilder('title').notString(),
      validationErrorBuilder('author').maxLength(MAX_AUTHOR_LENGTH),
      validationErrorBuilder('availableResolutions').hasIncorrectValue()
    )
  ),
];

const goodCreateCases = [
  createTestCase('all input data correct', correctCreateInputVideo, succesCreateResult),
  createTestCase(
    'author and title have max length',
    {
      ...correctCreateInputVideo,
      author: 'a'.repeat(MAX_AUTHOR_LENGTH),
      title: 't'.repeat(MAX_TITLE_LENGTH),
    },
    {
      ...succesCreateResult,
      author: 'a'.repeat(MAX_AUTHOR_LENGTH),
      title: 't'.repeat(MAX_TITLE_LENGTH),
    }
  ),
  createTestCase(
    'author and title is empty string',
    {
      ...correctCreateInputVideo,
      author: '',
      title: '',
    },
    {
      ...succesCreateResult,
      author: '',
      title: '',
    }
  ),
  createTestCase(
    'availableResolutions has double values',
    {
      ...correctCreateInputVideo,
      availableResolutions: [AvailableResolutions.P1080, AvailableResolutions.P1080],
    },
    {
      ...succesCreateResult,
      availableResolutions: [AvailableResolutions.P1080],
    }
  ),
];

beforeEach(async () => {
  await api.delete(Routes.Testing + '/all-data');
});

describe(`GET ${Routes.Videos}`, () => {
  describe(`should return ${HttpStatus.Ok} status code and`, () => {
    it('empty array if videos not exist', async () => {
      const response = await api.get(Routes.Videos);
      expect(response.status).toBe(HttpStatus.Ok);
      expect(response.body).toEqual([]);
    });
    it('array with videos if videos exist in database', async () => {
      const inputVideo1 = { ...correctCreateInputVideo, title: 'Video 1' };
      const inputVideo2 = { ...correctCreateInputVideo, title: 'Video 2' };
      const expectedVideo1 = { ...succesCreateResult, title: inputVideo1.title };
      const expectedVideo2 = { ...succesCreateResult, title: inputVideo2.title };
      await api.post(Routes.Videos).send(inputVideo1).expect(HttpStatus.Created);
      await api.post(Routes.Videos).send(inputVideo2).expect(HttpStatus.Created);
      const response = await api.get(Routes.Videos);
      expect(response.status).toBe(HttpStatus.Ok);
      expect(response.body).toEqual([expectedVideo1, expectedVideo2]);
    });
  });
});

describe(`GET ${Routes.Videos}/:id`, () => {
  describe(`should return ${HttpStatus.Ok} status code and found video`, () => {
    it(`video exist in database`, async () => {
      const postResponse = await api.post(Routes.Videos).send(correctCreateInputVideo);
      expect(postResponse.status).toBe(HttpStatus.Created);
      const getResponse = await api.get(`${Routes.Videos}/${postResponse.body.id}`);
      expect(getResponse.status).toBe(HttpStatus.Ok);
      expect(getResponse.body).toEqual(postResponse.body);
    });
  });
  describe(`should return ${HttpStatus.Not_Found} status code`, () => {
    it('video not found', async () => {
      const notExistedVideoId = 9999999;
      await api.get(`${Routes.Videos}/${notExistedVideoId}`).expect(HttpStatus.Not_Found);
    });
  });
});

describe(`POST ${Routes.Videos}`, () => {
  describe(`should create video, return ${HttpStatus.Created} status code and created video`, () => {
    (async () => {
      for (const goodCreateCase of goodCreateCases) {
        it(goodCreateCase.testDescribe, async () => {
          const response = await api.post(Routes.Videos).send(goodCreateCase.requestBody);
          expect(response.status).toBe(HttpStatus.Created);
          expect(response.body).toEqual(goodCreateCase.expectedBody);
        });
      }
    })();

    it('by default publicationDate more than createdAt date on 1 day', async () => {
      const response = await api.post(Routes.Videos).send(correctCreateInputVideo);
      expect(response.status).toBe(HttpStatus.Created);
      const expectedPublicationDate = new Date(response.body.createdAt);
      expectedPublicationDate.setDate(expectedPublicationDate.getDate() + 1);
      expect(response.body.publicationDate).toEqual(expectedPublicationDate.toISOString());
    });
  });

  describe(`should return ${HttpStatus.Bad_Request} and errors messages:`, () => {
    (async () => {
      for (const badCreateCase of badCreateCases) {
        it(badCreateCase.testDescribe, async () => {
          const response = await api.post(Routes.Videos).send(badCreateCase.requestBody);
          expect(response.status).toBe(HttpStatus.Bad_Request);
          expect(response.body).toEqual(badCreateCase.expectedBody);
        });
      }
    })();
  });
});

const goodUpdateCases = [
  createTestCase('all input data correct', correctUpdareInputVideo),
  createTestCase('author and title have max length', {
    ...correctUpdareInputVideo,
    author: 'a'.repeat(MAX_AUTHOR_LENGTH),
    title: 't'.repeat(MAX_TITLE_LENGTH),
  }),
  createTestCase('author and title is empty string', {
    ...correctUpdareInputVideo,
    author: '',
    title: '',
  }),
  createTestCase('availableResolutions has double resulution', {
    ...correctUpdareInputVideo,
    availableResolutions: [AvailableResolutions.P1080, AvailableResolutions.P1080],
  }),
  createTestCase('canBeDownloaded is true', {
    ...correctUpdareInputVideo,
    canBeDownloaded: true,
  }),
  createTestCase('canBeDownloaded is false', {
    ...correctUpdareInputVideo,
    canBeDownloaded: false,
  }),
  createTestCase('minAgeRestriction is null', {
    ...correctUpdareInputVideo,
    minAgeRestriction: null,
  }),
  createTestCase(
    `minAgeRestriction is min number of range ${MIN_AGE_RESTRICTION} - ${MAX_AGE_RESTRICTION}`,
    {
      ...correctUpdareInputVideo,
      minAgeRestriction: MIN_AGE_RESTRICTION,
    }
  ),
  createTestCase(
    `minAgeRestriction is max number of range ${MIN_AGE_RESTRICTION} - ${MAX_AGE_RESTRICTION}`,
    {
      ...correctUpdareInputVideo,
      minAgeRestriction: MAX_AGE_RESTRICTION,
    }
  ),
  createTestCase(
    `minAgeRestriction is random number of range ${MIN_AGE_RESTRICTION} - ${MAX_AGE_RESTRICTION}`,
    {
      ...correctUpdareInputVideo,
      minAgeRestriction: numbersUtils.getRandomFromRange(MAX_AGE_RESTRICTION, MAX_AGE_RESTRICTION),
    }
  ),
];

const badUpdateCases = [
  // for author
  createTestCase(
    'author not passed',
    objectsUtils.skipField(correctUpdareInputVideo, 'author'),
    packErrors(validationErrorBuilder('author').notExist())
  ),
  createTestCase(
    'author type not string',
    { ...correctUpdareInputVideo, author: 10 },
    packErrors(validationErrorBuilder('author').notString())
  ),
  createTestCase(
    'author length more than max',
    { ...correctUpdareInputVideo, author: 'a'.repeat(MAX_AUTHOR_LENGTH + 1) },
    packErrors(validationErrorBuilder('author').maxLength(MAX_AUTHOR_LENGTH))
  ),

  // for title
  createTestCase(
    'title not passed',
    objectsUtils.skipField(correctUpdareInputVideo, 'title'),
    packErrors(validationErrorBuilder('title').notExist())
  ),
  createTestCase(
    'title type not string',
    { ...correctUpdareInputVideo, title: 10 },
    packErrors(validationErrorBuilder('title').notString())
  ),
  createTestCase(
    'title length more than max',
    { ...correctUpdareInputVideo, title: 'a'.repeat(MAX_TITLE_LENGTH + 1) },
    packErrors(validationErrorBuilder('title').maxLength(MAX_TITLE_LENGTH))
  ),

  // for availableResolutions
  createTestCase(
    'availableResolutions not exist',
    objectsUtils.skipField(correctUpdareInputVideo, 'availableResolutions'),
    packErrors(validationErrorBuilder('availableResolutions').notExist())
  ),
  createTestCase(
    'availableResolutions is empty',
    { ...correctUpdareInputVideo, availableResolutions: [] },
    packErrors(validationErrorBuilder('availableResolutions').empty())
  ),
  createTestCase(
    'availableResolutions has incorrect value',
    { ...correctUpdareInputVideo, availableResolutions: ['bla-bla'] },
    packErrors(validationErrorBuilder('availableResolutions').hasIncorrectValue())
  ),

  // for canBeDownloaded
  createTestCase(
    'canBeDownloaded not exist',
    objectsUtils.skipField(correctUpdareInputVideo, 'canBeDownloaded'),
    packErrors(validationErrorBuilder('canBeDownloaded').notExist())
  ),
  createTestCase(
    'canBeDownloaded is not boolean: pass 10',
    { ...correctUpdareInputVideo, canBeDownloaded: 10 },
    packErrors(validationErrorBuilder('canBeDownloaded').notBoolean())
  ),
  createTestCase(
    'canBeDownloaded is not boolean: pass null',
    { ...correctUpdareInputVideo, canBeDownloaded: null },
    packErrors(validationErrorBuilder('canBeDownloaded').notBoolean())
  ),

  // for minAgeRestriction
  createTestCase(
    'minAgeRestriction not exist',
    objectsUtils.skipField(correctUpdareInputVideo, 'minAgeRestriction'),
    packErrors(validationErrorBuilder('minAgeRestriction').notExist())
  ),
  createTestCase(
    'minAgeRestriction has invalid type',
    { ...correctUpdareInputVideo, minAgeRestriction: '10' },
    packErrors(validationErrorBuilder('minAgeRestriction').notNumberOrNull())
  ),
  createTestCase(
    `minAgeRestriction out of range ${MIN_AGE_RESTRICTION} - ${MAX_AGE_RESTRICTION}`,
    { ...correctUpdareInputVideo, minAgeRestriction: MAX_AGE_RESTRICTION + 1 },
    packErrors(
      validationErrorBuilder('minAgeRestriction').outOfRange(
        MIN_AGE_RESTRICTION,
        MAX_AGE_RESTRICTION
      )
    )
  ),

  // for publicationDate
  createTestCase(
    'publicationDate not exist',
    objectsUtils.skipField(correctUpdareInputVideo, 'publicationDate'),
    packErrors(validationErrorBuilder('publicationDate').notExist())
  ),
  createTestCase(
    'publicationDate has invalid type: "10"',
    { ...correctUpdareInputVideo, publicationDate: '10' },
    packErrors(validationErrorBuilder('publicationDate').notIsoDateString())
  ),
  createTestCase(
    'publicationDate has invalid type: 2026',
    { ...correctUpdareInputVideo, publicationDate: 2026 },
    packErrors(validationErrorBuilder('publicationDate').notIsoDateString())
  ),

  // for all
  createTestCase(
    'all data incorrect',
    {
      title: 10,
      author: 'p'.repeat(MAX_AUTHOR_LENGTH + 1),
      availableResolutions: [1440],
      canBeDownloaded: 10,
      minAgeRestriction: '10',
    },
    packErrors(
      validationErrorBuilder('title').notString(),
      validationErrorBuilder('author').maxLength(MAX_AUTHOR_LENGTH),
      validationErrorBuilder('availableResolutions').hasIncorrectValue(),
      validationErrorBuilder('canBeDownloaded').notBoolean(),
      validationErrorBuilder('minAgeRestriction').notNumberOrNull(),
      validationErrorBuilder('publicationDate').notExist()
    )
  ),
];

describe(`PUT ${Routes.Videos}`, () => {
  describe(`should update video and return ${HttpStatus.No_Content} status code`, () => {
    beforeEach(async () => {
      await api.delete(Routes.Testing + '/all-data');
      await api.post(Routes.Videos).send(correctCreateInputVideo);
    });
    (async () => {
      for (const goodUpdateCase of goodUpdateCases) {
        it(goodUpdateCase.testDescribe, async () => {
          const response = await api.put(`${Routes.Videos}/1`).send(goodUpdateCase.requestBody);
          expect(response.status).toBe(HttpStatus.No_Content);
        });
      }
    })();
  });

  describe(`shouldn't update video. Return ${HttpStatus.Bad_Request} status code and error messages`, () => {
    beforeEach(async () => {
      await api.delete(Routes.Testing + '/all-data');
      await api.post(Routes.Videos).send(correctCreateInputVideo);
    });
    (async () => {
      for (const badUpdateCase of badUpdateCases) {
        it(badUpdateCase.testDescribe, async () => {
          const response = await api.put(`${Routes.Videos}/1`).send(badUpdateCase.requestBody);
          expect(response.status).toBe(HttpStatus.Bad_Request);
          expect(response.body).toEqual(badUpdateCase.expectedBody);
          // check: video does't update in database
          const getResponse = await api.get(`${Routes.Videos}/1`);
          expect(getResponse.status).toBe(HttpStatus.Ok);
          expect(getResponse.body).toEqual(succesCreateResult);
        });
      }
    })();
  });

  describe(`should return ${HttpStatus.Not_Found} status code`, () => {
    it('if video not found', async () => {
      const notExistedVideoId = 9999999;
      await api
        .put(`${Routes.Videos}/${notExistedVideoId}`)
        .send(correctUpdareInputVideo)
        .expect(HttpStatus.Not_Found);
    });
  });
});

describe(`DELETE ${Routes.Videos}/:id`, () => {
  describe(`should return ${HttpStatus.No_Content} status code`, () => {
    it('video be found and deleted', async () => {
      const postResponse = await api.post(Routes.Videos).send(correctCreateInputVideo);
      expect(postResponse.status).toBe(HttpStatus.Created);
      await api.delete(`${Routes.Videos}/${postResponse.body.id}`).expect(HttpStatus.No_Content);
      await api.get(`${Routes.Videos}/${postResponse.body.id}`).expect(HttpStatus.Not_Found);
    });
  });
  describe(`should return ${HttpStatus.Not_Found} status code`, () => {
    it('if video not found', async () => {
      const notExistedVideoId = 9999999;
      await api.delete(`${Routes.Videos}/${notExistedVideoId}`).expect(HttpStatus.Not_Found);
    });
  });
});
