const mongoose = require('mongoose');
require('dotenv').config();

// Using the actual hostnames that the SRV record resolves to, bypassing the broken 'ac4ljeo-shard' DNS issue.
const uri = "mongodb://jinarathejanafiver_db_user:RnQAIAoUJtBiay4x@ac-jv5wq9g-shard-00-00.ac4ljeo.mongodb.net:27017,ac-jv5wq9g-shard-00-01.ac4ljeo.mongodb.net:27017,ac-jv5wq9g-shard-00-02.ac4ljeo.mongodb.net:27017/news-aggregator?ssl=true&replicaSet=atlas-njamsh-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri, {
    family: 4 // Force IPv4 because IPv6 whitelist was rejected by Atlas
})
    .then(() => {
        console.log('SUCCESS! Connected to MongoDB using corrected hostnames and IPv4.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    });
