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
        console.log('Testing connection to:', sqlConfig.server);
        console.log('Database:', sqlConfig.database);

        const pool = await sql.connect(sqlConfig);
        console.log('Connected successfully!');

        const result = await pool.request().query('SELECT @@VERSION as version');
        console.log('SQL Version:', result.recordset[0].version);

        const countResult = await pool.request().query('SELECT COUNT(*) as count FROM Sarees');
        console.log('Sarees count:', countResult.recordset[0].count);

        await pool.close();
    } catch (err) {
        console.error('Connection failed:', err);
    }
}

testConnection();
