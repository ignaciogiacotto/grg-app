import CierrePfModel, { ICierrePf } from "../models/cierrePfModel";
import BoletaEspecialModel, { IBoletaEspecialDB } from "../models/boletaEspecialModel";

// Cierre PF services
export const createCierrePf = async (cierreData: ICierrePf) => {
  const newCierre = new CierrePfModel(cierreData);
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
  return await BoletaEspecialModel.find();
};

export const createBoletaEspecial = async (boletaData: IBoletaEspecialDB) => {
    const newBoleta = new BoletaEspecialModel(boletaData);
    return await newBoleta.save();
};

export const updateBoletaEspecial = async (id: string, boletaData: IBoletaEspecialDB) => {
    return await BoletaEspecialModel.findByIdAndUpdate(id, boletaData, { new: true });
};

export const deleteBoletaEspecial = async (id: string) => {
    return await BoletaEspecialModel.findByIdAndDelete(id);
};
