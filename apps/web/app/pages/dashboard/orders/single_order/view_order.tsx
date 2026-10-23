import SingleEventOrder from "../../../../components/SingleEventDetail";
import { user_cookie_token } from "../../../../cookies.server";
//import { GetSingleUserEventOrder } from "../../../../lib/events.server";
import type { Route } from "./+types/view_order";
import { data } from "react-router";

//View Order Detail!
/*
export async function loader({ request, params }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};
  const token = cookie?.token;
  const event = await GetSingleUserEventOrder(token, params.order_id);
  return event;
}
*/

type Drink = {
  drink_id: string;
  name: string;
  image_url: string | null;
  quantity: number;
  unit_price_minor_units: number;
};

export type EventOrder = {
  event_id: string;
  event_name: string;
  event_date: string;
  expected_guests: number;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "assigned"
    | "in_progress"
    | "completed"
    | "cancelled";
  rejection_reason: string | null;
  drinks: Drink[];
};

type EventApiResponse = {
  status: boolean;
  data: {
    event: EventOrder;
  };
  error?: {
    message?: string;
  };
};

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request, params }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};

  if (!cookie.token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  // Use the parameter name defined by your actual route.
  const eventId = params.event_id;

  if (!eventId) {
    throw new Response("Event ID is missing", { status: 400 });
  }

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}`,
    {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    },
  );

  const result: EventApiResponse = await response.json();

  if (!response.ok || !result.status) {
    throw data(
      {
        error: result.error?.message ?? "Failed to load event details.",
      },
      { status: response.status },
    );
  }

  return { event: result.data.event };
}

export default function ViewSingleOrderPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <main>
      <SingleEventOrder event={loaderData.event} />
    </main>
  );
}
