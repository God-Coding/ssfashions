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
        console.log('Connecting to database...');
        const pool = await sql.connect(sqlConfig);
        console.log('Connected successfully!');

        // 1. Add ImageURL2 and ImageURL3 to Sarees table if they don't exist
        console.log('Checking/Adding ImageURL columns...');
        try {
            await pool.request().query(`
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Sarees]') AND name = 'ImageURL2')
                BEGIN
                    ALTER TABLE Sarees ADD ImageURL2 NVARCHAR(MAX);
                    PRINT 'Added ImageURL2';
                END
                
                IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Sarees]') AND name = 'ImageURL3')
                BEGIN
                    ALTER TABLE Sarees ADD ImageURL3 NVARCHAR(MAX);
                    PRINT 'Added ImageURL3';
                END
            `);
            console.log('ImageURL columns check completed.');
        } catch (err) {
            console.error('Error adding columns:', err);
        }

        // 2. Create Orders table
        console.log('Creating Orders table...');
        try {
            await pool.request().query(`
                IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Orders]') AND type in (N'U'))
                BEGIN
                    CREATE TABLE Orders (
                        OrderID INT IDENTITY(1,1) PRIMARY KEY,
                        UserID INT, -- Can be nullable for guest checkout if needed, or link to Users
                        SareeID INT NOT NULL,
                        Amount DECIMAL(10, 2) NOT NULL,
                        PaymentMethod NVARCHAR(50) NOT NULL, -- 'COD', 'UPI', 'Card', etc.
                        PaymentStatus NVARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Paid', 'Failed'
                        ShippingAddress NVARCHAR(MAX) NOT NULL,
                        OrderDate DATETIME DEFAULT GETDATE(),
                        Status NVARCHAR(50) DEFAULT 'Placed', -- 'Placed', 'Shipped', 'Delivered', 'Cancelled'
                        FOREIGN KEY (SareeID) REFERENCES Sarees(SareeID)
                        -- FOREIGN KEY (UserID) REFERENCES Users(UserID) -- Optional: Enable if strictly enforcing user login
                    );
                    PRINT 'Orders table created.';
                END
                ELSE
                BEGIN
                    PRINT 'Orders table already exists.';
                END
            `);
            console.log('Orders table check completed.');
        } catch (err) {
            console.error('Error creating Orders table:', err);
        }

        await pool.close();
        console.log('Schema update finished.');

    } catch (err) {
        console.error('Database update failed:', err);
    }
}

updateSchema();
