import { Request, Response } from "express";

export const UserController = {
  async get(req: Request, res: Response) {
    res.send("get");
  },

  async create(req: Request, res: Response) {
    res.send("create");
  },
};
