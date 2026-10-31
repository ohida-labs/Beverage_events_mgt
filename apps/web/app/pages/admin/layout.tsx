import { RequireAuthMiddleware } from "../../middleware/auth";
import { Outlet } from "react-router";
//2. A middleware that checks 'roles' always to prevent attacker from accessing this page;
/*
The setup was confusing;
Due to type safety, authMiddleware will not work if:
1. Route.Middleware type is not from this current route
2. future.v8_middleware is not added to the react.router.config
*/

// eslint-disable-next-line react-refresh/only-export-components
export const middleware = [RequireAuthMiddleware];

export default function AdminLayout() {
  return (
    <div className="card max-w-6xl shadow-highlight mx-auto h-auto">
      <Outlet />
    </div>
  );
}
