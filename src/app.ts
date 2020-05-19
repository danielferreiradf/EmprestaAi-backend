import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { routes } from "./routes";

dotenv.config();

export const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/api", routes);
