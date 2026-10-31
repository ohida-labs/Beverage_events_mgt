//Middleware: user login
import { createContext } from "react-router";

type UserIdWithRoleOnly = {
  user_id: string;
  role: string;
};

export const AuthUserContext = createContext<UserIdWithRoleOnly | null>(null);
