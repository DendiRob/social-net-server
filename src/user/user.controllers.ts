import { type Request, type Response, type NextFunction } from 'express';
import * as service from '@/user/user.service.js';
import { StatusCodes } from 'http-status-codes';
// import { ErrorHandler } from '@/utils/ErrorHandler.js';

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const users = await service.getAllUsers();
  return res.status(StatusCodes.OK).json(users);
}
