import { Schema, model, Document } from 'mongoose';

export interface ITag extends Document {
  name: string;
}

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Tag = model<ITag>('Tag', tagSchema);
