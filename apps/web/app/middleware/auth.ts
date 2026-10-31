import { redirect } from "react-router";
import { AuthUserContext } from "../context";
import { user_cookie_token } from "../cookies.server";
import type { Route } from "../+types/root";

export const OptionalAuthMiddleware: Route.MiddlewareFunction = async function (
  { request, context },
  next,
) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};
  const token = cookie?.token;

  if (!token) {
    context.set(AuthUserContext, null);
    return next();
  }

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/auth/authorized`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const res = await response.json();

  if (!response.ok || !res.status) {
    context.set(AuthUserContext, null);
    return next();
  }

  context.set(AuthUserContext, res.data);

  return next();
};

export const RequireAuthMiddleware: Route.MiddlewareFunction = async function (
  { context },
  next,
) {
  const user = context.get(AuthUserContext);

  if (!user) {
    throw redirect("/login");
  }

  return next();
};
