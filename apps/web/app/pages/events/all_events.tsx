//import OrderListDisplay from "../../../components/EventOrderListDisplay";
//import { useLoaderData } from "react-router";
import { user_cookie_token } from "../../cookies.server";
import { data, Link } from "react-router";
import type { Route } from "./+types/all_events";

//import { GetUserEventOrders } from "../../../lib/events.server";
//import TotalPagination from "../../../components/PaginateComponent";
//import SearchInput from "../../../ui/SearchInput";
//import { SelectForm } from "../../../ui/select";

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

export default function EventsPage({ loaderData }: Route.ComponentProps) {
  const events = loaderData.events as EventItem[];
  const role = loaderData.role as string;
  const isManager = role === "admin" || role === "booking_manager";

  return (
    <main className="space-y-6 card mx-auto max-w-4xl">
      <div className="border-b-2 p-4">
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
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Event</th>
              <th className="px-5 py-3 font-medium">Guests</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Event Date</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {events.map((event) => (
              <tr key={event.event_id}>
                <td className="px-5 py-4 md:w-45 ">
                  <h2 className="font-semibold ">
                    <Link to={event.event_id}>{event.event_name}</Link>
                  </h2>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-gray-500">
                    {event.expected_guests}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm text-gray-500">{event.status}</p>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                  <p className="text-sm text-gray-500">
                    {new Date(event.event_date).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <Link
                    to={`/events/${event.event_id}`}
                    className="font-medium text-secondary hover:text-secondary90"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
