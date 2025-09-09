import Extraction, {
  IExtraction,
  ExtractionStatus,
} from "../models/extractionModel";
import { User } from "../models/userModel";

export const createExtraction = async (data: {
  description: string;
  type: "Western Union" | "Debit/MP";
  createdBy: User["_id"];
}): Promise<IExtraction> => {
  const extraction = new Extraction(data);
  await extraction.save();
  return extraction.populate("createdBy", "name");
};

export const getExtractions = async (): Promise<IExtraction[]> => {
  return await Extraction.find({ isArchived: false })
    .sort({ createdAt: -1 })
    .populate("createdBy", "name");
};

export const updateExtraction = async (
  id: string,
  updates: {
    status?: ExtractionStatus;
    isArchived?: boolean;
    description?: string;
    type?: "Western Union" | "Debit/MP";
  }
): Promise<IExtraction | null> => {
  return await Extraction.findByIdAndUpdate(id, updates, {
    new: true,
  }).populate("createdBy", "name");
};

export const archiveAllCompleted = async (): Promise<{
  matchedCount: number;
  modifiedCount: number;
}> => {
  const result = await Extraction.updateMany(
    { status: "Completado", isArchived: false },
    { $set: { isArchived: true } }
  );
  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
};
