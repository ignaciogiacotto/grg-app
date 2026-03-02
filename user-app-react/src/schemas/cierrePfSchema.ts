import { z } from "zod";

const boletaEspecialItemSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  quantity: z.number().min(0),
  value: z.number().min(0),
});

export const cierrePfSchema = z.object({
  date: z.string().min(1, "La fecha es requerida"),
  boletasEspeciales: z.array(boletaEspecialItemSchema),
  cantidadTotalBoletas: z.number().min(0),
  recargas: z.number().min(0),
  recargasSubtotal: z.number().min(0),
  westernUnionQuantity: z.number().min(0),
}).refine(data => data.cantidadTotalBoletas > 0 || data.westernUnionQuantity > 0, {
  message: "Debe haber al menos una Factura o una operación de Western Union",
  path: ["cantidadTotalBoletas"] // El error se marcará en este campo por defecto
});

export type CierrePfInput = z.infer<typeof cierrePfSchema>;
