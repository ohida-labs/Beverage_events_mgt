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

export async function GetUserEventOrders(token: string) {
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
  return [
    {
      event_id: "ORD-1212",
      name: "Oroma birthday",
      total: 45000,
      status: "delivered",
    },
    {
      event_id: "ORD-1213",
      name: "Collins birthday",
      total: 45921,
      status: "processing",
    },
    {
      event_id: "ORD-1214",
      name: "Collins birthday",
      total: 45921,
      status: "processing",
    },
    {
      event_id: "ORD-1215",
      name: "Collins birthday",
      total: 45921,
      status: "processing",
    },
    {
      event_id: "ORD-1216",
      name: "Collins birthday",
      total: 45921,
      status: "processing",
    },
  ];
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
