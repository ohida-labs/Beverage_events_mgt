import pool from "@/utils/database";
import { handlePgError } from "@/utils/exceptions/dbError";

//Get token
export const getResetToken = async (email: string) => {
  try {
    const query = {
      text: `
         select * from user_reset_tokens 
         where 
         email = $1
        `,
      values: [email],
    };

    const res = await pool.query(query);

    if (res.rows.length === 0) {
      return null;
    }
    const data = res.rows[0] as {
      token: string;
      email: string;
      isUsed: boolean;
      expires_at: Date;
    };
    return data;
  } catch (e) {
    handlePgError(e);
  }
};

//Upsert token
export const upsertToken = async (arg: {
  email?: string;
  isUsed?: boolean;
  expires_at?: Date;
  token?: string;
}) => {
  try {
    const query = {
      text: `
         insert into user_reset_tokens 
        (email, isUsed, expires_at, token)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO UPDATE 
        SET 
    email = COALESCE(EXCLUDED.email, user_reset_tokens.email),
    isUsed = COALESCE(EXCLUDED.isUsed, user_reset_tokens.isUsed),
    expires_at = COALESCE(EXCLUDED.expires_at, user_reset_tokens.expires_at),    
    token = COALESCE(EXCLUDED.token, user_reset_tokens.token) 
 RETURNING *;
  
        `,
      values: [arg.email, arg.isUsed, arg.expires_at, arg.token],
    };

    const res = await pool.query(query);

    const data = res.rows[0] as {
      token: string;
      email: string;
      isUsed: boolean;
      expires_at: Date;
    };
    return data;
  } catch (e) {
    handlePgError(e);
  }
};
