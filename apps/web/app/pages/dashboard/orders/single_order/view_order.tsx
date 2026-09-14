import SingleEventOrder from "../../../../components/SingleEventDetail";
import { user_cookie_token } from "../../../../cookies.server";
import { GetSingleUserEventOrder } from "../../../../lib/events.server";
import type { Route } from "./+types/view_order";
import { useLoaderData } from "react-router";

//View Order Detail!
// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request, params }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};
  const token = cookie?.token;
  const event = await GetSingleUserEventOrder(token, params.order_id);
  return event;
}

export default function ViewSingleOrderPage() {
  const event_order = useLoaderData<typeof loader>();
  return (
    <main>
      <SingleEventOrder event={event_order} />
    </main>
  );
}
