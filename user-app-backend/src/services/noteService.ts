import { Types } from "mongoose";
import { Note, INote } from "../models/noteModel";

export const getNotesForUser = async (userId: string) => {
  return Note.find({ visibleTo: new Types.ObjectId(userId) })
    .populate("tags")
    .populate("creator", "name")
    .populate("visibleTo", "name");
};

export const createNote = async (data: Partial<INote>) => {
  const note = new Note(data);
  return note.save();
};

export const updateNote = async (id: string, data: Partial<INote>) => {
  return Note.findByIdAndUpdate(id, data, { new: true });
};

export const deleteNote = async (id: string) => {
  return Note.findByIdAndDelete(id);
};
