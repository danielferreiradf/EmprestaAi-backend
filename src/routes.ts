import { Router } from "express";
import { UserController } from "./app/controllers/UserController";

export const routes = Router();

// User Routes
routes.get("/users", UserController.get);
routes.post("/users", UserController.create);
