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

async function checkSaree() {
    try {
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request()
            .query("SELECT * FROM Sarees WHERE SareeID = 9");
        console.log('Saree 9 Data:', result.recordset[0]);
        await pool.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkSaree();
