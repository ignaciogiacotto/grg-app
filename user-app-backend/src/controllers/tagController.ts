import { Request, Response } from 'express';
import * as tagService from '../services/tagService';

export const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await tagService.getTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags', error });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const newTag = await tagService.createTag(req.body);
    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ message: 'Error creating tag', error });
  }
};
