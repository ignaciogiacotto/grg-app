import CierrePfModel, { ICierrePf } from "../models/cierrePfModel";

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
