const sql = require('mssql');
require('dotenv').config({ path: '.env.local' });

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER || '',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function debugOrders() {
    try {
        const pool = await sql.connect(sqlConfig);

        // Count orders
        const countResult = await pool.request().query("SELECT COUNT(*) as count FROM Orders");
        console.log('Total Orders:', countResult.recordset[0].count);

        // Check for NULL UserID
        const nullUserResult = await pool.request().query("SELECT COUNT(*) as count FROM Orders WHERE UserID IS NULL");
        console.log('Orders with NULL UserID:', nullUserResult.recordset[0].count);

        // Check for Invalid UserID
        const invalidUserResult = await pool.request().query("SELECT COUNT(*) as count FROM Orders o LEFT JOIN Users u ON o.UserID = u.UserID WHERE u.UserID IS NULL AND o.UserID IS NOT NULL");
        console.log('Orders with Invalid UserID:', invalidUserResult.recordset[0].count);

        await pool.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

debugOrders();
