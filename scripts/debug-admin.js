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

async function checkData() {
    try {
        const pool = await sql.connect(sqlConfig);

        console.log('--- Users ---');
        const users = await pool.request().query("SELECT UserID, Email, Name, IsAdmin FROM Users");
        console.table(users.recordset);

        console.log('\n--- Orders ---');
        const orders = await pool.request().query("SELECT TOP 5 OrderID, UserID, SareeID, Status FROM Orders");
        console.table(orders.recordset);

        console.log('\n--- Admin Query Test ---');
        // Simulate the query used in the API
        try {
            const result = await pool.request().query(`
                SELECT 
                    o.OrderID, o.OrderDate, o.Status, o.Amount, o.PaymentMethod, o.PaymentStatus,
                    s.Name as SareeName, s.ImageURL,
                    u.Name as UserName, u.Email as UserEmail,
                    o.Address
                FROM Orders o
                JOIN Sarees s ON o.SareeID = s.SareeID
                JOIN Users u ON o.UserID = u.UserID
                ORDER BY o.OrderDate DESC
            `);
            console.log(`Found ${result.recordset.length} orders in Admin Query.`);
            if (result.recordset.length > 0) {
                console.log('Sample Order:', result.recordset[0]);
            }
        } catch (err) {
            console.error('Error in Admin Query:', err);
        }

        await pool.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkData();
