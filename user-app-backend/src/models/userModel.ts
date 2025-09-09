import { Schema, model, Document } from "mongoose";

export enum Role {
  Admin = "role_admin",
  Manager = "role_manager",
  Employee = "role_employee",
}

export interface User extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  role: Role;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: Object.values(Role),
    required: true,
    default: Role.Employee,
  },
});

export default model<User>("User", userSchema);
