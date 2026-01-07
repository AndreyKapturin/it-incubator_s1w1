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
import { AvailableResolutions, CreateInputVideoType, UpdateInputVideoType } from './types';

type ValidationResult<T> = {
  errors: ValidationFieldError[];
  cleanData: T;
};

const createVideoValidation = (
  inputVideo: CreateInputVideoType
): ValidationResult<CreateInputVideoType> => {
  const errors: ValidationFieldError[] = [];
  const cleanData = { ...inputVideo };

  if (cleanData.title === undefined) {
    errors.push(validationErrorBuilder('title').notExist());
  } else if (typeof cleanData.title !== 'string') {
    errors.push(validationErrorBuilder('title').notString());
  } else if (
    (cleanData.title = cleanData.title.trim()) &&
    cleanData.title.length > MAX_TITLE_LENGTH
  ) {
    errors.push(validationErrorBuilder('title').maxLength(MAX_TITLE_LENGTH));
  }

  if (cleanData.author === undefined) {
    errors.push(validationErrorBuilder('author').notExist());
  } else if (typeof cleanData.author !== 'string') {
    errors.push(validationErrorBuilder('author').notString());
  } else if (
    (cleanData.author = cleanData.author.trim()) &&
    cleanData.author.length > MAX_AUTHOR_LENGTH
  ) {
    errors.push(validationErrorBuilder('author').maxLength(MAX_AUTHOR_LENGTH));
  }

  if (cleanData.availableResolutions === undefined) {
    errors.push(validationErrorBuilder('availableResolutions').notExist());
  } else if (!Array.isArray(cleanData.availableResolutions)) {
    errors.push(validationErrorBuilder('availableResolutions').notArray());
  } else if (cleanData.availableResolutions.length === 0) {
    errors.push(validationErrorBuilder('availableResolutions').empty());
  } else if ((cleanData.availableResolutions = arrayUtils.unique(cleanData.availableResolutions))) {
    for (const availableResolution of cleanData.availableResolutions) {
      if (!(availableResolution in AvailableResolutions)) {
        errors.push(validationErrorBuilder('availableResolutions').hasIncorrectValue());
        break;
      }
    }
  }

  return { cleanData, errors };
};

const updateVideoValidation = (
  inputVideo: UpdateInputVideoType
): ValidationResult<UpdateInputVideoType> => {
  const errors: ValidationFieldError[] = [];
  const cleanData = { ...inputVideo };

  if (cleanData.title === undefined) {
    errors.push(validationErrorBuilder('title').notExist());
  } else if (typeof cleanData.title !== 'string') {
    errors.push(validationErrorBuilder('title').notString());
  } else if (
    (cleanData.title = cleanData.title.trim()) &&
    cleanData.title.length > MAX_TITLE_LENGTH
  ) {
    errors.push(validationErrorBuilder('title').maxLength(MAX_TITLE_LENGTH));
  }

  if (cleanData.author === undefined) {
    errors.push(validationErrorBuilder('author').notExist());
  } else if (typeof cleanData.author !== 'string') {
    errors.push(validationErrorBuilder('author').notString());
  } else if (
    (cleanData.author = cleanData.author.trim()) &&
    cleanData.author.length > MAX_AUTHOR_LENGTH
  ) {
    errors.push(validationErrorBuilder('author').maxLength(MAX_AUTHOR_LENGTH));
  }


  if (cleanData.availableResolutions === undefined) {
    errors.push(validationErrorBuilder('availableResolutions').notExist());
  } else if (!Array.isArray(cleanData.availableResolutions)) {
    errors.push(validationErrorBuilder('availableResolutions').notArray());
  } else if (cleanData.availableResolutions.length === 0) {
    errors.push(validationErrorBuilder('availableResolutions').empty());
  } else if ((cleanData.availableResolutions = arrayUtils.unique(cleanData.availableResolutions))) {
    for (const availableResolution of cleanData.availableResolutions) {
      if (!(availableResolution in AvailableResolutions)) {
        errors.push(validationErrorBuilder('availableResolutions').hasIncorrectValue());
        break;
      }
    }
  }

  if (cleanData.canBeDownloaded === undefined) {
    errors.push(validationErrorBuilder('canBeDownloaded').notExist());
  } else if (typeof cleanData.canBeDownloaded !== 'boolean') {
    errors.push(validationErrorBuilder('canBeDownloaded').notBoolean());
  }

  if (cleanData.minAgeRestriction === undefined) {
    errors.push(validationErrorBuilder('minAgeRestriction').notExist());
  } else if (cleanData.minAgeRestriction !== null && typeof cleanData.minAgeRestriction !== 'number') {
    errors.push(validationErrorBuilder('minAgeRestriction').notNumberOrNull());
  } else if (
    typeof cleanData.minAgeRestriction === 'number' &&
    numbersUtils.outRange(cleanData.minAgeRestriction, MIN_AGE_RESTRICTION, MAX_AGE_RESTRICTION)
  ) {
    errors.push(
      validationErrorBuilder('minAgeRestriction').outOfRange(
        MIN_AGE_RESTRICTION,
        MAX_AGE_RESTRICTION
      )
    );
  }

  if (cleanData.publicationDate === undefined) {
    errors.push(validationErrorBuilder('publicationDate').notExist());
    return { cleanData, errors };
  } else if (!ISODateStringRegExp.test(cleanData.publicationDate)) {
    errors.push(validationErrorBuilder('publicationDate').notIsoDateString());
  }

  return { cleanData, errors };
};

export { createVideoValidation, updateVideoValidation };
