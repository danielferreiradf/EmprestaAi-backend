import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Joi from "@hapi/joi";

export const ProductController = {
  // @desc Gets all products
  // @method GET
  // @route /api/products
  // @access Public

  async get(req: Request, res: Response) {
    const prisma = new PrismaClient();

    const products = await prisma.product.findMany();

    if (!products) {
      return res.status(404).send({ message: "No products found." });
    }

    return res.json(products);
  },

  // @desc Create new product
  // @method POST
  // @route /api/products
  // @access Private

  async create(req: Request, res: Response) {
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
  },
};
