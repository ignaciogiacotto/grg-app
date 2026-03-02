import { z } from "zod";

export const cierreKioscoSchema = z.object({
  date: z.string().min(1, "La fecha es requerida"),
  fac1: z.number().min(0, "Debe ser positivo"),
  fac2: z.number().min(0, "Debe ser positivo"),
  cyber: z.number().min(0, "Debe ser positivo"),
  cargVirt: z.number().min(0, "Debe ser positivo"),
  cigarros: z.object({
    facturaB: z.object({
      totalVenta: z.number().min(0),
      ganancia: z.number().min(0),
    }),
    remito: z.object({
      totalVenta: z.number().min(0),
      ganancia: z.number().min(0),
    }),
  }),
});

export type CierreKioscoInput = z.infer<typeof cierreKioscoSchema>;
