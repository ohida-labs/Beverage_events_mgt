//Run middleware auth for user with default role!
import { Outlet } from "react-router";
import { DefaultUserMiddleware } from "../../middleware/auth";
import type { Route } from "./+types/dashboard_layout";

/*
The setup was confusing;
Due to type safety, authMiddleware will not work if:
1. Route.Middleware type is not from this current route
2. future.v8_middleware is not added to the react.router.config
*/

// eslint-disable-next-line react-refresh/only-export-components
export const middleware: Route.MiddlewareFunction[] = [DefaultUserMiddleware];
export default function DashbordLayoutPage() {
  return <Outlet />;
}
