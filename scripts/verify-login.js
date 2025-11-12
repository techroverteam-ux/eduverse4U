const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function verifyLogin() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'eduverse',
    user: 'ashokverma',
    password: '',
  });

  try {
    await client.connect();
    
    // Check platform tenant
    const tenant = await client.query("SELECT * FROM tenants WHERE subdomain = 'platform'");
    console.log('Platform tenant found:', tenant.rows.length > 0);
    
    if (tenant.rows.length > 0) {
      const tenantId = tenant.rows[0].id;
      console.log('Tenant ID:', tenantId);
      
      // Check user
      const user = await client.query("SELECT * FROM users WHERE email = 'superadmin@demo.com'");
      console.log('User found:', user.rows.length > 0);
      
      if (user.rows.length > 0) {
        console.log('User details:', {
          email: user.rows[0].email,
          role: user.rows[0].role,
          tenantId: user.rows[0].tenantId,
          isActive: user.rows[0].isActive
        });
        
        // Test password
        const isValidPassword = await bcrypt.compare('admin123', user.rows[0].passwordHash);
        console.log('Password valid:', isValidPassword);
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

verifyLogin();