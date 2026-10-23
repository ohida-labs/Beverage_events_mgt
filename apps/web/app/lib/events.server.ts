// events.server.ts

//import { ApiFetchHelper } from "./api.server";

export async function GetLatestPendingEventOrder(token: string) {
  /*const response = await ApiFetchHelper(
    "/events?limit=1&sortBy=created_at&sortOrder=desc&state=pending",
    token,
  );

  const result = await response.json();

  if (!result?.status) {
    return result.error;
  }
 
  return result?.data?.events?.[0] ?? null;
 */

  console.log(token + "21312321");
  return {
    event: {
      id: "ORD-1212",
      name: "Oroma birthday Party",
      total: 45000,
      //status: 'pending',
      drinks: [
        {
          name: "Guiness Ice Bear",
          quantity: 20, //Crates
          crate_quantity: 12, //Crates
          price: 30500,
        },
        {
          name: "Malta Guinesss",
          quantity: 12, //Crates
          crate_quantity: 24, //Crates
          price: 14500,
        },
      ],
    },
  };
}

export async function GetDraftedEventOrders(token: string) {
  /*const response = await ApiFetchHelper(
    "/events?limit=1&sortBy=created_at&sortOrder=desc&state=pending",
    token,
  );

  const result = await response.json();

  if (!result?.status) {
    return result.error;
  }
 
  return result?.data?.events?.[0] ?? null;
 */

  console.log(token + "21312321");
  return {
    events: [
      {
        id: "ORD-1212",
        name: "Oroma birthday",
        total: 45000,
        status: "draft",
      },
      {
        id: "ORD-1213",
        name: "Collins birthday",
        total: 45921,
        status: "draft",
      },
    ],
  };
}

export async function GetUserEventOrders() {
  /*const response = await ApiFetchHelper(
    "/events?limit=1&sortBy=created_at&sortOrder=desc&state=pending",
    token, );

  const result = await response.json();

  if (!result?.status) {
    return result.error;
  }
 
  return result?.data?.events?.[0] ?? null;
 */
  /*
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

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
  };*/
}

export async function GetSingleUserEventOrder(
  token: string,
  event_order_id: string,
) {
  /*const response = await ApiFetchHelper(
    "/events?limit=1&sortBy=created_at&sortOrder=desc&state=pending",
    token,
  );

  const result = await response.json();

  if (!result?.status) {
    return result.error;
  }
 
  return result?.data?.events?.[0] ?? null;
 */

  console.log(token + "21312321");
  console.log(event_order_id);
  return {
    event_id: "ORD-1216",
    name: "Collins birthday",
    total: 45921,
    status: "processing",
  };
}
