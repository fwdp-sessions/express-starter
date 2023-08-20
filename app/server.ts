import config from "config";
import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import AppError from "./utils/error";
import authRouter from "./routes/auth.routes";
import validateEnv from "./utils/validateEnv";

// Environment variables Validation incase you missed something
validateEnv();

export const bootstrap = () => {
  const app = express();
  app
    .disable("x-powered-by") // Remove poowered by express header
    .use("/public", express.static("public")) // Static folder
    .use(morgan("dev")) // Logger
    .use(urlencoded({ extended: true })) // body-parser
    .use(json()) // body-parser
    .use(cors({ origin: [config.get<string>("origin")] })) // allow CORS
    .use(cookieParser())
    .use("/api/auth", authRouter) // auth route
    .get("/healthz", (_, res) => {
      return res.json({ ok: true });
    })
    .all("*", (request: Request, response: Response, next: NextFunction) => {
      next(new AppError(404, `Route ${request.originalUrl} not found`));
    })
    .use(
      (
        error: AppError,
        request: Request,
        response: Response,
        next: NextFunction
      ) => {
        error.status = error.status || "error";
        error.statusCode = error.statusCode || 500;

        response.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    );

  return app;
};
