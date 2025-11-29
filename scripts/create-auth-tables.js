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

async function createTables() {
    try {
        console.log('Connecting to database...');
        const pool = await sql.connect(sqlConfig);

        console.log('Creating Users table...');
        await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' and xtype='U')
      CREATE TABLE Users (
        UserID INT IDENTITY(1,1) PRIMARY KEY,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        Name NVARCHAR(255),
        Image NVARCHAR(MAX),
        CreatedAt DATETIME DEFAULT GETDATE()
      );
    `);

        console.log('Creating Wishlists table...');
        await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Wishlists' and xtype='U')
      CREATE TABLE Wishlists (
        WishlistID INT IDENTITY(1,1) PRIMARY KEY,
        UserID INT NOT NULL,
        SareeID INT NOT NULL,
        AddedAt DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
        FOREIGN KEY (SareeID) REFERENCES Sarees(SareeID) ON DELETE CASCADE,
        UNIQUE(UserID, SareeID)
      );
    `);

        console.log('Tables created successfully!');
        await pool.close();
    } catch (err) {
        console.error('Error creating tables:', err);
    }
}

createTables();
