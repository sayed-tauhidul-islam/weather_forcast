import mongoose from 'mongoose';

console.log('🔍 Testing MongoDB Connection...');

mongoose.connect('mongodb://localhost:27017/weather-app')
  .then(() => {
    console.log('✅ MongoDB Connection: SUCCESS');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('✅ Connection closed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection: FAILED');
    console.error('Error:', err.message);
    process.exit(1);
  });
