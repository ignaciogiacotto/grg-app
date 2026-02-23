import { Response } from 'express';
import * as noteService from '../services/noteService';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id?.toString(); // Explicitly convert to string
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const notes = await noteService.getNotesForUser(userId);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const count = await noteService.getUnreadCountForUser(userId);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error getting unread count', error });
  }
};

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id?.toString(); // Explicitly convert to string
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const noteData = { ...req.body, creator: userId, readBy: [userId] };
    // If visibleTo is not specified, make it visible to the creator
    if (!noteData.visibleTo || noteData.visibleTo.length === 0) {
        noteData.visibleTo = [userId];
    }
    const newNote = await noteService.createNote(noteData);
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const note = await noteService.markAsRead(req.params.id, userId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error marking note as read', error });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id?.toString();
    const note = await noteService.updateNote(req.params.id, req.body, userId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = await noteService.deleteNote(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error });
  }
};