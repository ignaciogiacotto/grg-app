import { Schema, model, Document } from "mongoose";

export interface IBoletaEspecialCierre {
  name: string;
  quantity: number;
  value: number;
}

export interface IBoletaEspecialDB extends Document {
  name: string;
  value: number;
}

const boletaEspecialSchema = new Schema<IBoletaEspecialDB>({
  name: { type: String, required: true, unique: true },
  value: { type: Number, required: true },
});

export default model<IBoletaEspecialDB>("BoletaEspecial", boletaEspecialSchema);
