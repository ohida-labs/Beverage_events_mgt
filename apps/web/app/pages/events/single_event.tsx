import SingleEventOrder from "../../components/SingleEventDetail";
import { user_cookie_token } from "../../cookies.server";
//import { GetSingleUserEventOrder } from "../../../../lib/events.server";
import type { Route } from "./+types/single_event";
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
    role: string;
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
    `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}?user_id=2c4ec3e8-ec43-4e43-98eb-3beecfdb9e78`,
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

  return {
    event: result.data.event,
    role: result.data.role,
  };
}

//For Booking MANGER ONLY
// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request, params }: Route.ActionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};

  if (!cookie.token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const eventId = params.event_id;
  const formData = await request.formData();

  const actionType = formData.get("action");
  const updates: Record<string, string> = {};

  if (actionType === "approve") {
    updates.status = "approved";
  } else if (actionType === "reject") {
    const reason = String(formData.get("rejection_reason") || "").trim();

    if (!reason) {
      return data({ error: "Enter a rejection reason." }, { status: 400 });
    }

    updates.status = "rejected";
    updates.rejection_reason = reason;
  } else if (actionType === "assign") {
    const staffId = String(formData.get("handled_by") || "").trim();

    if (!staffId) {
      return data(
        { error: "Enter a distribution staff user ID." },
        { status: 400 },
      );
    }

    updates.status = "assigned";
    updates.handled_by = staffId;
  } else {
    return data({ error: "Invalid event action." }, { status: 400 });
  }

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${cookie.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    },
  );

  const result = await response.json();

  if (!response.ok || !result.status) {
    return data(
      { error: result.error?.message || "Failed to update event." },
      { status: response.status },
    );
  }

  return data({ success: true });
}

export default function ViewSingleOrderPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <main>
      <SingleEventOrder event={loaderData.event} role={loaderData.role} />
    </main>
  );
}
