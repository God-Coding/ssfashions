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
        console.log('User:', process.env.DB_USER);

        const pool = await sql.connect(sqlConfig);
        console.log('✅ Connected successfully!');

        // Test query to get sarees
        const result = await pool.request().query('SELECT TOP 5 SareeID, Name, Price, ImageURL FROM Sarees ORDER BY UploadDate DESC');

        console.log('\n📊 Sample Sarees:');
        console.log('Total sarees found:', result.recordset.length);

        result.recordset.forEach((saree, index) => {
            console.log(`\n${index + 1}. ${saree.Name}`);
            console.log(`   ID: ${saree.SareeID}`);
            console.log(`   Price: ₹${saree.Price}`);
            console.log(`   ImageURL: ${saree.ImageURL ? saree.ImageURL.substring(0, 100) + '...' : 'NULL'}`);
        });

        await pool.close();
        console.log('\n✅ Test completed successfully!');

    } catch (err) {
        console.error('❌ Database test failed:', err.message);
        console.error('Full error:', err);
    }
}

testConnection();
