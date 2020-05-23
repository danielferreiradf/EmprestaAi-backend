import { Router } from "express";

import multer from "multer";
import { multerConfig } from "./config/multer";
import { UserController } from "./app/controllers/UserController";
import { ProductController } from "./app/controllers/ProductController";
import { OrderController } from "./app/controllers/OrderController";
import { SessionController } from "./app/controllers/SessionController";
import { FileController } from "./app/controllers/FileController";
import { auth } from "./app/middlewares/auth";

export const routes = Router();
const upload = multer(multerConfig);

// User Routes
routes.get("/users", UserController.getAll);
routes.get("/users/me", auth, UserController.getLoggedUser);
routes.get("/users/:userId", UserController.get);
routes.post("/users", UserController.create);
routes.put("/users/me", auth, UserController.update);
routes.delete("/users/me", auth, UserController.delete);

// Session Routes
routes.post("/sessions", SessionController.create);

// Product Routes
routes.get("/products", ProductController.getAll);
routes.get("/products/:productId", ProductController.get);
routes.get("/users/me/products", auth, ProductController.getUserProducts);
routes.post("/products", auth, ProductController.create);
routes.put("/products/:productId", auth, ProductController.update);
routes.delete("/products/:productId", auth, ProductController.delete);

// Files Routes
routes.post("/files", auth, upload.single("file"), FileController.create);

// Order Routes
routes.get("/orders", auth, OrderController.getAll);
routes.get("/orders/:orderId", auth, OrderController.get);
routes.post("/orders", auth, OrderController.create);
routes.delete("/orders/:orderId", auth, OrderController.delete);
