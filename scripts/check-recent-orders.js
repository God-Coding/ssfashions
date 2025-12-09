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

async function checkRecentOrders() {
    try {
        console.log('Checking recent orders...');
        const pool = await sql.connect(sqlConfig);

        // Get last 5 orders
        const result = await pool.request().query(`
            SELECT TOP 5 
                o.OrderID, 
                o.OrderDate, 
                o.Amount, 
                o.PaymentMethod, 
                o.PaymentStatus,
                o.UserID,
                o.TransactionID,
                s.Name as SareeName
            FROM Orders o
            LEFT JOIN Sarees s ON o.SareeID = s.SareeID
            ORDER BY o.OrderDate DESC
        `);

        console.log('\n📊 Recent Orders:');
        console.log('Total orders found:', result.recordset.length);

        result.recordset.forEach((order, index) => {
            console.log(`\n${index + 1}. Order #${order.OrderID}`);
            console.log(`   Date: ${order.OrderDate}`);
            console.log(`   Saree: ${order.SareeName || 'N/A'}`);
            console.log(`   Amount: ₹${order.Amount}`);
            console.log(`   Payment: ${order.PaymentMethod} (${order.PaymentStatus})`);
            console.log(`   UserID: ${order.UserID || 'NULL (Guest)'}`);
            console.log(`   TransactionID: ${order.TransactionID || 'N/A'}`);
        });

        await pool.close();
        console.log('\n✅ Check completed!');

    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

checkRecentOrders();
