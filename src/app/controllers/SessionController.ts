import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Jwt from "jsonwebtoken";
import Joi from "@hapi/joi";
import bcryptjs from "bcryptjs";

export const SessionController = {
  // @desc Create session with JWT Token and Cookie
  // @method POST
  // @route /api/sessions
  // @access Public

  async create(req: Request, res: Response) {
    try {
      const prisma = new PrismaClient();

      const createSessionSchema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });
      const { error } = createSessionSchema.validate(req.body);

      if (error) {
        return res
          .status(400)
          .json({ success: false, message: error.details[0].message });
      }

      const userExists = await prisma.user.findOne({
        where: { email: req.body.email },
      });

      if (!userExists) {
        return res
          .status(401)
          .json({ sucess: false, message: "Invalid credentials." });
      }

      if (!(await bcryptjs.compare(req.body.password, userExists.password))) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials." });
      }

      const { id, firstName, lastName, email } = userExists;

      // Generate Token
      const token = Jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });

      // Generate Cookie
      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_EXPIRE_COOKIE * 24 * 60 * 60 * 1000
        ),
      };

      return res.cookie("token", token, cookieOptions).json({
        success: true,
        data: {
          user: {
            id,
            firstName,
            lastName,
            email,
          },
          token,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
