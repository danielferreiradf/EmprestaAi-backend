import { Request, Response } from "express";
import { AuthRequest } from "../interfaces/auth";
import { PrismaClient } from "@prisma/client";
import Joi from "@hapi/joi";

export const OrderController = {
  async get(req: AuthRequest, res: Response) {
    try {
      res.send(`Hello ${req.userId}`);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
