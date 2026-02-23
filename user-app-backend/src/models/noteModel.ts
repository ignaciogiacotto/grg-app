import { Schema, model, Document, Types } from 'mongoose';

export interface INote extends Document {
  title: string;
  content:string;
  creator: Types.ObjectId;
  tags: Types.ObjectId[];
  visibleTo: Types.ObjectId[];
  readBy: Types.ObjectId[];
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
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

export const Note = model<INote>('Note', noteSchema);
