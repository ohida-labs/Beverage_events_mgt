//import OrderListDisplay from "../../../components/EventOrderListDisplay";
//import { useLoaderData } from "react-router";
import type { Route } from "./+types/orders_list";
import { user_cookie_token } from "../../../cookies.server";
import { data, Link } from "react-router";
//import { GetUserEventOrders } from "../../../lib/events.server";
//import TotalPagination from "../../../components/PaginateComponent";
//import SearchInput from "../../../ui/SearchInput";
//import { SelectForm } from "../../../ui/select";

/*export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};
  const token = cookie?.token;
  
  //run http request
  const events = await GetUserEventOrders(token);

  return { events };
  }
  */

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};

  if (!cookie?.token) {
    throw new Response("You must log in to view your events.", {
      status: 401,
    });
  }

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events`, {
    headers: {
      Authorization: `Bearer ${cookie.token}`,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.status) {
    throw data(
      {
        error: result.error?.message || "Failed to load your events.",
      },
      { status: response.status },
    );
  }

  return {
    events: result.data.events ?? [],
    role: result.data.role,
  };
}

//Orders list!
type EventItem = {
  event_id: string;
  event_name: string;
  event_date: string;
  expected_guests: number;
  status: string;
};

export default function OrdersPage({ loaderData }: Route.ComponentProps) {
  const events = loaderData.events as EventItem[];
  const role = loaderData.role as string;
  const isManager = role === "admin" || role === "booking_manager";

  console.log(events);
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {isManager ? "All Events" : "My Events"}
        </h1>

        <p className="text-sm text-gray-500">
          {isManager
            ? "Review and manage customer event requests."
            : "View and track your event requests."}
        </p>
      </div>

      {events.length === 0 ? (
        <section className="card space-y-3">
          <h2 className="font-medium">No events yet</h2>
          <p className="text-sm text-gray-500">
            {isManager
              ? "Customer event requests will appear here."
              : "Your event requests will appear here after you create one."}
          </p>

          {!isManager && (
            <Link
              to="/dashboard/orders/single_order/create_order"
              className="submit_button inline-block"
            >
              Create an event
            </Link>
          )}
        </section>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <article
              key={event.event_id}
              className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <h2 className="font-semibold">
                  <Link to={event.event_id}>{event.event_name}</Link>
                </h2>

                <p className="text-sm text-gray-500">
                  {new Date(event.event_date).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                <p className="text-sm text-gray-500">
                  {event.expected_guests} expected guests
                </p>
              </div>

              <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm capitalize text-gray-700">
                {event.status.replaceAll("_", " ")}
              </span>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

{
  /*
<main className="md:max-w-[80%] shadow space-y-6  p-4 md:mx-auto">
      <div>
         Header and Create Button 
         <div className="flex flex-wrap gap-y-6 card justify-between">
         <div className="px-4">
         <h2 className="text-2xl font-medium">Events</h2>
         <p className="text-muted text-xs">
         All your Event Order in one place.
         </p>
          </div>
         */
}
{
  /* 

          <button className="submit_button md:w-fit  w-full justify-center transition px-3 py-4 md:py-1 rounded-full text-[0.85rem]">
            Create new order
          </button>
        </div>
            */
}
{
  /* 
        <div className="flex mt-10 max-w-full">
          <SearchInput
            className="grow max-w-[75%]"
            placeholder="Search for Event"
          />
             <article className="flex">
            <SelectForm
              className="w-fit"
              field="td"
              onChangeValue={() => {}}
              title="Filter"
              items={[{ id: "least", name: "Least Favourite" }]}
            />
            <SelectForm
              className="w-fit"
              field="td"
              onChangeValue={() => {}}
              title="Sort"
              items={[{ id: "least", name: "Least Favourite" }]}
            />
          </article> 
        </div>
        */
}
{
  /*  </div> */
}

{
  /*
<OrderListDisplay events={events} />
 <TotalPagination /> 
</main>
 */
}
