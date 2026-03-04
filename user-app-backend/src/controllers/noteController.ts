import { Response } from "express";
import * as noteService from "../services/noteService";
import { AuthRequest } from "../middlewares/authMiddleware";
import logger from "../config/logger";

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const notes = await noteService.getNotesForUser(userId);
    res.json(notes);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching notes" });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const count = await noteService.getUnreadCountForUser(userId);
    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ message: "Error getting unread count" });
  }
};

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Inyectamos el creador y lo marcamos como leído por él mismo
    const noteData = {
      ...req.body,
      creator: userId,
      readBy: [userId],
    };

    // Si no se especifica quién puede verla, por defecto solo el creador
    if (!noteData.visibleTo || noteData.visibleTo.length === 0) {
      noteData.visibleTo = [userId];
    }

    const newNote = await noteService.createNote(noteData);
    res.status(201).json(newNote);
  } catch (error: any) {
    logger.error("Error creating note:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Error creating note",
    });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const note = await noteService.markAsRead(req.params.id, userId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (error: any) {
    res.status(500).json({ message: "Error marking note as read" });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const note = await noteService.updateNote(req.params.id, req.body, userId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Error updating note",
    });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = await noteService.deleteNote(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting note" });
  }
};
