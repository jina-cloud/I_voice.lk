const mongoose = require('mongoose');

mongoose.set('bufferCommands', false);

const connectDB = async () => {
    // --- Try Atlas first ---
    if (process.env.MONGO_URI) {
        try {
            console.log('[DB] Attempting to connect to MongoDB Atlas...');
            const conn = await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 8000,
                bufferCommands: false,
                family: 4,
            });
            console.log(`[DB] Atlas connected: ${conn.connection.host}`);
            return;
        } catch (atlasErr) {
            console.warn(`[DB] Atlas failed (${atlasErr.message}). Falling back to in-memory MongoDB...`);
        }
    }

    // --- Fallback: in-memory MongoDB (works offline / IP not whitelisted) ---
    try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const conn = await mongoose.connect(uri, { bufferCommands: false });
        console.log(`[DB] In-memory MongoDB connected: ${conn.connection.host}`);
        console.warn('[DB] ⚠️  Using in-memory DB — data will be lost on restart. Add your IP to Atlas Network Access for persistence.');
    } catch (memErr) {
        console.error('[DB] Failed to start in-memory MongoDB:', memErr.message);
        process.exit(1);
    }
};

module.exports = connectDB;
