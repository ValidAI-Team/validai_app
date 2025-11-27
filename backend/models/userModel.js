const { connectDB, sql } = require("../config/db");

async function findUserByEmail(email) {
    const pool = await connectDB();
    const result = await pool
        .request()
        .input("email", sql.VarChar, email)
        .query("SELECT * FROM Users WHERE Email = @email");

    return result.recordset[0];
}

async function createUser({ fullname, email, usertype, password }) {
    const pool = await connectDB();
    await pool
        .request()
        .input("fullname", sql.VarChar, fullname)
        .input("email", sql.VarChar, email)
        .input("usertype", sql.VarChar, usertype)
        .input("password", sql.VarChar, password)
        .query(`
            INSERT INTO Users (FullName, Email, UserType, Password)
            VALUES (@fullname, @email, @usertype, @password)
        `);
}

module.exports = { findUserByEmail, createUser };
