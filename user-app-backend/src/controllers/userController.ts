import { Response } from "express";
import * as userService from "../services/userService";
import { User, Role } from "../models/userModel";
import { AuthRequest } from "../middlewares/authMiddleware";

const isAdmin = (req: AuthRequest) => req.user?.role === Role.Admin;

export const getUsers = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 0;
  const pageSize = 5;
  const { content, totalElements } = await userService.getUsers(page, pageSize);
  res.json({ content, totalElements });
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  const id = req.params.id;
  const user = await userService.getUserById(id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.json(user);
};

export const createUser = async (req: AuthRequest, res: Response) => {
  if (!isAdmin(req)) {
    if (
      req.body.role &&
      req.body.role !== Role.Employee &&
      req.body.role !== Role.Manager
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to set this role" });
    }
  }
  const newUser = await userService.createUser(req.body);
  res.status(201).json(newUser);
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  const id = req.params.id;
  const userToUpdate = await userService.getUserById(id);

  if (userToUpdate && userToUpdate.role === Role.Admin) {
    return res.status(403).json({ message: "Admins cannot be updated." });
  }

  if (!isAdmin(req) && req.body.role) {
    const existingUser = await userService.getUserById(id);
    if (existingUser && existingUser.role !== req.body.role) {
      return res.status(403).json({ message: "Not authorized to change role" });
    }
  }
  const updatedUser = await userService.updateUser(id, req.body);
  if (!updatedUser) {
    return res.status(404).send("User not found");
  }
  res.json(updatedUser);
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Not authorized" });
  }
  const id = req.params.id;
  const userToDelete = await userService.getUserById(id);

  if (userToDelete && userToDelete.role === Role.Admin) {
    return res.status(403).json({ message: "Admins cannot be deleted." });
  }

  const deleted = await userService.deleteUser(id);
  if (!deleted) {
    return res.status(404).send("User not found");
  }
  res.status(204).send();
};
