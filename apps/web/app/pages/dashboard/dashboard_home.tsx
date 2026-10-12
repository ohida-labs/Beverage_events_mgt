import { user_cookie_token } from "../../cookies.server";
import { data } from "react-router";
import type { Route } from "./+types/dashboard_home";
import LastestActiveOrder from "../../components/LatestActiveOrder";
import DraftsOrderList from "../../components/DraftOrders";
import { AuthUserContext } from "../../context";
//import { GetDraftedEventOrders } from "../../lib/events.server";
//import { GetLatestPendingEventOrder } from "../../lib/events.server";

/* eslint-disable react-refresh/only-export-components */

export async function loader({ request, context }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const token = cookie?.token;

  //run http request
  //const active_eent = await GetLatestPendingEventOrder(token);
  // const draft_events = await GetDraftedEventOrders(token);
  const user = context.get(AuthUserContext);

  return data({
    user,
    active_event: {
      id: "#ADSEDAED",
      name: "Oroma birthday Party",
      total: 45000,
      //status: 'pending',

      drinks: [
        {
          id: "1",
          name: "Beer",
          crate_quantity: 22232,
          quantity: 67,
          price: 1900,
        },
        {
          id: "2",
          name: "Beer",
          crate_quantity: 22232,
          quantity: 67,
          price: 1900,
        },
        {
          id: "3",
          name: "Beer",
          crate_quantity: 22232,
          quantity: 67,
          price: 1900,
        },
        {
          id: "4",
          name: "Beer",
          crate_quantity: 22232,
          quantity: 67,
          price: 1900,
        },
        {
          id: "5",
          name: "Beer",
          crate_quantity: 22232,
          quantity: 67,
          price: 1900,
        },
      ],
    },
    draft_events: [
      {
        id: "ORD-12",
        name: "BOBO PARTY",
        total: 56000,
        status: "draft",
      },
      {
        id: "ORD-14",
        name: "Jake birthday PARTY",
        total: 23000,
        status: "draft",
      },
    ],
  });
  //return data({ event, user, ,  });
}

export default function DashboardHomeView({
  loaderData,
}: Route.ComponentProps) {
  //const { user, active_event, draft_events }  = loaderData;
  const { active_event, draft_events } = loaderData;

  /*
  if (user?.error) {
    return <p> An error Occured!</p>;
  }
*/

  return (
    <main className="md:max-w-160 shadow space-y-6  p-4 md:mx-auto">
      <div className="card space-y-6 rounded w-full flex flex-col">
        <div>
          <h2 className="text-xl font-bold">Good afternoon, Daniel</h2>
          <p className="text-xs text-muted">
            Welcome to Guiness. Make order of drinks for your event
          </p>
        </div>
        <button className="submit_button md:w-fit  w-full justify-center transition px-3 py-4 md:py-1 rounded-full text-[0.85rem]">
          Place an Order
        </button>
      </div>
      <LastestActiveOrder event={active_event} />
      <DraftsOrderList events={draft_events} />
    </main>
  );
}
