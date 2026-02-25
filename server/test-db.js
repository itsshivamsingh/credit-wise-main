// Database Connection Test Script
// Run with: node test-db.js

require('dotenv').config();
const mongoose = require('mongoose');

console.log('\n========================================');
console.log('CreditWise Database Connection Test');
console.log('========================================\n');

// Check environment variables
console.log('🔍 Checking environment variables...');
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.log('❌ ERROR: MONGO_URI is not set');
  console.log('📝 Please add MONGO_URI to your .env file');
  console.log('   Example: MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/creditwise');
  process.exit(1);
}

if (mongoUri.includes('localhost')) {
  console.log('⚠️  WARNING: Using local MongoDB (not MongoDB Atlas)');
} else {
  console.log('✅ MONGO_URI is set (MongoDB Atlas)');
}

console.log('   Connection string:', mongoUri.substring(0, 50) + '...');

// Test connection
console.log('\n🔗 Attempting to connect to MongoDB...');

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ SUCCESS: Connected to MongoDB!');
    
    console.log('\n📊 Database Information:');
    console.log('   Database Name:', mongoose.connection.db.databaseName);
    console.log('   Host:', mongoose.connection.host);
    console.log('   Port:', mongoose.connection.port);
    
    console.log('\n✨ Your CreditWise database is ready!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run: cd server && npm start');
    console.log('   2. Open: http://localhost:8000');
    console.log('   3. Register a new user');
    console.log('   4. Check Collections in MongoDB Atlas');
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ ERROR: Could not connect to MongoDB');
    console.log('   Error:', err.message);
    
    if (err.message.includes('authentication failed')) {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check username and password in MONGO_URI');
      console.log('   - Make sure password doesn\'t have special characters (URL encode if needed)');
      console.log('   - Reset password in MongoDB Atlas if unsure');
    }
    
    if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Check internet connection');
      console.log('   - Verify cluster name in connection string');
      console.log('   - Make sure cluster is running in MongoDB Atlas');
    }
    
    if (err.message.includes('IP')) {
      console.log('\n💡 Troubleshooting:');
      console.log('   - Add your IP to Network Access in MongoDB Atlas');
      console.log('   - Or add 0.0.0.0/0 (allows all IPs - development only)');
    }
    
    console.log('\n📖 For help, see DATABASE_SETUP.md or MONGO_QUICK_START.md');
    process.exit(1);
  });
