const mongoose = require('mongoose');

const uri = "mongodb://jinarathejanafiver_db_user:RnQAIAoUJtBiay4x@ac-jv5wq9g-shard-00-00.ac4ljeo.mongodb.net:27017,ac-jv5wq9g-shard-00-01.ac4ljeo.mongodb.net:27017,ac-jv5wq9g-shard-00-02.ac4ljeo.mongodb.net:27017/news-aggregator?ssl=true&replicaSet=atlas-njamsh-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri)
    .then(() => {
        console.log('SUCCESS! Connected to MongoDB with direct URI');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB with direct URI:', err.message);
        process.exit(1);
    });
