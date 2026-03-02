import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(5, "El nombre es muy corto"),
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  email: z.string().email("Formato de email inválido"),
  password: z
    .string()
    .min(4, "La contraseña debe tener al menos 4 caracteres")
    .optional()
    .or(z.literal("")),
  role: z.enum(["role_admin", "role_manager", "role_employee"]),
});

// Usamos el tipo inferido para la salida (donde role es obligatorio)
export type UserInput = z.infer<typeof userSchema>;
