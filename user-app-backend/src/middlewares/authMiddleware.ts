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
    console.log("Authorization header found:", req.headers.authorization); // Added log
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Extracted token:", token); // Added log
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };
      console.log("Decoded token:", decoded); // Added log
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        console.log("User not found for decoded ID:", decoded.id); // Added log
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }
      console.log("User found:", user.username); // Added log
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    console.log("No token found in Authorization header."); // Added log
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
