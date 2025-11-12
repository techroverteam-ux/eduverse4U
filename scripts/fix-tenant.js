const { Client } = require('pg');

async function fixTenant() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'eduverse',
    user: 'ashokverma',
    password: '',
  });

  try {
    await client.connect();
    
    // Check existing tenants
    const existing = await client.query("SELECT * FROM tenants");
    console.log('Existing tenants:', existing.rows);

    // Create platform tenant with correct columns
    await client.query(`
      INSERT INTO tenants (name, subdomain, "isActive") 
      VALUES ('Platform', 'platform', true) 
      ON CONFLICT (subdomain) DO UPDATE SET
        name = 'Platform',
        "isActive" = true
    `);

    // Verify tenant created
    const platform = await client.query("SELECT * FROM tenants WHERE subdomain = 'platform'");
    console.log('Platform tenant:', platform.rows[0]);

    console.log('✅ Platform tenant fixed!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

fixTenant();