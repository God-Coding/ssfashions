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

async function testConnection() {
    try {
        console.log('Testing database connection...');
        console.log('Server:', process.env.DB_SERVER);
        console.log('Database:', process.env.DB_NAME);

        const pool = await sql.connect(sqlConfig);
        console.log('✅ Connected successfully!');

        // Test getting sarees
        const sareeResult = await pool.request().query('SELECT TOP 3 SareeID, Name FROM Sarees');
        console.log('\n📦 Sample Sarees:', sareeResult.recordset);

        // Test getting orders
        const orderResult = await pool.request().query('SELECT TOP 5 OrderID, Amount, PaymentMethod, OrderDate FROM Orders ORDER BY OrderDate DESC');
        console.log('\n📋 Recent Orders:', orderResult.recordset);

        await pool.close();
        console.log('\n✅ Database is working fine!');

    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

testConnection();
