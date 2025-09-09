import { Schema, model, Document } from "mongoose";

export interface IProvider extends Document {
  day: string;
  providers: string[];
}

const providerSchema = new Schema<IProvider>({
  day: { type: String, required: true, unique: true },
  providers: [{ type: String }],
});

export default model<IProvider>("Provider", providerSchema);
