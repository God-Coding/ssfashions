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

async function refactorImages() {
    try {
        const pool = await sql.connect(sqlConfig);

        // 1. Update Saree ID 9 with comma-separated images
        // Using the previous dummy links combined
        const combinedImages = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80,https://images.unsplash.com/photo-1583391733958-e026b1346375?w=800&q=80';

        await pool.request().query(`
            UPDATE Sarees 
            SET ImageURL = '${combinedImages}'
            WHERE SareeID = 9
        `);
        console.log('Updated Saree 9 with comma-separated images.');

        // 2. Drop ImageURL2 and ImageURL3
        try {
            await pool.request().query(`
                IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Sarees]') AND name = 'ImageURL2')
                BEGIN
                    ALTER TABLE Sarees DROP COLUMN ImageURL2;
                    PRINT 'Dropped ImageURL2';
                END
                
                IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Sarees]') AND name = 'ImageURL3')
                BEGIN
                    ALTER TABLE Sarees DROP COLUMN ImageURL3;
                    PRINT 'Dropped ImageURL3';
                END
            `);
            console.log('Dropped extra columns.');
        } catch (err) {
            console.error('Error dropping columns:', err);
        }

        await pool.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

refactorImages();
