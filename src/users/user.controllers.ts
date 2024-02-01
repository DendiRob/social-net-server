import { type Request, type Response, type NextFunction } from 'express';
import * as service from '@/users/user.service.js';
import { StatusCodes } from 'http-status-codes';
// import { ErrorHandler } from '@/utils/ErrorHandler.js';

// export async function getAllUsers(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const users = await service.getAllUsers();
//   return res.status(StatusCodes.OK).json(users);
// }

const getViewer = (req: Request, res: Response, next: NextFunction): void => {
  (async () => {
    const viewer = await service.getViewer(req.uuid);

    res.status(StatusCodes.OK).json(viewer);
  })().catch((e) => {
    next(e); // TODO :Сделать общий ловец ошибок
  });
};

export { getViewer };
