#!/usr/bin/env node
// Generate secure random secrets for production environment

import crypto from 'crypto';

console.log('🔐 Generating secure secrets for production...\n');

// Generate secrets
const generateSecret = (length = 32) => {
  return crypto.randomBytes(length).toString('base64');
};

const jwtSecret = generateSecret(64);
const sessionSecret = generateSecret(64);
const encryptionKey = generateSecret(32);

console.log('Copy these values to your production .env file:\n');
console.log('═'.repeat(60));
console.log('\n# Security Secrets (CHANGE THESE!)');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`\nSESSION_SECRET=${sessionSecret}`);
console.log(`\nENCRYPTION_KEY=${encryptionKey}`);
console.log('\n' + '═'.repeat(60));

console.log('\n⚠️  IMPORTANT:');
console.log('1. Never commit these secrets to version control');
console.log('2. Store them securely (use a password manager)');
console.log('3. Use different secrets for each environment');
console.log('4. Rotate secrets periodically\n');

// Save to file (optional)
import fs from 'fs';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const filename = `secrets-${timestamp}.txt`;

try {
  fs.writeFileSync(
    filename,
    `# Generated on ${new Date().toISOString()}\n\n` +
    `JWT_SECRET=${jwtSecret}\n` +
    `SESSION_SECRET=${sessionSecret}\n` +
    `ENCRYPTION_KEY=${encryptionKey}\n`
  );
  console.log(`✅ Secrets also saved to: ${filename}`);
  console.log('   (Delete this file after copying the values!)\n');
} catch (error) {
  console.error('❌ Could not save secrets to file:', error.message);
}
