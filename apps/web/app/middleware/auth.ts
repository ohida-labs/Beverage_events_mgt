import { redirect } from "react-router";
import { AuthUserContext } from "../context";
import { user_cookie_token } from "../cookies.server";
import type { Route } from "../pages/dashboard/+types/dashboard_layout";

export const DefaultUserMiddleware: Route.MiddlewareFunction = async function (
  { request, context },
  next,
) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};
  const token = cookie?.token;

  if (!token) {
    throw redirect("/login");
  }

  //run http request
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

  //NOT VALID
  if (!res.status) {
    throw redirect(`/login?reason=${res?.error?.message}`);
  }

  context.set(AuthUserContext, res.data);

  return next();
};
