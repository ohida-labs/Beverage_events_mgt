import { data, Link, useFetcher, useLoaderData } from "react-router";
import type { Route } from "./+types/user_details";
import { user_cookie_token } from "../../../cookies.server";

type User = {
  user_id: string;
  email: string;
  first_name: string;
  role: string;
  blacklist: boolean;
  blacklist_reason: string | null;
  phone_number?: string | null;
  //  profile?: string | null;
  created: string;
};

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request, params }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};

  if (!cookie.token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  if (!params.user_id) {
    throw new Response("User ID is required.", { status: 400 });
  }

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/user?user_id=${encodeURIComponent(params.user_id)}`,
    {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Response("Unable to load user details.", {
      status: response.status,
    });
  }

  const result = await response.json();

  return { user: result.data.user as User };
}

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request, params }: Route.ActionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};

  if (!cookie.token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  if (!params.user_id) {
    return data({ error: "User ID is required." }, { status: 400 });
  }

  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");

  let updates: Record<string, string | boolean>;

  if (intent === "change_role") {
    const role = String(formData.get("role") || "");

    if (
      role !== "admin" &&
      role !== "booking_manager" &&
      role !== "distribution_staff" &&
      role !== "consumer"
    ) {
      return data({ error: "Invalid role." }, { status: 400 });
    }

    updates = { role };
  } else if (intent === "blacklist") {
    const reason = String(formData.get("reason") || "").trim();

    if (!reason) {
      return data({ error: "Please provide a reason." }, { status: 400 });
    }

    updates = {
      blacklisted: true,
      blacklisted_reason: reason,
    };
  } else if (intent === "unblacklist") {
    updates = {
      blacklisted: false,
      blacklisted_reason: "",
    };
  } else {
    return data({ error: "Invalid action." }, { status: 400 });
  }

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/user?user_id=${encodeURIComponent(params.user_id)}`,
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
      { error: result.error?.message || "Failed to update user." },
      { status: response.status || 400 },
    );
  }

  return data({ success: "User updated successfully." });
}

export default function UserDetails() {
  const { user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  return (
    <main className="space-y-6 p-6">
      <Link
        to="/admin/users"
        className="text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back to users
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">
          {user.first_name || "Unnamed user"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{user.email}</p>
      </div>

      {fetcher.data && "error" in fetcher.data && (
        <p className="text-sm text-danger" role="alert">
          {fetcher.data.error}
        </p>
      )}

      {fetcher.data && "success" in fetcher.data && (
        <p className="text-sm text-success" role="status">
          {fetcher.data.success}
        </p>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="font-medium">Account details</h2>

        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="mt-1">{user.email}</dd>
          </div>

          <div>
            <dt className="text-gray-500">Role</dt>
            <dd className="mt-1">{user.role.replaceAll("_", " ")}</dd>
          </div>

          <div>
            <dt className="text-gray-500">Account status</dt>
            <dd className="mt-1">
              {user.blacklist ? "Blacklisted" : "Active"}
            </dd>
          </div>

          {user.blacklist_reason && (
            <div>
              <dt className="text-gray-500">Blacklist reason</dt>
              <dd className="mt-1">{user.blacklist_reason}</dd>
            </div>
          )}

          {user.phone_number && (
            <div>
              <dt className="text-gray-500">Phone number</dt>
              <dd className="mt-1">{user.phone_number}</dd>
            </div>
          )}

          <div>
            <dt className="text-gray-500">Date joined</dt>
            <dd className="mt-1">
              {new Date(user.created).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="font-medium">Change role</h2>

        <fetcher.Form method="post" className="mt-4 flex flex-wrap gap-3">
          <input type="hidden" name="intent" value="change_role" />

          <select
            name="role"
            defaultValue={user.role}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="consumer">Consumer</option>
            <option value="booking_manager">Booking Manager</option>
            <option value="distribution_staff">Distribution Staff</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={fetcher.state !== "idle"}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Save role
          </button>
        </fetcher.Form>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="font-medium">Account access</h2>

        {user.blacklist ? (
          <fetcher.Form method="post" className="mt-4">
            <input type="hidden" name="intent" value="unblacklist" />

            <button
              type="submit"
              disabled={fetcher.state !== "idle"}
              className="rounded-lg border border-green-200 px-4 py-2 text-sm text-success disabled:opacity-50"
            >
              Remove blacklist
            </button>
          </fetcher.Form>
        ) : (
          <fetcher.Form method="post" className="mt-4 space-y-3">
            <input type="hidden" name="intent" value="blacklist" />

            <textarea
              name="reason"
              required
              placeholder="Reason for blacklisting this account"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              rows={3}
            />

            <button
              type="submit"
              disabled={fetcher.state !== "idle"}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700 disabled:opacity-50"
            >
              Blacklist account
            </button>
          </fetcher.Form>
        )}
      </section>
    </main>
  );
}
