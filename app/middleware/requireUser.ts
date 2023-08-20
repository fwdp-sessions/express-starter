import { Response, Request, NextFunction } from "express";
import AppError from "../utils/error";
import { verifyJwt } from "../utils/jwt";

// Authentication Guard
export const requireUser = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = response.locals.user;

    if (!user)
      return next(
        new AppError(401, `Session has expired or user doesn't exist`)
      );

    next();
  } catch (error) {
    next(error);
  }
};
