import Jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../interfaces/auth";

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader) {
    // Get token - Remove "Bearer "
    token = authHeader.split(" ")[1];
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }
  else {
    return res.status(401).json({ error: "Token not provided." });
  }

  try {
    // Verify token
    const decoded = <any>Jwt.verify(token, process.env.JWT_SECRET);

    // Add user id to to Request
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Token invalid." });
  }
};
