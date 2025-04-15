const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [
        account_firstname,
        account_lastname,
        account_email,
        account_password])
    } catch (error) {
        return error.message
    }
}

/* *****************************
*   login account
* *************************** */
// async function loginAccount(account_email, account_password){
//     try {
//         const sql = "SELECT * FROM account WHERE account_email = $1 AND account_password = $2"
//         return await pool.query(sql, [account_email, account_password])
//     } catch (error) {
//         return error.message
//     }
// }
async function loginAccount(account_email) {
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const result = await pool.query(sql, [account_email])
      return result.rows[0]
    } catch (error) {
      console.error("loginAccount error:", error)
      throw error
    }
  }
  

//finish server-side validation starts here
/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  } //next you go over to account-validation and apply the check function

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
 * Return account data using account id
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  try{
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4"
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    return result; // TODO: See what the requirement wants
  } catch(error) {
    return new Error("Update failed");
  }

}

async function updatePassword(account_id, hashed_password) {
  try{
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2"
    const result = await pool.query(sql, [hashed_password, account_id]);
    return result; // TODO: See what the requirement wants
  } catch(error) {
    return new Error("Update password failed")
  }

}

module.exports = { registerAccount, checkExistingEmail, loginAccount, getAccountByEmail, getAccountById, updateAccount, updatePassword }
//this is the account model that will handle all the database queries related to the account table