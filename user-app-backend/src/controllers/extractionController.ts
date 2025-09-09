import { Response } from "express";
import * as extractionService from "../services/extractionService";
import { AuthRequest } from "../middlewares/authMiddleware";

export const handleCreateExtraction = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { description, type } = req.body;
    if (!description || !type) {
      return res
        .status(400)
        .json({ message: "Description and type are required" });
    }
    const createdBy = req.user?._id;
    if (!createdBy) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const extraction = await extractionService.createExtraction({
      description,
      type,
      createdBy,
    });
    res.status(201).json(extraction);
  } catch (error) {
    res.status(500).json({ message: "Error creating extraction", error });
  }
};

export const handleGetExtractions = async (req: AuthRequest, res: Response) => {
  try {
    const extractions = await extractionService.getExtractions();
    res.status(200).json(extractions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching extractions", error });
  }
};

export const handleUpdateExtraction = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status, isArchived, description, type } = req.body;

    const updates: {
      status?: any;
      isArchived?: boolean;
      description?: string;
      type?: "Western Union" | "Debit/MP";
    } = {};

    if (status) updates.status = status;
    if (isArchived !== undefined) updates.isArchived = isArchived;
    if (description) updates.description = description;
    if (type) updates.type = type;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const extraction = await extractionService.updateExtraction(id, updates);
    if (!extraction) {
      return res.status(404).json({ message: "Extraction not found" });
    }
    res.status(200).json(extraction);
  } catch (error) {
    res.status(500).json({ message: "Error updating extraction", error });
  }
};

export const handleArchiveAllCompleted = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await extractionService.archiveAllCompleted();
    res
      .status(200)
      .json({
        message: `${result.modifiedCount} extractions archived successfully.`,
        ...result,
      });
  } catch (error) {
    res.status(500).json({ message: "Error archiving extractions", error });
  }
};
