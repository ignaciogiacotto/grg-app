import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
  role: z
    .enum(["role_admin", "role_manager", "role_employee"])
    .default("role_employee"),
});

// Tipos inferidos de Zod
export type UserInput = z.infer<typeof userSchema>;
