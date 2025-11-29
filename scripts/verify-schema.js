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

async function verifySchema() {
    try {
        console.log('Connecting to database...');
        const pool = await sql.connect(sqlConfig);
        console.log('Connected successfully!');

        // Check Sarees columns
        const columnsResult = await pool.request().query(`
            SELECT name FROM sys.columns 
            WHERE object_id = OBJECT_ID(N'[dbo].[Sarees]') 
            AND name IN ('ImageURL2', 'ImageURL3')
        `);
        console.log('Sarees new columns:', columnsResult.recordset);

        // Check Orders table
        const tablesResult = await pool.request().query(`
            SELECT name FROM sys.objects 
            WHERE object_id = OBJECT_ID(N'[dbo].[Orders]') 
            AND type in (N'U')
        `);
        console.log('Orders table found:', tablesResult.recordset.length > 0);

        await pool.close();
    } catch (err) {
        console.error('Verification failed:', err);
    }
}

verifySchema();
