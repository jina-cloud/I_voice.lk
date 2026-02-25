const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const initCronJob = require('./cron/newsFetcher');
const newsRoutes = require('./routes/newsRoutes');

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Mount Routes
app.use('/api', newsRoutes);

// Connect to DB first, then start cron job
const startServer = async () => {
  await connectDB(); // Wait until MongoDB is connected
  initCronJob();     // Then start the automated cron fetcher
};
startServer();

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
