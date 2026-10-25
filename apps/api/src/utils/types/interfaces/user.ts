export interface IUser {
  user_id: string;
  email: string;
  password_hash: string;
  role: string;
  profile_image_url?: string;
  first_name: string;
  last_name?: string;
  blacklisted: boolean;
  blacklisted_reason: string;
  phone_number: string;
  is_active?: boolean;

  country: string;
  updated_at: Date;
  created_at: Date;
}

export interface IUpdateUser {
  role?: string;
  profile_image_url?: string;
  country?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  blacklisted?: boolean;
  password_hash?: string;
  is_active?: boolean;

  blacklisted_reason?: string;
}

export interface IFilterUser {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "first_name" | "last_name" | "email" | "created_at" | null;
  sortOrder?: "asc" | "desc" | null;
  role?: "default" | "super_admin" | "admin" | null;
}
