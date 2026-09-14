import OrderListDisplay from "../../../components/EventOrderListDisplay";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/orders_list";
import { user_cookie_token } from "../../../cookies.server";
import { GetUserEventOrders } from "../../../lib/events.server";

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};
  const token = cookie?.token;

  //run http request
  const events = await GetUserEventOrders(token);
  //const active_eent = await GetLatestPendingEventOrder(token);
  //const user = context.get(AuthUserContext);

  return { events };
}

//Orders list!
export default function OrdersPage() {
  const { events } = useLoaderData<typeof loader>();

  return (
    <main className="md:max-w-[80%] shadow space-y-6  p-4 md:mx-auto">
      <div className="flex card justify-between">
        <div className="px-4">
          <h2 className="text-2xl font-medium">Events</h2>
          <p className="text-muted text-xs">
            All your Event Order in one place.
          </p>
        </div>

        <button className="submit_button space-x-2 cursor-pointer">
          Create new order
          {/* 
            <FontAwesomeIcon className="text-primary " icon={faInfoCircle} />
         */}
        </button>
      </div>

      <OrderListDisplay events={events} />
    </main>
  );
}
