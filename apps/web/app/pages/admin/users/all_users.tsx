import { useLoaderData, Link, Form, useSearchParams } from "react-router";
import { user_cookie_token } from "../../../cookies.server";
import type { Route } from "./+types/all_users";

type User = {
  user_id: string;
  email: string;
  first_name: string;
  role: string;
  blacklist: boolean;
  blacklist_reason: string | null;
  created: string;
};

type LoaderData = {
  users: User[];
  page: number;
  limit: number;
  error?: string;
};

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await user_cookie_token.parse(cookieHeader)) || {};

  if (!cookie.token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const page = Math.max(0, Number(url.searchParams.get("page")) || 0);
  const limit = url.searchParams.get("limit") || 20;

  const search = url.searchParams.get("search") || "";

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/user/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
    {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    },
  );

  if (response.status === 401 || response.status === 403) {
    throw new Response("You are not authorized to view users.", {
      status: response.status,
    });
  }

  if (!response.ok) {
    throw new Response("Failed to load users.", {
      status: response.status,
    });
  }

  const result = await response.json();

  return {
    users: result.data.users as User[],
    page,
    limit,
  };
}

export default function AdminUsers() {
  const { users, page, limit } = useLoaderData<typeof loader>() as LoaderData;
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and view registered platform users.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-medium">All users</h2>
          <p className="mt-1 text-sm text-gray-500">
            {users.length} users on this page
          </p>
        </div>

        {users.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Form method="get" className="flex gap-3">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by name or email..."
                className="w-full max-w-md rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-green-600"
              />

              <button
                type="submit"
                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
              >
                Search
              </button>
            </Form>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date joined</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.user_id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {user.first_name || "Unnamed user"}
                      </p>
                      <p className="mt-1 text-gray-500">{user.email}</p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {user.role.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={
                          user.blacklist
                            ? "rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"
                            : "rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700"
                        }
                      >
                        {user.blacklist ? "Blacklisted" : "Active"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                      {new Date(user.created).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
          <span className="text-sm text-gray-500">Page {page + 1}</span>

          <div className="flex gap-2">
            {page > 0 && (
              <Link
                to={`?limit=${limit}&=page=${page - 1}&search=${encodeURIComponent(search)}`}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
              >
                Previous
              </Link>
            )}

            {users.length === limit && (
              <Link
                to={`?limit=${limit}&page=${page + 1}&search=${encodeURIComponent(search)}`}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
