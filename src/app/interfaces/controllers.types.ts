import { Request } from "express";

export interface AuthRequest extends Request {
  userId?: number;
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
