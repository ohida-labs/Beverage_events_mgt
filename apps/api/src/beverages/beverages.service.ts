import { GetAvailableBeverages } from "./repository/beverages.repository";

export const GetAvailableBeveragesService = async () => {
  const beverages = await GetAvailableBeverages();

  return { beverages };
};
