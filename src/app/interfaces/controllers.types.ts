import { Request, Response } from "express";

export interface CustomRequest extends Request {
  userId?: number;
}

export interface CustomResponse extends Response {
  json: (params: {
    success: boolean;
    data?: object[] | object;
    message?: string;
  }) => any;
}

// export interface UserSchemaValidation extends ObjectSchema {
//   firstName: Joi.StringSchema;
//   lastName: string;
//   email: string;
//   address: string;
//   city: string;
//   state: string;
//   cep: number;
//   phone: number;
//   password?: string;
// }

// export interface ProductSchemaValidation {
//   name: string;
//   price: number;
//   description: string;
//   location: string;
// }
