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

async function updateSareeImages() {
    try {
        const pool = await sql.connect(sqlConfig);

        // Update Saree ID 9 with dummy images for testing
        await pool.request().query(`
            UPDATE Sarees 
            SET 
                ImageURL2 = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', 
                ImageURL3 = 'https://images.unsplash.com/photo-1583391733958-e026b1346375?w=800&q=80'
            WHERE SareeID = 9
        `);

        console.log('Updated Saree 9 with multiple images.');
        await pool.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

updateSareeImages();
