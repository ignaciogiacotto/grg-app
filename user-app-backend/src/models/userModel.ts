import { Schema, model, Document } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - email
 *         - password
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         username:
 *           type: string
 *           description: The username for login.
 *         email:
 *           type: string
 *           description: The email of the user.
 *         role:
 *           type: string
 *           description: The role of the user.
 *           enum: [role_admin, role_manager, role_employee]
 *       example:
 *         _id: 60d0fe4f5311236168a109ca
 *         name: John Doe
 *         username: johndoe
 *         email: johndoe@example.com
 *         role: role_employee
 */

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
