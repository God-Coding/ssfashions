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

async function seedDatabase() {
    try {
        console.log('Connecting to database...');
        const pool = await sql.connect(sqlConfig);

        console.log('Seeding data...');
        const result = await pool.request().query(`
      INSERT INTO Sarees (Name, Price, ImageURL, Description, PurchaseCount) VALUES 
      ('Royal Banarasi Silk', 12500.00, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', 'Traditional red Banarasi silk saree with intricate gold zari work.', 150),
      ('Kanjivaram Gold Weave', 18000.00, 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80', 'Luxurious Kanjivaram saree in deep maroon with pure gold weave.', 85),
      ('Chanderi Cotton Silk', 4500.00, 'https://images.unsplash.com/photo-1583391733958-e026b1346375?w=800&q=80', 'Lightweight and elegant Chanderi saree, perfect for summer occasions.', 42),
      ('Mysore Silk Crepe', 8900.00, 'https://images.unsplash.com/photo-1610030469668-965d05a1b9f5?w=800&q=80', 'Soft and smooth Mysore silk saree with geometric prints.', 67),
      ('Paithani Peacock Design', 22000.00, 'https://images.unsplash.com/photo-1610030469841-29e71953d63d?w=800&q=80', 'Exquisite Paithani saree featuring traditional peacock motifs on the pallu.', 25);
    `);

        console.log('Rows affected:', result.rowsAffected);
        console.log('Seeding completed successfully!');

        await pool.close();
    } catch (err) {
        console.error('Seeding failed:', err);
    }
}

seedDatabase();
