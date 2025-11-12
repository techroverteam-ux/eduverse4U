const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'eduverse',
    user: 'ashokverma',
    password: '',
  });

  try {
    await client.connect();
    
    // Get or create platform tenant
    let tenantResult = await client.query("SELECT id FROM tenants WHERE subdomain = 'platform'");
    let tenantId;
    
    if (tenantResult.rows.length === 0) {
      tenantResult = await client.query(`
        INSERT INTO tenants (name, subdomain) 
        VALUES ('Platform', 'platform') 
        RETURNING id
      `);
      tenantId = tenantResult.rows[0].id;
    } else {
      tenantId = tenantResult.rows[0].id;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create/update super admin
    await client.query(`
      INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role
    `, [tenantId, 'superadmin@demo.com', hashedPassword, 'Super', 'Admin', 'super_admin']);

    console.log('✅ Super Admin created!');
    console.log('Login with:');
    console.log('POST http://localhost:3001/auth/login');
    console.log('Headers: x-tenant: platform');
    console.log('Body: {"email":"superadmin@demo.com","password":"admin123"}');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

createAdmin();