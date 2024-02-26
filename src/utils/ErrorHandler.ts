import { StatusCodes } from 'http-status-codes';

interface IParams {
  server?: string;
  client?: string | string[];
}

export class ErrorHandler extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly payload?: string | string[]
  ) {
    super(message);
  }

  static UnauthorizedError(params?: IParams): ErrorHandler {
    return new ErrorHandler(
      StatusCodes.UNAUTHORIZED,
      params?.server ?? '',
      params?.client
    );
  }

  static ForbiddenError(params?: IParams): ErrorHandler {
    return new ErrorHandler(
      StatusCodes.FORBIDDEN,
      params?.server ?? '',
      params?.client
    );
  }

  static NotFoundError(params?: IParams): ErrorHandler {
    return new ErrorHandler(
      StatusCodes.NOT_FOUND,
      params?.server ?? '',
      params?.client
    );
  }

  static BadRequestError(params?: IParams): ErrorHandler {
    return new ErrorHandler(
      StatusCodes.BAD_REQUEST,
      params?.server ?? '',
      params?.client
    );
  }

  static IamATeapot(params?: IParams): ErrorHandler {
    return new ErrorHandler(
      StatusCodes.IM_A_TEAPOT,
      params?.server ?? '',
      params?.client
    );
  }

  static ConflictError(params?: IParams): ErrorHandler {
    return new ErrorHandler(
      StatusCodes.CONFLICT,
      params?.server ?? '',
      params?.client
    );
  }

  static InternalServerError(params?: IParams): ErrorHandler {
    return new ErrorHandler(
      StatusCodes.INTERNAL_SERVER_ERROR,
      params?.server ?? '',
      params?.client
    );
  }
}
