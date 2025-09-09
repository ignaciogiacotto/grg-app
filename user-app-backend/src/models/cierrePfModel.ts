import { Schema, model, Document } from "mongoose";

export interface ICierrePf extends Document {
  date: Date;
  western: number;
  mp: number;
  liga: number;
  santander: number;
  giros: number;
  uala: number;
  naranjaX: number;
  nsaAgencia: number;
  brubank: number;
  direcTv: number;
  extracciones: number;
  recargas: number;
  descFacturas: number;
  cantTotalFacturas: number;
  totalGanancia: number;
}

const cierrePfSchema = new Schema<ICierrePf>({
  date: { type: Date, default: Date.now },
  western: { type: Number, default: 0 },
  mp: { type: Number, default: 0 },
  liga: { type: Number, default: 0 },
  santander: { type: Number, default: 0 },
  giros: { type: Number, default: 0 },
  uala: { type: Number, default: 0 },
  naranjaX: { type: Number, default: 0 },
  nsaAgencia: { type: Number, default: 0 },
  brubank: { type: Number, default: 0 },
  direcTv: { type: Number, default: 0 },
  extracciones: { type: Number, default: 0 },
  recargas: { type: Number, default: 0 },
  descFacturas: { type: Number, default: 0 },
  cantTotalFacturas: { type: Number, default: 0 },
  totalGanancia: { type: Number, default: 0 },
});

export default model<ICierrePf>("CierrePf", cierrePfSchema);
