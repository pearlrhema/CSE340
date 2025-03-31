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



module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById };