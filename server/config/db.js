const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dineverse';
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`✨ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failure: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
