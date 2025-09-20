require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    console.log('URI:', process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:[^:@]*@/, ':****@') : 'Not found');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    // Simplified connection options
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🖥️  Host:', mongoose.connection.host);
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ test: String, createdAt: { type: Date, default: Date.now } });
    const TestModel = mongoose.model('ConnectionTest', testSchema);
    
    const testDoc = new TestModel({ test: 'Connection test successful' });
    await testDoc.save();
    console.log('✅ Successfully created test document');
    
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Successfully deleted test document');
    
    await mongoose.connection.close();
    console.log('✅ Connection test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    if (error.name === 'MongoServerError') {
      console.error('MongoDB Server Error - Check your credentials and network access');
    }
    process.exit(1);
  }
};

testConnection();