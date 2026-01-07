#!/usr/bin/env node
// MongoDB Authentication Setup Script
// Run this to create a secure user for your production database

import { MongoClient } from 'mongodb';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupMongoAuth() {
  console.log('🔐 MongoDB Authentication Setup\n');
  console.log('This script will help you create a secure MongoDB user.\n');

  try {
    // Get user inputs
    const dbName = await question('Database name [weather-app]: ') || 'weather-app';
    const username = await question('Username [weatherapp_user]: ') || 'weatherapp_user';
    const password = await question('Password (min 16 chars): ');

    if (password.length < 16) {
      console.error('❌ Password must be at least 16 characters long!');
      process.exit(1);
    }

    const mongoUrl = await question('MongoDB URL [mongodb://localhost:27017]: ') || 'mongodb://localhost:27017';

    console.log('\n📋 Configuration:');
    console.log(`   Database: ${dbName}`);
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${'*'.repeat(password.length)}`);
    console.log(`   MongoDB URL: ${mongoUrl}\n`);

    const confirm = await question('Proceed? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ Cancelled.');
      process.exit(0);
    }

    console.log('\n🔄 Connecting to MongoDB...');
    const client = new MongoClient(mongoUrl);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    // Switch to admin database to create user
    const adminDb = client.db('admin');

    console.log('\n🔄 Creating user...');
    
    try {
      await adminDb.command({
        createUser: username,
        pwd: password,
        roles: [
          { role: 'readWrite', db: dbName },
          { role: 'dbAdmin', db: dbName }
        ]
      });
      console.log('✅ User created successfully!');
    } catch (error) {
      if (error.codeName === 'DuplicateKey') {
        console.log('⚠️  User already exists. Updating password...');
        await adminDb.command({
          updateUser: username,
          pwd: password
        });
        console.log('✅ Password updated successfully!');
      } else {
        throw error;
      }
    }

    await client.close();

    // Generate connection string
    const authUrl = `mongodb://${username}:${password}@localhost:27017/${dbName}?authSource=admin`;

    console.log('\n' + '═'.repeat(70));
    console.log('\n✅ MongoDB Authentication Setup Complete!\n');
    console.log('Add this to your production .env file:\n');
    console.log(`MONGODB_URI=${authUrl}\n`);
    console.log('═'.repeat(70));

    console.log('\n📝 Next Steps:');
    console.log('1. Enable MongoDB authentication in mongod.conf:');
    console.log('   security:');
    console.log('     authorization: enabled');
    console.log('\n2. Restart MongoDB service');
    console.log('\n3. Update your .env file with the connection string above');
    console.log('\n4. Test the connection with your application\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupMongoAuth();
