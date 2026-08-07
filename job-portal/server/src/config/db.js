const mongoose = require('mongoose');

let isConnected = false;
let useMock = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hirepulse', {
      serverSelectionTimeoutMS: 2500, // Quick fallback if MongoDB is not running locally
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database] Local MongoDB unavailable (${error.message}). Switched to in-memory dynamic data store.`);
    useMock = true;
  }
};

const getDbState = () => ({ isConnected, useMock });

module.exports = { connectDB, getDbState };
