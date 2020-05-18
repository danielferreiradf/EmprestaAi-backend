import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import Joi from "@hapi/joi";

export const UserController = {
  // @desc Gets all users
  // @method GET
  // @route /api/users
  // @access Private

  async getAll(req: Request, res: Response) {
    try {
      const prisma = new PrismaClient();

      const users = await prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          state: true,
          cep: true,
        },
      });

      if (!users) {
        return res.status(404).send({ message: "Users not found." });
      }

      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // @desc Gets single user
  // @method GET
  // @route /api/users/:userId
  // @access Private

  async get(req: Request, res: Response) {
    try {
      const prisma = new PrismaClient();

      const user = await prisma.user.findOne({
        where: { id: +req.params.userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          state: true,
          cep: true,
        },
      });

      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // @desc Creates new user
  // @method POST
  // @route /api/users
  // @access Public

  async create(req: Request, res: Response) {
    try {
      const prisma = new PrismaClient();

      const createUserSchema = Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        cep: Joi.number().required(),
        phone: Joi.number().required(),
        password: Joi.string().min(6).required(),
      });
      const { error } = createUserSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const userExists = await prisma.user.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res.status(400).json({ message: "User already exists." });
      }

      const hashedPassword = await bcryptjs.hash(req.body.password, 8);

      const newUser = await prisma.user.create({
        data: { ...req.body, password: hashedPassword },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          state: true,
          cep: true,
        },
      });

      return res.json(newUser);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
