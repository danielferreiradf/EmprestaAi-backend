import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import Joi from "@hapi/joi";
import { AuthRequest } from "../interfaces/controllers.types";

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
        return res
          .status(404)
          .send({ success: false, message: "Users not found" });
      }

      return res.json({ success: true, data: users });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
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
        return res
          .status(404)
          .send({ success: false, message: "User not found" });
      }

      return res.json({ success: true, data: user });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // @desc Get logged user
  // @method GET
  // @route /api/users/me
  // @access Private

  async getLoggedUser(req: AuthRequest, res: Response) {
    try {
      const prisma = new PrismaClient();

      const user = await prisma.user.findOne({
        where: { id: req.userId },
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
        return res
          .status(404)
          .send({ success: false, message: "User not found" });
      }

      return res.json({ success: true, data: user });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // @desc Create new user
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
        return res
          .status(400)
          .json({ success: false, message: error.details[0].message });
      }

      const userExists = await prisma.user.findOne({
        where: { email: req.body.email },
      });

      if (userExists) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
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

      return res.json({ success: true, data: newUser });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // @desc Update logged user
  // @method PUT
  // @route /api/users/me
  // @access Private

  async update(req: AuthRequest, res: Response) {
    try {
      const prisma = new PrismaClient();

      const createUserSchema = Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        cep: Joi.number().required(),
        phone: Joi.number().required(),
        // password: Joi.string().min(6).required(),
      });

      const { error } = createUserSchema.validate(req.body);

      if (error) {
        return res
          .status(400)
          .json({ success: false, message: error.details[0].message });
      }

      const user = await prisma.user.findOne({ where: { id: req.userId } });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User does not exist" });
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { ...req.body },
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

      return res.json({ success: true, data: updatedUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // @desc Delete logged user
  // @method Delete
  // @route /api/users/me
  // @access Private

  async delete(req: AuthRequest, res: Response) {
    try {
      const prisma = new PrismaClient();

      const user = await prisma.user.findOne({ where: { id: req.userId } });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User does not exist" });
      }

      await prisma.user.delete({
        where: { id: user.id },
      });

      return res.json({ success: true, message: "User deleted", data: {} });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
