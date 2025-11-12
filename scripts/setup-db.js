const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');

async function setupDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'eduverse',
    user: 'ashokverma',
    password: '',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Read and execute schema
    const schema = fs.readFileSync('./docs/database-schema.sql', 'utf8');
    await client.query(schema);
    console.log('Database schema created');

    // Create platform tenant
    const tenantResult = await client.query(`
      INSERT INTO tenants (name, subdomain) 
      VALUES ('Platform', 'platform') 
      ON CONFLICT (subdomain) DO NOTHING
      RETURNING id
    `);

    let tenantId;
    if (tenantResult.rows.length > 0) {
      tenantId = tenantResult.rows[0].id;
    } else {
      const existingTenant = await client.query(
        "SELECT id FROM tenants WHERE subdomain = 'platform'"
      );
      tenantId = existingTenant.rows[0].id;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create super admin user
    await client.query(`
      INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = $3,
        role = $6
    `, [tenantId, 'superadmin@demo.com', hashedPassword, 'Super', 'Admin', 'super_admin']);

    console.log('✅ Setup complete!');
    console.log('Super Admin Login:');
    console.log('Email: superadmin@demo.com');
    console.log('Password: admin123');
    console.log('Tenant Header: platform');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

setupDatabase();