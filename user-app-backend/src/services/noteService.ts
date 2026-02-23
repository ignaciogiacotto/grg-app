import { Types } from "mongoose";
import { Note, INote } from "../models/noteModel";

export const getNotesForUser = async (userId: string) => {
  return Note.find({ visibleTo: new Types.ObjectId(userId) })
    .populate("tags")
    .populate("creator", "name")
    .populate("visibleTo", "name");
};

export const getUnreadCountForUser = async (userId: string) => {
  return Note.countDocuments({
    visibleTo: new Types.ObjectId(userId),
    readBy: { $ne: new Types.ObjectId(userId) },
  });
};

export const createNote = async (data: Partial<INote>) => {
  const note = new Note(data);
  if (data.creator && !note.readBy.includes(data.creator)) {
    note.readBy.push(data.creator);
  }
  return note.save();
};

export const updateNote = async (id: string, data: Partial<INote>, updaterId?: string) => {
  if (updaterId) {
    data.readBy = [new Types.ObjectId(updaterId) as any];
  }
  return Note.findByIdAndUpdate(id, data, { new: true });
};

export const markAsRead = async (id: string, userId: string) => {
  return Note.findByIdAndUpdate(
    id,
    { $addToSet: { readBy: new Types.ObjectId(userId) } },
    { new: true }
  );
};

export const deleteNote = async (id: string) => {
  return Note.findByIdAndDelete(id);
};
