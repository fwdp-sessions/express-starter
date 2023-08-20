import { CookieOptions, NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { CreateUserInput, LoginUserInput, UserRole } from "../types/user";
import {
  createUser,
  findUser,
  findUserByEmail,
  findUserById,
  signTokens,
} from "../services/user.service";
import AppError from "../utils/error";
import { verifyJwt } from "../utils/jwt";
import config from "config";
import { userCreateSchema } from "../schema/user";

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
};

if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>("refreshTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("refreshTokenExpiresIn") * 60 * 1000,
};

export const registerUserHandler = async (
  request: Request<{}, {}, CreateUserInput>,
  response: Response,
  next: NextFunction
) => {
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, 12);

    const user = await createUser({
      email: request.body.email,
      password: hashedPassword,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      role: UserRole.GUEST,
    });

    response.status(201).json({
      status: "success",
      data: {
        user: user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserHandler = async (
  request: Request<{}, {}, LoginUserInput>,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = request.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return next(new AppError(400, "Invalid credentials"));
    }

    const userFound = await findUser(user.id);
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userFound.password
    );

    if (!isPasswordCorrect) {
      return next(new AppError(400, "Invalid credentials"));
    }

    const { accessToken, refreshToken } = await signTokens(userFound);

    response.cookie("accessToken", accessToken, accessTokenCookieOptions);
    response.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
    response.cookie("loggedIn", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    response.status(200).json({
      status: "success",
      message: "User logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    response
      .status(200)
      .json({ status: "success", data: response.locals.user });
  } catch (error) {
    next(error);
  }
};

export const logoutUserHandler = (response: Response) => {
  response.cookie("accessToken", "", { maxAge: 1 });
  response.cookie("refreshToken", "", { maxAge: 1 });
  response.cookie("loggedIn", "", { maxAge: 1 });
};

//TODO: Implement this properly should respond new set of cookies
export const refreshAccessTokenHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const requestRefreshToken = request.cookies.refreshToken;

    const message = "Could not refresh access token";

    if (!requestRefreshToken) {
      return next(new AppError(403, message));
    }

    const decoded = verifyJwt<{ sub: string }>(
      requestRefreshToken,
      "refreshTokenPublicKey"
    );

    if (!decoded) {
      return next(new AppError(403, message));
    }

    const userFound = await findUserById(decoded.sub);

    if (!userFound) {
      return next(new AppError(403, message));
    }
    const { accessToken, refreshToken } = await signTokens(userFound);

    response.cookie("accessToken", accessToken, accessTokenCookieOptions);
    response.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
    response.cookie("loggedIn", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    response.status(200).json({
      status: "success",
      message: "Tokens Refreshed!",
    });
  } catch (error) {
    next(error);
  }
};
