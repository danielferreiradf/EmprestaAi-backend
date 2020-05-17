import express, { Request, Response } from "express";
import dotenv from "dotenv";

import { routes } from "./routes";

dotenv.config({ path: "./config/dev.env" });

export const app = express();

app.use(routes);

app.get("/", (req: Request, res: Response) => res.send("hello!"));
