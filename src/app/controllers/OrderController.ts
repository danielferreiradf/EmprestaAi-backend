import { CustomRequest, CustomResponse } from "../interfaces/controllers.types";
import { PrismaClient } from "@prisma/client";
import Joi from "@hapi/joi";

export const OrderController = {
  async get(req: CustomRequest, res: CustomResponse) {
    try {
      res.send(`Hello ${req.userId}`);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
