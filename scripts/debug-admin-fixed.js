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

async function debugAdminQuery() {
    try {
        const pool = await sql.connect(sqlConfig);

        console.log('--- Executing Admin API Query (LEFT JOIN) ---');
        const result = await pool.request().query(`
            SELECT 
                o.OrderID, o.OrderDate, o.Status, o.Amount, o.PaymentMethod, o.PaymentStatus,
                s.Name as SareeName, s.ImageURL,
                u.Name as UserName, u.Email as UserEmail,
                o.Address
            FROM Orders o
            LEFT JOIN Sarees s ON o.SareeID = s.SareeID
            LEFT JOIN Users u ON o.UserID = u.UserID
            ORDER BY o.OrderDate DESC
        `);

        console.log(`Total Records Found: ${result.recordset.length}`);
        if (result.recordset.length > 0) {
            console.log('First Record:', JSON.stringify(result.recordset[0], null, 2));
        } else {
            console.log('No records found. The Orders table might be empty.');
        }

        await pool.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

debugAdminQuery();
