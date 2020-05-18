import { Router } from "express";
import { UserController } from "./app/controllers/UserController";
import { ProductController } from "./app/controllers/ProductController";
import { OrderController } from "./app/controllers/OrderController";

export const routes = Router();

// User Routes
routes.get("/users/:userId", UserController.get);
routes.get("/users", UserController.getAll);
routes.post("/users", UserController.create);

// Product Routes
routes.get("/products/:productId", ProductController.get);
routes.get("/products", ProductController.getAll);
routes.get("/users/products/:ownerId", ProductController.getUserProducts);
routes.post("/products", ProductController.create);

// Order Routes
routes.get("/orders", OrderController.get);
