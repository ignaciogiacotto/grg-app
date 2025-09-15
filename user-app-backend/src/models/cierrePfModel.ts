import { Schema, model, Document } from "mongoose";

interface IBoletaEspecial {
  name: string;
  quantity: number;
  value: number;
}

export interface ICierrePf extends Document {
  date: Date;
  boletasEspeciales: IBoletaEspecial[];
  cantidadTotalBoletas: number;
  recargas: number;
  recargasSubtotal: number;
  westernUnionQuantity: number;
  totalGanancia: number;
}

const cierrePfSchema = new Schema<ICierrePf>({
  date: { type: Date, default: Date.now },
  boletasEspeciales: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      value: { type: Number, required: true },
    },
  ],
  cantidadTotalBoletas: { type: Number, required: true, default: 0 },
  recargas: { type: Number, default: 0 },
  recargasSubtotal: { type: Number, default: 0 },
  westernUnionQuantity: { type: Number, default: 0 },
  totalGanancia: { type: Number, default: 0 },
});

export default model<ICierrePf>("CierrePf", cierrePfSchema);
