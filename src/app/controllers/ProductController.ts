import { PrismaClient } from "@prisma/client";
import Joi from "@hapi/joi";
import { CustomRequest, CustomResponse } from "../interfaces/controllers.types";

export const ProductController = {
  // @desc Get all products
  // @method GET
  // @route /api/products
  // @access Public

  async getAll(req: CustomRequest, res: CustomResponse) {
    try {
      const prisma = new PrismaClient();

      const products = await prisma.product.findMany({
        where: {
          statusRent: { equals: false },
          name: { contains: req.query.productName },
        },
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
          picture: {
            select: {
              id: true,
              name: true,
              path: true,
            },
          },
        },
      });

      if (!products || !products.length) {
        return res
          .status(404)
          .json({ success: false, message: "Products not found" });
      }

      return res.json({ success: true, data: products });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // @desc Get single product
  // @method GET
  // @route /api/products/:productId
  // @access Public

  async get(req: CustomRequest, res: CustomResponse) {
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
          picture: {
            select: {
              id: true,
              name: true,
              path: true,
            },
          },
        },
      });

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      return res.json({ success: true, data: product });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // @desc Get all products from logged user
  // @method GET
  // @route /api/users/me/products
  // @access Private

  async getUserProducts(req: CustomRequest, res: CustomResponse) {
    try {
      const prisma = new PrismaClient();

      const products = await prisma.product.findMany({
        where: { ownerId: req.userId },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          location: true,
          ownerId: true,
          statusRent: true,
          picture: {
            select: {
              id: true,
              name: true,
              path: true,
            },
          },
        },
      });

      if (!products || !products.length) {
        return res
          .status(404)
          .json({ success: false, message: "Products not found" });
      }

      return res.json({ success: true, data: products });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // @desc Create new product
  // @method POST
  // @route /api/products
  // @access Private

  async create(req: CustomRequest, res: CustomResponse) {
    try {
      const prisma = new PrismaClient();

      const createProductSchema = Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().min(10).required(),
        location: Joi.string().required(),
        pictureId: Joi.number().required(),
      });

      const { error } = createProductSchema.validate(req.body);

      if (error) {
        return res
          .status(400)
          .json({ success: false, message: error.details[0].message });
      }

      const newProduct = await prisma.product.create({
        data: {
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          location: req.body.location,
          picture: { connect: { id: req.body.pictureId } },
          owner: { connect: { id: req.userId } },
        },
      });

      return res.json({ success: true, data: newProduct });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // @desc Update product
  // @method PUT
  // @route /api/products/:productId
  // @access Private

  async update(req: CustomRequest, res: CustomResponse) {
    try {
      const prisma = new PrismaClient();

      const updateProductSchema = Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().min(10).required(),
        location: Joi.string().required(),
        pictureId: Joi.number().required(),
      });

      const { error } = updateProductSchema.validate(req.body);

      if (error) {
        return res
          .status(400)
          .json({ success: false, message: error.details[0].message });
      }

      const product = await prisma.product.findOne({
        where: { id: +req.params.productId },
      });

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product does not exist" });
      }

      // Check if product owner is the same as logged user
      if (product?.ownerId !== req.userId) {
        return res.status(401).json({
          success: false,
          message: "User does not have permission to update this product.",
        });
      }

      const updatedProduct = await prisma.product.update({
        where: { id: product.id },
        data: {
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          location: req.body.location,
        },
      });

      return res.json({
        success: true,
        message: "Product updated",
        data: updatedProduct,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // @desc Delete product
  // @method DELETE
  // @route /api/products/:productId
  // @access Private

  async delete(req: CustomRequest, res: CustomResponse) {
    try {
      const prisma = new PrismaClient();

      const product = await prisma.product.findOne({
        where: { id: +req.params.productId },
      });

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product does not exist" });
      }

      // Check if product owner is the same as logged user
      if (product?.ownerId !== req.userId) {
        return res.status(401).json({
          success: false,
          message: "User does not have permission to delete this product.",
        });
      }

      await prisma.product.delete({
        where: { id: product?.id },
      });

      return res.json({ success: true, message: "Product deleted", data: {} });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
