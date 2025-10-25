#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testLogin() {
  const email = 'admin@healthpedhyan.com';
  const password = 'admin123';

  console.log('🧪 Testing login flow...\n');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('');

  try {
    // Find user
    console.log('1. Looking up user in database...');
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('❌ User not found!');
      return;
    }

    console.log('✅ User found:', user.email);
    console.log('   Role:', user.role);
    console.log('   Hash:', user.passwordHash.substring(0, 20) + '...');
    console.log('');

    // Test password
    console.log('2. Testing password...');
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (isValid) {
      console.log('✅ Password is correct!');
      console.log('');
      console.log('🎉 Login should work!');
      console.log('');
      console.log('Try logging in at: http://localhost:3000/admin/login');
      console.log('Email:', email);
      console.log('Password:', password);
    } else {
      console.log('❌ Password is incorrect!');
      console.log('');
      console.log('To reset password, run: pnpm admin:create');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);

    if (error.code === 'P1001') {
      console.log('\n💡 Cannot connect to database. Make sure:');
      console.log('   1. PostgreSQL is running: service postgresql status');
      console.log('   2. DATABASE_URL in .env is correct');
      console.log('   Current DATABASE_URL:', process.env.DATABASE_URL);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
