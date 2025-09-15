import { Note, INote } from '../models/noteModel';
import { User } from '../models/userModel';

export const getNotesForUser = async (userId: string) => {
  return Note.find({ visibleTo: userId }).populate('tags').populate('creator', 'name');
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
