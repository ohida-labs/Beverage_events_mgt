import { Outlet } from "react-router";
//import type { Route } from "./+types/dashboard_layout";
//A middleware that checks 'roles' always to prevent attacker from accessing this page;
/*
The setup was confusing;
Due to type safety, authMiddleware will not work if:
1. Route.Middleware type is not from this current route
2. future.v8_middleware is not added to the react.router.config
*/
//export const middleware: Route.MiddlewareFunction[] = [DefaultUserMiddleware];
export default function DashbordLayoutPage() {
  return <Outlet />;
}
