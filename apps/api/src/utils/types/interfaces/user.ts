export interface IUser {
  user_id: string;
  email: string;
  password: string;
  role: string;
  profile: string;
  first_name: string;
  last_name?: string;
  priority: number;
  blacklisted: boolean;
  blacklisted_reason: string;
  phone_number: string;
  country: string;
  updated_at: Date;
  created_at: Date;
}

export interface IUpdateUser {
  role?: string;
  priority?: number;
  profile?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  blacklisted?: boolean;
  blacklisted_reason?: string;
}
