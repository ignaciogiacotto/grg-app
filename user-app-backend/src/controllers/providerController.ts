import { Request, Response } from "express";
import * as providerService from "../services/providerService";

export const getProviders = async (req: Request, res: Response) => {
  const providers = await providerService.getProviders();
  res.json(providers);
};

export const createProvider = async (req: Request, res: Response) => {
  const { day } = req.body;
  const newProvider = await providerService.createProvider(day);
  res.status(201).json(newProvider);
};

export const updateProvider = async (req: Request, res: Response) => {
  const { day } = req.params;
  const { providers } = req.body;
  const updatedProvider = await providerService.updateProvider(day, providers);
  if (!updatedProvider) {
    return res.status(404).send("Provider not found");
  }
  res.json(updatedProvider);
};