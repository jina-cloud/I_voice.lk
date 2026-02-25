const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error('[DB] MONGO_URI environment variable is not set!');
        console.error('[DB] Please add MONGO_URI in Railway → Variables tab.');
        process.exit(1);
    }

    try {
        console.log('[DB] Connecting to MongoDB Atlas...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            bufferCommands: false,
            family: 4,
        });
        console.log(`[DB] Atlas connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`[DB] MongoDB connection failed: ${err.message}`);
        console.error('[DB] Check your MONGO_URI and Atlas Network Access (allow 0.0.0.0/0).');
        process.exit(1);
    }
};

module.exports = connectDB;
