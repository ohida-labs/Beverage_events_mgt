import pool from "@/utils/database";
import { DbUpdateHelper } from "@/utils/database/updateHelper";
import { handlePgError } from "@/utils/exceptions/dbError";
import ValidationError from "@/utils/exceptions/validationError";

export const CreateNewEvent = async (
  userId: string,
  event_arg: ICreateEvent,
) => {
  try {
    const query = {
      text: `
         insert into users (user_id, event_name, expected_guests, event_date, drinks)
         values ($1, $2, $3, $4, $5)
        `,
      values: [
        userId,
        event_arg.event_name,
        event_arg.expected_guests,
        event_arg.event_date,
        event_arg.drinks,
      ],
    };

    const res = await pool.query(query);

    const event = res.rows[0].event_id as {
      event_id: string;
    };

    return event;
  } catch (e) {
    handlePgError(e);
  }
};

export const GetEvent = async (user_id: string, event_id: string) => {
  try {
    const query = `
         select * from events 
         where user_id = $1 AND
         event_id = $2 
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
         where user_id = $1`;

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
          AND user_id = $${QueryWithIds.length - 1} 
          RETURNING event_id, user_id, event_name;         
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
     on e.user_id = u.user_id
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
  try {
    const query = `
    select e.*,
    COUNT(e.id) OVER () as total_count,
    u.first_name as first_name,    
    u.email as email,
    u.profile as profile,
    u.user_id as userId,
    from events e 
    left join users u 
    on e.user_id = u.user_id
    where (e.name ILIKE  c OR u.email ILIKE $1 || '%')
    offset $3
    limit $4
    `;
    //"""order by ${/*OrderBy*/} ${/*direction*/}"""

    const res = await pool.query(query);
    if (res.rows.length === 0) {
      return null;
    }

    const eventslist_user = res.rows; //IeventUser
    return eventslist_user;
  } catch (e) {
    handlePgError(e);
  }
};
