import { DbUpdateHelper } from "@/utils/database/updateHelper";
import pool from "../../utils/database";
import { handlePgError } from "../../utils/exceptions/dbError";
import ValidationError from "../../utils/exceptions/validationError";
import {
  IFilterUser,
  IUpdateUser,
  IUser,
} from "../../utils/types/interfaces/user";

interface UpdateUserWithPassword extends IUpdateUser {
  password?: string;
  user_id?: string | null;
}

export const GetUser = async (id: string, search_by?: string) => {
  try {
    const query_id = `
         select * from users 
         where 
         user_id = $1
        `;
    const query_email = `
         select * from users 
         where 
         email = $1
        `;
    const query = {
      text: search_by === "email" ? query_email : query_id,
      values: [id],
    };

    const res = await pool.query(query);

    if (res.rows.length === 0) {
      return null;
    }
    const user: IUser = res.rows[0];
    return user;
  } catch (e) {
    console.log("from login", e);
    if (e instanceof ValidationError) {
      throw e;
    }
    handlePgError(e);
  }
};

export const CreateUser = async (user_arg: {
  first_name: string | null;
  last_name?: string | null;
  email: string;
  password: string;
}) => {
  //console.log(user_arg, "dbbbbb");
  try {
    const query = {
      text: `
         insert into users (email, password_hash, first_name, last_name)
         values ($1, $2, $3, $4)
         returning user_id, role;
        `,
      values: [
        user_arg.email,
        user_arg.password,
        user_arg.first_name,
        user_arg.last_name,
      ],
    };

    const res = await pool.query(query);
    const user = res.rows[0] as {
      user_id: string;
      role: string;
      priority: string;
    };

    return user;
  } catch (e) {
    handlePgError(e);
  }
};

//Change user_id to null if user deletes their account
//Admin: change user: 'blacklisted, role, priority, reason'
export const UpdateUser = async (id: string, data: UpdateUserWithPassword) => {
  const { setClause, values } = DbUpdateHelper({ updates: data, id });

  try {
    let query_text = `
          UPDATE users
          SET ${setClause} 
          WHERE user_id = $${values.length} 
          RETURNING user_id;         
          `;

    const query = {
      text: query_text,
      values,
    };
    const res = await pool.query(query);

    if (res.rows.length === 0) {
      throw new ValidationError(
        {
          user: "User not found",
        },
        "This User is not found",
      );
    }

    return res.rows[0].user_id as { user_id: string };
  } catch (e) {
    if (e instanceof ValidationError) {
      throw e;
    }
    handlePgError(e);
  }
};

//Admin
export const DeleteUserFromDb = async (identifier: string) => {
  const pquery = await pool.connect();

  try {
    await pquery.query("BEGIN");

    const query_text = `DELETE FROM users WHERE user_id = $1 RETURNING first_name, email, user_id`;

    const deleted_info = await pool.query(query_text, [identifier]);

    await pquery.query("COMMIT");

    if (deleted_info.rows.length === 0) {
      throw new ValidationError(
        {
          user: "User account cannot be deleted",
        },
        "This User is not found",
      );
    }

    return deleted_info.rows[0].user_id as {
      user_id: string;
    };
  } catch (e) {
    await pquery.query("ROLLBACK");
    handlePgError(e);
  }
};

//Admins: Gets all user;

export const GetAllUsersDb = async (filter: IFilterUser) => {
  try {
    const { page, limit, search, role, sortBy, sortOrder } = filter;

    const offset = page * limit;

    const query = `
    SELECT
    user_id,
    email,
    first_name,
    role,
    blacklisted,
    blacklisted_reason,
    created_at
FROM users
WHERE
    (
        $1 = ''
        OR email ILIKE '%' || $1 || '%'
        OR first_name ILIKE '%' || $1 || '%'
    )
    AND (
    $2::TEXT = ''
    OR role = $2::user_role
)
ORDER BY created_at DESC
LIMIT $3
OFFSET $4;
      `;

    const res = await pool.query(query, [
      search,
      role ?? "",
      //sortBy ?? "created_at",
      // sortOrder ?? "DESC",
      limit || 20,
      offset,
    ]);

    return res.rows as IUser[];
  } catch (e) {
    handlePgError(e);
  }
};

/*export const GetAllUsersDb = async (filter: IFilterUser) => {
  try {
    const query = `
         select * from users 
         limit 100
         `;

    const res = await pool.query(query);

    if (res.rows.length === 0) {
      return [];
    }

    const user: IUser[] = res.rows;
    return user;
  } catch (e) {
    handlePgError(e);
  }
};*/
//Admin: batch change user: 'priority, roles'
