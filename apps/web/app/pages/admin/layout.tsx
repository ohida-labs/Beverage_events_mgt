import type { Route } from "../admin/+types/layout";

import { Outlet } from "react-router";
import { AdminUserMiddleware } from "../../middleware/IsAdmin";
//2. A middleware that checks 'roles' always to prevent attacker from accessing this page;
/*
The setup was confusing;
Due to type safety, authMiddleware will not work if:
1. Route.Middleware type is not from this current route
2. future.v8_middleware is not added to the react.router.config
*/
// eslint-disable-next-line react-refresh/only-export-components
export const middleware: Route.MiddlewareFunction[] = [AdminUserMiddleware];

export default function AdminLayout() {
  return <Outlet />;
}
