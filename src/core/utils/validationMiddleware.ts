import { NextFunction, Response } from 'express';
import { HttpStatus } from '../commonTypes/HttpStatus';
import { ValidationFieldError } from '../commonTypes/validationError';
import { RequestWithBody } from '../commonTypes/RequestTypes';

type ValidationResultType<B> = {
  errors: ValidationFieldError[];
  cleanBody: B;
};
type ValidationCallbackType<B> = (body: B) => ValidationResultType<B>;

const bodyValidationMiddleware =
  <B>(validationCallback: ValidationCallbackType<B>) =>
  (req: RequestWithBody<B>, res: Response, next: NextFunction) => {
    const { cleanBody, errors } = validationCallback(req.body);
    if (errors.length !== 0) {
      res.status(HttpStatus.Bad_Request).json({ errorsMessages: errors });
    } else {
      (req as RequestWithBody<B>).body = cleanBody;
      next();
    }
  };

export { bodyValidationMiddleware };
export type { ValidationCallbackType };
