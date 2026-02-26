const mongoose = require('mongoose');
const axios = require('axios');
const News = require('./models/News');
require('dotenv').config();

const checkStatus = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB.");

        const response = await axios.get('https://esena-news-api-v3.vercel.app/');
        const apiArticles = response.data?.news_data?.data || [];
        console.log(`API has ${apiArticles.length} recent articles.`);

        if (apiArticles.length > 0) {
            const latestApi = apiArticles[0];
            console.log(`Latest API Article: [${latestApi.id}] ${latestApi.titleSi}`);

            const dbArticle = await News.findOne({ id: String(latestApi.id) });
            if (dbArticle) {
                console.log("-> This article ALREADY EXISTS in the database. (Cron job correctly skipped sending it to WhatsApp)");
            } else {
                console.log("-> This article is NEW and NOT in the database yet.");
            }
        }
    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

checkStatus();
