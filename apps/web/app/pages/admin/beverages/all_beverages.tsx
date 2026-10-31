import {
  Link,
  Form,
  useFetcher,
  useLoaderData,
  useSearchParams,
  data,
} from "react-router";
import { user_cookie_token } from "../../../cookies.server";
import type { Route } from "./+types/all_beverages";

type Beverage = {
  drink_id: string;
  name: string;
  image_url: string | null;
  price_minor_units: number;
  is_available: boolean;
  created_by: string;
};

type LoaderData = {
  beverages: Beverage[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const API = import.meta.env.VITE_BACKEND_URL;

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request }: Route.LoaderArgs) {
  const cookie =
    (await user_cookie_token.parse(request.headers.get("Cookie"))) || {};

  if (!cookie.token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const page = Math.max(0, Number(url.searchParams.get("page")) || 0);
  const limit = Math.min(
    100,
    Math.max(1, Number(url.searchParams.get("limit")) || 20),
  );
  const search = url.searchParams.get("search") || "";
  const availability = url.searchParams.get("availability") || "";

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  if (availability) {
    query.set("availability", availability);
  }

  const response = await fetch(`${API}/beverages/all?${query}`, {
    headers: { Authorization: `Bearer ${cookie.token}` },
  });

  if (response.status === 401 || response.status === 403) {
    throw new Response("You are not authorized to manage beverages.", {
      status: response.status,
    });
  }

  if (!response.ok) {
    throw new Response("Failed to load beverages.", {
      status: response.status,
    });
  }

  const result = await response.json();

  return {
    beverages: result.data as Beverage[],
    page: result.pagination.page as number,
    limit: result.pagination.limit as number,
    total: result.pagination.total as number,
    totalPages: result.pagination.totalPages as number,
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request }: Route.ActionArgs) {
  const cookie =
    (await user_cookie_token.parse(request.headers.get("Cookie"))) || {};

  if (!cookie.token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const priceValue = String(formData.get("price") || "");
  const imageValue = String(formData.get("image_url") || "").trim();
  const price = Number(priceValue);

  if (!name || !priceValue || !Number.isFinite(price) || price <= 0) {
    return data(
      { error: "Enter a beverage name and a valid price." },
      { status: 400 },
    );
  }

  if (imageValue) {
    try {
      const imageUrl = new URL(imageValue);

      if (!["http:", "https:"].includes(imageUrl.protocol)) {
        throw new Error("Invalid URL protocol");
      }
    } catch {
      return data(
        { error: "Enter a valid image URL, or leave it empty." },
        { status: 400 },
      );
    }
  }

  const response = await fetch(`${API}/beverages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cookie.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      price,
      image_url: imageValue || null,
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.status) {
    return data(
      { error: result.message || "Failed to create beverage." },
      { status: response.status || 400 },
    );
  }

  return data({ success: "Beverage created successfully." });
}

export default function AllBeverages() {
  const { beverages, page, limit, total, totalPages } = useLoaderData<
    typeof loader
  >() as LoaderData;

  const fetcher = useFetcher<typeof action>();
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const availability = searchParams.get("availability") || "";

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Beverages</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage beverage names, images, prices, and availability.
        </p>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="font-medium">Add beverage</h2>

        <fetcher.Form method="post" className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            name="name"
            required
            placeholder="Beverage name"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />

          <input
            name="price"
            type="number"
            required
            min="0.01"
            step="0.01"
            placeholder="Price in naira"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />

          <input
            name="image_url"
            type="url"
            placeholder="Image URL (optional)"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm sm:col-span-2"
          />

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={fetcher.state !== "idle"}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {fetcher.state !== "idle" ? "Adding..." : "Add beverage"}
            </button>
          </div>
        </fetcher.Form>

        {fetcher.data && "error" in fetcher.data && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {fetcher.data.error}
          </p>
        )}

        {fetcher.data && "success" in fetcher.data && (
          <p className="mt-3 text-sm text-green-700" role="status">
            {fetcher.data.success}
          </p>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-medium">All beverages</h2>
          <p className="mt-1 text-sm text-gray-500">
            {total} beverages in total
          </p>
        </div>

        <Form method="get" className="flex flex-wrap gap-3 p-5">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search beverages..."
            className="w-full max-w-sm rounded-lg border border-gray-200 px-4 py-2 text-sm"
          />

          <select
            name="availability"
            defaultValue={availability}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>

          <input type="hidden" name="limit" value={limit} />

          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Apply filters
          </button>
        </Form>

        {beverages.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">No beverages found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Image</th>
                  <th className="px-5 py-3 font-medium">Beverage</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Availability</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {beverages.map((beverage) => (
                  <tr key={beverage.drink_id}>
                    <td className="px-5 py-4">
                      {beverage.image_url ? (
                        <img
                          src={beverage.image_url}
                          alt={beverage.name}
                          loading="lazy"
                          className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 font-medium text-gray-900">
                      {beverage.name}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        maximumFractionDigits: 2,
                      }).format(beverage.price_minor_units / 100)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={
                          beverage.is_available
                            ? "rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700"
                            : "rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700"
                        }
                      >
                        {beverage.is_available ? "Available" : "Unavailable"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        to={`/admin/beverages/${beverage.drink_id}`}
                        className="font-medium text-secondary hover:bg-secondary90"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4">
          <span className="text-sm text-gray-500">
            Page {page + 1} of {Math.max(totalPages, 1)}
          </span>

          <div className="flex gap-2">
            {page > 0 && (
              <Link
                to={`?page=${page - 1}&limit=${limit}&search=${encodeURIComponent(search)}&availability=${availability}`}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
              >
                Previous
              </Link>
            )}

            {page + 1 < totalPages && (
              <Link
                to={`?page=${page + 1}&limit=${limit}&search=${encodeURIComponent(search)}&availability=${availability}`}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
