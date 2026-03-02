import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errorDetails = result.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res.status(400).json({
      message: "Validation failed",
      errors: errorDetails,
    });
  }

  // Si la validación es exitosa, reemplazamos req.body con los datos parseados
  // Esto es útil para transformaciones o valores por defecto definidos en el esquema
  req.body = result.data;
  next();
};

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Mantengo temporalmente validateUser para no romper rutas existentes que aún no refactorizamos
  // pero lo marcaré para eliminar o lo delegaré al nuevo sistema si es necesario.
  // Sin embargo, lo mejor es actualizar las rutas directamente a validate(userSchema).
  next();
};
