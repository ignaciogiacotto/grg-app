import { Schema, model, Document } from "mongoose";

export interface ICierreKiosco extends Document {
  date: Date;
  fac1: number;
  fac2: number;
  cyber: number;
  cargVirt: number;
  cigarros: {
    facturaB: {
      totalVenta: number;
      ganancia: number;
      costo: number;
    };
    remito: {
      totalVenta: number;
      ganancia: number;
      costo: number;
    };
  };
  totalCaja: number;
  totalCigarros: number;
  createdBy: Schema.Types.ObjectId;
}

const cierreKioscoSchema = new Schema<ICierreKiosco>({
  date: { type: Date, default: Date.now },
  fac1: { type: Number, required: true },
  fac2: { type: Number, required: true },
  cyber: { type: Number, required: true },
  cargVirt: { type: Number, required: true },
  cigarros: {
    facturaB: {
      totalVenta: { type: Number, required: true },
      ganancia: { type: Number, required: true },
      costo: { type: Number, required: true },
    },
    remito: {
      totalVenta: { type: Number, required: true },
      ganancia: { type: Number, required: true },
      costo: { type: Number, required: true },
    },
  },
  totalCaja: { type: Number, required: true },
  totalCigarros: { type: Number, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const CierreKiosco = model<ICierreKiosco>(
  "CierreKiosco",
  cierreKioscoSchema
);
