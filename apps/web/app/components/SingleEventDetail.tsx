/*type Drink = {
  drink_id: string;
  name: string;
  logo: string;
  crate_size: number;
  quantity: number;
};

type EventOrder = {
  event_id: string;
  name: string;
  total: number;
  status: string;
  event_date?: Date;
  expected_guests?: number;
  drinks?: Drink[];
};
*/
import { useFetcher } from "react-router";
type Drink = {
  drink_id: string;
  name: string;
  image_url: string | null;
  quantity: number;
  unit_price_minor_units: number;
};

type EventOrder = {
  event_id: string;
  event_name: string;
  total?: number;
  status: string;
  event_date: string;
  expected_guests: number;
  rejection_reason: string | null;
  drinks: Drink[];
};

export default function EventPage({
  event,
  role,
}: {
  event: EventOrder;
  role: string;
}) {
  const fetcher = useFetcher();
  const isManager = role === "admin" || role === "booking_manager";

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center  justify-between">
        <div>
          <p className="text-lg text-gray-500">Event Detail</p>
          <h1 className="text-2xl font-semibold">{event.event_name}</h1>
        </div>
        <StatusBadge state={event.status} />
      </div>

      {isManager && (
        <div className="mt-6 space-y-4 border-t pt-5">
          <h3 className="font-semibold">Manage event</h3>

          {event.status === "pending" && (
            <>
              <fetcher.Form method="post">
                <input type="hidden" name="action" value="approve" />
                <button className="submit_button w-full" type="submit">
                  Approve event
                </button>
              </fetcher.Form>

              <fetcher.Form method="post" className="space-y-2">
                <input type="hidden" name="action" value="reject" />
                <textarea
                  name="rejection_reason"
                  required
                  placeholder="Reason for rejection"
                  className="w-full rounded-lg border p-3"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-red-600 px-4 py-2 text-white"
                >
                  Reject event
                </button>
              </fetcher.Form>
            </>
          )}

          {["approved", "assigned"].includes(event.status) && (
            <fetcher.Form method="post" className="space-y-2">
              <input type="hidden" name="action" value="assign" />
              <input
                name="handled_by"
                required
                placeholder="Distribution staff user ID"
                className="w-full rounded-lg border p-3"
              />
              <button type="submit" className="submit_button w-full">
                Assign distribution staff
              </button>
            </fetcher.Form>
          )}

          {fetcher.data?.error && (
            <p className="text-sm text-red-600">{fetcher.data.error}</p>
          )}

          {fetcher.data?.success && (
            <p className="text-sm text-green-700">
              Event updated successfully.
            </p>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Event Card */}
        <section className="rounded-2xl max-h-fit border card p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Event details</h2>

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              {/*<CalendarDays className="h-5 w-5 text-gray-400" />*/}
              <div>
                <p className="text-xs text-gray-500">Event date</p>
                <p className="font-medium">
                  {new Date(event.event_date).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* <Users className="h-5 w-5 text-gray-400" /> */}
              <div>
                <p className="text-xs text-gray-500">Expected guests</p>
                <p className="font-medium">{event.expected_guests}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* <Clock3 className="h-5 w-5 text-gray-400" /> */}
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-medium capitalize">{event.status}</p>
              </div>
            </div>

            {event.status === "rejected" && event.rejection_reason && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                <p className="font-semibold">Rejection reason</p>
                <p>{event.rejection_reason}</p>
              </div>
            )}
          </div>
        </section>

        {/* Drinks Card */}
        <section className="rounded-2xl border card p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Drinks</h2>
            <span className="text-sm text-gray-500">
              {event?.drinks && event?.drinks.length} items
            </span>
          </div>

          <div className="space-y-3">
            {event.drinks &&
              event.drinks.map((drink) => (
                <div
                  key={drink.drink_id}
                  className="flex items-center justify-between rounded-xl border p-3"
                >
                  <div className="flex items-center gap-3">
                    {drink.image_url ? (
                      <img
                        src={drink.image_url}
                        alt={drink.name}
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-500">
                        N/A
                      </div>
                    )}

                    <div>
                      <p className="font-medium">{drink.name}</p>
                      <p className="text-sm text-gray-500">
                        ₦
                        {(drink.unit_price_minor_units / 100).toLocaleString(
                          "en-NG",
                        )}{" "}
                        per unit
                      </p>
                    </div>
                  </div>

                  <span className="font-semibold">x{drink.quantity}</span>
                </div>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatusBadge({ state }: { state: EventOrder["status"] }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
        state === "completed"
          ? "bg-green-100 text-green-700"
          : state === "cancelled"
            ? "bg-red-100 text-red-700"
            : state === "processing"
              ? "bg-blue-100 text-blue-700"
              : state === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
      }`}
    >
      {state}
    </span>
  );
}
