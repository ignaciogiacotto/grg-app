import { Tag, ITag } from '../models/tagModel';

export const getTags = async () => {
  return Tag.find();
};

export const createTag = async (data: Partial<ITag>) => {
  // Find if tag already exists
  const existingTag = await Tag.findOne({ name: data.name });
  if (existingTag) {
    return existingTag;
  }
  const tag = new Tag(data);
  return tag.save();
};
