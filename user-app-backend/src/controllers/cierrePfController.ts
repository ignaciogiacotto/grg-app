import { Request, Response } from "express";
import * as cierrePfService from "../services/cierrePfService";
import logger from "../config/logger";

export const createCierrePf = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const createdBy = req.user?._id;
    const newCierre = await cierrePfService.createCierrePf({
      ...req.body,
      createdBy,
    });
    res.status(201).json(newCierre);
  } catch (error: any) {
    logger.error("Error creating cierre PF:", error);
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Error creating cierre PF" 
    });
  }
};

export const getCierresPf = async (req: Request, res: Response) => {
  try {
    const cierres = await cierrePfService.getCierresPf();
    res.json(cierres);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching cierres PF" });
  }
};

export const getCierrePfById = async (req: Request, res: Response) => {
  try {
    const cierre = await cierrePfService.getCierrePfById(req.params.id);
    if (!cierre) {
      return res.status(404).json({ message: "Cierre PF not found" });
    }
    res.json(cierre);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching cierre PF" });
  }
};

export const updateCierrePf = async (req: Request, res: Response) => {
  try {
    const updatedCierre = await cierrePfService.updateCierrePf(
      req.params.id,
      req.body
    );
    if (!updatedCierre) {
      return res.status(404).json({ message: "Cierre PF not found" });
    }
    res.json(updatedCierre);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Error updating cierre PF" 
    });
  }
};

export const deleteCierrePf = async (req: Request, res: Response) => {
  try {
    const deletedCierre = await cierrePfService.deleteCierrePf(req.params.id);
    if (!deletedCierre) {
      return res.status(404).json({ message: "Cierre PF not found" });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting cierre PF" });
  }
};

// Boleta Especial controllers
export const getBoletasEspeciales = async (req: Request, res: Response) => {
    try {
        const boletas = await cierrePfService.getBoletasEspeciales();
        res.json(boletas);
    } catch (error) {
        res.status(500).json({ message: "Error fetching boletas especiales" });
    }
};

export const createBoletaEspecial = async (req: Request, res: Response) => {
    try {
        const newBoleta = await cierrePfService.createBoletaEspecial(req.body);
        res.status(201).json(newBoleta);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ 
          message: error.message || "Error creating boleta especial" 
        });
    }
};

export const updateBoletaEspecial = async (req: Request, res: Response) => {
    try {
        const updatedBoleta = await cierrePfService.updateBoletaEspecial(req.params.id, req.body);
        if (!updatedBoleta) {
            return res.status(404).json({ message: "Boleta especial not found" });
        }
        res.json(updatedBoleta);
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ 
          message: error.message || "Error updating boleta especial" 
        });
    }
};

export const deleteBoletaEspecial = async (req: Request, res: Response) => {
    try {
        const deletedBoleta = await cierrePfService.deleteBoletaEspecial(req.params.id);
        if (!deletedBoleta) {
            return res.status(404).json({ message: "Boleta especial not found" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error deleting boleta especial" });
    }
};
