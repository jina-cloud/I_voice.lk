const axios = require('axios');
require('dotenv').config();

const testRealArticle = async () => {
    try {
        const communityId = process.env.WHATSAPP_COMMUNITY_ID;
        if (!communityId) {
            console.log('Error: WHATSAPP_COMMUNITY_ID not found in .env');
            return;
        }

        console.log("Fetching latest news from API...");
        const response = await axios.get('https://esena-news-api-v3.vercel.app/');
        
        if (response.data && response.data.news_data && response.data.news_data.data && response.data.news_data.data.length > 0) {
            const article = response.data.news_data.data[0]; // Get the most recent one
            
            console.log(`Found article: ${article.titleSi}`);
            console.log(`Sending to WhatsApp Group (${communityId})...`);
            
            const message = `*${article.titleSi}*\n\nRead more: ${article.share_url || 'https://ivoice.lk/'}\n\n_Ivoice_`;
            
            const sendResponse = await axios.post('http://localhost:5002/send', {
                chatId: communityId,
                message: message
            });

            console.log('Success!', sendResponse.data);
        } else {
            console.log("Could not find any articles in the API response.");
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
};

testRealArticle();
