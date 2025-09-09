import { Request, Response } from "express";
import * as cierreKioscoService from "../services/cierreKioscoService";

export const createCierreKiosco = async (req: Request, res: Response) => {
  try {
    const newCierreKiosco = await cierreKioscoService.createCierreKiosco(
      req.body
    );
    res.status(201).json(newCierreKiosco);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getCierresKiosco = async (req: Request, res: Response) => {
  try {
    const cierresKiosco = await cierreKioscoService.getCierresKiosco();
    res.status(200).json(cierresKiosco);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCierreKioscoById = async (req: Request, res: Response) => {
  try {
    const cierreKiosco = await cierreKioscoService.getCierreKioscoById(
      req.params.id
    );
    if (cierreKiosco) {
      res.status(200).json(cierreKiosco);
    } else {
      res.status(404).json({ message: "CierreKiosco not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCierreKiosco = async (req: Request, res: Response) => {
  try {
    const updatedCierreKiosco = await cierreKioscoService.updateCierreKiosco(
      req.params.id,
      req.body
    );
    if (updatedCierreKiosco) {
      res.status(200).json(updatedCierreKiosco);
    } else {
      res.status(404).json({ message: "CierreKiosco not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCierreKiosco = async (req: Request, res: Response) => {
  try {
    const deletedCierreKiosco = await cierreKioscoService.deleteCierreKiosco(
      req.params.id
    );
    if (deletedCierreKiosco) {
      res.status(200).json({ message: "CierreKiosco deleted successfully" });
    } else {
      res.status(404).json({ message: "CierreKiosco not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
