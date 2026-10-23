import pool from "@/utils/database";
import { handlePgError } from "@/utils/exceptions/dbError";

export const GetAvailableBeverages = async () => {
  try {
    const result = await pool.query(`
      SELECT
        drink_id,
        name,
        image_url,
        price_minor_units,
        is_available
      FROM beverage_items
      WHERE is_available = TRUE
      ORDER BY name ASC
    `);

    return result.rows;
  } catch (error) {
    handlePgError(error);
  }
};
