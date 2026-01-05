import { Router } from 'express';
import { cleanDatabase } from '../database';
import { HttpStatus } from '../core/commonTypes/HttpStatus';

const testingRouter = Router();

testingRouter.delete('/all-data', (req, res) => {
  cleanDatabase();
  res.sendStatus(HttpStatus.No_Content);
});

export { testingRouter };
