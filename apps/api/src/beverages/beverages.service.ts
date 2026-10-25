import {
  CreateBeverage,
  GetAllBeverages,
  GetAvailableBeverages,
  UpdateBeverage,
  GetBeverageById,
} from "./repository/beverages.repository";

export const GetAvailableBeveragesService = async () => {
  const beverages = await GetAvailableBeverages();

  return { beverages };
};

//admin only
export const GetAllBeveragesService = async (filters: BeverageFilters) => {
  const result = await GetAllBeverages(filters);

  if (!result) {
    throw new Error("Failed to retrieve beverages.");
  }

  return {
    beverages: result.beverages,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / filters.limit),
    },
  };
};

interface CreateBeverageInput {
  name: string;
  image_url?: string | null;
  price: number;
  created_by: string;
}

export const CreateBeverageService = async (input: CreateBeverageInput) => {
  const name = input.name.trim();

  if (!name) {
    throw new Error("Beverage name is required.");
  }

  if (
    !Number.isFinite(input.price) ||
    input.price <= 0 ||
    !Number.isSafeInteger(Math.round(input.price * 100))
  ) {
    throw new Error("Enter a valid price greater than zero.");
  }

  const beverage = await CreateBeverage({
    name,
    image_url: input.image_url?.trim() || null,
    price_minor_units: Math.round(input.price * 100),
    created_by: input.created_by,
  });

  if (!beverage) {
    throw new Error("Failed to create beverage.");
  }

  return { beverage };
};

//Update drink

interface UpdateBeverageInput {
  name?: string;
  image_url?: string | null;
  price?: number;
  is_available?: boolean;
}

export const UpdateBeverageService = async (
  drinkId: string,
  input: UpdateBeverageInput,
) => {
  const updates: {
    name?: string;
    image_url?: string | null;
    price_minor_units?: number;
    is_available?: boolean;
  } = {};

  if (input.name !== undefined) {
    if (typeof input.name !== "string" || !input.name.trim()) {
      throw new Error("Beverage name cannot be empty.");
    }

    updates.name = input.name.trim();
  }

  if (input.image_url !== undefined) {
    if (
      input.image_url !== null &&
      (typeof input.image_url !== "string" ||
        !URL.canParse(input.image_url) ||
        !["http:", "https:"].includes(new URL(input.image_url).protocol))
    ) {
      throw new Error("Image URL must be a valid HTTP or HTTPS URL.");
    }

    updates.image_url =
      typeof input.image_url === "string"
        ? input.image_url.trim() || null
        : null;
  }

  if (input.price !== undefined) {
    if (
      typeof input.price !== "number" ||
      !Number.isFinite(input.price) ||
      input.price <= 0 ||
      !Number.isSafeInteger(Math.round(input.price * 100))
    ) {
      throw new Error("Enter a valid price greater than zero.");
    }

    updates.price_minor_units = Math.round(input.price * 100);
  }

  if (input.is_available !== undefined) {
    if (typeof input.is_available !== "boolean") {
      throw new Error("Availability must be true or false.");
    }

    updates.is_available = input.is_available;
  }

  if (Object.keys(updates).length === 0) {
    throw new Error("Provide at least one field to update.");
  }

  const beverage = await UpdateBeverage(drinkId, updates);

  if (!beverage) {
    throw new Error("Beverage not found.");
  }

  return { beverage };
};

//gET SINLGE bEVERAGE SERVICE

export const GetBeverageByIdService = async (drinkId: string) => {
  const beverage = await GetBeverageById(drinkId);

  if (!beverage) {
    throw new Error("Beverage not found.");
  }

  return { beverage };
};
