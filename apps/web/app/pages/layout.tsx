import { Outlet, useLoaderData } from "react-router";
import { AuthUserContext } from "../context";
import { OptionalAuthMiddleware } from "../middleware/auth";
import type { Route } from "../+types/root";
import NavigationBar from "../components/Navbar";
//import { OptionalAuthMiddleware } from "../middleware/auth.server";
//import NavigationBar from "../components/NavigationBar";

// eslint-disable-next-line react-refresh/only-export-components
export const middleware = [OptionalAuthMiddleware];

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ context }: Route.LoaderArgs) {
  return {
    user: context.get(AuthUserContext),
  };
}

export default function AppLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <NavigationBar user={user} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
