export interface BeverageFilters {
  page: number;
  limit: number;
  search: string;
  availability: boolean | null;
}

export interface CreateBeverageInput {
  name: string;
  image_url: string | null;
  price_minor_units: number;
  created_by: string;
}

export interface UpdateBeverageInput {
  name?: string;
  image_url?: string | null;
  price_minor_units?: number;
  is_available?: boolean;
}
