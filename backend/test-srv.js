const mongoose = require('mongoose');

const uri = "mongodb+srv://jinarathejanafiver_db_user:RnQAIAoUJtBiay4x@ac4ljeo.mongodb.net/news-aggregator?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log('Successfully connected to MongoDB with +srv URI');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB with +srv URI:', err.message);
    process.exit(1);
  });
