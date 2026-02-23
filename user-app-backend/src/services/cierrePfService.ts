import CierrePfModel, { ICierrePf } from "../models/cierrePfModel";
import BoletaEspecialModel, { IBoletaEspecialDB } from "../models/boletaEspecialModel";
import { startOfDay, endOfDay, isFuture } from 'date-fns';

// Cierre PF services
export const createCierrePf = async (cierreData: ICierrePf) => {
  const dateToUse = cierreData.date ? new Date(cierreData.date) : new Date();
  
  if (isFuture(dateToUse)) {
    const error = new Error("No se pueden realizar cierres para fechas futuras.");
    (error as any).statusCode = 400;
    throw error;
  }

  const start = startOfDay(dateToUse);
  const end = endOfDay(dateToUse);

  const existingCierre = await CierrePfModel.findOne({
    date: {
      $gte: start,
      $lte: end,
    },
  });

  if (existingCierre) {
    const error = new Error("Ya existe un cierre para esta fecha.");
    (error as any).statusCode = 409;
    throw error;
  }

  const newCierre = new CierrePfModel({ ...cierreData, date: dateToUse });
  return await newCierre.save();
};

export const getCierresPf = async () => {
  return await CierrePfModel.find().sort({ date: -1 });
};

export const getCierrePfById = async (id: string) => {
  return await CierrePfModel.findById(id);
};

export const updateCierrePf = async (id: string, cierreData: ICierrePf) => {
  return await CierrePfModel.findByIdAndUpdate(id, cierreData, { new: true });
};

export const deleteCierrePf = async (id: string) => {
  return await CierrePfModel.findByIdAndDelete(id);
};

// Boleta Especial services
export const getBoletasEspeciales = async () => {
  return await BoletaEspecialModel.find().sort({ order: 1, name: 1 });
};

export const createBoletaEspecial = async (boletaData: Partial<IBoletaEspecialDB>) => {
    const newBoleta = new BoletaEspecialModel(boletaData);
    return await newBoleta.save();
};

export const updateBoletaEspecial = async (id: string, boletaData: Partial<IBoletaEspecialDB>) => {
    return await BoletaEspecialModel.findByIdAndUpdate(id, boletaData, { new: true });
};

export const deleteBoletaEspecial = async (id: string) => {
    return await BoletaEspecialModel.findByIdAndDelete(id);
};
