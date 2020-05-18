import express, { Request, Response } from "express";
import dotenv from "dotenv";

import { routes } from "./routes";

dotenv.config();

export const app = express();

app.use(express.json());
app.use("/api", routes);
