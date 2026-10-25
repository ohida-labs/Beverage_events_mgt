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

/*
export const GetAllBeverages = async () => {
  try {
    const result = await pool.query(`
      SELECT
        drink_id,
        name,
        image_url,
        price_minor_units,
        is_available,
        created_by
      FROM beverage_items
      ORDER BY name ASC
    `);

    return result.rows;
  } catch (error) {
    handlePgError(error);
  }
};

*/

export const GetAllBeverages = async (filters: BeverageFilters) => {
  try {
    const { page, limit, search, availability } = filters;
    const offset = page * limit;

    const values = [`%${search}%`, availability, limit, offset];

    const query = `
      SELECT
        drink_id,
        name,
        image_url,
        price_minor_units,
        is_available,
        created_by
      FROM beverage_items
      WHERE name ILIKE $1
        AND ($2::boolean IS NULL OR is_available = $2)
      ORDER BY name ASC
      LIMIT $3
      OFFSET $4
    `;

    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM beverage_items
      WHERE name ILIKE $1
        AND ($2::boolean IS NULL OR is_available = $2)
    `;

    const [result, countResult] = await Promise.all([
      pool.query(query, values),
      pool.query(countQuery, [values[0], values[1]]),
    ]);

    return {
      beverages: result.rows,
      total: countResult.rows[0].total as number,
    };
  } catch (error) {
    handlePgError(error);
  }
};

//create new drink request

export const CreateBeverage = async (beverage: CreateBeverageInput) => {
  try {
    const result = await pool.query(
      `
        INSERT INTO beverage_items (
          name,
          image_url,
          price_minor_units,
          created_by
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          drink_id,
          name,
          image_url,
          price_minor_units,
          is_available,
          created_by
      `,
      [
        beverage.name,
        beverage.image_url,
        beverage.price_minor_units,
        beverage.created_by,
      ],
    );

    return result.rows[0];
  } catch (error) {
    handlePgError(error);
  }
};

export const UpdateBeverage = async (
  drinkId: string,
  input: UpdateBeverageInput,
) => {
  try {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (input.name !== undefined) {
      values.push(input.name);
      fields.push(`name = $${values.length}`);
    }

    if (input.image_url !== undefined) {
      values.push(input.image_url);
      fields.push(`image_url = $${values.length}`);
    }

    if (input.price_minor_units !== undefined) {
      values.push(input.price_minor_units);
      fields.push(`price_minor_units = $${values.length}`);
    }

    if (input.is_available !== undefined) {
      values.push(input.is_available);
      fields.push(`is_available = $${values.length}`);
    }

    if (fields.length === 0) {
      return null;
    }

    values.push(drinkId);

    const result = await pool.query(
      `
        UPDATE beverage_items
        SET ${fields.join(", ")}
        WHERE drink_id = $${values.length}
        RETURNING
          drink_id,
          name,
          image_url,
          price_minor_units,
          is_available,
          created_by
      `,
      values,
    );

    return result.rows[0] ?? null;
  } catch (error) {
    handlePgError(error);
  }
};

//Single For everyone to see
export const GetBeverageById = async (drinkId: string) => {
  try {
    const result = await pool.query(
      `
        SELECT
          drink_id,
          name,
          image_url,
          price_minor_units,
          is_available,
          created_by
        FROM beverage_items
        WHERE drink_id = $1
      `,
      [drinkId],
    );

    return result.rows[0] ?? null;
  } catch (error) {
    handlePgError(error);
  }
};
