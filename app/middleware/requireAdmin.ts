import { Response, Request, NextFunction } from "express";
import AppError from "../utils/error";
import { verifyJwt } from "../utils/jwt";

// Authentication Guard for Admin
export const requireAdmin = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const accessToken = request.cookies["accessToken"];

    // Verify cookie here
    // accessToken

    if (!accessToken) {
      throw new AppError(401, "Unauthorized");
    }

    const decoded = verifyJwt<{ sub: string }>(
      accessToken,
      "accessTokenPublicKey"
    );

    // if cookie is valid, set req.user to the user object
    // otherwise, throw an AppError
    //
    //

    next();
  } catch (error) {
    next(error);
  }
};
