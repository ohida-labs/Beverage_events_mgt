import pool from "@/utils/database";
import { DbUpdateHelper } from "@/utils/database/updateHelper";
import { handlePgError } from "@/utils/exceptions/dbError";
import ValidationError from "@/utils/exceptions/validationError";
import {
  ICreateEvent,
  IManagedEventUpdate,
  IEvent,
  IFilterEvents,
  IUpdateEvent,
} from "@/utils/types/interfaces/event";

//A
export const CreateNewEvent = async (
  userId: string,
  event_arg: ICreateEvent,
) => {
  const client = await pool.connect();

  try {
    const { event_name, event_date, expected_guests, items } = event_arg;

    if (
      !event_name?.trim() ||
      !event_date ||
      !Number.isInteger(expected_guests) ||
      expected_guests < 1 ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      throw new ValidationError(
        {},
        "Provide valid event details and at least one drink.",
      );
    }

    const seenDrinkIds = new Set<string>();

    for (const item of items) {
      if (
        !item ||
        typeof item.drink_id !== "string" ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        seenDrinkIds.has(item.drink_id)
      ) {
        throw new ValidationError(
          {},
          "Drink selections must have unique IDs and valid quantities.",
        );
      }

      seenDrinkIds.add(item.drink_id);
    }

    await client.query("BEGIN");

    // Confirm that every selected drink exists and is available.
    const drinkResult = await client.query(
      `SELECT drink_id, price_minor_units
       FROM beverage_items
       WHERE drink_id = ANY($1::uuid[])
         AND is_available = TRUE`,
      [items.map((item) => item.drink_id)],
    );

    if (drinkResult.rows.length !== items.length) {
      throw new ValidationError(
        {},
        "One or more selected drinks are invalid or unavailable.",
      );
    }

    const drinksById = new Map(
      drinkResult.rows.map((drink) => [
        drink.drink_id,
        drink.price_minor_units,
      ]),
    );

    // Create the event for the authenticated customer.
    const eventResult = await client.query(
      `INSERT INTO events (
         customer_id,
         event_name,
         event_date,
         expected_guests
       )
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, event_name.trim(), event_date, expected_guests],
    );

    const event = eventResult.rows[0];

    // Save every selected drink and its database price.
    for (const item of items) {
      const unitPrice = drinksById.get(item.drink_id);

      await client.query(
        `INSERT INTO event_items (
           event_id,
           drink_id,
           quantity,
           unit_price_minor_units
         )
         VALUES ($1, $2, $3, $4)`,
        [event.event_id, item.drink_id, item.quantity, unitPrice],
      );
    }

    await client.query("COMMIT");

    return event;
  } catch (error) {
    await client.query("ROLLBACK");

    if (error instanceof ValidationError) {
      throw error;
    }

    handlePgError(error);
  } finally {
    client.release();
  }
};

//a

export const UpdateManagedEvent = async (
  event_id: string,
  updates: IManagedEventUpdate,
) => {
  const allowedFields = ["status", "handled_by", "rejection_reason"];

  const fields = Object.keys(updates).filter((key) =>
    allowedFields.includes(key),
  );

  if (fields.length === 0) {
    throw new Error("No valid event updates provided.");
  }

  const values = fields.map(
    (field) => updates[field as keyof IManagedEventUpdate],
  );

  const setClause = fields
    .map((field, index) => `"${field}" = $${index + 1}`)
    .join(", ");

  values.push(event_id);
  const query = {
    text: `
      UPDATE events
      SET ${setClause}
      WHERE event_id = $${values.length}
      RETURNING event_id, event_name, status, handled_by, rejection_reason;
    `,
    values,
  };

  const result = await pool.query(query);

  console.log(result.rows);
  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
};

//For Distributor staff only
export const UpdateDistributionEvent = async (
  eventId: string,
  userId: string,
  status: "in_progress" | "completed",
) => {
  const expectedStatus = status === "in_progress" ? "assigned" : "in_progress";

  const query = {
    text: `
      UPDATE events
      SET status = $1
      WHERE event_id = $2
        AND handled_by = $3
        AND status = $4
      RETURNING event_id, event_name, status, handled_by;
    `,
    values: [status, eventId, userId, expectedStatus],
  };

  const result = await pool.query(query);

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
};

export const GetEvent = async (user_id: string, event_id: string) => {
  try {
    const query = `
           SELECT
          e.event_id,
          e.customer_id,
          e.event_name,
          e.event_date,
          e.expected_guests,
          e.event_poster_url,
          e.status,
          e.handled_by,
          e.rejection_reason,
          e.created_at,
          e.updated_at,
          COALESCE(
            json_agg(
              json_build_object(
                'drink_id', b.drink_id,
                'name', b.name,
                'image_url', b.image_url,
                'quantity', ei.quantity,
                'unit_price_minor_units', ei.unit_price_minor_units
              )
            ) FILTER (WHERE b.drink_id IS NOT NULL),
            '[]'::json
          ) AS drinks
        FROM events e
        LEFT JOIN event_items ei
          ON ei.event_id = e.event_id
        LEFT JOIN beverage_items b
          ON b.drink_id = ei.drink_id
        
        WHERE e.customer_id = $1
          AND e.event_id = $2
        GROUP BY e.event_id
       
        `;

    const res = await pool.query(query, [user_id, event_id]);

    if (res.rows.length === 0) {
      return null;
    }

    const event = res.rows[0] as IEvent;
    return event;
  } catch (e) {
    handlePgError(e);
  }
};

export const GetAllEvents = async (user_id: string, filter?: IFilterEvents) => {
  try {
    const query = `
         select * from events 
         where customer_id = $1`;

    const res = await pool.query(query, [user_id]);

    if (res.rows.length === 0) {
      return [];
    }

    const events = res.rows as IEvent[];
    return events;
  } catch (e) {
    handlePgError(e);
  }
};

export const UpdateEvent = async (
  user_id: string,
  event_id: string,
  updates: IUpdateEvent,
) => {
  const { setClause, values } = DbUpdateHelper({ updates });
  const QueryWithIds = [...values, user_id, event_id];
  try {
    let query_text = `
          UPDATE events
          SET ${setClause} 
          WHERE event_id = $${QueryWithIds.length}
          AND customer_id = $${QueryWithIds.length - 1} 
          RETURNING event_id, customer_id, event_name;         
          `;

    const query = {
      text: query_text,
      values,
    };

    const res = await pool.query(query);

    if (res.rows.length === 0) {
      throw new ValidationError(
        {
          id: "Check the event id",
        },
        "Event not found",
      );
    }

    return res.rows[0].event_id as { event_id: string };
  } catch (e) {
    if (e instanceof ValidationError) {
      throw e;
    }
    handlePgError(e);
  }
};

//By super_Admin:
export const DeleteEvent = async (eventId: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    //By admin only
    const query_text = `      
    DELETE FROM events
    WHERE event_id = $1   
    returning *;
    `;

    const res = await client.query(query_text, [eventId]);

    await client.query("COMMIT");
    return { event: res.rows[0] };
  } catch (e) {
    await client.query("ROLLBACK");
    handlePgError(e);
  } finally {
    client.release();
  }
};

//By ADMIN
export const GetEventWithUser = async (user_id: string, event_id: string) => {
  try {
    const query = `
     select e.*,
     to_jsonb(u) AS user
     from events e
     left join users u
     on e.customer_id = u.user_id
     where e.event_id = $1;
    `;

    const res = await pool.query(query, [user_id, event_id]);

    if (res.rows.length === 0) {
      return null;
    }

    const event_user = res.rows[0]; //IeventUser
    return event_user;
  } catch (e) {
    handlePgError(e);
  }
};

////IFiltereventsUser
export const GetAllEventsWithUser = async (arg: { filter: IFilterEvents }) => {
  console.log(arg.filter);
  try {
    const query = `
  SELECT
    e.*,
    COUNT(e.event_id) OVER () AS total_count,
    u.first_name AS first_name,
    u.email AS email,
    u.user_id AS user_id
  FROM events e
  LEFT JOIN users u
    ON e.customer_id = u.user_id
  WHERE (
    e.event_name ILIKE $1 || '%'
    OR u.email ILIKE $1 || '%'
  )
  OFFSET $2
  LIMIT $3
`;

    const searchTerm = arg.filter.search;

    const res = await pool.query(query, [
      searchTerm || "",
      arg.filter.page || 0,
      arg.filter.limit || 50,
    ]);

    if (res.rows.length === 0) {
      return [];
    }

    const eventslist_user = res.rows;
    return eventslist_user;
  } catch (e) {
    handlePgError(e);
  }
};

//For distributor to see
export const GetAllAssignedEvents = async (arg: {
  userId: string;
  filter?: IFilterEvents | null;
}) => {
  try {
    const filter = arg.filter ?? ({} as IFilterEvents);
    const searchTerm = filter.search || "";

    const query = `
      SELECT
        e.*,
        COUNT(e.event_id) OVER () AS total_count,
        u.first_name AS first_name,
        u.email AS email,
        u.user_id AS user_id
      FROM events e
      LEFT JOIN users u
        ON e.customer_id = u.user_id
      WHERE e.handled_by = $1
        AND (
          e.event_name ILIKE $2 || '%'
          OR u.email ILIKE $2 || '%'
        )
      ORDER BY e.event_date DESC
      OFFSET $3
      LIMIT $4
    `;

    const res = await pool.query(query, [
      arg.userId,
      searchTerm,
      filter.page || 0,
      filter.limit || 50,
    ]);

    return res.rows;
  } catch (e) {
    handlePgError(e);
  }
};
