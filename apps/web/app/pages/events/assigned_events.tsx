import { data, useFetcher } from "react-router";
import type { Route } from "./+types/assigned_events";
import { user_cookie_token } from "../../cookies.server";

type EventItem = {
  event_id: string;
  event_name: string;
  event_date: string;
  expected_guests: number;
  status: "assigned" | "in_progress" | "completed";
  first_name?: string;
  email?: string;
};

type EventsResponse = {
  status: boolean;
  data: {
    events: EventItem[];
    role: string;
  };
  error?: { message?: string };
};

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};

  if (!cookie.token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/events`, {
    headers: {
      Authorization: `Bearer ${cookie.token}`,
    },
  });

  const result: EventsResponse = await response.json();

  if (!response.ok || !result.status) {
    throw data(
      {
        error: result.error?.message ?? "Failed to load assigned events.",
      },
      { status: response.status },
    );
  }

  if (result.data.role !== "distribution_staff") {
    throw new Response("Forbidden", { status: 403 });
  }

  return { events: result.data.events ?? [] };
}

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }: Route.ActionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};

  if (!cookie.token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const eventId = String(formData.get("event_id") || "");
  const status = String(formData.get("status") || "");

  if (!eventId || (status !== "in_progress" && status !== "completed")) {
    return data({ error: "Invalid event update." }, { status: 400 });
  }

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${cookie.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
  );

  const result = await response.json();

  if (!response.ok || !result.status) {
    return data(
      {
        error: result.error?.message || "Failed to update event status.",
      },
      { status: response.status },
    );
  }

  return { success: true };
}

export default function DistributionEventsPage({
  loaderData,
}: Route.ComponentProps) {
  const { events } = loaderData;
  const fetcher = useFetcher<typeof action>();
  const isUpdating = fetcher.state !== "idle";

  return (
    <main className="max-w-3xl mx-auto space-y-6">
      <header className="flex flex-wrap gap-y-4 justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Assigned Events</h1>
          <p className="text-sm text-gray-500">
            View your assigned events and track fulfilment.
          </p>
        </div>
        <button>Filter</button>
      </header>

      {events.length === 0 ? (
        <section className="card space-y-2">
          <h2 className="font-medium">No assigned events yet</h2>
          <p className="text-sm text-gray-500">
            Events assigned to you by the booking manager will appear here.
          </p>
        </section>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <article key={event.event_id} className="card mx-auto space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-semibold capitalize">{event.event_name}</h2>

                <span className="w-fit rounded-full bg-secondary/10 px-3 py-1 text-sm capitalize text-secondary">
                  {event.status.replaceAll("_", " ")}
                </span>
              </div>

              <div className="space-y-1 text-sm text-gray-500">
                <p>
                  <span>Date of Event: </span>
                  <span className="font-medium">
                    {new Date(event.event_date).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </p>
                <p>
                  <span>{event.expected_guests.toLocaleString()}</span> expected
                  guests
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`/events/${event.event_id}`}
                  className="
                bg-primary/50 block h-auto border-2 py-2 px-3
                text-primary"
                >
                  View more
                </a>

                {event.status === "assigned" && (
                  <fetcher.Form method="post">
                    <input
                      type="hidden"
                      name="event_id"
                      value={event.event_id}
                    />
                    <input type="hidden" name="status" value="in_progress" />
                    <button
                      type="submit"
                      className="submit_button cursor-pointer py-2 px-3 font-bold rounded-none"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Start fulfilment"}
                    </button>
                  </fetcher.Form>
                )}

                {event.status === "in_progress" && (
                  <fetcher.Form method="post">
                    <input
                      type="hidden"
                      name="event_id"
                      value={event.event_id}
                    />
                    <input type="hidden" name="status" value="completed" />
                    <button
                      type="submit"
                      className="submit_button cursor-pointer py-2 px-3 font-bold bg-secondary rounded-none"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Mark as completed"}
                    </button>
                  </fetcher.Form>
                )}
              </div>

              {fetcher.data &&
                "error" in fetcher.data &&
                fetcher.data.error && (
                  <p className="text-sm text-red-600" role="alert">
                    {fetcher.data.error}
                  </p>
                )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
