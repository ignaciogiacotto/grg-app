import { Request, Response } from "express";
import * as cierrePfService from "../services/cierrePfService";

export const createCierrePf = async (req: Request, res: Response) => {
  try {
    const newCierre = await cierrePfService.createCierrePf(req.body);
    res.status(201).json(newCierre);
  } catch (error) {
    res.status(500).json({ message: "Error creating cierre PF", error });
  }
};

export const getCierresPf = async (req: Request, res: Response) => {
  try {
    const cierres = await cierrePfService.getCierresPf();
    res.json(cierres);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cierres PF", error });
  }
};

export const getCierrePfById = async (req: Request, res: Response) => {
  try {
    const cierre = await cierrePfService.getCierrePfById(req.params.id);
    if (!cierre) {
      return res.status(404).send("Cierre PF not found");
    }
    res.json(cierre);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cierre PF", error });
  }
};

export const updateCierrePf = async (req: Request, res: Response) => {
  try {
    console.log("Data received in updateCierrePf:", req.body);
    const updatedCierre = await cierrePfService.updateCierrePf(
      req.params.id,
      req.body
    );
    if (!updatedCierre) {
      return res.status(404).send("Cierre PF not found");
    }
    res.json(updatedCierre);
  } catch (error) {
    res.status(500).json({ message: "Error updating cierre PF", error });
  }
};

export const deleteCierrePf = async (req: Request, res: Response) => {
  try {
    const deletedCierre = await cierrePfService.deleteCierrePf(req.params.id);
    if (!deletedCierre) {
      return res.status(404).send("Cierre PF not found");
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting cierre PF", error });
  }
};

// Boleta Especial controllers
export const getBoletasEspeciales = async (req: Request, res: Response) => {
    try {
        const boletas = await cierrePfService.getBoletasEspeciales();
        res.json(boletas);
    } catch (error) {
        console.dir(error, { depth: null });
        res.status(500).json({ message: "Error fetching boletas especiales", error });
    }
};

export const createBoletaEspecial = async (req: Request, res: Response) => {
    try {
        const newBoleta = await cierrePfService.createBoletaEspecial(req.body);
        res.status(201).json(newBoleta);
    } catch (error) {
        res.status(500).json({ message: "Error creating boleta especial", error });
    }
};

export const updateBoletaEspecial = async (req: Request, res: Response) => {
    try {
        const updatedBoleta = await cierrePfService.updateBoletaEspecial(req.params.id, req.body);
        if (!updatedBoleta) {
            return res.status(404).send("Boleta especial not found");
        }
        res.json(updatedBoleta);
    } catch (error) {
        res.status(500).json({ message: "Error updating boleta especial", error });
    }
};

export const deleteBoletaEspecial = async (req: Request, res: Response) => {
    try {
        const deletedBoleta = await cierrePfService.deleteBoletaEspecial(req.params.id);
        if (!deletedBoleta) {
            return res.status(404).send("Boleta especial not found");
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error deleting boleta especial", error });
    }
};
