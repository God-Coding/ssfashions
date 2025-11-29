import sql from 'mssql';

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
    encrypt: true, // for azure
    trustServerCertificate: false // change to true for local dev / self-signed certs
  }
};

export async function getPool() {
  try {
    const pool = await sql.connect(sqlConfig);
    return pool;
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
}
