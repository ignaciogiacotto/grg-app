import ProviderModel from "../models/providerModel";

export const getProviders = async () => {
  return await ProviderModel.find();
};

export const createProvider = async (day: string) => {
  const newProvider = new ProviderModel({ day, providers: [] });
  return await newProvider.save();
};

export const updateProvider = async (day: string, providers: string[]) => {
  return await ProviderModel.findOneAndUpdate(
    { day },
    { providers },
    { new: true }
  );
};
