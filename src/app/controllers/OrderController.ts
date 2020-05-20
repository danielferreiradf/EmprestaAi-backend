import { CustomRequest, CustomResponse } from "../interfaces/controllers.types";
import { PrismaClient } from "@prisma/client";
import moment from "moment";
import Joi from "@hapi/joi";
import { start } from "repl";

export const OrderController = {
  // @desc Get single user logged order
  // @method GET
  // @route /api/orders/:orderId
  // @access Private

  async get(req: CustomRequest, res: CustomResponse) {
    try {
      const prisma = new PrismaClient();

      const order = await prisma.order.findMany({
        where: { id: +req.params.orderId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              description: true,
              location: true,
              ownerId: true,
              statusRent: true,
            },
          },
          owner: {
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
          },
          renter: {
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
          },
        },
      });

      if (!order || !order.length) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }

      return res.json({ success: true, data: order });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // @desc Get logged user orders
  // @method GET
  // @route /api/orders
  // @access Private

  async getAll(req: CustomRequest, res: CustomResponse) {
    try {
      const prisma = new PrismaClient();

      const orders = await prisma.order.findMany({
        where: { renterId: req.userId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              description: true,
              location: true,
              ownerId: true,
              statusRent: true,
            },
          },
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          renter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      if (!orders || !orders.length) {
        return res
          .status(404)
          .json({ success: false, message: "Orders not found" });
      }

      return res.json({ success: true, data: orders });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // @desc Create new order
  // @method POST
  // @route /api/orders
  // @access Private

  async create(req: CustomRequest, res: CustomResponse) {
    try {
      const prisma = new PrismaClient();

      const createOrderSchema = Joi.object().keys({
        productId: Joi.number().required(),
        ownerId: Joi.number().required(),
        startOfRent: Joi.date().required(),
        endOfRent: Joi.date().required(),
      });

      const { error } = createOrderSchema.validate(req.body);

      if (error) {
        return res
          .status(400)
          .json({ success: false, message: error.details[0].message });
      }

      // Check if ownerId and renterId are equal
      if (req.body.ownerId === req.userId) {
        return res
          .status(400)
          .json({ success: false, message: "User cannot rent this product" });
      }

      const product = await prisma.product.findOne({
        where: { id: req.body.productId },
      });

      // Check if product is already rented
      if (product?.statusRent) {
        return res
          .status(400)
          .json({ success: false, message: "Product is already rented" });
      }

      const startDate = moment(req.body.startOfRent);
      const endDate = moment(req.body.endOfRent);

      const amountOfDays = moment.duration(endDate.diff(startDate)).asDays();
      const totalPrice = amountOfDays * product!.price;

      const newOrder = await prisma.order.create({
        data: {
          product: { connect: { id: req.body.productId } },
          owner: { connect: { id: req.body.ownerId } },
          renter: { connect: { id: req.userId } },
          startOfRent: startDate.toISOString(),
          endOfRent: endDate.toISOString(),
          totalPrice: totalPrice,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              description: true,
              location: true,
              ownerId: true,
              statusRent: true,
            },
          },
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          renter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      // Update product rent status
      await prisma.product.update({
        where: { id: req.body.productId },
        data: { statusRent: true },
      });

      return res.json({ success: true, data: newOrder });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // @desc Delete order
  // @method DELETE
  // @route /api/orders/:orderId
  // @access Private

  async delete(req: CustomRequest, res: CustomResponse) {
    try {
      const prisma = new PrismaClient();

      const order = await prisma.order.findOne({
        where: { id: +req.params.orderId },
      });

      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order does not exist" });
      }

      // Check if order owner is the same as logged user
      if (order?.renterId !== req.userId) {
        return res.status(401).json({
          success: false,
          message: "User does not have permission to delete this order.",
        });
      }

      const deletedOrder = await prisma.order.delete({
        where: { id: order.id },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              description: true,
              location: true,
              ownerId: true,
              statusRent: true,
            },
          },
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          renter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      // Update product rent status
      await prisma.product.update({
        where: { id: order.productId },
        data: { statusRent: false },
      });

      return res.json({
        success: true,
        message: "Order deleted",
        data: deletedOrder,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
