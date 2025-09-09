import { Request, Response, NextFunction } from "express";

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res
      .status(400)
      .json({
        message: "All fields are required: name, username, email, password",
      });
  }

  // Basic email validation
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  next();
};
