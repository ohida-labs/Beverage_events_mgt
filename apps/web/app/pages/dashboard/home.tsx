import { user_cookie_token } from "../../cookies.server";
import { data } from "react-router";
import type { Route } from "./+types/home";

//import { AuthUserContext } from "../../context";
/* eslint-disable react-refresh/only-export-components */
/*export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(AuthUserContext);
  return user;
}*/

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};
  const token = cookie?.token;

  //run http request
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const res = await response.json();

  //NOT VALID
  if (!res.status) {
    return data(
      { error: res?.error?.message },
      { status: res?.error?.statusCode },
    );
  }

  return data(res.data);
}

export default function DashboardHomeView({
  loaderData,
}: Route.ComponentProps) {
  const user = loaderData;
  return <div></div>;
}
