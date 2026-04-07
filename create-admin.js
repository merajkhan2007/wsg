const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createAdmin() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Neon database.');
    
    const email = 'admin@wesoulgifts.com';
    const password = 'adminpassword123';
    const name = 'System Admin';

    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log('Admin user already exists!');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await client.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'admin')",
      [name, email, hashedPassword]
    );
    
    console.log('Admin user created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (err) {
    console.error('Error creating admin:');
    console.error(err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createAdmin();
