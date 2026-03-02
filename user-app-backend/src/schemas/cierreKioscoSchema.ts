import { z } from "zod";

export const cierreKioscoSchema = z.object({
  date: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
  fac1: z.number().min(0, "Debe ser un número positivo"),
  fac2: z.number().min(0, "Debe ser un número positivo"),
  cyber: z.number().min(0, "Debe ser un número positivo"),
  cargVirt: z.number().min(0, "Debe ser un número positivo"),
  cigarros: z.object({
    facturaB: z.object({
      totalVenta: z.number().min(0),
      ganancia: z.number().min(0),
      costo: z.number().min(0),
    }),
    remito: z.object({
      totalVenta: z.number().min(0),
      ganancia: z.number().min(0),
      costo: z.number().min(0),
    }),
  }),
  totalCaja: z.number(),
  totalCigarros: z.number(),
});

export type CierreKioscoInput = z.infer<typeof cierreKioscoSchema>;
