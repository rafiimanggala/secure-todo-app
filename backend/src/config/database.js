const { Pool } = require('pg');

const adminPool = new Pool({
  host: process.env.DB_HOST || 'database',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'patient_db',
  user: process.env.DB_ADMIN_USER || 'admin_user',
  password: process.env.DB_ADMIN_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? {
    ca: process.env.DB_CA_CERT || undefined,
    rejectUnauthorized: false
  } : false,
  max: 20
});

const testConnection = async () => {
  try {
    const client = await adminPool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connection established');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

const getPoolByRole = (role) => {
  return adminPool;
};

module.exports = { adminPool, getPoolByRole, testConnection };
