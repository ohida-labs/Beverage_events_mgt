import { AuthUserContext } from "../context";
import { user_cookie_token } from "../cookies.server";
import { redirect } from "react-router";
import type { Route } from "../pages/admin/+types/layout";
//TODO: REFACTOR THIS CODE
export const AdminUserMiddleware: Route.MiddlewareFunction = async function (
  { request, context },
  next,
) {
  //Get Token
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};
  const token = cookie?.token;

  //Not available: Go to Login
  if (!token) {
    throw redirect("/login");
  }

  //Change token to user info
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/auth/authorized`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const res = await response.json();

  //Invalid Token
  if (!res.status) {
    throw redirect(`/login?reason=${res?.error?.message}`);
  }

  if (res.data.role === "default") {
    return redirect(`/dashboard`);
  }
  //Save the user context
  context.set(AuthUserContext, res.data);

  //Check paths
  return next();
};
