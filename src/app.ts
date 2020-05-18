import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { routes } from "./routes";

dotenv.config();

export const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", routes);
