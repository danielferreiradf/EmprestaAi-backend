import { Request, Response } from "express";

export interface CustomRequest extends Request {
  userId?: number;
  body: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    cep: string;
    phone: string;
    password: string;

    name: string;
    price: number;
    description: string;
    location: string;

    productId: number;
    ownerId: number;
    startOfRent: string;
    endOfRent: string;
  };
  params: {
    productId: string;
    userId: string;
    orderId: string;
  };
}

export interface CustomResponse extends Response {
  json: (args: {
    success: boolean;
    data?: object[] | object;
    message?: string;
  }) => any;
}

export interface IResponseBody {
  body: {
    success: boolean;
    data?: object[] | object;
    message?: string;
  };
}
