import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel, { User, Role } from "../models/userModel";

export interface AuthRequest extends Request {
  user?: User;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "User role not authorized" });
    }
    next();
  };
};
