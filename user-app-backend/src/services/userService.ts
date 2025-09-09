import UserModel, { User } from "../models/userModel";
import bcrypt from "bcrypt";

export const getUsers = async (page: number, pageSize: number) => {
  const skip = page * pageSize;
  const users = await UserModel.find().skip(skip).limit(pageSize);
  const totalElements = await UserModel.countDocuments();
  return { content: users, totalElements };
};

export const getUserById = async (id: string) => {
  return await UserModel.findById(id);
};

export const createUser = async (user: Omit<User, "id">) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  const newUser = new UserModel(user);
  return await newUser.save();
};

export const updateUser = async (id: string, user: Partial<User>) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  return await UserModel.findByIdAndUpdate(id, user, { new: true });
};

export const deleteUser = async (id: string) => {
  const result = await UserModel.findByIdAndDelete(id);
  return !!result;
};

export const findUserByUsernameAndPassword = async (
  username: string,
  password: string
) => {
  const user = await UserModel.findOne({ username }).select("+password");
  if (!user) {
    return null;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return null;
  }
  return user;
};
