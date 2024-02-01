import {
  type Request,
  type Response,
  type NextFunction,
  type Express
} from 'express';

import { ValidationError } from 'yup';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export default function (app: Express) {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
        payload: err.errors
      });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .end(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
  });
}
