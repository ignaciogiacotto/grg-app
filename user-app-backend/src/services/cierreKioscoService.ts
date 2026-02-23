import { CierreKiosco, ICierreKiosco } from "../models/cierreKioscoModel";
import { startOfDay, endOfDay, isFuture } from 'date-fns';

export const createCierreKiosco = async (data: ICierreKiosco) => {
  const dateToUse = data.date ? new Date(data.date) : new Date();

  if (isFuture(dateToUse)) {
    const error = new Error("No se pueden realizar cierres para fechas futuras.");
    (error as any).statusCode = 400;
    throw error;
  }

  const start = startOfDay(dateToUse);
  const end = endOfDay(dateToUse);

  const existingCierre = await CierreKiosco.findOne({
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

  const newCierreKiosco = new CierreKiosco({ ...data, date: dateToUse });
  return await newCierreKiosco.save();
};

export const getCierresKiosco = async () => {
  return await CierreKiosco.find()
    .populate("createdBy", "name username")
    .sort({ date: -1 });
};

export const getCierreKioscoById = async (id: string) => {
  return await CierreKiosco.findById(id).populate("createdBy", "name username");
};

export const updateCierreKiosco = async (id: string, data: any) => {
  return await CierreKiosco.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCierreKiosco = async (id: string) => {
  return await CierreKiosco.findByIdAndDelete(id);
};
