import { ValidationFieldError } from '../commonTypes/validationError';

const validationErrorBuilder = (fieldName: string) => {
  const error: ValidationFieldError = {
    field: fieldName,
    message: '',
  };
  return {
    hasIncorrectValue: (): ValidationFieldError => {
      error.message = 'Has incorrect value';
      return error;
    },
    empty: (): ValidationFieldError => {
      error.message = 'Is empty';
      return error;
    },
    notExist: (): ValidationFieldError => {
      error.message = 'Not exist';
      return error;
    },
    notString: (): ValidationFieldError => {
      error.message = 'Is not a string type';
      return error;
    },
    notBoolean: (): ValidationFieldError => {
      error.message = 'Is not a boolean type';
      return error;
    },
    notArray: (): ValidationFieldError => {
      error.message = 'Is not a array type';
      return error;
    },
    notNumber: (): ValidationFieldError => {
      error.message = 'Is not a number';
      return error;
    },
    minLength: (minLength: number): ValidationFieldError => {
      error.message = `Must have min length ${minLength}`;
      return error;
    },
    maxLength: (maxLength: number): ValidationFieldError => {
      error.message = `Must have max length ${maxLength}`;
      return error;
    },
    notNumberOrNull: (): ValidationFieldError => {
      error.message = 'Is not a number or null';
      return error;
    },
    outOfRange: (min: number, max: number): ValidationFieldError => {
      error.message = `Out of range. Available min: ${min} max: ${max}`;
      return error;
    },
    notIsoDateString: (): ValidationFieldError => {
      error.message = 'Is not ISO format date string'
      return error;
    },
    custom: (message: string): ValidationFieldError => {
      error.message = message;
      return error;
    },
  };
};

export { validationErrorBuilder };
