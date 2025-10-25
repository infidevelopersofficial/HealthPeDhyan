#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const { Client } = require('pg');

async function testLogin() {
  const email = 'admin@healthpedhyan.com';
  const password = 'admin123';

  console.log('🧪 Testing login flow...\n');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('');

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'healthpedhyan',
    user: 'healthpedhyan',
    password: 'healthpedhyan',
  });

  try {
    // Connect
    console.log('1. Connecting to database...');
    await client.connect();
    console.log('✅ Connected!');
    console.log('');

    // Find user
    console.log('2. Looking up user...');
    const result = await client.query(
      'SELECT id, email, name, role, "passwordHash" FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('❌ User not found!');
      console.log('\nRun: pnpm admin:create');
      return;
    }

    const user = result.rows[0];
    console.log('✅ User found:', user.email);
    console.log('   Name:', user.name);
    console.log('   Role:', user.role);
    console.log('   Hash:', user.passwordHash.substring(0, 20) + '...');
    console.log('');

    // Test password
    console.log('3. Testing password...');
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (isValid) {
      console.log('✅ Password is CORRECT!');
      console.log('');
      console.log('🎉 Login credentials are valid!');
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📱 Login at: http://localhost:3000/admin/login');
      console.log('📧 Email:', email);
      console.log('🔑 Password:', password);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('💡 If login still fails:');
      console.log('   1. Make sure the dev server is running: pnpm dev');
      console.log('   2. Check DATABASE_URL in .env matches database credentials');
      console.log('   3. Clear browser cache and try again');
    } else {
      console.log('❌ Password is INCORRECT!');
      console.log('');
      console.log('Run: pnpm admin:create');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 PostgreSQL is not running. Start it with:');
      console.log('   service postgresql start');
    } else if (error.code === '28P01') {
      console.log('\n💡 Database authentication failed. Check credentials.');
    }
  } finally {
    await client.end();
  }
}

testLogin();
