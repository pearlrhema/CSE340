// THE MODEL IS WHERE ALL DATA INTERACTIONS ARE STORED
const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
// async function getInventoryByClassificationId(classification_id) {
//   try {
//     const data = await pool.query(
//       `SELECT * FROM public.inventory AS i
//       JOIN public.classification AS c
//       ON i.classification_id = c.classification_id
//       WHERE i.classification_id = $1`,
//       [classification_id]
//     )
//     return data.rows
//   } catch (error) {
//     console.error("getclassificationsbyid error " + error)
//   }
// }

async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );

    if (data.rows.length === 0) {
      return null; // No inventory items found
    }
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error);
    throw new Error("Database query failed");
  }
}


// async function getInventoryById(inv_id) {
//   try {
//     const data = await pool.query(
//       `SELECT * FROM public.inventory WHERE inv_id = $1`,
//       [inv_id]
//     );
//     return data.rows[0]; // Return a single item
//   } catch (error) {
//     console.error("getInventoryById error: " + error);
//   }
// }

async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`, 
      [inv_id]
    );
    if (data.rows.length === 0) {
      return null; // No inventory item found
    }
    return data.rows[0]; // Return a single item
  } catch (error) {
    console.error("getInventoryById error: " + error);
    throw new Error("Database query failed"); // Ensure error propagates
  }
}

// query to insert a new classification into the database. (task two ends here)
async function insertClassification(classification_name) {
  const sql = `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *`;
  const data = await pool.query(sql, [classification_name])
  return data.rowCount
}

// async function addInventory(vehicle) {
//   const sql = `
//     INSERT INTO inventory (inv_make, inv_model, inv_year, inv_color, inv_mileage, inv_price, inv_description, inv_image_url)
//     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//     RETURNING *;
//   `;
//   const values = [
//     vehicle.make,
//     vehicle.model,
//     vehicle.year,
//     vehicle.color,
//     vehicle.mileage,
//     vehicle.price,
//     vehicle.description,
//     vehicle.image_url,
//   ];

//   try {
//     const result = await pool.query(sql, values);
//     return result.rows[0]; // Return the first row of the result
//   } catch (error) {
//     console.error('Error inserting inventory:', error);
//     throw error; // Propagate the error
//   }
// }

// models/inventory-model.js
async function addInventory (
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color
) {
  try {
    const sql = `
      INSERT INTO public.inventory (
        inv_make, inv_model, inv_year, inv_description, 
        inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;

    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    ]);

    return data.rows[0];
  } catch (error) {
    console.error("addInventory error", error);
    return null;
  }
};




module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById, insertClassification, addInventory };