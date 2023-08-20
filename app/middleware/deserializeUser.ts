import { NextFunction, Request, Response } from "express";
import AppError from "../utils/error";
import { verifyJwt } from "../utils/jwt";
import { findUserById } from "../services/user.service";

export const deserializeUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let accessToken;
    if (request.cookies.accessToken) {
      accessToken = request.cookies.accessToken;
    }

    if (!accessToken) {
      return next(new AppError(401, "You are not logged in"));
    }

    const decoded = verifyJwt<{ sub: string }>(
      accessToken,
      "accessTokenPublicKey"
    );

    if (!decoded) {
      return next(new AppError(401, `Invalid token or user doesn't exist`));
    }

    const user = await findUserById(decoded.sub);
    if (!user) {
      return next(new AppError(401, `Invalid token or cookies expired`));
    }

    response.locals.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
