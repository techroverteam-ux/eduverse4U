const { Client } = require('pg');

async function checkDB() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'eduverse',
    user: 'ashokverma',
    password: '',
  });

  try {
    await client.connect();
    
    // Check tenants table structure
    const tenants = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'tenants'
    `);
    console.log('Tenants table columns:', tenants.rows);

    // Check users table structure  
    const users = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    console.log('Users table columns:', users.rows);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkDB();