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

async function addTransactionIdColumn() {
    try {
        console.log('Connecting to database...');
        const pool = await sql.connect(sqlConfig);
        console.log('Connected successfully!');

        // Add TransactionID column to Orders table
        console.log('Adding TransactionID column to Orders table...');
        try {
            await pool.request().query(`
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Orders]') AND name = 'TransactionID')
                BEGIN
                    ALTER TABLE Orders ADD TransactionID NVARCHAR(100) NULL;
                    PRINT 'Added TransactionID column';
                END
                ELSE
                BEGIN
                    PRINT 'TransactionID column already exists';
                END
            `);
            console.log('TransactionID column check completed.');
        } catch (err) {
            console.error('Error adding TransactionID column:', err);
        }

        await pool.close();
        console.log('Database update finished.');

    } catch (err) {
        console.error('Database update failed:', err);
    }
}

addTransactionIdColumn();
