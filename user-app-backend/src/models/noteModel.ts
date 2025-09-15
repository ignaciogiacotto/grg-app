import { Schema, model, Document } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  creator: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
  visibleTo: Schema.Types.ObjectId[];
}

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    visibleTo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

export const Note = model<INote>('Note', noteSchema);
