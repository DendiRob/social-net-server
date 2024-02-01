import { type Request, type Response, type NextFunction } from 'express';
import * as service from '@/users/user.service.js';
import { StatusCodes } from 'http-status-codes';

const getViewer = (req: Request, res: Response, next: NextFunction): void => {
  (async () => {
    const viewer = await service.getViewer(req.uuid);

    res.status(StatusCodes.OK).json(viewer);
  })().catch((e) => {
    next(e);
  });
};

export { getViewer };
