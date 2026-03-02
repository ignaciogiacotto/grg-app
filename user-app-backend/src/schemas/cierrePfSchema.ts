import { z } from "zod";

const boletaEspecialItemSchema = z.object({
  name: z.string().min(1, "El nombre de la boleta es requerido"),
  quantity: z.number().min(0, "La cantidad no puede ser negativa"),
  value: z.number().min(0, "El valor no puede ser negativo"),
});

export const cierrePfSchema = z.object({
  date: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
  boletasEspeciales: z.array(boletaEspecialItemSchema),
  cantidadTotalBoletas: z.number().min(0),
  recargas: z.number().min(0),
  recargasSubtotal: z.number().min(0),
  westernUnionQuantity: z.number().min(0),
  totalGanancia: z.number(),
});

export type CierrePfInput = z.infer<typeof cierrePfSchema>;
