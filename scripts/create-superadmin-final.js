const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function createSuperAdmin() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'eduverse',
    user: 'ashokverma',
    password: '',
  });

  try {
    await client.connect();
    
    // Create platform tenant
    let tenantResult = await client.query("SELECT id FROM tenants WHERE subdomain = 'platform'");
    let tenantId;
    
    if (tenantResult.rows.length === 0) {
      tenantResult = await client.query(`
        INSERT INTO tenants (name, subdomain, "isActive") 
        VALUES ('Platform', 'platform', true) 
        RETURNING id
      `);
      tenantId = tenantResult.rows[0].id;
    } else {
      tenantId = tenantResult.rows[0].id;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create super admin user
    await client.query(`
      INSERT INTO users ("tenantId", email, "passwordHash", "firstName", "lastName", role, "isActive")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO UPDATE SET
        "passwordHash" = EXCLUDED."passwordHash",
        role = EXCLUDED.role
    `, [tenantId, 'superadmin@demo.com', hashedPassword, 'Super', 'Admin', 'super_admin', true]);

    console.log('✅ Super Admin Account Created Successfully!');
    console.log('');
    console.log('Login Details:');
    console.log('Email: superadmin@demo.com');
    console.log('Password: admin123');
    console.log('');
    console.log('API Login:');
    console.log('POST http://localhost:3001/auth/login');
    console.log('Headers: {"x-tenant": "platform"}');
    console.log('Body: {"email":"superadmin@demo.com","password":"admin123"}');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

createSuperAdmin();