import { Schema, model, Document } from 'mongoose';

export type ExtractionStatus = 'Pendiente' | 'Disponible' | 'Avisado' | 'Completado';

export interface IExtraction extends Document {
  amount: number;
  clientNumber: string;
  type: 'Western Union' | 'Debit/MP';
  status: ExtractionStatus;
  isArchived: boolean;
  createdBy: Schema.Types.ObjectId;
}

const ExtractionSchema = new Schema<IExtraction>({
  amount: { type: Number, required: true },
  clientNumber: { type: String, required: true },
  type: { type: String, required: true, enum: ['Western Union', 'Debit/MP'] },
  status: { type: String, required: true, enum: ['Pendiente', 'Disponible', 'Avisado', 'Completado'], default: 'Pendiente' },
  isArchived: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true,
});

export default model<IExtraction>('Extraction', ExtractionSchema);
