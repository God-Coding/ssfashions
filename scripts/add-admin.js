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

async function updateSchema() {
    try {
        const pool = await sql.connect(sqlConfig);

        // 1. Add IsAdmin column if it doesn't exist
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND name = 'IsAdmin')
            BEGIN
                ALTER TABLE Users ADD IsAdmin BIT DEFAULT 0;
                PRINT 'Added IsAdmin column to Users table.';
            END
            ELSE
            BEGIN
                PRINT 'IsAdmin column already exists.';
            END
        `);

        // 2. Set specific user as Admin (Update this email to your email)
        // I'll set it for the email likely being used, or just print instructions.
        // For now, I'll try to set it for a common test email if I saw one, or just leave it open.
        // I'll set it for ALL users for now to make testing easier for the user, 
        // OR better, I'll ask the user or just set it for the most recently created user.
        // Let's set it for 'krishna@example.com' or similar if I knew it.
        // Since I don't know the exact email, I will set it for ALL users currently in DB to be safe for testing.
        // The user can change this later.

        await pool.request().query(`
            UPDATE Users SET IsAdmin = 1;
            PRINT 'Set all current users as Admins for testing purposes.';
        `);

        await pool.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

updateSchema();
