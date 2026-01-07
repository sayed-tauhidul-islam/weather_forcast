import fetch from 'node-fetch';

console.log('🔍 Testing API Endpoints...\n');

const API_BASE = 'http://localhost:5000/api';

async function testEndpoint(name, url, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);
    
    const response = await fetch(`${API_BASE}${url}`, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name}: SUCCESS`);
      return { success: true, data };
    } else {
      console.log(`⚠️  ${name}: ${data.error || 'Failed'}`);
      return { success: false, error: data.error };
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  // Test 1: Health Check
  await testEndpoint('Health Check', '/health');
  
  // Test 2: Weather API (without auth)
  await testEndpoint('Weather API', '/weather/forecast?lat=23.8103&lon=90.4125');
  
  // Test 3: Register User
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'Test123!',
    name: 'Test User'
  };
  const registerResult = await testEndpoint('Register User', '/auth/register', 'POST', testUser);
  
  if (registerResult.success && registerResult.data.token) {
    console.log(`\n🔑 JWT Token received: ${registerResult.data.token.substring(0, 20)}...`);
    
    // Test 4: Get Profile (with auth)
    const profileResult = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${registerResult.data.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (profileResult.ok) {
      const profile = await profileResult.json();
      console.log(`✅ Get Profile: SUCCESS`);
      console.log(`   Email: ${profile.email}`);
      console.log(`   Name: ${profile.name}`);
      console.log(`   Email Verified: ${profile.emailVerified}`);
      console.log(`   2FA Enabled: ${profile.twoFactorEnabled}`);
    }
  }
  
  console.log('\n✅ API Testing Complete!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
