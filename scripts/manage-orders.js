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

async function manageOrders() {
    try {
        const pool = await sql.connect(sqlConfig);

        // 1. Check Count
        const countResult = await pool.request().query("SELECT COUNT(*) as count FROM Orders");
        const count = countResult.recordset[0].count;
        console.log(`Current Order Count: ${count}`);

        if (count === 0) {
            console.log('No orders found. Creating a test order...');

            // Get a user and a saree to link to
            const userRes = await pool.request().query("SELECT TOP 1 UserID FROM Users");
            const sareeRes = await pool.request().query("SELECT TOP 1 SareeID FROM Sarees");

            if (userRes.recordset.length > 0 && sareeRes.recordset.length > 0) {
                const userId = userRes.recordset[0].UserID;
                const sareeId = sareeRes.recordset[0].SareeID;

                await pool.request()
                    .input('userId', sql.Int, userId)
                    .input('sareeId', sql.Int, sareeId)
                    .input('amount', sql.Decimal, 1500.00)
                    .input('address', sql.NVarChar, '123 Test St, Demo City')
                    .query(`
                        INSERT INTO Orders (UserID, SareeID, OrderDate, Status, Amount, PaymentMethod, PaymentStatus, Address)
                        VALUES (@userId, @sareeId, GETDATE(), 'Pending', @amount, 'COD', 'Pending', @address)
                    `);
                console.log('Test order created successfully.');
            } else {
                console.log('Cannot create test order: No users or sarees found in DB.');
            }
        } else {
            console.log('Orders exist. The dashboard should show them.');
            // List them to be sure
            const orders = await pool.request().query("SELECT OrderID, Status FROM Orders");
            console.table(orders.recordset);
        }

        await pool.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

manageOrders();
