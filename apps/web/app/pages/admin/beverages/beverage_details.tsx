import { Link, useFetcher, useLoaderData, data } from "react-router";
import type { Route } from "./+types/beverage_details";
import { user_cookie_token } from "../../../cookies.server";

type Beverage = {
  drink_id: string;
  name: string;
  image_url: string | null;
  price_minor_units: number;
  is_available: boolean;
  created_by: string;
};

const API = import.meta.env.VITE_BACKEND_URL;

// eslint-disable-next-line react-refresh/only-export-components
export async function loader({ request, params }: Route.LoaderArgs) {
  const cookie =
    (await user_cookie_token.parse(request.headers.get("Cookie"))) || {};

  if (!cookie.token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  if (!params.drink_id) {
    throw new Response("Beverage ID is required.", { status: 400 });
  }

  const response = await fetch(
    `${API}/beverages/${encodeURIComponent(params.drink_id)}`,
    {
      headers: { Authorization: `Bearer ${cookie.token}` },
    },
  );

  if (response.status === 401 || response.status === 403) {
    throw new Response("You are not authorized to view this beverage.", {
      status: response.status,
    });
  }

  if (!response.ok) {
    throw new Response("Unable to load beverage details.", {
      status: response.status,
    });
  }

  const result = await response.json();

  if (!result.status || !result.data) {
    throw new Response("Beverage not found.", { status: 404 });
  }

  return { beverage: result.data as Beverage };
}

// eslint-disable-next-line react-refresh/only-export-components
export async function action({ request, params }: Route.ActionArgs) {
  const cookie =
    (await user_cookie_token.parse(request.headers.get("Cookie"))) || {};

  if (!cookie.token) {
    throw new Response("Unauthorized", { status: 401 });
  }

  if (!params.drink_id) {
    return data({ error: "Beverage ID is required." }, { status: 400 });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const priceValue = String(formData.get("price") || "");
  const imageValue = String(formData.get("image_url") || "").trim();
  const availabilityValue = String(formData.get("is_available") || "");

  const price = Number(priceValue);

  if (!name || !priceValue || !Number.isFinite(price) || price <= 0) {
    return data(
      { error: "Enter a beverage name and a valid price." },
      { status: 400 },
    );
  }

  if (!["true", "false"].includes(availabilityValue)) {
    return data(
      { error: "Choose a valid availability status." },
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

  const response = await fetch(
    `${API}/beverages/${encodeURIComponent(params.drink_id)}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${cookie.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        image_url: imageValue || null,
        is_available: availabilityValue === "true",
      }),
    },
  );

  const result = await response.json();

  if (!response.ok || !result.status) {
    return data(
      { error: result.message || "Failed to update beverage." },
      { status: response.status || 400 },
    );
  }

  return data({ success: "Beverage updated successfully." });
}

export default function BeverageDetails() {
  const { beverage } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  return (
    <main className="space-y-6 p-6">
      <Link
        to="/admin/beverages"
        className="text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back to beverages
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">{beverage.name}</h1>
        <p className="mt-1 text-sm text-muted">
          View and edit beverage details.
        </p>
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
        <h2 className="font-medium">Beverage details</h2>

        <div className="mt-4">
          {beverage.image_url ? (
            <img
              src={beverage.image_url}
              alt={beverage.name}
              className="h-40 w-40 rounded-xl border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
              No image available
            </div>
          )}
        </div>

        <fetcher.Form method="post" className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Beverage name
            </label>
            <input
              id="name"
              name="name"
              required
              defaultValue={beverage.name}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Price (₦)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              required
              defaultValue={beverage.price_minor_units / 100}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="image_url"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <input
              id="image_url"
              name="image_url"
              type="url"
              defaultValue={beverage.image_url || ""}
              placeholder="https://example.com/beverage.jpg"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty to remove the current image.
            </p>
          </div>

          <div>
            <label
              htmlFor="is_available"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Availability
            </label>
            <select
              id="is_available"
              name="is_available"
              defaultValue={String(beverage.is_available)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={fetcher.state !== "idle"}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {fetcher.state !== "idle" ? "Saving..." : "Save changes"}
          </button>
        </fetcher.Form>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="font-medium">Record information</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-gray-500">Beverage ID</dt>
            <dd className="mt-1 break-all">{beverage.drink_id}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Created by</dt>
            <dd className="mt-1 break-all">{beverage.created_by}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
