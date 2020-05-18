import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import Joi from "@hapi/joi";

export const ProductController = {
  // @desc Gets all products
  // @method GET
  // @route /api/products
  // @access Public

  async getAll(req: Request, res: Response) {
    try {
      const prisma = new PrismaClient();

      const products = await prisma.product.findMany({
        include: {
          owner: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              address: true,
              city: true,
              state: true,
              cep: true,
            },
          },
        },
      });

      if (!products) {
        return res.status(404).send({ message: "Products not found." });
      }

      return res.json(products);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // @desc Gets single product
  // @method GET
  // @route /api/products/:productId
  // @access Public

  async get(req: Request, res: Response) {
    try {
      const prisma = new PrismaClient();

      const product = await prisma.product.findOne({
        where: { id: +req.params.productId },
        include: {
          owner: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              address: true,
              city: true,
              state: true,
              cep: true,
            },
          },
        },
      });

      if (!product) {
        return res.status(404).send({ message: "Product not found." });
      }

      return res.json(product);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // @desc Gets all products from user
  // @method GET
  // @route /api/users/products/:ownerId
  // @access Private

  async getUserProducts(req: Request, res: Response) {
    try {
      const prisma = new PrismaClient();

      const products = await prisma.product.findMany({
        where: { ownerId: +req.params.ownerId },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          location: true,
          ownerId: true,
          statusRent: true,
        },
      });

      if (!products || !products.length) {
        return res.status(404).send({ message: "Products not found." });
      }

      return res.json(products);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // @desc Create new product
  // @method POST
  // @route /api/products
  // @access Private

  async create(req: Request, res: Response) {
    try {
      const prisma = new PrismaClient();

      const { ownerId } = req.params;

      const createProductSchema = Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().min(10).required(),
        location: Joi.string().required(),
        ownerId: Joi.number().required(),
      });
      const { error } = createProductSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const newProduct = await prisma.product.create({
        data: {
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          location: req.body.location,
          owner: { connect: { id: req.body.ownerId } },
        },
      });

      return res.json(newProduct);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
