import { Router } from "express";
import { UserController } from "./app/controllers/UserController";
import { ProductController } from "./app/controllers/ProductController";
import { OrderController } from "./app/controllers/OrderController";

export const routes = Router();

// User Routes
routes.get("/users", UserController.get);
routes.post("/users", UserController.create);

// Product Routes
routes.get("/products", ProductController.get);
routes.post("/products/", ProductController.create);

// Order Routes
