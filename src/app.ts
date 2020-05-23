import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { resolve } from "path";
import { routes } from "./routes";

dotenv.config();

export const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/api", routes);
app.use("/files", express.static(resolve(__dirname, "..", "temp", "uploads")));
