import { ValidationFieldError } from '../core/commonTypes/validationError';
import {
  MAX_AGE_RESTRICTION,
  MAX_AUTHOR_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_AGE_RESTRICTION,
} from '../core/constants';
import { arrayUtils } from '../core/utils/arrayUtils';
import { ISODateStringRegExp } from '../core/utils/dateUtils';
import { numbersUtils } from '../core/utils/numbersUtils';
import { validationErrorBuilder } from '../core/utils/validationErrorBuilder';
import { ValidationCallbackType } from '../core/utils/validationMiddleware';
import { AvailableResolutions, CreateInputVideoType, UpdateInputVideoType } from './types';

const createVideoValidation: ValidationCallbackType<CreateInputVideoType> = (inputVideo) => {
  const errors: ValidationFieldError[] = [];
  const cleanBody = {
    title: inputVideo.title,
    author: inputVideo.author,
    availableResolutions: inputVideo.availableResolutions,
  };

  if (cleanBody.title === undefined) {
    errors.push(validationErrorBuilder('title').notExist());
  } else if (typeof cleanBody.title !== 'string') {
    errors.push(validationErrorBuilder('title').notString());
  } else if (
    (cleanBody.title = cleanBody.title.trim()) &&
    cleanBody.title.length > MAX_TITLE_LENGTH
  ) {
    errors.push(validationErrorBuilder('title').maxLength(MAX_TITLE_LENGTH));
  }

  if (cleanBody.author === undefined) {
    errors.push(validationErrorBuilder('author').notExist());
  } else if (typeof cleanBody.author !== 'string') {
    errors.push(validationErrorBuilder('author').notString());
  } else if (
    (cleanBody.author = cleanBody.author.trim()) &&
    cleanBody.author.length > MAX_AUTHOR_LENGTH
  ) {
    errors.push(validationErrorBuilder('author').maxLength(MAX_AUTHOR_LENGTH));
  }

  if (cleanBody.availableResolutions === undefined) {
    errors.push(validationErrorBuilder('availableResolutions').notExist());
  } else if (!Array.isArray(cleanBody.availableResolutions)) {
    errors.push(validationErrorBuilder('availableResolutions').notArray());
  } else if (cleanBody.availableResolutions.length === 0) {
    errors.push(validationErrorBuilder('availableResolutions').empty());
  } else if ((cleanBody.availableResolutions = arrayUtils.unique(cleanBody.availableResolutions))) {
    for (const availableResolution of cleanBody.availableResolutions) {
      if (!(availableResolution in AvailableResolutions)) {
        errors.push(validationErrorBuilder('availableResolutions').hasIncorrectValue());
        break;
      }
    }
  }

  return { cleanBody, errors };
};

const updateVideoValidation: ValidationCallbackType<UpdateInputVideoType> = (inputVideo) => {
  const errors: ValidationFieldError[] = [];
  const cleanBody = {
    title: inputVideo.title,
    author: inputVideo.author,
    availableResolutions: inputVideo.availableResolutions,
    canBeDownloaded: inputVideo.canBeDownloaded,
    minAgeRestriction: inputVideo.minAgeRestriction,
    publicationDate: inputVideo.publicationDate,
  };

  if (cleanBody.title === undefined) {
    errors.push(validationErrorBuilder('title').notExist());
  } else if (typeof cleanBody.title !== 'string') {
    errors.push(validationErrorBuilder('title').notString());
  } else if (
    (cleanBody.title = cleanBody.title.trim()) &&
    cleanBody.title.length > MAX_TITLE_LENGTH
  ) {
    errors.push(validationErrorBuilder('title').maxLength(MAX_TITLE_LENGTH));
  }

  if (cleanBody.author === undefined) {
    errors.push(validationErrorBuilder('author').notExist());
  } else if (typeof cleanBody.author !== 'string') {
    errors.push(validationErrorBuilder('author').notString());
  } else if (
    (cleanBody.author = cleanBody.author.trim()) &&
    cleanBody.author.length > MAX_AUTHOR_LENGTH
  ) {
    errors.push(validationErrorBuilder('author').maxLength(MAX_AUTHOR_LENGTH));
  }

  if (cleanBody.availableResolutions === undefined) {
    errors.push(validationErrorBuilder('availableResolutions').notExist());
  } else if (!Array.isArray(cleanBody.availableResolutions)) {
    errors.push(validationErrorBuilder('availableResolutions').notArray());
  } else if (cleanBody.availableResolutions.length === 0) {
    errors.push(validationErrorBuilder('availableResolutions').empty());
  } else if ((cleanBody.availableResolutions = arrayUtils.unique(cleanBody.availableResolutions))) {
    for (const availableResolution of cleanBody.availableResolutions) {
      if (!(availableResolution in AvailableResolutions)) {
        errors.push(validationErrorBuilder('availableResolutions').hasIncorrectValue());
        break;
      }
    }
  }

  if (cleanBody.canBeDownloaded === undefined) {
    errors.push(validationErrorBuilder('canBeDownloaded').notExist());
  } else if (typeof cleanBody.canBeDownloaded !== 'boolean') {
    errors.push(validationErrorBuilder('canBeDownloaded').notBoolean());
  }

  if (cleanBody.minAgeRestriction === undefined) {
    errors.push(validationErrorBuilder('minAgeRestriction').notExist());
  } else if (
    cleanBody.minAgeRestriction !== null &&
    typeof cleanBody.minAgeRestriction !== 'number'
  ) {
    errors.push(validationErrorBuilder('minAgeRestriction').notNumberOrNull());
  } else if (
    typeof cleanBody.minAgeRestriction === 'number' &&
    numbersUtils.outRange(cleanBody.minAgeRestriction, MIN_AGE_RESTRICTION, MAX_AGE_RESTRICTION)
  ) {
    errors.push(
      validationErrorBuilder('minAgeRestriction').outOfRange(
        MIN_AGE_RESTRICTION,
        MAX_AGE_RESTRICTION
      )
    );
  }

  if (cleanBody.publicationDate === undefined) {
    errors.push(validationErrorBuilder('publicationDate').notExist());
  } else if (!ISODateStringRegExp.test(cleanBody.publicationDate)) {
    errors.push(validationErrorBuilder('publicationDate').notIsoDateString());
  }

  return { cleanBody, errors };
};

export { createVideoValidation, updateVideoValidation };
