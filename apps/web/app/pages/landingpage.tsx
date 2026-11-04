/* eslint-disable react-refresh/only-export-components */
//import type { Route } from "../+types/root";
//import SignOutButton from "../components/SignOut";

//Load all beverages HERE!
/*export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};
  return cookie?.token;
}
 */
/*
export async function action() {
  return redirect("/", {
    headers: {
      "Set-Cookie": await user_cookie_token.serialize(
        {},
        {
          expires: new Date(0),
        },
      ),
    },
  });
}
  */
export default function Landingpage() {
  return (
    <main>
      <p>This is guiness booking consumer platform!</p>
    </main>
  );
}
