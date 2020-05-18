import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import Joi from "@hapi/joi";

export const OrderController = {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      throw new Error("teste erro");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
