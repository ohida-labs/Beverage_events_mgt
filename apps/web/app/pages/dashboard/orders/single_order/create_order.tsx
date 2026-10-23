//Create Order Detail!
import { redirect, data } from "react-router";
import type { Route } from "./+types/create_order";
import { user_cookie_token } from "../../../../cookies.server";
import EventForm from "../../../../components/EventForm";

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/beverages`);

  if (!response.ok) {
    throw new Response("Failed to load beverages", {
      status: response.status,
    });
  }

  const result = await response.json();

  if (!result.status) {
    throw new Response("Could not retrieve beverages", {
      status: 500,
    });
  }

  return { drinks: result.data };
}

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const event_name = String(formData.get("event_name") ?? "").trim();
  const event_date = String(formData.get("event_date") ?? "");
  const expected_guests = Number(formData.get("expected_guests"));

  let items;

  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return data({ error: "Invalid drink selection." }, { status: 400 });
  }

  if (
    !event_name ||
    !event_date ||
    !Number.isInteger(expected_guests) ||
    expected_guests < 1 ||
    !Array.isArray(items) ||
    items.length === 0 ||
    items.some(
      (item) =>
        !item ||
        typeof item.drink_id !== "string" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1,
    )
  ) {
    return data(
      {
        error:
          "Please provide valid event details and select at least one drink.",
      },
      { status: 400 },
    );
  }

  // Read the JWT from your existing cookie session.
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};
  const token = cookie.token;

  if (!token) {
    return data(
      { error: "Please log in before creating an event." },
      { status: 401 },
    );
  }

  let response: Response;

  try {
    response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        event_name,
        event_date,
        expected_guests,
        items,
      }),
    });
  } catch {
    return data(
      { error: "Unable to connect to the backend. Please try again." },
      { status: 502 },
    );
  }

  const result = await response.json().catch(() => null);
  console.log(result);

  if (!response.ok || !result?.status) {
    return data(
      {
        error:
          result?.error?.message ??
          result?.message ??
          "Failed to create event.",
      },
      { status: response.ok ? 500 : response.status },
    );
  }

  return redirect("/dashboard/events"); // Replace with your actual event listing/details route.
}

export default function CreateNewEventOrderPage({
  loaderData,
}: Route.ComponentProps) {
  return (
    <main className="md:max-w-3xl space-y-4 mx-auto">
      <h3 className="text-h font-medium text-2xl text-center">
        Create a new Event
      </h3>
      <EventForm drinks={loaderData.drinks} />
    </main>
  );
}

/*
import EventForm from "../../../../components/EventForm";
import type { Route } from "./+types/create_order";
import { redirect } from "react-router";
// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }: Route.ActionArgs) {
  //Create new Event
  //const formData = await request.formData();

  //const customerName = formData.get("customer_name");
  // const quantity = formData.get("quantity");

  //Make http request here!
  console.log(request.method);
  return redirect(`/orders/12112`);
}

export default function CreateNewEventOrderPage() {
  return (
    <main className="md:max-w-3xl space-y-4 mx-auto">
      <h3 className="text-h font-medium text-2xl text-center">
        Create a new Event
      </h3>
      <EventForm />
    </main>
  );
}
*/
